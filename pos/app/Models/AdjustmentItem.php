<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AdjustmentItem
 *
 * @property int $id
 * @property int $adjustment_id
 * @property int $product_id
 * @property float|null $quantity
 * @property int $method_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereAdjustmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereMethodType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AdjustmentItem whereUpdatedAt($value)
 *
 * @property-read \App\Models\Adjustment $adjustment
 * @property-read mixed $sale_unit
 * @property-read \App\Models\Product $product
 *
 * @mixin \Eloquent
 */
class AdjustmentItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'adjustment_items';

    public const JSON_API_TYPE = 'adjustment_items';

    const METHOD_ADDITION = 1;

    const METHOD_SUBTRACTION = 2;

    protected $fillable = [
        'adjustment_id',
        'product_id',
        'method_type',
        'quantity',
    ];

    public static $rules = [
        'product_id' => 'required|exists:products,id',
        'method_type' => 'required',
        'quantity' => 'nullable|numeric',
    ];

    public $casts = [
        'quantity' => 'double',
    ];

    protected $appends = ['sale_unit'];

    public function prepareLinks(): array
    {
        return [

        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'product_id' => $this->product_id,
            'method_type' => $this->method_type,
            'quantity' => $this->quantity,
        ];

        return $fields;
    }

    public function adjustment(): BelongsTo
    {
        return $this->belongsTo(Adjustment::class, 'adjustment_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function getSaleUnitAttribute()
    {
        $saleUnitId = Product::whereId($this->product_id)->value('sale_unit');

        $saleUnit = Unit::whereId($saleUnitId)->value('short_name');

        return $saleUnit;
    }
}
