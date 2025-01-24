<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PurchaseItem
 *
 * @property int $id
 * @property int $purchase_id
 * @property int $product_id
 * @property float|null $product_cost
 * @property float|null $net_unit_cost
 * @property int $tax_type
 * @property float|null $tax_value
 * @property float|null $tax_amount
 * @property int $discount_type
 * @property float|null $discount_value
 * @property float|null $discount_amount
 * @property int $purchase_unit
 * @property float|null $quantity
 * @property float|null $sub_total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\Purchase $purchase
 *
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereDiscountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereDiscountValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereNetUnitCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereProductCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem wherePurchaseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem wherePurchaseUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereSubTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereTaxType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereTaxValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseItem whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class PurchaseItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'purchase_items';

    const JSON_API_TYPE = 'purchase_items';

    protected $fillable = [
        'purchase_id',
        'product_id',
        'product_cost',
        'net_unit_cost',
        'tax_type',
        'tax_value',
        'tax_amount',
        'discount_type',
        'discount_value',
        'discount_amount',
        'purchase_unit',
        'quantity',
        'sub_total',
    ];

    public static $rules = [
        'product_id' => 'required|exists:products,id',
        'product_cost' => 'nullable|numeric',
        'net_unit_cost' => 'nullable|numeric',
        'tax_type' => 'nullable|numeric',
        'tax_value' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount_type' => 'nullable|numeric',
        'discount_value' => 'nullable|numeric',
        'discount_amount' => 'nullable|numeric',
        'purchase_unit' => 'nullable|numeric',
        'quantity' => 'nullable|numeric',
        'sub_total' => 'nullable|numeric',
        'unit_id' => 'integer',
    ];

    public $casts = [
        'product_cost' => 'double',
        'net_unit_cost' => 'double',
        'tax_value' => 'double',
        'tax_amount' => 'double',
        'discount_value' => 'double',
        'discount_amount' => 'double',
        'quantity' => 'double',
        'sub_total' => 'double',
    ];

    public function getPurchaseUnitAttribute($value)
    {
        $purchaseUnit = Unit::whereId($value)->first();
        if ($purchaseUnit) {
            return $purchaseUnit->toArray();
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
            'product_cost' => $this->product_cost,
            'net_unit_cost' => $this->net_unit_cost,
            'tax_type' => $this->tax_type,
            'tax_value' => $this->tax_value,
            'tax_amount' => $this->tax_amount,
            'discount_type' => $this->discount_type,
            'discount_vale' => $this->discount_value,
            'discount_amount' => $this->discount_amount,
            'purchase_unit' => $this->purchase_unit,
            'quantity' => $this->quantity,
            'sub_total' => $this->sub_total,
            'product_code' => $this->product->code,
            'product_name' => $this->product->name,
        ];

        return $fields;
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class, 'purchase_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
