<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PurchaseReturnItem
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
 * @property-read \App\Models\Product|null $product
 * @property-read \App\Models\PurchaseReturn|null $purchaseReturn
 *
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem query()
 *  * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereDiscountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereDiscountValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereNetUnitCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereProductCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem wherePurchaseReturnId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem wherePurchaseUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereSubTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereTaxType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereTaxValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereUpdatedAt($value)
 *
 * @property int $purchase_return_id
 *
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturnItem whereCreatedAt($value)
 *
 * @mixin \Eloquent
 */
class PurchaseReturnItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'purchases_return_items';

    const JSON_API_TYPE = 'purchases_return_items';

    protected $fillable = [
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

    public function purchaseReturn(): BelongsTo
    {
        return $this->belongsTo(PurchaseReturn::class, 'purchase_return_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
