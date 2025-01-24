<?php

namespace App\Exports;

use App\Models\Expense;
use Maatwebsite\Excel\Concerns\FromView;

class ExpenseWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $expenses = Expense::whereWarehouseId($warehouseId)->with('warehouse', 'expenseCategory')->get();
        } else {
            $expenses = Expense::with('warehouse', 'expenseCategory')->get();
        }

        return view('excel.expense-report-excel', ['expenses' => $expenses]);
    }
}
