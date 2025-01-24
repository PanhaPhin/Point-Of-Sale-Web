<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * App\Models\Transfer
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property int $from_warehouse_id
 * @property int $to_warehouse_id
 * @property float|null $tax_rate
 * @property float|null $tax_amount
 * @property float|null $discount
 * @property float|null $shipping
 * @property float|null $grand_total
 * @property int|null $status
 * @property string|null $note
 * @property string|null $reference_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Warehouse $fromWarehouse
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|\Spatie\MediaLibrary
 *  * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TransferItem[] $transferItems
 * @property-read int|null $media_count
 * @property-read \App\Models\Warehouse $toWarehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereFromWarehouseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereShipping($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereToWarehouseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transfer whereUpdatedAt($value)
 *
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, \Spatie\MediaLibrary\MediaCollections\Models\Media> $media
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TransferItem> $transferItems
 * @property-read int|null $transfer_items_count
 *
 * @mixin \Eloquent
 */
class Transfer extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'transfers';

    public const JSON_API_TYPE = 'transfers';

    const PERCENTAGE = 1;

    const FIXED = 2;

    //tax type  const
    const EXCLUSIVE = 1;

    const INCLUSIVE = 2;

    // status

    const COMPLETED = 1;

    const SENT = 2;

    const PENDING = 3;

    protected $fillable = [
        'date',
        'from_warehouse_id',
        'to_warehouse_id',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'note',
        'status',
        'reference_code',
    ];

    public static $rules = [
        'date' => 'date|required',
        'from_warehouse_id' => 'required|exists:warehouses,id',
        'to_warehouse_id' => 'required|exists:warehouses,id',
        'tax_rate' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount' => 'nullable|numeric',
        'shipping' => 'nullable|numeric',
        'grand_total' => 'nullable|numeric',
        'notes' => 'nullable',
        'status' => 'integer',
        'reference_code' => 'nullable',
    ];

    public $casts = [
        'date' => 'date',
        'tax_rate' => 'double',
        'tax_amount' => 'double',
        'discount' => 'double',
        'shipping' => 'double',
        'grand_total' => 'double',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('transfers.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'date' => $this->date,
            'from_warehouse_id' => $this->from_warehouse_id,
            'to_warehouse_id' => $this->to_warehouse_id,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'discount' => $this->discount,
            'shipping' => $this->shipping,
            'grand_total' => $this->grand_total,
            'note' => $this->note,
            'status' => $this->status,
            'reference_code' => $this->reference_code,
            'transfer_items' => $this->transferItems,
            'from_warehouse' => $this->fromWarehouse,
            'to_warehouse' => $this->toWarehouse,
            'created_at' => $this->created_at,
        ];

        return $fields;
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id', 'id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id', 'id');
    }

    public function transferItems(): HasMany
    {
        return $this->hasMany(TransferItem::class, 'transfer_id', 'id');
    }
}
