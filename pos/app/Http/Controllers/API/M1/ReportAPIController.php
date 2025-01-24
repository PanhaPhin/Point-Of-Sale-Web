<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use Carbon\Carbon;

class ReportAPIController extends AppBaseController
{
    public function getTodaySalesOverallReport()
    {
        $data = [];
        $today = Carbon::today();
        $salesDiscount = Sale::where('date', $today)->sum('discount');
        $salesTax = Sale::where('date', $today)->sum('tax_amount');
        $salesShippingAmount = Sale::where('date', $today)->sum('shipping');
        $totalGrandTotalAmount = Sale::where('date', $today)->sum('grand_total');

        $data['today_sales_cash_payment'] = SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::CASH)->sum('amount');
        $data['today_sales_cheque_payment'] = SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::CHEQUE)->sum('amount');
        $data['today_sales_bank_transfer_payment'] = SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::BANK_TRANSFER)->sum('amount');
        $data['today_sales_other_payment'] = SalesPayment::where('payment_date', $today)->where('payment_type',
            SalesPayment::OTHER)->sum('amount');

        $data['today_sales_total_amount'] = $totalGrandTotalAmount;
        $data['today_sales_total_return_amount'] = SaleReturn::where('date', $today)->sum('grand_total');
        $data['today_sales_payment_amount'] = SalesPayment::where('payment_date', $today)->sum('amount');

        $productsData = Product::leftJoin('sale_items', 'products.id', '=',
            'sale_items.product_id')
            ->whereDate('sale_items.created_at', $today)
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->get();

        $productsSold = [];
        $data['all_grand_total_amount'] = 0;

        foreach ($productsData as $key => $product) {
            $productsSold[] = $product->prepareProductReport();
            $data['all_grand_total_amount'] = $data['all_grand_total_amount'] + $product->grand_total;
        }
        $data['today_total_products_sold'] = $productsSold;

        $data['today_brand_report'] = Brand::leftJoin('products', 'brands.id', '=',
            'products.brand_id')->leftJoin('sale_items', 'products.id', '=',
                'sale_items.product_id')
            ->whereDate('sale_items.created_at', $today)
            ->selectRaw('brands.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('brands.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('brands.id')
            ->get();

        $data['all_tax_amount'] = $salesTax;
        $data['all_discount_amount'] = $salesDiscount;
        $data['all_shipping_amount'] = $salesShippingAmount;
        $data['all_grand_total_amount'] = $totalGrandTotalAmount;

        return $this->sendResponse($data, 'Today sales register overall report retrieved successfully');
    }
}
