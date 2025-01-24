<?php

namespace App\Exports;

use App\Models\SaleReturn;
use Maatwebsite\Excel\Concerns\FromView;

class SaleReturnWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $saleReturns = SaleReturn::whereWarehouseId($warehouseId)->with('warehouse', 'customer')->get();
        } else {
            $saleReturns = SaleReturn::with('warehouse', 'customer')->get();
        }

        return view('excel.sale-return-report-excel', ['saleReturns' => $saleReturns]);
    }
}
