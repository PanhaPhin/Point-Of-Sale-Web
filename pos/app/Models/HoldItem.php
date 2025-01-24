<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\HoldItem
 *
 * @property int $id
 * @property int $hold_id
 * @property int $product_id
 * @property float|null $product_price
 * @property float|null $net_unit_price
 * @property int $tax_type
 * @property float|null $tax_value
 * @property float|null $tax_amount
 * @property int $discount_type
 * @property float|null $discount_value
 * @property float|null $discount_amount
 * @property array $sale_unit
 * @property float|null $quantity
 * @property float|null $sub_total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Hold $hold
 * @property-read \App\Models\Product $product
 *
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereDiscountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereDiscountValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereHoldId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereNetUnitPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereProductPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereSaleUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereSubTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereTaxType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereTaxValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HoldItem whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class HoldItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'hold_items';

    public const JSON_API_TYPE = 'hold_items';

    protected $fillable = [
        'product_id',
        'product_price',
        'net_unit_price',
        'tax_type',
        'tax_value',
        'tax_amount',
        'discount_type',
        'discount_value',
        'discount_amount',
        'sale_unit',
        'quantity',
        'sub_total',
    ];

    public static $rules = [
        'product_id' => 'required|exists:products,id',
        'product_price' => 'nullable|numeric',
        'tax_type' => 'nullable|numeric',
        'tax_value' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount_type' => 'nullable|numeric',
        'discount_value' => 'nullable|numeric',
        'discount_amount' => 'nullable|numeric',
        'sale_unit' => 'nullable|numeric',
        'quantity' => 'nullable|numeric',
        'sub_total' => 'nullable|numeric',
    ];

    public $casts = [
        'product_price' => 'double',
        'tax_amount' => 'double',
        'tax_value' => 'double',
        'discount_value' => 'double',
        'discount_amount' => 'double',
        'quantity' => 'double',
        'sub_total' => 'double',
    ];

    public function getSaleUnitAttribute($value): array
    {
        $saleUnit = Unit::whereId($value)->first();
        if ($saleUnit) {
            return $saleUnit->toArray();
        }

        return [];
    }

    public function prepareLinks(): array
    {
        return [

        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'product_id' => $this->product_id,
            'net_unit_price' => $this->net_unit_price,
            'product_price' => $this->product_price,
            'tax_type' => $this->tax_type,
            'tax_value' => $this->tax_value,
            'tax_amount' => $this->tax_amount,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'discount_amount' => $this->discount_amount,
            'sale_unit' => $this->sale_unit,
            'quantity' => $this->quantity,
            'sub_total' => $this->sub_total,
        ];

        return $fields;
    }

    public function hold(): BelongsTo
    {
        return $this->belongsTo(Hold::class, 'hold_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
