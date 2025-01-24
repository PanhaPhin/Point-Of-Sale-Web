<?php

namespace App\Http\Controllers\API;

use App\Exports\ExpenseWarehouseReportExport;
use App\Exports\ProductPurchaseReportExport;
use App\Exports\ProductPurchaseReturnReportExport;
use App\Exports\ProductSaleReportExport;
use App\Exports\ProductSaleReturnReportExport;
use App\Exports\PurchaseReportExport;
use App\Exports\PurchaseReturnWarehouseReportExport;
use App\Exports\PurchasesWarehouseReportExport;
use App\Exports\SaleReportExport;
use App\Exports\SaleReturnWarehouseReportExport;
use App\Exports\SalesWarehouseReportExport;
use App\Exports\StockReportExport;
use App\Exports\TopSellingProductReportExport;
use App\Http\Controllers\AppBaseController;
use App\Models\BaseUnit;
use App\Models\Brand;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ManageStock;
use App\Models\POSRegister;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Repositories\CustomerRepository;
use App\Repositories\ManageStockRepository;
use App\Repositories\PurchaseRepository;
use App\Repositories\PurchaseReturnRepository;
use App\Repositories\SupplierRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\QueryBuilder;

class ReportAPIController extends AppBaseController
{
    private $manageStockRepository;

    private $purchaseRepository;

    private $purchaseReturnRepository;

    private $supplierRepository;

    /**
     * ReportAPIController constructor.
     */
    public function __construct(
        ManageStockRepository $manageStockRepository,
        PurchaseRepository $purchaseRepository,
        PurchaseReturnRepository $purchaseReturnRepository,
        SupplierRepository $supplierRepository,
        CustomerRepository $customerRepository
    ) {
        $this->manageStockRepository = $manageStockRepository;
        $this->purchaseRepository = $purchaseRepository;
        $this->purchaseReturnRepository = $purchaseReturnRepository;
        $this->supplierRepository = $supplierRepository;
        $this->customerRepository = $customerRepository;
    }

