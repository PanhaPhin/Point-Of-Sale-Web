<?php

namespace App\Exports;

use App\Models\PurchaseReturn;
use Maatwebsite\Excel\Concerns\FromView;

class PurchaseReturnWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');
        $supplierId = request()->get('supplier_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $purchaseReturns = PurchaseReturn::whereWarehouseId($warehouseId)->with('warehouse', 'supplier')->get();
        } elseif (isset($supplierId) && $supplierId != 'null') {
            $purchaseReturns = PurchaseReturn::whereSupplierId($supplierId)->with('warehouse', 'supplier')->get();
        } else {
            $purchaseReturns = PurchaseReturn::with('warehouse', 'supplier')->get();
        }

        return view('excel.purchase-return-report-excel', ['purchaseReturns' => $purchaseReturns]);
    }
}
