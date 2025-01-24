<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CraeteAdjustmentRequest;
use App\Http\Requests\UpdateAdjustmentRequest;
use App\Http\Resources\AdjustmentCollection;
use App\Http\Resources\AdjustmentResource;
use App\Models\Adjustment;
use App\Models\AdjustmentItem;
use App\Models\ManageStock;
use App\Repositories\AdjustmentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class AdjustmentAPIController extends AppBaseController
{
    /** @var AdjustmentRepository */
    private $adjustmentRepository;

    public function __construct(AdjustmentRepository $adjustmentRepository)
    {
        $this->adjustmentRepository = $adjustmentRepository;
    }

    public function index(Request $request): AdjustmentCollection
    {
        $perPage = getPageSize($request);

        $adjustments = $this->adjustmentRepository;

        if ($request->get('warehouse_id')) {
            $adjustments->where('warehouse_id', $request->get('warehouse_id'));
        }

        $adjustments = $adjustments->paginate($perPage);

        AdjustmentResource::usingWithCollection();

        return new AdjustmentCollection($adjustments);
    }

    public function store(CraeteAdjustmentRequest $request): AdjustmentResource
    {
        $input = $request->all();
        $adjustment = $this->adjustmentRepository->storeAdjustment($input);

        return new AdjustmentResource($adjustment);
    }

    public function show(Adjustment $adjustment): AdjustmentResource
    {
        $adjustment = $adjustment->load('adjustmentItems.product');

        return new AdjustmentResource($adjustment);
    }

    public function edit(Adjustment $adjustment): AdjustmentResource
    {
        $adjustment = $adjustment->load('adjustmentItems.product.stocks', 'warehouse');

        return new AdjustmentResource($adjustment);
    }

    public function update(UpdateAdjustmentRequest $request, $id): AdjustmentResource
    {
        $input = $request->all();
        $adjustment = $this->adjustmentRepository->updateAdjustment($input, $id);

        return new AdjustmentResource($adjustment);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        try {
            DB::beginTransaction();

            $adjustment = $this->adjustmentRepository->with('adjustmentItems')->where('id', $id)->firstOrFail();

            foreach ($adjustment->adjustmentItems as $adjustmentItem) {
                $oldItem = AdjustmentItem::whereId($adjustmentItem->id)->firstOrFail();
                $existProductStock = ManageStock::whereWarehouseId($adjustment->warehouse_id)->whereProductId($oldItem->product_id)->first();

                if ($oldItem->method_type == AdjustmentItem::METHOD_ADDITION) {
                    $totalQuantity = $existProductStock->quantity - $oldItem['quantity'];
                } else {
                    $totalQuantity = $existProductStock->quantity + $oldItem['quantity'];
                }

                $existProductStock->update([
                    'quantity' => $totalQuantity,
                ]);
            }

            $this->adjustmentRepository->delete($id);

            DB::commit();

            return $this->sendSuccess('Adjustment delete successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
