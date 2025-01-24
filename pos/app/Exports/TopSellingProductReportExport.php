<?php

namespace App\Exports;

use App\Models\Product;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromView;

class TopSellingProductReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        if (request()->get('start_date') && request()->get('start_date') && request()->get('start_date') != 'null' && request()->get('start_date') != 'null') {
            $startDate = Carbon::parse(request()->get('start_date'))->toDateTimeString();
            $endDate = Carbon::parse(request()->get('end_date'))->toDateTimeString();
            $topSelling = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
                ->whereDate('sale_items.created_at', '>=', $startDate)
                ->whereDate('sale_items.created_at', '<=', $endDate)
                ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
                ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
                ->groupBy('products.id')
                ->orderBy('total_quantity', 'desc')
                ->latest()
                ->take(10)
                ->get();
        } else {
            $topSelling = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
                ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
                ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
                ->groupBy('products.id')
                ->orderBy('total_quantity', 'desc')
                ->latest()
                ->take(10)
                ->get();
        }

        $topSellingProducts = [];
        foreach ($topSelling as $topSelling) {
            if ($topSelling->total_quantity != 0) {
                $topSellingProducts[] = $topSelling->prepareTopSellingReport();
            }
        }

        return view('excel.top-selling-product-report-excel', ['topSellingProducts' => $topSellingProducts]);
    }
}
