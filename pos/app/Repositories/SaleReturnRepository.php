<?php

namespace App\Repositories;

use App\Mail\MailSender;
use App\Models\Customer;
use App\Models\MailTemplate;
use App\Models\ManageStock;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use App\Models\SmsSetting;
use App\Models\SmsTemplate;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SaleRepository
 */
class SaleReturnRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'date',
        'tax_rate',
        'tax_amount',
        'discount',
        'shipping',
        'grand_total',
        'paid_amount',
        'payment_type',
        'note',
        'created_at',
        'reference_code',
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
        return SaleReturn::class;
    }

    public function storeSaleReturn($input): SaleReturn
    {
        try {
            DB::beginTransaction();

            $saleID = $input['sale_id'];

            $sale = Sale::whereId($saleID)->first();

            if (empty($sale)) {
                throw new UnprocessableEntityHttpException('Sale Does Not exist');
            }

            $input['date'] = $input['date'] ?? date('Y/m/d');
            $saleReturnInputArray = Arr::only($input, [
                'customer_id', 'warehouse_id', 'tax_rate', 'tax_amount', 'discount', 'shipping', 'grand_total',
                'paid_amount', 'payment_type', 'note', 'date', 'status', 'sale_id',
            ]);

            /** @var Sale $sale */
            $saleReturn = SaleReturn::create($saleReturnInputArray);
            $saleUpdate = $sale->update(['is_return' => 1]);
            $saleReturn = $this->storeSaleReturnItems($saleReturn, $input);

            foreach ($input['sale_return_items'] as $purchaseItem) {
                $product = ManageStock::whereWarehouseId($input['warehouse_id'])
                    ->whereProductId($purchaseItem['product_id'])
                    ->first();
                $saleExist = SaleItem::where('product_id', $purchaseItem['product_id'])->whereHas('sale',
                    function (Builder $q) use ($input) {
                        $q->where('customer_id', $input['customer_id'])->where('warehouse_id',
                            $input['warehouse_id'])->where('id', $input['sale_id']);
                    })->exists();
                if ($saleExist) {
                    if ($product) {
                        if ($product->quantity >= $purchaseItem['quantity']) {
                            $product->update([
                                'quantity' => $product->quantity + $purchaseItem['quantity'],
                            ]);
                        }
                    } else {
                        ManageStock::create([
                            'warehouse_id' => $input['warehouse_id'],
                            'product_id' => $purchaseItem['product_id'],
                            'quantity' => $purchaseItem['quantity'],
                        ]);
                    }
                } else {
                    throw new UnprocessableEntityHttpException('Sale Does Not exist');
                }
            }

            $mailTemplate = MailTemplate::where('type', MailTemplate::MAIL_TYPE_SALE_RETURN)->first();
            $smsTemplate = SmsTemplate::where('type', SmsTemplate::SMS_TYPE_SALE_RETURN)->first();

            $subject = 'Customer sale return';

            $customer = Customer::whereId($saleReturn->customer_id)->first();

            $search = [
                '{customer_name}', '{sales_return_id}', '{sales_return_date}', '{sales_return_amount}', '{app_name}',
            ];

            $replace = [
                $customer->name, $saleReturn->reference_code, $saleReturn->date, number_format($saleReturn->grand_total, 2),
                getSettingValue('company_name'),
            ];

            if (! empty($mailTemplate) && $mailTemplate->status == MailTemplate::ACTIVE) {
                $data['data'] = str_replace($search, $replace, $mailTemplate->content);

                Mail::to($customer->email)
                    ->send(new MailSender('emails.mail-sender', $subject, $data));
            }

            if (! empty($smsTemplate) && $smsTemplate->status == SmsTemplate::ACTIVE) {
                $message = str_replace($search, $replace, $smsTemplate->content);

                $client = new \GuzzleHttp\Client();

                $url = SmsSetting::where('key', 'url')->value('value');
                //                $token = SmsSetting::where('key', 'token')->value('value');
                //            $url = "https://xrjv8e.api.infobip.com/sms/2/text/advanced";

                $data = SmsSetting::where('key', 'payload')->value('value');

                $data = preg_replace('/\s/', '', $data);

                $data = json_decode($data, true);

                $toKey = SmsSetting::where('key', 'mobile_key')->value('value');
                $number = $customer->phone;

                $messageKey = SmsSetting::where('key', 'message_key')->value('value');

                $data = replaceArrayValue($data, $toKey, $number);
                $data = replaceArrayValue($data, $messageKey, $message);

                $response = $client->post($url, [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                    ],
                    'form_params' => [$data],
                ]);
            }

            DB::commit();

            return $saleReturn;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function storeSaleReturnItems($saleReturn, $input)
    {
        foreach ($input['sale_return_items'] as $saleReturnItem) {
            $saleID = $input['sale_id'];

            $salesExists = SaleItem::where('product_id', $saleReturnItem['product_id'])
                ->whereHas('sale', function (Builder $query) use ($input) {
                    $query->where('warehouse_id', $input['warehouse_id'])
                        ->where('id', $input['sale_id']);
                })
                ->exists();

            if (! $salesExists) {
                throw new UnprocessableEntityHttpException('You can not return given product as there is no sales for it.');
            }

            $saleOfProduct = SaleItem::where('product_id', $saleReturnItem['product_id'])
                ->whereHas('sale', function (Builder $query) use ($input) {
                    $query->where('warehouse_id', $input['warehouse_id'])
                        ->where('id', $input['sale_id']);
                })
                ->sum('quantity');

            //            if ($saleOfProduct <= 0) {
            //                throw new UnprocessableEntityHttpException('There is no quantity remains to return.');
            //            }

            if ($saleReturnItem['quantity'] > $saleOfProduct) {
                throw new UnprocessableEntityHttpException('Sales quantity is '.$saleOfProduct.' and you are trying to return '.$saleReturnItem['quantity']);
            }

            //            $existingReturnProducts = SaleReturnItem::where('product_id',  $saleReturnItem['product_id'])
            //                ->whereHas('saleReturn', function (Builder $query) use($input) {
            //                    $query->where('warehouse_id', $input['warehouse_id']);
            //                })
            //                ->exists();
            //
            //            if ($existingReturnProducts) {
            //                $sumOfReturnedProducts = SaleReturnItem::where('product_id',  $saleReturnItem['product_id'])
            //                    ->whereHas('saleReturn', function (Builder $query) use($input) {
            //                        $query->where('warehouse_id', $input['warehouse_id']);
            //                    })
            //                    ->sum('quantity');
            //
            //                $remainingQtyToReturn = $saleOfProduct - $sumOfReturnedProducts;
            //
            //                if ($saleReturnItem['quantity'] != $remainingQtyToReturn && $saleReturnItem['quantity'] > $remainingQtyToReturn ) {
            //                    $remainingQtyToReturn = ($remainingQtyToReturn <= 0) ? 0 : $remainingQtyToReturn;
            //                        throw new UnprocessableEntityHttpException('Remaining sales to return is '.$remainingQtyToReturn.' and you are returning '.$saleReturnItem['quantity']);
            //                }
            //            }

            $item = $this->calculationSaleReturnItems($saleReturnItem);
            $saleReturnItem = new SaleReturnItem($item);
            $saleReturn->saleReturnItems()->save($saleReturnItem);
        }

        $subTotalAmount = $saleReturn->saleReturnItems()->sum('sub_total');

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

        $input['reference_code'] = getSettingValue('sale_return_code').'_111'.$saleReturn->id;
        $saleReturn->update($input);

        return $saleReturn;
    }

    /**
     * @return mixed
     */
    public function calculationSaleReturnItems($saleReturnItem)
    {
        $validator = Validator::make($saleReturnItem, SaleReturnItem::$rules);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        //discount calculation
        $perItemDiscountAmount = 0;
        $saleReturnItem['net_unit_price'] = $saleReturnItem['product_price'];
        if ($saleReturnItem['discount_type'] == SaleReturn::PERCENTAGE) {
            if ($saleReturnItem['discount_value'] <= 100 && $saleReturnItem['discount_value'] >= 0) {
                $saleReturnItem['discount_amount'] = ($saleReturnItem['discount_value'] * $saleReturnItem['product_price'] / 100) * $saleReturnItem['quantity'];
                if ($saleReturnItem['quantity'] == 0) {
                    $perItemDiscountAmount = 0;
                } else {
                    $perItemDiscountAmount = $saleReturnItem['discount_amount'] / $saleReturnItem['quantity'];
                }
                $saleReturnItem['net_unit_price'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException('Please enter discount value between 0 to 100.');
            }
        } elseif ($saleReturnItem['discount_type'] == SaleReturn::FIXED) {
            if ($saleReturnItem['discount_value'] <= $saleReturnItem['product_price'] && $saleReturnItem['discount_value'] >= 0) {
                $saleReturnItem['discount_amount'] = $saleReturnItem['discount_value'] * $saleReturnItem['quantity'];
                if ($saleReturnItem['quantity'] == 0) {
                    $perItemDiscountAmount = 0;
                } else {
                    $perItemDiscountAmount = $saleReturnItem['discount_amount'] / $saleReturnItem['quantity'];
                }
                $saleReturnItem['net_unit_price'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException("Please enter  discount's value between product's price.");
            }
        }

        //tax calculation
        $perItemTaxAmount = 0;
        if ($saleReturnItem['tax_value'] <= 100 && $saleReturnItem['tax_value'] >= 0) {
            if ($saleReturnItem['tax_type'] == SaleReturn::EXCLUSIVE) {
                $saleReturnItem['tax_amount'] = (($saleReturnItem['net_unit_price'] * $saleReturnItem['tax_value']) / 100) * $saleReturnItem['quantity'];
                if ($saleReturnItem['quantity'] == 0) {
                    $perItemTaxAmount = 0;
                } else {
                    $perItemTaxAmount = $saleReturnItem['tax_amount'] / $saleReturnItem['quantity'];
                }
            } elseif ($saleReturnItem['tax_type'] == SaleReturn::INCLUSIVE) {
                $saleReturnItem['tax_amount'] = ($saleReturnItem['net_unit_price'] * $saleReturnItem['tax_value']) / (100 + $saleReturnItem['tax_value']) * $saleReturnItem['quantity'];
                if ($saleReturnItem['quantity'] == 0) {
                    $perItemTaxAmount = 0;
                } else {
                    $perItemTaxAmount = $saleReturnItem['tax_amount'] / $saleReturnItem['quantity'];
                }

                $saleReturnItem['net_unit_price'] -= $perItemTaxAmount;
            }
        } else {
            throw new UnprocessableEntityHttpException('Please enter tax value between 0 to 100 ');
        }
        $saleReturnItem['sub_total'] = ($saleReturnItem['net_unit_price'] + $perItemTaxAmount) * $saleReturnItem['quantity'];

        return $saleReturnItem;
    }

    /**
     * @return mixed
     */
    public function updateSaleReturn($input, $id)
    {
        try {
            DB::beginTransaction();
            $saleReturn = SaleReturn::findOrFail($id);
            $saleReturnItemIds = SaleReturnItem::whereSaleReturnId($id)->pluck('id')->toArray();
            $saleReturnItemOldIds = [];
            foreach ($input['sale_return_items'] as $key => $saleReturnItem) {
                //get different ids & update
                $saleReturnItemOldIds[$key] = $saleReturnItem['sale_return_item_id'];
                $saleReturnItemArray = Arr::only($saleReturnItem, [
                    'sale_return_item_id', 'product_id', 'product_price', 'net_unit_price', 'tax_type', 'tax_value',
                    'tax_amount', 'discount_type', 'discount_value', 'discount_amount', 'sale_unit', 'quantity',
                    'sub_total',
                ]);

                $salesExists = SaleItem::where('product_id', $saleReturnItemArray['product_id'])
                    ->whereHas('sale', function (Builder $query) use ($input) {
                        $query->where('warehouse_id', $input['warehouse_id'])
                            ->where('id', $input['sale_id']);
                    })
                    ->exists();

                if (! $salesExists) {
                    throw new UnprocessableEntityHttpException('You can not return given product as there is no sales for it.');
                }

                $saleOfProduct = SaleItem::where('product_id', $saleReturnItemArray['product_id'])
                    ->whereHas('sale', function (Builder $query) use ($input) {
                        $query->where('warehouse_id', $input['warehouse_id'])
                            ->where('id', $input['sale_id']);
                    })
                    ->sum('quantity');

                //            if ($saleOfProduct <= 0) {
                //                throw new UnprocessableEntityHttpException('There is no quantity remains to return.');
                //            }

                if ($saleReturnItemArray['quantity'] > $saleOfProduct) {
                    throw new UnprocessableEntityHttpException('Sales quantity is '.$saleOfProduct.' and you are trying to return '.$saleReturnItemArray['quantity']);
                }

                $existingReturnProducts = SaleReturnItem::where('product_id', $saleReturnItemArray['product_id'])
                    ->whereHas('saleReturn', function (Builder $query) use ($input) {
                        $query->where('warehouse_id', $input['warehouse_id'])
                            ->where('id', $input['sale_id']);
                    })
                    ->exists();

                //                if ($existingReturnProducts) {
                //                    $sumOfReturnedProducts = SaleReturnItem::where('product_id',  $saleReturnItemArray['product_id'])
                //                        ->whereHas('saleReturn', function (Builder $query) use($input) {
                //                            $query->where('warehouse_id', $input['warehouse_id'])
                //                                ->where('id', $input['sale_id']);
                //                        })
                //                        ->sum('quantity');
                //
                //                    $remainingQtyToReturn = $saleOfProduct - $sumOfReturnedProducts;
                //
                //                    if ($saleReturnItem['quantity'] != $remainingQtyToReturn && $saleReturnItem['quantity'] > $remainingQtyToReturn ) {
                //                        $remainingQtyToReturn = ($remainingQtyToReturn <= 0) ? 0 : $remainingQtyToReturn;
                //                        throw new UnprocessableEntityHttpException('Remaining sales to return is '.$remainingQtyToReturn.' and you are returning '.$saleReturnItemArray['quantity']);
                //                    }
                //                }

                $this->updateItem($saleReturnItemArray, $input['warehouse_id']);
                //create new product items
                //                if (is_null($saleReturnItem['sale_return_item_id'])) {
                //                    $saleReturnItem = $this->calculationSaleReturnItems($saleReturnItem);
                //                    $saleReturnItemArray = Arr::only($saleReturnItem, [
                //                        'product_id', 'product_price', 'net_unit_price', 'tax_type', 'tax_value', 'tax_amount',
                //                        'discount_type', 'discount_value', 'discount_amount', 'sale_unit', 'quantity', 'sub_total',
                //                    ]);
                //                    $saleReturn->saleReturnItems()->create($saleReturnItemArray);
                //
                //                    // manage new product
                //                    $product = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($saleReturnItem['product_id'])->first();
                //                    $saleExist = SaleItem::where('product_id', $saleReturnItem['product_id'])->whereHas('sale',
                //                        function (Builder $q) use ($input) {
                //                            $q->where('customer_id', $input['customer_id'])->where('warehouse_id',
                //                                $input['warehouse_id']);
                //                        })->exists();
                //                    if ($saleExist) {
                //                        if ($product) {
                //                            if ($product->quantity >= $saleReturnItem['quantity']) {
                //                                $product->update([
                //                                    'quantity' => $product->quantity + $saleReturnItem['quantity'],
                //                                ]);
                //                            }
                //                        } else {
                //                            ManageStock::create([
                //                                'warehouse_id' => $input['warehouse_id'],
                //                                'product_id'   => $saleReturnItem['product_id'],
                //                                'quantity'     => $saleReturnItem['quantity'],
                //                            ]);
                //                        }
                //                    } else {
                //                        throw new UnprocessableEntityHttpException("Sale Does Not exist");
                //                    }
                //                }
            }
            $removeItemIds = array_diff($saleReturnItemIds, $saleReturnItemOldIds);
            //delete remove product
            if (! empty(array_values($removeItemIds))) {
                foreach ($removeItemIds as $removeItemId) {
                    // remove quantity manage storage
                    $oldProduct = SaleReturnItem::whereId($removeItemId)->first();
                    $productQuantity = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($oldProduct->product_id)->first();
                    if ($productQuantity && $oldProduct) {
                        if ($oldProduct->quantity <= $productQuantity->quantity) {
                            $stockQuantity = $productQuantity->quantity - $oldProduct->quantity;
                            if ($stockQuantity < 0) {
                                $stockQuantity = 0;
                            }
                            $productQuantity->update([
                                'quantity' => $stockQuantity,
                            ]);
                        }
                    } else {
                        throw new UnprocessableEntityHttpException('Quantity must be less than Available quantity.');
                    }
                }
                SaleReturnItem::whereIn('id', array_values($removeItemIds))->delete();
            }

            $saleReturn = $this->updateSaleReturnCalculation($input, $id);
            DB::commit();

            return $saleReturn;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateItem($saleReturnItem, $warehouseId): bool
    {
        try {
            $saleReturnItem = $this->calculationSaleReturnItems($saleReturnItem);
            $item = SaleReturnItem::whereId($saleReturnItem['sale_return_item_id']);

            $product = ManageStock::whereWarehouseId($warehouseId)->whereProductId($saleReturnItem['product_id'])->first();
            $oldItem = SaleReturnItem::whereId($saleReturnItem['sale_return_item_id'])->first();
            $totalQuantity = 0;
            if ($product && $oldItem && $oldItem->quantity != $saleReturnItem['quantity']) {
                if ($oldItem->quantity > $saleReturnItem['quantity']) {
                    $totalQuantity = $product->quantity - ($oldItem->quantity - $saleReturnItem['quantity']);
                    if ($totalQuantity < 0) {
                        $totalQuantity = 0;
                    }
                } elseif ($oldItem->quantity < $saleReturnItem['quantity']) {
                    $totalQuantity = $product->quantity + ($saleReturnItem['quantity'] - $oldItem->quantity);
                    if ($totalQuantity < 0) {
                        $totalQuantity = 0;
                    }
                }
                $product->update([
                    'quantity' => $totalQuantity,
                ]);
            }
            unset($saleReturnItem['sale_return_item_id']);
            $item->update($saleReturnItem);

            return true;
        } catch (Exception $e) {
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function updateSaleReturnCalculation($input, $id)
    {
        $saleReturn = SaleReturn::findOrFail($id);
        $subTotalAmount = $saleReturn->saleReturnItems()->sum('sub_total');

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

        $saleReturnInputArray = Arr::only($input, [
            'customer_id', 'warehouse_id', 'tax_rate', 'tax_amount', 'discount', 'shipping', 'grand_total',
            'received_amount', 'paid_amount', 'payment_type', 'note', 'date', 'status', 'payment_status',
        ]);
        $saleReturn->update($saleReturnInputArray);

        return $saleReturn;
    }
}
