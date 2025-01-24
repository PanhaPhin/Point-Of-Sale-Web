<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\TransferItem
 *
 * @property int $id
 * @property int $transfer_id
 * @property int $product_id
 * @property float|null $product_price
 * @property float|null $net_unit_price
 * @property int $tax_type
 * @property float|null $tax_value
 * @property float|null $tax_amount
 * @property int $discount_type
 * @property float|null $discount_value
 * @property float|null $discount_amount
 * @property float|null $quantity
 * @property float|null $sub_total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 *
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereDiscountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereDiscountValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereNetUnitPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereProductPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereSubTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereTaxType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereTaxValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereTransferId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransferItem whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class TransferItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'transfer_items';

    public const JSON_API_TYPE = 'transfer_items';

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
            'quantity' => $this->quantity,
            'sub_total' => $this->sub_total,
        ];

        return $fields;
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
