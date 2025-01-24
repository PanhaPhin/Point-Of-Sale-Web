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
 * Class Adjustment
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property string|null $reference_code
 * @property int $warehouse_id
 * @property int $total_products
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|\Spatie\MediaLibrary\MediaCollections\Models\Media[] $media
 *  * @property-read \App\Models\Warehouse $warehouse
 * @property-read int|null $media_count
 *  * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\AdjustmentItem[] $adjustmentItems
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment query()
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereWarehouseId($value)
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdjustmentItem> $adjustmentItems
 * @property-read int|null $adjustment_items_count
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Adjustment whereTotalProducts($value)
 *
 * @mixin \Eloquent
 */
class Adjustment extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'adjustments';

    public const JSON_API_TYPE = 'adjustments';

    protected $fillable = [
        'reference_code',
        'date',
        'warehouse_id',
        'total_products',
    ];

    public static $rules = [
        'reference_code' => 'nullable',
        'date' => 'date|required',
        'warehouse_id' => 'required|exists:warehouses,id',
    ];

    public $casts = [
        'date' => 'date',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('adjustments.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'reference_code' => $this->reference_code,
            'date' => $this->date,
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse->name,
            'total_products' => $this->total_products,
            'created_at' => $this->created_at,
            'adjustment_items' => $this->adjustmentItems,
        ];

        return $fields;
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }

    public function adjustmentItems(): HasMany
    {
        return $this->hasMany(AdjustmentItem::class, 'adjustment_id', 'id');
    }
}
