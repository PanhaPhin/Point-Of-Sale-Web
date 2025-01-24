<?php

namespace App\Repositories;

use App\Models\ManageStock;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class PurchaseRepository
 */
class PurchaseRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'date',
        'reference_code',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'received_amount',
        'paid_amount',
        'payment_type',
        'notes',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'date',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'received_amount',
        'notes',
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
        return Purchase::class;
    }

    public function storePurchase($input)
    {
        try {
            DB::beginTransaction();
            foreach ($input['purchase_items'] as $purchase_items) {
                if ($purchase_items['quantity'] == 0) {
                    throw new UnprocessableEntityHttpException('Please Enter Attlist One Quantity.');
                }
            }

            $purchaseInputArray = Arr::only($input, [
                'supplier_id', 'warehouse_id', 'date', 'tax_rate', 'tax_amount', 'discount', 'shipping', 'grand_total',
                'received_amount', 'paid_amount', 'payment_type', 'notes', 'status',
            ]);

            /** @var Purchase $purchase */
            $purchase = Purchase::create($purchaseInputArray);

            $purchase = $this->storePurchaseItems($purchase, $input);

            // manage stock
            foreach ($input['purchase_items'] as $purchaseItem) {
                manageStock($input['warehouse_id'], $purchaseItem['product_id'], $purchaseItem['quantity']);
            }

            DB::commit();

            return $purchase;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function calculationPurchaseItems($purchaseItem)
    {
        $validator = Validator::make($purchaseItem, PurchaseItem::$rules);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        //discount calculation
        $perItemDiscountAmount = 0;
        $purchaseItem['net_unit_cost'] = $purchaseItem['product_cost'];
        if ($purchaseItem['discount_type'] == Purchase::PERCENTAGE) {
            if ($purchaseItem['discount_value'] <= 100 && $purchaseItem['discount_value'] >= 0) {
                $purchaseItem['discount_amount'] = ($purchaseItem['discount_value'] * $purchaseItem['product_cost'] / 100) * $purchaseItem['quantity'];
                $perItemDiscountAmount = $purchaseItem['discount_amount'] / $purchaseItem['quantity'];
                $purchaseItem['net_unit_cost'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException('Please enter discount value between 0 to 100.');
            }
        } elseif ($purchaseItem['discount_type'] == Purchase::FIXED) {
            if ($purchaseItem['discount_value'] <= $purchaseItem['product_cost'] && $purchaseItem['discount_value'] >= 0) {
                $purchaseItem['discount_amount'] = $purchaseItem['discount_value'] * $purchaseItem['quantity'];
                $perItemDiscountAmount = $purchaseItem['discount_amount'] / $purchaseItem['quantity'];
                $purchaseItem['net_unit_cost'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException("Please enter  discount's value between product's price.");
            }
        }
        //tax calculation
        $perItemTaxAmount = 0;
        if ($purchaseItem['tax_value'] <= 100 && $purchaseItem['tax_value'] >= 0) {
            if ($purchaseItem['tax_type'] == Purchase::EXCLUSIVE) {
                $purchaseItem['tax_amount'] = (($purchaseItem['net_unit_cost'] * $purchaseItem['tax_value']) / 100) * $purchaseItem['quantity'];
                $perItemTaxAmount = $purchaseItem['tax_amount'] / $purchaseItem['quantity'];
            } elseif ($purchaseItem['tax_type'] == Purchase::INCLUSIVE) {
                $purchaseItem['tax_amount'] = ($purchaseItem['net_unit_cost'] * $purchaseItem['tax_value']) / (100 + $purchaseItem['tax_value']) * $purchaseItem['quantity'];
                $perItemTaxAmount = $purchaseItem['tax_amount'] / $purchaseItem['quantity'];
                $purchaseItem['net_unit_cost'] -= $perItemTaxAmount;
            }
        } else {
            throw new UnprocessableEntityHttpException('Please enter tax value between 0 to 100 ');
        }
        $purchaseItem['sub_total'] = ($purchaseItem['net_unit_cost'] + $perItemTaxAmount) * $purchaseItem['quantity'];

        return $purchaseItem;
    }

    /**
     * @return mixed
     */
    public function storePurchaseItems($purchase, $input)
    {
        foreach ($input['purchase_items'] as $purchaseItem) {
            $items = $this->calculationPurchaseItems($purchaseItem);
            $purchaseItem = new PurchaseItem($items);
            $purchase->purchaseItems()->save($purchaseItem);
        }

        $subTotalAmount = $purchase->purchaseItems()->sum('sub_total');
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
        $input['grand_total'] = $input['grand_total'] + $input['tax_amount'];
        if ($input['shipping'] <= $input['grand_total'] && $input['shipping'] >= 0) {
            $input['grand_total'] += $input['shipping'];
        } else {
            throw new UnprocessableEntityHttpException('Shipping amount should not be greater than total.');
        }

        $input['reference_code'] = getSettingValue('purchase_code').'_111'.$purchase->id;
        $purchase->update($input);

        return $purchase;
    }

    /**
     * @return mixed
     */
    public function updatePurchase($input, $id)
    {
        try {
            DB::beginTransaction();
            foreach ($input['purchase_items'] as $purchase_items) {
                if ($purchase_items['quantity'] == 0) {
                    throw new UnprocessableEntityHttpException('Please Enter Attlist One Quantity.');
                }
            }
            $purchase = Purchase::findOrFail($id);
            $purchaseItemIds = PurchaseItem::wherePurchaseId($id)->pluck('id')->toArray();
            $purchaseItmOldIds = [];
            foreach ($input['purchase_items'] as $key => $purchaseItem) {
                //get different ids & update
                $purchaseItmOldIds[$key] = $purchaseItem['purchase_item_id'];
                $purchaseItemArr = Arr::only($purchaseItem, [
                    'purchase_item_id', 'product_id', 'product_cost', 'net_unit_cost', 'tax_type', 'tax_value',
                    'tax_amount', 'discount_type', 'discount_value', 'discount_amount', 'purchase_unit', 'quantity',
                    'sub_total',
                ]);
                $this->updateItem($purchaseItemArr, $input['warehouse_id']);
                //create new product items
                if (is_null($purchaseItem['purchase_item_id'])) {
                    $purchaseItem = $this->calculationPurchaseItems($purchaseItem);
                    $purchaseItemArr = Arr::only($purchaseItem, [
                        'purchase_item_id', 'product_id', 'product_cost', 'net_unit_cost', 'tax_type', 'tax_value',
                        'tax_amount', 'discount_type', 'discount_value', 'discount_amount', 'purchase_unit', 'quantity',
                        'sub_total',
                    ]);
                    $purchase->purchaseItems()->create($purchaseItemArr);
                    // manage new product
                    manageStock($input['warehouse_id'], $purchaseItem['product_id'], $purchaseItem['quantity']);
                }
            }
            $removeItemIds = array_diff($purchaseItemIds, $purchaseItmOldIds);
            //delete remove product
            if (! empty(array_values($removeItemIds))) {
                foreach ($removeItemIds as $removeItemId) {
                    // remove quantity manage storage
                    $oldProduct = PurchaseItem::whereId($removeItemId)->first();
                    $productQuantity = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($oldProduct->product_id)->first();
                    if ($productQuantity && $oldProduct) {
                        if ($oldProduct->quantity <= $productQuantity->quantity) {
                            $productQuantity->update([
                                'quantity' => $productQuantity->quantity - $oldProduct->quantity,
                            ]);
                        }
                    } else {
                        throw new UnprocessableEntityHttpException('Quantity must be less than Available quantity.');
                    }
                }
                PurchaseItem::whereIn('id', array_values($removeItemIds))->delete();
            }
            $purchase = $this->updatePurchaseCalculation($input, $id);
            DB::commit();

            return $purchase;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function updatePurchaseCalculation($input, $id)
    {
        $purchase = Purchase::findOrFail($id);
        $subTotalAmount = $purchase->purchaseItems()->sum('sub_total');

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

        $purchaseInputArray = Arr::only($input, [
            'supplier_id', 'warehouse_id', 'date', 'tax_rate', 'tax_amount', 'discount', 'shipping', 'grand_total',
            'received_amount', 'paid_amount', 'payment_type', 'notes', 'status',
        ]);
        $purchase->update($purchaseInputArray);

        return $purchase;
    }

    public function updateItem($purchaseItem, $warehouseId): bool
    {
        try {
            $purchaseItem = $this->calculationPurchaseItems($purchaseItem);
            $item = PurchaseItem::whereId($purchaseItem['purchase_item_id']);
            // update stock manage
            $product = ManageStock::whereWarehouseId($warehouseId)->whereProductId($purchaseItem['product_id'])->first();
            $oldItem = PurchaseItem::whereId($purchaseItem['purchase_item_id'])->first();
            $totalQuantity = 0;
            if ($product && $oldItem && $oldItem->quantity != $purchaseItem['quantity']) {
                if ($oldItem->quantity > $purchaseItem['quantity']) {
                    $totalQuantity = $product->quantity - ($oldItem->quantity - $purchaseItem['quantity']);
                } elseif ($oldItem->quantity < $purchaseItem['quantity']) {
                    $totalQuantity = $product->quantity + ($purchaseItem['quantity'] - $oldItem->quantity);
                }
                $product->update([
                    'quantity' => $totalQuantity,
                ]);
            }

            unset($purchaseItem['purchase_item_id']);
            $item->update($purchaseItem);

            return true;
        } catch (Exception $e) {
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
