<?php

namespace App\Exports;

use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromView;

class SalesWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $sales = Sale::whereWarehouseId($warehouseId)->with('warehouse', 'customer')->get();
        } else {
            $sales = Sale::with('warehouse', 'customer')->get();
        }

        return view('excel.sale-report-excel', ['sales' => $sales]);
    }
}
