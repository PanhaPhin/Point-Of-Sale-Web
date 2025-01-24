<?php

namespace App\Exports;

use App\Models\SaleReturn;
use Maatwebsite\Excel\Concerns\FromView;

class ProductSaleReturnReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $productId = request()->get('product_id');

        $saleReturns = SaleReturn::whereHas('saleReturnItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['saleReturnItems.product', 'customer'])->get();

        return view('excel.product-sale-returns-report-excel',
            ['saleReturns' => $saleReturns, 'productId' => $productId]);
    }
}
