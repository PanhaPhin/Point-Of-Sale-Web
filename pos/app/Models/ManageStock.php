<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

/**
 * App\Models\ManageStock
 *
 * @property int $id
 * @property int $warehouse_id
 * @property int $product_id
 * @property float $quantity
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\Warehouse $warehouse
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock query()
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereWarehouseId($value)
 *
 * @property float $alert
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ManageStock whereAlert($value)
 *
 * @mixin \Eloquent
 */
class ManageStock extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'manage_stocks';

    const JSON_API_TYPE = 'manage_stocks';

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'quantity',
        'alert',
    ];

    protected $casts = [
        'warehouse_id' => 'integer',
        'product_id' => 'integer',
        'quantity' => 'float',
        'alert' => 'float',
    ];

    public static $rules = [
        'warehouse_id' => 'required|exists:warehouses,id',
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|numeric',
    ];

    public function prepareLinks(): array
    {
        return [

        ];
    }

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            $product = Product::find($model->product_id);
            Log::info('Updating '.$model->quantity);
            Log::info('Updating 1 '.$product->stock_alert);

            if ($model->quantity <= $product->stock_alert) {
                $model->alert = true;
            } else {
                $model->alert = false;
            }
        });

        static::creating(function ($model) {
            $product = Product::find($model->product_id);
            Log::info('Creating '.$model->quantity);
            Log::info('Creating 1 '.$product->stock_alert);

            if ($model->quantity <= $product->stock_alert) {
                $model->alert = true;
            } else {
                $model->alert = false;
            }
        });
    }

    public function prepareAttributes(): array
    {
        return [
            'warehouse_id' => $this->warehouse_id,
            'product_id' => $this->product_id,
            'product_unit_name' => $this->getProductUnitName(),
            'quantity' => $this->quantity,
            'product' => $this->product,
            'warehouse' => $this->warehouse,
            'product_category_name' => $this->product->productCategory->name,
        ];
    }

    public function prepareWarehouseAttributes(): array
    {
        $fields = [
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'product_unit' => $this->product->product_unit,
            'product_unit_name' => $this->getProductUnitName(),
            'product_name' => $this->product->name,
            'product_image' => $this->product->image_url,
        ];

        return $fields;
    }

    public function prepareStockAlerts(): array
    {
        $fields = [
            'product_code' => $this->product->code,
            'product_name' => $this->product->name,
            'warehouse_id' => $this->warehouse_id,
            'quantity' => $this->quantity,
            'alert_quantity' => $this->alert,
            'product_unit_name' => $this->getProductUnitName(),
        ];

        return $fields;
    }

    /**
     * @return array|string
     */
    public function getProductUnitName()
    {
        $productUnit = BaseUnit::whereId($this->product->product_unit)->first();
        if ($productUnit) {
            return $productUnit->name;
        }

        return '';
    }

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function warehouse(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}
