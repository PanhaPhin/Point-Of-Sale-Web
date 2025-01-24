<?php

namespace App\Exports;

use App\Models\Purchase;
use Maatwebsite\Excel\Concerns\FromView;

class PurchaseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $startDate = request()->get('start_date');
        $endDate = request()->get('end_date');

        if ($startDate != 'null' && $endDate != 'null' && $startDate && $endDate) {
            $purchases = Purchase::with(['purchaseItems', 'warehouse', 'supplier'])->whereDate('created_at', '>=',
                $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->get();
        } else {
            $purchases = Purchase::with(['purchaseItems', 'warehouse', 'supplier'])->get();
        }

        return view('excel.all-purchase-report-excel', ['purchases' => $purchases]);
    }
}
