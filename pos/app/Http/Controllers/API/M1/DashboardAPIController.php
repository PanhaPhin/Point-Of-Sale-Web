<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardAPIController extends AppBaseController
{
    public function index(): JsonResponse
    {
        $data = [];
        $today = Carbon::today();

        $data['sales'] = (float) Sale::sum('grand_total');
        $data['purchases'] = (float) Purchase::sum('grand_total');
        $data['sale_returns'] = (float) SaleReturn::sum('grand_total');
        $data['purchase_returns'] = (float) PurchaseReturn::sum('grand_total');
        $data['today_sales'] = (float) Sale::where('date', $today)->sum('grand_total');
        $data['today_sales_received'] = (float) SalesPayment::where('payment_date', $today)->sum('amount');
        $data['today_purchases'] = (float) PurchaseReturn::where('date', $today)->sum('grand_total');
        $data['today_expenses'] = (float) Expense::where('date', $today)->sum('amount');

        return $this->sendResponse($data, 'Dashboard data Retrieved Successfully');
    }

    public function getWeekSalePurchases(): JsonResponse
    {
        $count = 7;
        $days = [];
        $date = Carbon::tomorrow();
        for ($i = 0; $i < $count; $i++) {
            $days[] = $date->subDay()->format('Y-m-d');
        }
        $day['days'] = array_reverse($days);
        $sales = Sale::whereBetween('date', [$day['days'][0], $day['days'][6]])
            ->orderBy('date', 'desc')
            ->groupBy('date')
            ->get([
                DB::raw('DATE_FORMAT(date,"%Y-%m-%d") as week'),
                DB::raw('SUM(grand_total) as grand_total'),
            ])->keyBy('week');
        $period = CarbonPeriod::create($day['days'][0], $day['days'][6]);
        $data['dates'] = array_map(function ($datePeriod) {
            return $datePeriod->format('Y-m-d');
        }, iterator_to_array($period));

        $data['sales'] = array_map(function ($datePeriod) use ($sales) {
            $week = $datePeriod->format('Y-m-d');

            return $sales->has($week) ? $sales->get($week)->grand_total : 0;
        }, iterator_to_array($period));

        $purchases = Purchase::whereBetween('date', [$day['days'][0], $day['days'][6]])
            ->orderBy('date', 'desc')
            ->groupBy('date')
            ->get([
                DB::raw('DATE_FORMAT(date,"%Y-%m-%d") as week'),
                DB::raw('SUM(grand_total) as grand_total'),
            ])->keyBy('week');
        $data['purchases'] = array_map(function ($datePeriod) use ($purchases) {
            $week = $datePeriod->format('Y-m-d');

            return $purchases->has($week) ? $purchases->get($week)->grand_total : 0;
        }, iterator_to_array($period));

        for ($x = 0; $x < 7; $x++) {
            $newData[] = [
                'dates' => $data['dates'][$x],
                'sales' => $data['sales'][$x],
                'purchases' => $data['purchases'][$x],
            ];
        }

        return $this->sendResponse($newData, 'Week of Sales Purchase Retrieved Successfully');
    }

    public function getYearlyTopSelling(): JsonResponse
    {
        $year = Carbon::now()->year;
        $topSellings = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->whereYear('sale_items.created_at', $year)
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->orderBy('total_quantity', 'desc')
            ->take(5)
            ->get();
        $data = [];
        foreach ($topSellings as $topSelling) {
            $data[] = [
                'name' => $topSelling->name,
                'total_quantity' => $topSelling->total_quantity,
            ];
        }

        return $this->sendResponse($data, 'Yearly TopSelling Products Retrieved Successfully');
    }

    public function getTopSellingProducts(): JsonResponse
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;
        $topSellings = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
            ->whereMonth('sale_items.created_at', $month)
            ->whereYear('sale_items.created_at', $year)
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->orderBy('total_quantity', 'desc')
            ->latest()
            ->take(5)
            ->get();
        $data = [];
        foreach ($topSellings as $topSelling) {
            $data[] = $topSelling->prepareTopSelling();
        }

        return $this->sendResponse($data, 'Top Selling Products Retrieved Successfully');
    }

    public function getTopCustomer(): JsonResponse
    {
        $month = Carbon::now()->month;
        $topCustomers = Customer::leftJoin('sales', 'customers.id', '=', 'sales.customer_id')
            ->whereMonth('date', $month)
            ->select('customers.*', DB::raw('sum(sales.grand_total) as grand_total'))
            ->groupBy('customers.id')
            ->orderBy('grand_total', 'desc')
            ->latest()
            ->take(5)
            ->get();
        $data = [];
        foreach ($topCustomers as $topCustomer) {
            $data[] = [
                'name' => $topCustomer->name,
                'grand_total' => $topCustomer->grand_total,
            ];
        }

        return $this->sendResponse($data, 'Top Customers Retrieved Successfully');
    }

    public function getRecentSales()
    {
        $recentSales = Sale::latest()->take(5)->get();
        $data = [];
        foreach ($recentSales as $sales) {
            $data[] = $sales->prepareRecentSelling();
        }

        return $this->sendResponse($data, 'Recent Selling Products Retrieved Successfully');
    }

    public function stockAlerts(): JsonResponse
    {
        $manageStocks = ManageStock::with('warehouse')->where('alert', true)->limit(10)->latest()->get();

        $productResponse = [];
        foreach ($manageStocks as $stocks) {
            $productResponse[] = $stocks->prepareStockAlerts();
        }

        return $this->sendResponse($productResponse, 'Stocks retrieved successfully');
    }
}
