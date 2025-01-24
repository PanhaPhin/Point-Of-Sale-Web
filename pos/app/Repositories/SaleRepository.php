<?php

namespace App\Repositories;

use App\Mail\MailSender;
use App\Models\Customer;
use App\Models\MailTemplate;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalesPayment;
use App\Models\SmsSetting;
use App\Models\SmsTemplate;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SaleRepository
 */
class SaleRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'date',
        'grand_total',
        'paid_amount',
        'created_at',
        'reference_code'
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'date',
        'grand_total',
        'paid_amount',
        'created_at',
        'reference_code'
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
        return Sale::class;
    }

    public function storeSale($input): Sale
    {
        try {
            DB::beginTransaction();

            $input['date'] = $input['date'] ?? date('Y/m/d');
            $input['is_sale_created'] = $input['is_sale_created'] ?? false;
            $QuotationId = $input['quotation_id'] ?? false;
            $saleInputArray = Arr::only($input, [
                'customer_id', 'warehouse_id', 'tax_rate', 'tax_amount', 'discount', 'shipping', 'grand_total',
                'received_amount', 'paid_amount', 'payment_type', 'note', 'date', 'status', 'payment_status',
            ]);

            $saleInputArray['user_id'] = Auth::id();
            /** @var Sale $sale */
            $sale = Sale::create($saleInputArray);
            if ($input['is_sale_created'] && $QuotationId) {
                $quotation = Quotation::find($QuotationId);
                $quotation->update([
                    'is_sale_created' => true,
                ]);
            }
            $sale = $this->storeSaleItems($sale, $input);
            $reference_code = getSettingValue('sale_code').'_111'.$sale->id;
            $this->generateBarcode($reference_code);
            $sale['barcode_image_url'] = Storage::url('sales/barcode-'.$reference_code.'.png');

            foreach ($input['sale_items'] as $saleItem) {
                $product = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($saleItem['product_id'])->first();
                if ($product && $product->quantity >= $saleItem['quantity']) {
                    $totalQuantity = $product->quantity - $saleItem['quantity'];
                    $product->update([
                        'quantity' => $totalQuantity,
                    ]);
                } else {
                    throw new UnprocessableEntityHttpException('Quantity must be less than Available quantity.');
                }
            }

            $mailTemplate = MailTemplate::where('type', MailTemplate::MAIL_TYPE_SALE)->first();
            $smsTemplate = SmsTemplate::where('type', SmsTemplate::SMS_TYPE_SALE)->first();

            $subject = 'Customer sale';

            $customer = Customer::whereId($sale->customer_id)->first();

            $search = [
                '{customer_name}', '{sales_id}', '{sales_date}', '{sales_amount}', '{paid_amount}', '{due_amount}',
                '{app_name}',
            ];

            $totalPayAmount = SalesPayment::whereSaleId($sale->id)->sum('amount');

            $dueAmount = $sale->grand_total - $totalPayAmount;

            $payAmount = 0;

            if (($dueAmount < 0) || ($sale->payment_status == Sale::PAID)) {
                $dueAmount = 0;
                $payAmount = $sale->grand_total;
            }

            $payAmount = number_format($payAmount, 2);
            $dueAmount = number_format($dueAmount, 2);

            $replace = [
                $customer->name, $sale->reference_code, $sale->date, number_format($sale->grand_total, 2), $payAmount, $dueAmount,
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
                // $token = SmsSetting::where('key', 'token')->value('value');
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

            return $sale;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function calculationSaleItems($saleItem)
    {
        $validator = Validator::make($saleItem, SaleItem::$rules);
        if ($validator->fails()) {
            throw new UnprocessableEntityHttpException($validator->errors()->first());
        }

        //discount calculation
        $perItemDiscountAmount = 0;
        $saleItem['net_unit_price'] = $saleItem['product_price'];
        if ($saleItem['discount_type'] == Sale::PERCENTAGE) {
            if ($saleItem['discount_value'] <= 100 && $saleItem['discount_value'] >= 0) {
                $saleItem['discount_amount'] = ($saleItem['discount_value'] * $saleItem['product_price'] / 100) * $saleItem['quantity'];
                $perItemDiscountAmount = $saleItem['discount_amount'] / $saleItem['quantity'];
                $saleItem['net_unit_price'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException('Please enter discount value between 0 to 100.');
            }
        } elseif ($saleItem['discount_type'] == Sale::FIXED) {
            if ($saleItem['discount_value'] <= $saleItem['product_price'] && $saleItem['discount_value'] >= 0) {
                $saleItem['discount_amount'] = $saleItem['discount_value'] * $saleItem['quantity'];
                $perItemDiscountAmount = $saleItem['discount_amount'] / $saleItem['quantity'];
                $saleItem['net_unit_price'] -= $perItemDiscountAmount;
            } else {
                throw new UnprocessableEntityHttpException("Please enter  discount's value between product's price.");
            }
        }

        //tax calculation
        $perItemTaxAmount = 0;
        if ($saleItem['tax_value'] <= 100 && $saleItem['tax_value'] >= 0) {
            if ($saleItem['tax_type'] == Sale::EXCLUSIVE) {
                $saleItem['tax_amount'] = (($saleItem['net_unit_price'] * $saleItem['tax_value']) / 100) * $saleItem['quantity'];
                $perItemTaxAmount = $saleItem['tax_amount'] / $saleItem['quantity'];
            } elseif ($saleItem['tax_type'] == Sale::INCLUSIVE) {
                $saleItem['tax_amount'] = ($saleItem['net_unit_price'] * $saleItem['tax_value']) / (100 + $saleItem['tax_value']) * $saleItem['quantity'];
                $perItemTaxAmount = $saleItem['tax_amount'] / $saleItem['quantity'];
                $saleItem['net_unit_price'] -= $perItemTaxAmount;
            }
        } else {
            throw new UnprocessableEntityHttpException('Please enter tax value between 0 to 100 ');
        }
        $saleItem['sub_total'] = ($saleItem['net_unit_price'] + $perItemTaxAmount) * $saleItem['quantity'];

        return $saleItem;
    }

    /**
     * @return mixed
     */
    public function storeSaleItems($sale, $input)
    {
        foreach ($input['sale_items'] as $saleItem) {
            $product = Product::whereId($saleItem['product_id'])->first();

            if (! empty($product) && isset($product->quantity_limit) && $saleItem['quantity'] > $product->quantity_limit) {
                throw new UnprocessableEntityHttpException('Please enter less than '.$product->quantity_limit.' quantity of '.$product->name.' product.');
            }
            $item = $this->calculationSaleItems($saleItem);
            $saleItem = new SaleItem($item);
            $sale->saleItems()->save($saleItem);
        }

        $subTotalAmount = $sale->saleItems()->sum('sub_total');

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

        if ($input['payment_status'] == Sale::PAID) {
            $input['paid_amount'] = $input['grand_total'];
            SalesPayment::create([
                'sale_id' => $sale->id,
                'payment_date' => Carbon::now(),
                'payment_type' => $input['payment_type'],
                'amount' => $input['paid_amount'],
                'received_amount' => $input['paid_amount'],
            ]);
        } elseif ($input['payment_status'] == Sale::UNPAID) {
            $input['paid_amount'] = 0;
        }

        $input['reference_code'] = getSettingValue('sale_code').'_111'.$sale->id;
        $sale->update($input);

        return $sale;
    }

    /**
     * @return mixed
     */
    public function updateSale($input, $id)
    {
        try {
            DB::beginTransaction();
            $sale = Sale::findOrFail($id);
            $saleItemIds = SaleItem::whereSaleId($id)->pluck('id')->toArray();
            $saleItmOldIds = [];
            foreach ($input['sale_items'] as $key => $saleItem) {
                $product = Product::whereId($saleItem['product_id'])->first();

                if (! empty($product) && isset($product->quantity_limit) && $saleItem['quantity'] > $product->quantity_limit) {
                    throw new UnprocessableEntityHttpException('Please enter less than '.$product->quantity_limit.' quantity of '.$product->name.' product.');
                }

                //get different ids & update
                $saleItmOldIds[$key] = $saleItem['sale_item_id'];
                $saleItemArray = Arr::only($saleItem, [
                    'sale_item_id', 'product_id', 'product_price', 'net_unit_price', 'tax_type', 'tax_value',
                    'tax_amount', 'discount_type', 'discount_value', 'discount_amount', 'sale_unit', 'quantity',
                    'sub_total',
                ]);
                $this->updateItem($saleItemArray, $input['warehouse_id']);
                //create new product items
                if (is_null($saleItem['sale_item_id'])) {
                    $saleItem = $this->calculationSaleItems($saleItem);
                    $saleItemArray = Arr::only($saleItem, [
                        'product_id', 'product_price', 'net_unit_price', 'tax_type', 'tax_value', 'tax_amount',
                        'discount_type', 'discount_value', 'discount_amount', 'sale_unit', 'quantity', 'sub_total',
                    ]);
                    $sale->saleItems()->create($saleItemArray);
                    $product = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($saleItem['product_id'])->first();
                    if ($product) {
                        if ($product->quantity >= $saleItem['quantity']) {
                            $product->update([
                                'quantity' => $product->quantity - $saleItem['quantity'],
                            ]);
                        } else {
                            throw new UnprocessableEntityHttpException('Quantity must be less than Available quantity.');
                        }
                    }
                }
            }
            $removeItemIds = array_diff($saleItemIds, $saleItmOldIds);
            //delete remove product
            if (! empty(array_values($removeItemIds))) {
                foreach ($removeItemIds as $removeItemId) {
                    // remove quantity manage storage
                    $oldProduct = SaleItem::whereId($removeItemId)->first();
                    $productQuantity = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($oldProduct->product_id)->first();
                    if ($productQuantity) {
                        if ($oldProduct) {
                            $productQuantity->update([
                                'quantity' => $productQuantity->quantity + $oldProduct->quantity,
                            ]);
                        }
                    } else {
                        ManageStock::create([
                            'warehouse_id' => $input['warehouse_id'],
                            'product_id' => $oldProduct->product_id,
                            'quantity' => $oldProduct->quantity,
                        ]);
                    }
                }
                SaleItem::whereIn('id', array_values($removeItemIds))->delete();
            }
            $this->generateBarcode($sale->reference_code);
            $sale['barcode_image_url'] = Storage::url('sales/barcode-'.$sale->reference_code.'.png');
            $sale = $this->updateSaleCalculation($input, $id);
            DB::commit();

            return $sale;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateItem($saleItem, $warehouseId): bool
    {
        try {
            $saleItem = $this->calculationSaleItems($saleItem);
            $item = SaleItem::whereId($saleItem['sale_item_id']);
            $product = ManageStock::whereWarehouseId($warehouseId)->whereProductId($saleItem['product_id'])->first();
            $oldItem = SaleItem::whereId($saleItem['sale_item_id'])->first();
            if ($oldItem && $oldItem->quantity != $saleItem['quantity']) {
                $totalQuantity = 0;
                if ($oldItem->quantity > $saleItem['quantity']) {
                    if ($product) {
                        $totalQuantity = $product->quantity + ($oldItem->quantity - $saleItem['quantity']);
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    } else {
                        ManageStock::create([
                            'warehouse_id' => $warehouseId,
                            'product_id' => $saleItem['product_id'],
                            'quantity' => $totalQuantity,
                        ]);
                    }
                } elseif ($oldItem->quantity < $saleItem['quantity']) {
                    $totalQuantity = $product->quantity - ($saleItem['quantity'] - $oldItem->quantity);
                    if ($product->quantity < ($saleItem['quantity'] - $oldItem->quantity)) {
                        throw new UnprocessableEntityHttpException('Quantity must be less than Available quantity.');
                    }
                    $product->update([
                        'quantity' => $totalQuantity,
                    ]);
                }
            }
            unset($saleItem['sale_item_id']);
            $item->update($saleItem);

            return true;
        } catch (Exception $e) {
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function updateSaleCalculation($input, $id)
    {
        $sale = Sale::findOrFail($id);
        $subTotalAmount = $sale->saleItems()->sum('sub_total');

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

        $sale->first();
        $saleExistGrandTotal = $sale->grand_total;

        if ($input['payment_status'] == Sale::PAID && $input['grand_total'] > $saleExistGrandTotal) {
            $input['payment_status'] = Sale::PARTIAL_PAID;
        }

        $saleInputArray = Arr::only($input, [
            'customer_id', 'warehouse_id', 'tax_rate', 'tax_amount', 'discount', 'shipping', 'grand_total',
            'received_amount', 'paid_amount', 'payment_type', 'note', 'date', 'status', 'payment_status',
        ]);
        $sale->update($saleInputArray);

        return $sale;
    }

    /**
     * @param $input
     */
    public function generateBarcode($code): bool
    {
        $generator = new BarcodeGeneratorPNG();
        $barcodeType = $generator::TYPE_CODE_128;

        Storage::disk(config('app.media_disc'))->put('sales/barcode-'.$code.'.png',
            $generator->getBarcode(Sale::CODE128, $barcodeType, 4, 70));

        return true;
    }
}
