<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Hold
 *
 * @property int $id
 * @property string|null $reference_code
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Customer $customer
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\HoldItem[] $holdItems
 * @property-read int|null $hold_items_count
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Hold newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Hold newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Hold query()
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold wherePaidAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereReceivedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereShipping($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hold whereWarehouseId($value)
 *
 * @mixin \Eloquent
 */
class Hold extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'holds';

    public const JSON_API_TYPE = 'holds';

    protected $fillable = [
        'reference_code',
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
    ];

    public static $rules = [
        'reference_code' => 'required',
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
        'status' => 'integer',
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

    public function prepareLinks(): array
    {
        return [
            'self' => route('holds.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'reference_code' => $this->reference_code,
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
            'hold_items' => $this->holdItems,
            'created_at' => $this->created_at,
        ];

        return $fields;
    }

    public function prepareHolds(): array
    {
        $fields = [
            'id' => $this->id,
            'date' => $this->date,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->customer->name,
            'warehouse_id' => $this->warehouse_id,
            'reference_code' => $this->reference_code,
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

    public function holdItems(): HasMany
    {
        return $this->hasMany(HoldItem::class, 'hold_id', 'id');
    }
}
