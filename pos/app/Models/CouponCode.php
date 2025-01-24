<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Models\CouponCode
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon $end_date
 * @property int $how_many_time_can_use
 * @property float $discount
 * @property int $how_many_time_used
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode query()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereFixedDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereHowManyTimeCanUse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereHowManyTimeUsed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereUpdatedAt($value)
 *
 * @property int $discount_type
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponCode whereDiscountType($value)
 *
 * @mixin \Eloquent
 */
class CouponCode extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $fillable = [
        'name',
        'code',
        'start_date',
        'end_date',
        'how_many_time_can_use',
        'discount_type',
        'discount',
        'how_many_time_used',
    ];

    public static $rules = [
        'name' => 'required',
        'code' => 'required|unique:coupon_codes,code',
        'products' => 'required',
        'start_date' => 'required',
        'end_date' => 'required',
        'how_many_time_can_use' => 'required|integer',
        'discount_type' => 'required|integer',
        'discount' => 'required',
    ];

    public $casts = [
        'name' => 'string',
        'code' => 'string',
        // 'start_date' => 'date',
        // 'end_date' => 'date',
        'how_many_time_can_use' => 'integer',
        'discount_type' => 'integer',
        'discount' => 'double',
        'how_many_time_used' => 'integer',
    ];

    public const FIXED = 1;

    public const PERCENTAGE = 2;

    public function prepareLinks(): array
    {
        return [];
    }

    public function prepareAttributes(): array
    {
        $products = [];

        foreach ($this->products as $product) {
            $products[] = [
                'id' => $product->id,
                'name' => $product->name,
            ];
        }

        return [
            'name' => $this->name,
            'code' => $this->code,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'how_many_time_can_use' => $this->how_many_time_can_use,
            'discount_type' => $this->discount_type,
            'discount' => $this->discount,
            'how_many_time_used' => $this->how_many_time_used,
            'products' => $products,
        ];
    }

    /**
     * The products that belong to the CouponCode
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'coupon_product');
    }
}