    public function getWarehouseSaleReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/sale-report-pdf.xlsx')) {
            Storage::delete('excel/sale-report-pdf.xlsx');
        }
        Excel::store(new SalesWarehouseReportExport, 'excel/sale-report-excel.xlsx');

        $data['sale_excel_url'] = Storage::url('excel/sale-report-excel.xlsx');

        return $this->sendResponse($data, 'Sale Report retrieved successfully');
    }

    public function getWarehousePurchaseReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/purchase-report-pdf.xlsx')) {
            Storage::delete('excel/purchase-report-pdf.xlsx');
        }
        Excel::store(new PurchasesWarehouseReportExport, 'excel/purchase-report-excel.xlsx');

        $data['purchase_excel_url'] = Storage::url('excel/purchase-report-excel.xlsx');

        return $this->sendResponse($data, 'purchase Report retrieved successfully');
    }

    public function getWarehouseSaleReturnReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/sale-return-report-excel.xlsx')) {
            Storage::delete('excel/sale-return-report-excel.xlsx');
        }
        Excel::store(new SaleReturnWarehouseReportExport, 'excel/sale-return-report-excel.xlsx');

        $data['sale_return_excel_url'] = Storage::url('excel/sale-return-report-excel.xlsx');

        return $this->sendResponse($data, 'sale return Report retrieved successfully');
    }

    public function getWarehousePurchaseReturnReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/purchase-return-report-excel.xlsx')) {
            Storage::delete('excel/purchase-return-report-excel.xlsx');
        }
        Excel::store(new PurchaseReturnWarehouseReportExport, 'excel/purchase-return-report-excel.xlsx');

        $data['purchase_return_excel_url'] = Storage::url('excel/purchase-return-report-excel.xlsx');

        return $this->sendResponse($data, 'purchase return Report retrieved successfully');
    }

    public function getWarehouseExpenseReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/expense-report-excel.xlsx')) {
            Storage::delete('excel/expense-report-excel.xlsx');
        }
        Excel::store(new ExpenseWarehouseReportExport, 'excel/expense-report-excel.xlsx');

        $data['expense_excel_url'] = Storage::url('excel/expense-report-excel.xlsx');

        return $this->sendResponse($data, 'expenses Report retrieved successfully');
    }

    public function getSalesReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/total-sales-report-excel.xlsx')) {
            Storage::delete('excel/total-sales-report-excel.xlsx');
        }
        Excel::store(new SaleReportExport, 'excel/total-sales-report-excel.xlsx');

        $data['total_sale_excel_url'] = Storage::url('excel/total-sales-report-excel.xlsx');

        return $this->sendResponse($data, 'Sale Report retrieved successfully');
    }

    public function getPurchaseReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/purchases-report-excel.xlsx')) {
            Storage::delete('excel/purchases-report-excel.xlsx');
        }
        Excel::store(new PurchaseReportExport, 'excel/purchases-report-excel.xlsx');

        $data['total_purchase_excel_url'] = Storage::url('excel/purchases-report-excel.xlsx');

        return $this->sendResponse($data, 'Purchase Report retrieved successfully');
    }

    public function getSellingProductReportExcel(): JsonResponse
    {
        if (Storage::exists('excel/top-selling-product-report-excel.xlsx')) {
            Storage::delete('excel/top-selling-product-report-excel.xlsx');
        }
        Excel::store(new TopSellingProductReportExport, 'excel/top-selling-product-report-excel.xlsx');

        $data['top_selling_product_excel_url'] = Storage::url('excel/top-selling-product-report-excel.xlsx');

        return $this->sendResponse($data, 'Top selling product Report retrieved successfully');
    }

    /**
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function getSellingProductReport(Request $request): JsonResponse
    {
        if ($request->get('start_date') && $request->get('start_date') != 'null') {
            $startDate = Carbon::parse(request()->get('start_date'))->toDateTimeString();
            $endDate = Carbon::parse(request()->get('end_date'))->toDateTimeString();
            $topSelling = Product::leftJoin('sale_items', 'products.id', '=', 'sale_items.product_id')
                ->where('sale_items.created_at', '>=', $startDate)
                ->where('sale_items.created_at', '<=', $endDate)
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
        foreach ($topSelling as $item) {
            if (isset($item->total_quantity) && $item->total_quantity != 0) {
                $topSellingProducts[] = $item->prepareTopSellingReport();
            }
        }

        return $this->sendResponse($topSellingProducts, 'Top selling product Report retrieved successfully');
    }

    public function stockReportExcel(Request $request): JsonResponse
    {
        if (Storage::exists('excel/stock-report-excel.xlsx')) {
            Storage::delete('excel/stock-report-excel.xlsx');
        }
        Excel::store(new StockReportExport, 'excel/stock-report-excel.xlsx');

        $data['stock_report_excel_url'] = Storage::url('excel/stock-report-excel.xlsx');

        return $this->sendResponse($data, 'Stock Report retrieved successfully');
    }

    public function getProductSaleReportExport(): JsonResponse
    {
        if (Storage::exists('excel/product-sales-report-excel.xlsx')) {
            Storage::delete('excel/product-sales-report-excel.xlsx');
        }
        Excel::store(new ProductSaleReportExport, 'excel/product-sales-report-excel.xlsx');

        $data['product_sale_report_excel_url'] = Storage::url('excel/product-sales-report-excel.xlsx');

        return $this->sendResponse($data, 'Product sales Report retrieved successfully');
    }

    public function getPurchaseProductReportExport(): JsonResponse
    {
        if (Storage::exists('excel/product-purchases-report-excel.xlsx')) {
            Storage::delete('excel/product-purchases-report-excel.xlsx');
        }
        Excel::store(new ProductPurchaseReportExport, 'excel/product-purchases-report-excel.xlsx');

        $data['product_purchase_report_url'] = Storage::url('excel/product-purchases-report-excel.xlsx');

        return $this->sendResponse($data, 'Product purchases retrieved successfully');
    }

    public function getSaleReturnProductReportExport(): JsonResponse
    {
        if (Storage::exists('excel/product-sale-return-report-excel.xlsx')) {
            Storage::delete('excel/product-sale-return-report-excel.xlsx');
        }
        Excel::store(new ProductSaleReturnReportExport, 'excel/product-sale-return-report-excel.xlsx');

        $data['product_sale_return_report_url'] = Storage::url('excel/product-sale-return-report-excel.xlsx');

        return $this->sendResponse($data, 'Product sale returns retrieved successfully');
    }

    public function getPurchaseReturnProductReportExport(): JsonResponse
    {
        if (Storage::exists('excel/product-purchase-return-report-excel.xlsx')) {
            Storage::delete('excel/product-purchase-return-report-excel.xlsx');
        }
        Excel::store(new ProductPurchaseReturnReportExport, 'excel/product-purchase-return-report-excel.xlsx');

        $data['product_purchase_return_report_url'] = Storage::url('excel/product-purchase-return-report-excel.xlsx');

        return $this->sendResponse($data, 'Product sale returns retrieved successfully');
    }

    public function getProductQuantity(Request $request): JsonResponse
    {
        $productId = $request->get('product_id');
        $product = ManageStock::whereProductId($productId)->with('warehouse', 'product')->get();

        return $this->sendResponse($product, 'Product Quantity retrieved successfully');
    }

    /**
     * @param  null  $warehouseId
     */
    public function stockAlerts(Request $request, $warehouseId = null): JsonResponse
    {
        $perPage = getPageSize($request);
        $manageStocks = $this->manageStockRepository->with('warehouse')->where('alert', true)->paginate($perPage);
        if ($warehouseId != null) {
            $manageStocks = $this->manageStockRepository->with('warehouse')->where(
                'warehouse_id',
                $warehouseId
            )->where(
                'alert',
                true
            )->paginate($perPage);
        }

        $productResponse = [];

        foreach ($manageStocks as $stock) {
            $product = Product::where('id', $stock->product_id)->first();
            $productUnitName = BaseUnit::whereId($product->product_unit)->value('name');
            $stock['product_unit_name'] = $productUnitName;
            $product->stock = $stock;
            $productResponse[] = $product;
            $product = null;
            $stock = null;
        }

        return Response::json([
            [
                'success' => true,
                'data' => $productResponse,
                'manage_stocks' => $manageStocks,
                'message' => 'Stocks retrieved successfully',
            ],
        ]);
    }

    public function getTodaySalesOverallReport()
    {
        $data = [];
        $today = Carbon::today();

        $salesDiscount = Sale::where('date', $today)->sum('discount');
        $salesTax = Sale::where('date', $today)->sum('tax_amount');
        $salesShippingAmount = Sale::where('date', $today)->sum('shipping');
        $totalGrandTotalAmount = Sale::where('date', $today)->sum('grand_total');

        $data['today_sales_cash_payment'] = SalesPayment::where('payment_date', $today)->where(
            'payment_type',
            SalesPayment::CASH
        )->sum('amount');
        $data['today_sales_cheque_payment'] = SalesPayment::where('payment_date', $today)->where(
            'payment_type',
            SalesPayment::CHEQUE
        )->sum('amount');
        $data['today_sales_bank_transfer_payment'] = SalesPayment::where('payment_date', $today)->where(
            'payment_type',
            SalesPayment::BANK_TRANSFER
        )->sum('amount');
        $data['today_sales_other_payment'] = SalesPayment::where('payment_date', $today)->where(
            'payment_type',
            SalesPayment::OTHER
        )->sum('amount');

        $data['today_sales_total_amount'] = $totalGrandTotalAmount;
        $data['today_sales_total_return_amount'] = SaleReturn::where('date', $today)->sum('grand_total');
        $data['today_sales_payment_amount'] = SalesPayment::where('payment_date', $today)->sum('amount');

        $productsData = Product::leftJoin(
            'sale_items',
            'products.id',
            '=',
            'sale_items.product_id'
        )
            ->whereDate('sale_items.created_at', $today)
            ->selectRaw('products.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('products.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('products.id')
            ->get();

        $productsSold = [];
        $data['all_grand_total_amount'] = 0;

        foreach ($productsData as $key => $product) {
            $productsSold[] = $product->prepareProductReport();
            $data['all_grand_total_amount'] = $data['all_grand_total_amount'] + $product->grand_total;
        }
        $data['today_total_products_sold'] = $productsSold;

        $data['today_brand_report'] = Brand::leftJoin(
            'products',
            'brands.id',
            '=',
            'products.brand_id'
        )->leftJoin(
            'sale_items',
            'products.id',
            '=',
            'sale_items.product_id'
        )
            ->whereDate('sale_items.created_at', $today)
            ->selectRaw('brands.*, COALESCE(sum(sale_items.sub_total),0) grand_total')
            ->selectRaw('brands.*, COALESCE(sum(sale_items.quantity),0) total_quantity')
            ->groupBy('brands.id')
            ->get();

        $data['all_tax_amount'] = $salesTax;
        $data['all_discount_amount'] = $salesDiscount;
        $data['all_shipping_amount'] = $salesShippingAmount;
        $data['all_grand_total_amount'] = $totalGrandTotalAmount;

        $cashInHand = 0;
        $register = POSRegister::where('user_id', Auth::id())
            ->whereNull('closed_at')
            ->first();
        if ($register) {
            $cashInHand = $register->cash_in_hand;
        }

        $data['cash_in_hand'] = $cashInHand;
        $data['total_cash_amount'] = $cashInHand + $data['today_sales_cash_payment'];

        return $this->sendResponse($data, 'Today sales register overall report retrieved successfully');
    }

    public function getSupplierReport(Request $request): JsonResponse
    {
        $perPage = getPageSize($request);
        $suppliers = $this->supplierRepository->withCount('purchases')->with('purchases')->paginate($perPage);

        foreach ($suppliers as $key => $supplier) {
            $suppliers[$key]['total_grand_amount'] = $supplier->purchases->sum('grand_total');
        }

        return $this->sendResponse($suppliers, 'Suppliers  retrieved successfully');
    }

    public function getSupplierPurchasesReport($supplierId, Request $request): JsonResponse
    {
        $perPage = getPageSize($request);

        $search = $request->filter['search'] ?? '';
        $supplier = (Supplier::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);

        $purchases = QueryBuilder::for(Purchase::class)
            ->where('supplier_id', $supplierId)
            ->search($search)
            ->allowedSorts('reference_code', 'created_at')
            ->allowedFilters(['reference_code'])
            ->with('warehouse', 'supplier');

        if ($supplier || $warehouse) {
            $purchases->whereHas('supplier', function (Builder $q) use ($search, $supplier) {
                if ($supplier) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            });
        }

        $purchases = $purchases->paginate($perPage);

        return $this->sendResponse($purchases, 'Supplier purchases retrieved successfully');
    }

    public function getSupplierPurchasesReturnReport($supplierId, Request $request)
    {
        $perPage = getPageSize($request);

        $search = $request->filter['search'] ?? '';
        $supplier = (Supplier::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $reference = (PurchaseReturn::whereSupplierId($supplierId)->where(
            'reference_code',
            'LIKE',
            "%$search%"
        )->get()->count() != 0);

        $purchaseReturns = QueryBuilder::for(PurchaseReturn::class)
            ->where('supplier_id', $supplierId)
            ->with('warehouse', 'supplier');

        if ($supplier || $warehouse) {
            $purchaseReturns->whereHas('supplier', function (Builder $q) use ($search, $supplier) {
                if ($supplier) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            });
        }

        if ($reference) {
            $purchaseReturns->where('reference_code', 'LIKE', "%$search%");
        }

        $purchaseReturns = $purchaseReturns->paginate($perPage);

        return $this->sendResponse($purchaseReturns, 'Supplier purchase returns retrieved successfully');
    }

    public function getSupplierInfo($supplierId)
    {
        $data = [];
        $purchases = $this->purchaseRepository->whereSupplierId($supplierId);
        $purchaseReturns = $this->purchaseReturnRepository->whereSupplierId($supplierId);

        $data['purchases_count'] = $purchases->count();
        $data['purchases_total_amount'] = $purchases->sum('grand_total');
        $data['purchases_returns_count'] = $purchaseReturns->count();
        $data['purchases_returns_total_amount'] = $purchaseReturns->sum('grand_total');

        return $this->sendResponse($data, 'Supplier info retrieved successfully');
    }

    public function getBestCustomersReport(Request $request): JsonResponse
    {
        $month = Carbon::now()->month;
        $topCustomers = Customer::leftJoin('sales', 'customers.id', '=', 'sales.customer_id')
            ->whereMonth('date', $month)
            ->select('customers.*', DB::raw('sum(sales.grand_total) as grand_total'))
            ->groupBy('customers.id')
            ->orderBy('grand_total', 'desc')
            ->latest()
            ->take(5)
            ->withCount('sales')
            ->get();

        $totalRecords = $topCustomers->count();

        return Response::json([
            'success' => true,
            'total_records' => $totalRecords,
            'top_customers' => $topCustomers,
            'message' => 'Best Customers report Retrieved Successfully',
        ]);
    }

    public function getProfitLossReport(Request $request)
    {
        $data = [];
        $data['sales'] = Sale::whereBetween(
            'date',
            [$request->get('start_date'), $request->get('end_date')]
        )->sum('grand_total');
        $data['purchases'] = Purchase::whereBetween(
            'date',
            [$request->get('start_date'), $request->get('end_date')]
        )->sum('grand_total');
        $data['sale_returns'] = SaleReturn::whereBetween(
            'date',
            [$request->get('start_date'), $request->get('end_date')]
        )->sum('grand_total');
        $data['purchase_returns'] = PurchaseReturn::whereBetween(
            'date',
            [$request->get('start_date'), $request->get('end_date')]
        )->sum('grand_total');
        $data['expenses'] = Expense::whereBetween(
            'date',
            [$request->get('start_date'), $request->get('end_date')]
        )->sum('amount');
        $data['sales_payment_amount'] = SalesPayment::whereBetween(
            'payment_date',
            [$request->get('start_date'), $request->get('end_date')]
        )->sum('amount');
        $data['Revenue'] = $data['sales'] - $data['sale_returns'];
        $data['payments_received'] = $data['sales_payment_amount'] + $data['purchase_returns'];

        $productCost = 0;

        $sales = Sale::whereBetween(
            'date',
            [$request->get('start_date'), $request->get('end_date')]
        )->with('saleItems')->get();

        foreach ($sales as $sale) {
            foreach ($sale->saleItems as $saleItem) {
                $productCost = $productCost + ($saleItem->product->product_cost * $saleItem->quantity);
            }
        }

        $data['product_cost'] = $productCost;

        $data['gross_profit'] = $data['sales'] - $productCost;

        return $this->sendResponse($data, 'Profit loss report info retrieved successfully');
    }

    public function getCustomerReport(Request $request)
    {
        $perPage = getPageSize($request);
        $customers = $this->customerRepository->withCount('sales')->with('sales.payments')->paginate($perPage);

        foreach ($customers as $key => $customer) {
            $totalPaidAmount = 0;
            $grandTotalAmount = $customer->sales->sum('grand_total');
            $customers[$key]['total_grand_amount'] = $grandTotalAmount;
            foreach ($customer->sales as $sale) {
                $totalPaidAmount = $totalPaidAmount + $sale->payments->sum('amount');
            }
            $totalDueAmount = $grandTotalAmount - $totalPaidAmount;
            $customers[$key]['total_paid_amount'] = $totalPaidAmount;
            $customers[$key]['total_due_amount'] = $totalDueAmount;
        }

        return $this->sendResponse($customers, 'Customers all report retrieved successfully');
    }

    public function getCustomerPaymentsReport($id, Request $request): JsonResponse
    {
        $perPage = getPageSize($request);

        $saleIds = [];

        $sales = Sale::whereCustomerId($id)->get();

        foreach ($sales as $sale) {
            $saleIds[] = $sale->id;
        }

        $payments = QueryBuilder::for(SalesPayment::class)
            ->whereIn('sale_id', $saleIds)
            ->with('sale')
            ->paginate($perPage);

        return $this->sendResponse($payments, 'Customers payments report retrieved successfully');
    }

    public function getCustomerInfo(Customer $customer)
    {
        $salesData = [];

        $salesData['totalSale'] = $customer->sales->count();

        $salesData['totalAmount'] = $customer->sales->sum('grand_total');

        $salesData['totalPaid'] = 0;

        foreach ($customer->sales as $sale) {
            $salesData['totalPaid'] = $salesData['totalPaid'] + $sale->payments->sum('amount');
        }

        $salesData['totalSalesDue'] = $salesData['totalAmount'] - $salesData['totalPaid'];

        return $this->sendResponse($salesData, 'Customer info retrieved successfully');
    }
}
