<?php

namespace App\Exports;

use App\Models\Purchase;
use Maatwebsite\Excel\Concerns\FromView;

class PurchasesWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');
        $supplierId = request()->get('supplier_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $purchases = Purchase::whereWarehouseId($warehouseId)->with('warehouse', 'supplier')->get();
        } elseif (isset($supplierId) && $supplierId != 'null') {
            $purchases = Purchase::whereSupplierId($supplierId)->with('warehouse', 'supplier')->get();
        } else {
            $purchases = Purchase::with('warehouse', 'supplier')->get();
        }

        return view('excel.purchase-report-excel', ['purchases' => $purchases]);
    }
}
