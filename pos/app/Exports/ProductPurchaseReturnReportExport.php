<?php

namespace App\Exports;

use App\Models\PurchaseReturn;
use Maatwebsite\Excel\Concerns\FromView;

class ProductPurchaseReturnReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $productId = request()->get('product_id');

        $purchaseReturns = PurchaseReturn::whereHas('purchaseReturnItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['purchaseReturnItems.product', 'supplier'])->get();

        return view('excel.product-purchase-return-report-excel',
            ['purchaseReturns' => $purchaseReturns, 'productId' => $productId]);
    }
}
