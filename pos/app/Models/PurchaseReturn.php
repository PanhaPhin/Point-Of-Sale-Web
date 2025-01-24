<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\PurchaseReturn
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property int $supplier_id
 * @property int $warehouse_id
 * @property float|null $tax_rate
 * @property float|null $tax_amount
 * @property float|null $discount
 * @property float|null $shipping
 * @property float|null $grand_total
 * @property float|null $received_amount
 * @property float|null $paid_amount
 * @property int|null $payment_type
 * @property int|null $status
 * @property int|null $payment_status
 * @property string|null $notes
 * @property string|null $reference_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $purchase_return_pdf_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PurchaseReturnItem[] $purchaseReturnItems
 * @property-read int|null $purchase_return_items_count
 * @property-read \App\Models\Supplier $supplier
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn query()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn wherePaidAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn wherePaymentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereReceivedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereShipping($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereSupplierId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseReturn whereWarehouseId($value)
 *
 * @mixin \Eloquent
 */
class PurchaseReturn extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'purchases_return';

    const JSON_API_TYPE = 'purchases_return';

    const PURCHASE_RETURN_PDF = 'purchase_return_pdf';

    protected $fillable = [
        'date',
        'supplier_id',
        'warehouse_id',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'received_amount',
        'paid_amount',
        'payment_type',
        'notes',
        'status',
        'payment_status',
        'reference_code',
    ];

    public static $rules = [
        'date' => 'required|date',
        'supplier_id' => 'required|exists:suppliers,id',
        'warehouse_id' => 'required|exists:warehouses,id',
        'tax_rate' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount' => 'nullable|numeric',
        'shipping' => 'nullable|numeric',
        'grand_total' => 'nullable|numeric',
        'received_amount' => 'numeric|nullable',
        'paid_amount' => 'numeric|nullable',
        'payment_type' => 'numeric|integer',
        'notes' => 'nullable',
        'status' => 'integer|required',
        'payment_status' => 'integer|required',
        'reference_code' => 'nullable',
    ];

    public $casts = [
        'date' => 'date',
        'tax_rate' => 'double',
        'tax_amount' => 'double',
        'discount' => 'double',
        'shipping' => 'double',
        'grand_total' => 'double',
        'received_amount' => 'double',
        'paid_amount' => 'double',
    ];

    //tax type  const
    const EXCLUSIVE = 1;

    const INCLUSIVE = 2;

    // discount type const
    const PERCENTAGE = 1;

    const FIXED = 2;

    // payment type
    const CASH = 1;

    // Order status
    const COMPLETED = 1;

    const PENDING = 2;

    // Payment status
    const PAID = 1;

    const UNPAID = 2;

    public function prepareLinks(): array
    {
        return [
            'self' => route('purchases-return.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'date' => $this->date,
            'supplier_id' => $this->supplier_id,
            'supplier_name' => $this->supplier->name,
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse->name,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'discount' => $this->discount,
            'shipping' => $this->shipping,
            'grand_total' => $this->grand_total,
            'received_amount' => $this->received_amount,
            'notes' => $this->notes,
            'reference_code' => $this->reference_code,
            'created_at' => $this->created_at,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'purchase_return_items' => $this->purchaseReturnItems,
        ];

        return $fields;
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function purchaseReturnItems(): HasMany
    {
        return $this->hasMany(PurchaseReturnItem::class, 'purchase_return_id', 'id');
    }
}
