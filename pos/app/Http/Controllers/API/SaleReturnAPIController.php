<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateSaleReturnRequest;
use App\Http\Requests\UpdateSaleReturnRequest;
use App\Http\Resources\SaleReturnCollection;
use App\Http\Resources\SaleReturnResource;
use App\Models\Customer;
use App\Models\ManageStock;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\Setting;
use App\Models\Warehouse;
use App\Repositories\SaleReturnRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class SaleReturnAPIController extends AppBaseController
{
    /**
     * @var SaleReturnRepository
     */
    private $saleReturnRepository;

    /**
     * SaleReturnAPIController constructor.
     */
    public function __construct(SaleReturnRepository $saleReturnRepository)
    {
        $this->saleReturnRepository = $saleReturnRepository;
    }

    public function index(Request $request): SaleReturnCollection
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';
        $customer = (Customer::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $salesReturn = $this->saleReturnRepository;
        if ($customer || $warehouse) {
            $salesReturn->whereHas('customer', function (Builder $q) use ($search, $customer) {
                if ($customer) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            });
        }

        if ($request->get('start_date') && $request->get('end_date')) {
            $salesReturn->whereBetween('date', [$request->get('start_date'), $request->get('end_date')]);
        }

        if ($request->get('warehouse_id')) {
            $salesReturn->where('warehouse_id', $request->get('warehouse_id'));
        }

        if ($request->get('customer_id')) {
            $salesReturn->where('customer_id', $request->get('customer_id'));
        }

        if ($request->get('status') && $request->get('status') != 'null') {
            $salesReturn->Where('status', $request->get('status'));
        }

        if ($request->get('payment_status') && $request->get('payment_status') != 'null') {
            $salesReturn->where('payment_status', $request->get('payment_status'));
        }

        $salesReturn = $salesReturn->paginate($perPage);

        SaleReturnResource::usingWithCollection();

        return new SaleReturnCollection($salesReturn);
    }

    public function store(CreateSaleReturnRequest $request): SaleReturnResource
    {
        $input = $request->all();
        $saleReturn = $this->saleReturnRepository->storeSaleReturn($input);

        return new SaleReturnResource($saleReturn);
    }

    public function show($id): SaleReturnResource
    {
        $saleReturn = $this->saleReturnRepository->find($id);

        return new SaleReturnResource($saleReturn);
    }

    public function edit(SaleReturn $salesReturn): SaleReturnResource
    {
        $salesReturn = $salesReturn->load('saleReturnItems.product', 'warehouse');

        return new SaleReturnResource($salesReturn);
    }

    public function editBySale($saleId)
    {
        $salesReturn = SaleReturn::where('sale_id', $saleId)->first();
        if (empty($salesReturn)) {
            return $this->sendError('Sale Return is not created');
        }
        $salesReturn = $salesReturn->load('saleReturnItems', 'saleReturnItems.product', 'warehouse');

        return new SaleReturnResource($salesReturn);
    }

    public function update(UpdateSaleReturnRequest $request, $id): SaleReturnResource
    {
        $input = $request->all();
        $saleReturn = $this->saleReturnRepository->updateSaleReturn($input, $id);

        return new SaleReturnResource($saleReturn);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $saleReturn = $this->saleReturnRepository->with('saleReturnItems')->where('id', $id)->first();
            $sale = Sale::whereId($saleReturn->sale_id)->first();
            if ($sale) {
                $sale->update(['is_return' => 0]);
            }
            foreach ($saleReturn->saleReturnItems as $saleReturnItem) {
                $product = ManageStock::whereWarehouseId($saleReturn->warehouse_id)->whereProductId($saleReturnItem['product_id'])->first();
                if ($product) {
                    if ($product->quantity >= $saleReturnItem['quantity']) {
                        $totalQuantity = $product->quantity - $saleReturnItem['quantity'];
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    }
                }
            }
            $this->saleReturnRepository->delete($id);
            DB::commit();

            return $this->sendSuccess('Sale Return Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function saleReturnInfo(SaleReturn $salesReturn): JsonResponse
    {
        $salesReturn = $salesReturn->load('saleReturnItems.product', 'warehouse', 'customer');
        $keyName = [
            'email', 'company_name', 'phone', 'address',
        ];
        $salesReturn['company_info'] = Setting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();

        return $this->sendResponse($salesReturn, 'Sale Return information retrieved successfully');
    }

    /**
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     */
    public function pdfDownload(SaleReturn $saleReturn): JsonResponse
    {
        $saleReturn = $saleReturn->load('customer', 'saleReturnItems.product');
        $data = [];
        if (Storage::exists('pdf/sale_return-'.$saleReturn->reference_code.'.pdf')) {
            Storage::delete('pdf/sale_return-'.$saleReturn->reference_code.'.pdf');
        }
        $companyLogo = getLogoUrl();

        $companyLogo = (string) \Image::make($companyLogo)->encode('data-url');

        $pdf = PDF::loadView('pdf.sale-return-pdf', compact('saleReturn', 'companyLogo'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/sale_return-'.$saleReturn->reference_code.'.pdf',
            $pdf->output());
        $data['sale_return_pdf_url'] = Storage::url('pdf/sale_return-'.$saleReturn->reference_code.'.pdf');

        return $this->sendResponse($data, 'Sale return pdf retrieved Successfully');
    }

    public function getSaleReturnProductReport(Request $request): SaleReturnCollection
    {
        $perPage = getPageSize($request);
        $productId = $request->get('product_id');
        $saleReturns = $this->saleReturnRepository->whereHas('saleReturnItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['saleReturnItems.product', 'customer']);

        $saleReturns = $saleReturns->paginate($perPage);

        SaleReturnResource::usingWithCollection();

        return new SaleReturnCollection($saleReturns);
    }
}
