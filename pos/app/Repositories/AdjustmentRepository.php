<?php

namespace App\Repositories;

use App\Models\Adjustment;
use App\Models\AdjustmentItem;
use App\Models\ManageStock;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SaleRepository
 */
class AdjustmentRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'date',
        'reference_code',
        'warehouse_id',
        'total_products',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'date',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return Adjustment::class;
    }

    public function storeAdjustment($input): Adjustment
    {
        try {
            DB::beginTransaction();

            $input['total_products'] = count($input['adjustment_items']);
            $input['date'] = $input['date'] ?? date('Y/m/d');
            $adjustmentInputArray = Arr::only($input, [
                'date', 'warehouse_id', 'total_products',
            ]);
            $adjustment = Adjustment::create($adjustmentInputArray);
            $reference_code = 'AD_111'.$adjustment->id;
            $adjustment->update(['reference_code' => $reference_code]);

            $adjustment = $this->storeAdjustmentItems($adjustment, $input);

            DB::commit();

            return $adjustment;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function storeAdjustmentItems($adjustment, $input)
    {
        foreach ($input['adjustment_items'] as $adjustmentItem) {
            $adjustmentItem['adjustment_id'] = $adjustment->id;
            AdjustmentItem::Create($adjustmentItem);

            $product = ManageStock::whereWarehouseId($adjustment->warehouse_id)->whereProductId($adjustmentItem['product_id'])->first();
            if (! empty($product)) {
                if ($adjustmentItem['method_type'] == AdjustmentItem::METHOD_ADDITION) {
                    $totalQuantity = $product->quantity + $adjustmentItem['quantity'];
                    $product->update([
                        'quantity' => $totalQuantity,
                    ]);
                } else {
                    $totalQuantity = $product->quantity - $adjustmentItem['quantity'];
                    if ($totalQuantity < 0) {
                        throw new UnprocessableEntityHttpException('Quantity exceeds quantity available in stock.');
                    }
                    $product->update([
                        'quantity' => $totalQuantity,
                    ]);
                }
            } else {
                if ($adjustmentItem['method_type'] == AdjustmentItem::METHOD_ADDITION) {
                    ManageStock::create([
                        'warehouse_id' => $adjustment->warehouse_id,
                        'product_id' => $adjustmentItem['product_id'],
                        'quantity' => $adjustmentItem['quantity'],
                    ]);
                }
            }
        }

        return $adjustment;
    }

    public function updateAdjustment($input, $id)
    {
        try {
            DB::beginTransaction();

            $adjustment = Adjustment::findOrFail($id);

            $input['total_products'] = count($input['adjustment_items']);
            $input['date'] = $input['date'] ?? date('Y/m/d');
            $adjustmentInputArray = Arr::only($input, [
                'date', 'warehouse_id', 'total_products',
            ]);
            $adjustment->update($adjustmentInputArray);

            $adjustment = $this->updateAdjustmentItems($adjustment, $input);

            DB::commit();

            return $adjustment;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateAdjustmentItems($adjustment, $input)
    {
        $adjustmentItmOldIds = AdjustmentItem::whereAdjustmentId($adjustment->id)->pluck('id')->toArray();
        $adjustmentItemIds = [];

        foreach ($input['adjustment_items'] as $key => $adjustmentItem) {
            $adjustmentItemIds[$key] = $adjustmentItem['adjustment_item_id'];

            $product = ManageStock::whereWarehouseId($adjustment->warehouse_id)->whereProductId($adjustmentItem['product_id'])->first();

            if (is_null($adjustmentItem['adjustment_item_id'])) {
                $adjustmentItem['adjustment_id'] = $adjustment->id;

                AdjustmentItem::Create($adjustmentItem);

                if (! empty($product)) {
                    if ($adjustmentItem['method_type'] == AdjustmentItem::METHOD_ADDITION) {
                        $totalQuantity = $product->quantity + $adjustmentItem['quantity'];
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    } else {
                        $totalQuantity = $product->quantity - $adjustmentItem['quantity'];
                        if ($totalQuantity < 0) {
                            throw new UnprocessableEntityHttpException('Quantity exceeds quantity available in stock.');
                        }
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    }
                } else {
                    if ($adjustmentItem['method_type'] == AdjustmentItem::METHOD_ADDITION) {
                        ManageStock::create([
                            'warehouse_id' => $adjustment->warehouse_id,
                            'product_id' => $adjustmentItem['product_id'],
                            'quantity' => $adjustmentItem['quantity'],
                        ]);
                    }
                }
            } else {
                $exitAdjustmentItem = AdjustmentItem::whereId($adjustmentItem['adjustment_item_id'])->firstOrFail();

                if ($exitAdjustmentItem['method_type'] == AdjustmentItem::METHOD_ADDITION) {
                    $existQuantity = $product->quantity - $exitAdjustmentItem->quantity;
                } else {
                    $existQuantity = $product->quantity + $exitAdjustmentItem->quantity;
                }

                if ($adjustmentItem['method_type'] == AdjustmentItem::METHOD_ADDITION) {
                    $totalQuantity = $existQuantity + $adjustmentItem['quantity'];
                    $product->update([
                        'quantity' => $totalQuantity,
                    ]);
                } else {
                    $totalQuantity = $existQuantity - $adjustmentItem['quantity'];
                    if ($totalQuantity < 0) {
                        throw new UnprocessableEntityHttpException('Quantity exceeds quantity available in stock.');
                    }
                    $product->update([
                        'quantity' => $totalQuantity,
                    ]);
                }

                $exitAdjustmentItem->update([
                    'quantity' => $adjustmentItem['quantity'],
                    'method_type' => $adjustmentItem['method_type'],
                ]);
            }
        }

        $removeItemIds = array_diff($adjustmentItmOldIds, $adjustmentItemIds);

        if (! empty(array_values($removeItemIds))) {
            foreach ($removeItemIds as $removeItemId) {
                $oldItem = AdjustmentItem::whereId($removeItemId)->firstOrFail();
                $existProductStock = ManageStock::whereWarehouseId($adjustment->warehouse_id)->whereProductId($oldItem->product_id)->first();

                if ($oldItem->method_type == AdjustmentItem::METHOD_ADDITION) {
                    $totalQuantity = $existProductStock->quantity - $oldItem['quantity'];
                } else {
                    $totalQuantity = $existProductStock->quantity + $oldItem['quantity'];
                }

                $existProductStock->update([
                    'quantity' => $totalQuantity,
                ]);
            }
            AdjustmentItem::whereIn('id', array_values($removeItemIds))->delete();
        }

        return $adjustment;
    }
}
