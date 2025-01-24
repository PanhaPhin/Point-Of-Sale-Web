<?php

namespace App\Exports;

use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromView;

class ProductSaleReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $productId = request()->get('product_id');

        $sales = Sale::whereHas('saleItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['saleItems.product', 'customer'])->get();

        return view('excel.product-sale-report-excel', ['sales' => $sales, 'productId' => $productId]);
    }
}
