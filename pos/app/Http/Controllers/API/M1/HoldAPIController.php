<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateHoldRequest;
use App\Models\Hold;
use App\Repositories\HoldRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class HoldAPIController extends AppBaseController
{
    private HoldRepository $holdRepository;

    public function __construct(HoldRepository $holdRepository)
    {
        $this->holdRepository = $holdRepository;
    }

    public function index()
    {
        $holds = Hold::all();
        $data = [];
        foreach ($holds as $hold) {
            $data[] = $hold->prepareHolds();
        }

        return $this->sendResponse($data, 'Holds Retrieved Successfully');
    }

    public function store(CreateHoldRequest $request): JsonResponse
    {
        $input = $request->all();
        $this->holdRepository->storeHold($input);

        return $this->sendSuccess('Hold created successfully.');
    }

    public function show($id): JsonResponse
    {
        $sale = $this->holdRepository->find($id);

        return $this->sendResponse($sale, 'Sale retrieved successfully.');
    }

    public function edit($id): JsonResponse
    {
        $getHold = Hold::with('holdItems.product.stocks', 'warehouse')->where('id', $id)->get();
        $data = [];
        foreach ($getHold as $hold) {
            foreach ($hold->holdItems as $items) {
                $imageUrls = $items->product->image_url;
                $data[] = [
                    'name' => $items->product->name,
                    'code' => $items->product->code,
                    'quantity' => $items->quantity,
                    'price' => $items->product->product_price,
                    'unit_name' => array_values($items->product->getProductUnitName())[1],
                    'image' => $imageUrls['imageUrls'] ?? [],
                ];
            }
        }

        return $this->sendResponse($data, 'Holds Retrieved Successfully');
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $hold = Hold::findOrFail($id);
            $hold->delete();

            DB::commit();

            return $this->sendSuccess('Hold Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
