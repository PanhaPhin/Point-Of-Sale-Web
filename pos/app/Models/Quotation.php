<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Quotation
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property int $customer_id
 * @property int $warehouse_id
 * @property float|null $tax_rate
 * @property float|null $tax_amount
 * @property float|null $discount
 * @property float|null $shipping
 * @property float|null $grand_total
 * @property float|null $received_amount
 * @property float|null $paid_amount
 * @property int|null $status
 * @property string|null $note
 * @property string|null $reference_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Customer $customer
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|\Spatie\MediaLibrary\MediaCollections\Models\Media[] $media
 * @property-read int|null $media_count
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation wherePaidAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereReceivedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereShipping($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereWarehouseId($value)
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\QuotationItem[] $quotationItems
 * @property-read int|null $quotation_items_count
 * @property int $is_sale_created
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Quotation whereIsSaleCreated($value)
 *
 * @mixin \Eloquent
 */
class Quotation extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    public const JSON_API_TYPE = 'quotations';

    const QuotationSale = 3;

    /**
     * @var string[]
     */
    protected $fillable = [
        'date',
        'customer_id',
        'warehouse_id',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'received_amount',
        'paid_amount',
        'note',
        'status',
        'reference_code',
        'is_sale_created',
    ];

    /**
     * @var string[]
     */
    public static $rules = [
        'date' => 'date|required',
        'customer_id' => 'required|exists:customers,id',
        'warehouse_id' => 'required|exists:warehouses,id',
        'tax_rate' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount' => 'nullable|numeric',
        'shipping' => 'nullable|numeric',
        'grand_total' => 'nullable|numeric',
        'received_amount' => 'numeric|nullable',
        'paid_amount' => 'numeric|nullable',
        'notes' => 'nullable',
        'status' => 'required',
        'reference_code' => 'nullable',
    ];

    /**
     * @var string[]
     */
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

    // status
    const SENT = 1;

    const PENDING = 2;

    public function prepareLinks(): array
    {
        return [
            'self' => route('quotations.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'date' => $this->date,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->customer->name,
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse->name,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'discount' => $this->discount,
            'shipping' => $this->shipping,
            'grand_total' => $this->grand_total,
            'received_amount' => $this->received_amount,
            'paid_amount' => $this->paid_amount,
            'note' => $this->note,
            'status' => $this->status,
            'is_sale_created' => $this->is_sale_created,
            'reference_code' => $this->reference_code,
            'quotation_items' => $this->quotationItems,
            'created_at' => $this->created_at,
        ];

        return $fields;
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }

    public function quotationItems(): HasMany
    {
        return $this->hasMany(QuotationItem::class, 'quotation_id', 'id');
    }
}
