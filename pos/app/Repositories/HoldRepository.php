<?php

namespace App\Repositories;

use App\Models\Hold;
use App\Models\HoldItem;
use App\Models\Sale;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class HoldRepository
 */
class HoldRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'reference_code',
        'date',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'received_amount',
        'paid_amount',
        'payment_type',
        'note',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'reference_code',
        'date',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'received_amount',
        'note',
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
        return Hold::class;
    }

    public function storeHold($input): Hold
    {
        try {
            DB::beginTransaction();

            $existReference = Hold::whereReferenceCode($input['reference_code'])->first();

            if (! empty($existReference)) {
                $existReference->delete();
            }

            $input['date'] = $input['date'] ?? date('Y/m/d');
            $holdInputArray = Arr::only($input, [
                'reference_code', 'customer_id', 'warehouse_id', 'tax_rate', 'tax_amount', 'discount', 'shipping',
                'grand_total',
                'received_amount', 'paid_amount', 'payment_type', 'note', 'date', 'status', 'payment_status',
            ]);

            /** @var Hold $hold */
            $hold = Hold::create($holdInputArray);

            $hold = $this->storeHoldItems($hold, $input);

            DB::commit();

            return $hold;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function storeHoldItems($hold, $input)
    {
        foreach ($input['hold_items'] as $holdItem) {
            $item = $this->calculationHoldItems($holdItem);
            $holdItem = new HoldItem($item);
            $hold->holdItems()->save($holdItem);
        }

        $subTotalAmount = $hold->holdItems()->sum('sub_total');

        if ($input['discount'] <= $subTotalAmount) {
            $input['grand_total'] = $subTotalAmount - $input['discount'];
        } else {
            throw new UnprocessableEntityHttpException('Discount amount should not be greater than total.');
        }
        if ($input['tax_rate'] <= 100 && $input['tax_rate'] >= 0) {
            $input['tax_amount'] = $input['grand_total'] * $input['tax_rate'] / 100;
        } else {
            throw new UnprocessableEntityHttpException('Please enter tax value between 0 to 100.');
        }
        $input['grand_total'] += $input['tax_amount'];
        if ($input['shipping'] <= $input['grand_total'] && $input['shipping'] >= 0) {
            $input['grand_total'] += $input['shipping'];
        } else {
            throw new UnprocessableEntityHttpException('Shipping amount should not be greater than total.');
        }

        $hold->update($input);

        return $hold;
    }

    /**
     * @return mixed
     */
    public function calculationHoldItems($holdItem)
    {
        $validator = Validator::make($holdItem, HoldItem::$rules);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        //discount calculation
        $perItemDiscountAmount = 0;
        $holdItem['net_unit_price'] = $holdItem['product_price'];
        if ($holdItem['discount_type'] == Sale::PERCENTAGE) {
            if ($holdItem['discount_value'] <= 100 && $holdItem['discount_value'] >= 0) {
                $holdItem['discount_amount'] = ($holdItem['discount_value'] * $holdItem['product_price'] / 100) * $holdItem['quantity'];
                $perItemDiscountAmount = $holdItem['discount_amount'] / $holdItem['quantity'];
                $holdItem['net_unit_price'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException('Please enter discount value between 0 to 100.');
            }
        } elseif ($holdItem['discount_type'] == Sale::FIXED) {
            if ($holdItem['discount_value'] <= $holdItem['product_price'] && $holdItem['discount_value'] >= 0) {
                $holdItem['discount_amount'] = $holdItem['discount_value'] * $holdItem['quantity'];
                $perItemDiscountAmount = $holdItem['discount_amount'] / $holdItem['quantity'];
                $holdItem['net_unit_price'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException("Please enter  discount's value between product's price.");
            }
        }

        //tax calculation
        $perItemTaxAmount = 0;
        if ($holdItem['tax_value'] <= 100 && $holdItem['tax_value'] >= 0) {
            if ($holdItem['tax_type'] == Sale::EXCLUSIVE) {
                $holdItem['tax_amount'] = (($holdItem['net_unit_price'] * $holdItem['tax_value']) / 100) * $holdItem['quantity'];
                $perItemTaxAmount = $holdItem['tax_amount'] / $holdItem['quantity'];
            } elseif ($holdItem['tax_type'] == Sale::INCLUSIVE) {
                $holdItem['tax_amount'] = ($holdItem['net_unit_price'] * $holdItem['tax_value']) / (100 + $holdItem['tax_value']) * $holdItem['quantity'];
                $perItemTaxAmount = $holdItem['tax_amount'] / $holdItem['quantity'];
                $holdItem['net_unit_price'] -= $perItemTaxAmount;
            }
        } else {
            throw new UnprocessableEntityHttpException('Please enter tax value between 0 to 100 ');
        }
        $holdItem['sub_total'] = ($holdItem['net_unit_price'] + $perItemTaxAmount) * $holdItem['quantity'];

        return $holdItem;
    }

    /**
     * @return mixed
     */
    public function updateHold($input, $id)
    {
        try {
            DB::beginTransaction();
            $hold = Hold::findOrFail($id);
            $holdItemIds = HoldItem::whereHoldId($id)->pluck('id')->toArray();
            $HoldItmOldIds = [];
            foreach ($input['hold_items'] as $key => $holdItem) {
                //get different ids & update
                $HoldItmOldIds[$key] = $holdItem['hold_item_id'];
                $holdItemArray = Arr::only($holdItem, [
                    'hold_item_id', 'product_id', 'product_price', 'net_unit_price', 'tax_type', 'tax_value',
                    'tax_amount', 'discount_type', 'discount_value', 'discount_amount', 'sale_unit', 'quantity',
                    'sub_total',
                ]);
                $this->updateItem($holdItemArray, $input['warehouse_id']);
                //create new product items
                if (is_null($holdItem['hold_item_id'])) {
                    $holdItem = $this->calculationHoldItems($holdItem);
                    $holdItemArray = Arr::only($holdItem, [
                        'product_id', 'product_price', 'net_unit_price', 'tax_type', 'tax_value', 'tax_amount',
                        'discount_type', 'discount_value', 'discount_amount', 'sale_unit', 'quantity', 'sub_total',
                    ]);
                    $hold->holdItems()->create($holdItemArray);
                }
            }
            $removeItemIds = array_diff($holdItemIds, $HoldItmOldIds);
            //delete remove product
            if (! empty(array_values($removeItemIds))) {
                HoldItem::whereIn('id', array_values($removeItemIds))->delete();
            }
            $hold = $this->updateHoldCalculation($input, $id);
            DB::commit();

            return $hold;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateItem($holdItem, $warehouseId): bool
    {
        try {
            $holdItem = $this->calculationHoldItems($holdItem);

            $item = HoldItem::whereId($holdItem['hold_item_id']);

            unset($holdItem['hold_item_id']);
            $item->update($holdItem);

            return true;
        } catch (Exception $e) {
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function updateHoldCalculation($input, $id)
    {
        $hold = Hold::findOrFail($id);
        $subTotalAmount = $hold->holdItems()->sum('sub_total');

        if ($input['discount'] > $subTotalAmount || $input['discount'] < 0) {
            throw new UnprocessableEntityHttpException('Discount amount should not be greater than total.');
        }
        $input['grand_total'] = $subTotalAmount - $input['discount'];
        if ($input['tax_rate'] > 100 || $input['tax_rate'] < 0) {
            throw new UnprocessableEntityHttpException('Please enter tax value between 0 to 100.');
        }
        $input['tax_amount'] = $input['grand_total'] * $input['tax_rate'] / 100;

        $input['grand_total'] += $input['tax_amount'];

        if ($input['shipping'] > $input['grand_total'] || $input['shipping'] < 0) {
            throw new UnprocessableEntityHttpException('Shipping amount should not be greater than total.');
        }

        $input['grand_total'] += $input['shipping'];

        $hold->first();

        $holdInputArray = Arr::only($input, [
            'reference_code', 'customer_id', 'warehouse_id', 'tax_rate', 'tax_amount', 'discount', 'shipping',
            'grand_total',
            'received_amount', 'paid_amount', 'note', 'date', 'status',
        ]);
        $hold->update($holdInputArray);

        return $hold;
    }
}
