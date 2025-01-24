<?php

namespace App\Exports;

use App\Models\ManageStock;
use Maatwebsite\Excel\Concerns\FromView;

class StockReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');

        $stocks = ManageStock::whereWarehouseId($warehouseId)->with('product', 'warehouse')->get();

        return view('excel.stock-report-excel', ['stocks' => $stocks]);
    }
}
