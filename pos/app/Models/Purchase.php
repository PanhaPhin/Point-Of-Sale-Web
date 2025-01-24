<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Purchase
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
 * @property int|null $status
 * @property string|null $notes
 * @property string|null $reference_code
 * @property-read \App\Models\Supplier $supplier
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PurchaseItem[] $purchaseItems
 * @property-read int|null $purchase_items_count
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase query()
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereReceivedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereShipping($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereSupplierId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Purchase whereWarehouseId($value)
 *
 * @property float|null $paid_amount
 * @property int|null $payment_type
 * @property-read string $purchase_pdf_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 *
 * @method static Builder|Purchase search($search = '')
 * @method static Builder|Purchase wherePaidAmount($value)
 * @method static Builder|Purchase wherePaymentType($value)
 *
 * @mixin \Eloquent
 */
class Purchase extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'purchases';

    const JSON_API_TYPE = 'purchases';

    const PURCHASE_PDF = 'purchase_pdf';

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

    public function getPurchasePdfUrlAttribute(): string
    {
        /** @var Media $media */
        $media = $this->getMedia(self::PURCHASE_PDF)->first();
        if (! empty($media)) {
            return $media->getFullUrl();
        }

        return '';
    }

    //tax type  const
    const EXCLUSIVE = 1;

    const INCLUSIVE = 2;

    // discount type const
    const PERCENTAGE = 1;

    const FIXED = 2;

    // payment type
    const CASH = 1;

    // Order status
    const RECEIVED = 1;

    const PENDING = 2;

    const ORDERED = 3;

    public function prepareLinks(): array
    {
        return [
            'self' => route('purchases.show', $this->id),
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
            'purchase_items' => $this->purchaseItems,
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

    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchaseItem::class, 'purchase_id', 'id');
    }

    public function scopeSearch($query, $search = '')
    {
        $supplier = (Supplier::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        if ($supplier || $warehouse) {
            return $query->whereHas('supplier', function (Builder $q) use ($search, $supplier) {
                if ($supplier) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            });
        }
        if (is_numeric($search)) {
            $search = (float) $search;
            $search = (string) $search;
        }

        return $query->where('reference_code', 'LIKE', '%'.$search.'%')
            ->orWhere('grand_total', 'LIKE', '%'.$search.'%');
    }
}
