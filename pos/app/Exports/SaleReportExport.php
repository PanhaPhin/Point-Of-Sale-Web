<?php

namespace App\Exports;

use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromView;

class SaleReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $startDate = request()->get('start_date');
        $endDate = request()->get('start_date');
        if ($startDate != 'null' && $endDate != 'null' && $startDate && $endDate) {
            $sales = Sale::with(['saleItems', 'warehouse', 'customer', 'payments'])->whereDate('created_at', '>=',
                $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->get();
        } else {
            $sales = Sale::with(['saleItems', 'warehouse', 'customer', 'payments'])->get();
        }

        return view('excel.all-sale-report-excel', ['sales' => $sales]);
    }
}
