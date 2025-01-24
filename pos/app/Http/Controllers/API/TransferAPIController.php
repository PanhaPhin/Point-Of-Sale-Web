<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateTransferRequest;
use App\Http\Requests\UpdateTransferRequest;
use App\Http\Resources\TransferCollection;
use App\Http\Resources\TransferResource;
use App\Models\ManageStock;
use App\Models\Transfer;
use App\Models\TransferItem;
use App\Repositories\TransferRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class TransferAPIController extends AppBaseController
{
    /** @var transferRepository */
    private $transferRepository;

    public function __construct(TransferRepository $transferRepository)
    {
        $this->transferRepository = $transferRepository;
    }

    public function index(Request $request): TransferCollection
    {
        $perPage = getPageSize($request);

        $transfers = $this->transferRepository;

        if ($request->get('status') && $request->get('status') != 'null') {
            $transfers->Where('status', $request->get('status'));
        }

        $transfers = $transfers->paginate($perPage);

        TransferResource::usingWithCollection();

        return new TransferCollection($transfers);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function store(CreateTransferRequest $request): TransferResource
    {
        $input = $request->all();
        $transfer = $this->transferRepository->storeTransfer($input);

        return new TransferResource($transfer);
    }

    public function show(Transfer $transfer)
    {
        $transfer = $transfer->load('transferItems.product');

        return new TransferResource($transfer);
    }

    public function edit(Transfer $transfer): TransferResource
    {
        $transfer = $transfer->load('transferItems.product.stocks', 'fromWarehouse', 'toWarehouse');

        return new TransferResource($transfer);
    }

    public function update(UpdateTransferRequest $request, $id): TransferResource
    {
        $input = $request->all();
        $transfer = $this->transferRepository->updateTransfer($input, $id);

        return new TransferResource($transfer);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Transfer  $transfer
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $transfer = $this->transferRepository->with('transferItems')->where('id', $id)->firstOrFail();

            foreach ($transfer->transferItems as $transferItem) {
                $oldTransferItem = TransferItem::whereId($transferItem->id)->first();
                $oldTransfer = Transfer::whereId($oldTransferItem->transfer_id)->first();
                $fromManageStock = ManageStock::whereWarehouseId($oldTransfer->from_warehouse_id)->whereProductId($oldTransferItem->product_id)->first();
                $toManageStock = ManageStock::whereWarehouseId($oldTransfer->to_warehouse_id)->whereProductId($oldTransferItem->product_id)->first();

                $toquantity = 0;

                if ($toManageStock) {
                    $toquantity = $toquantity - $oldTransferItem->quantity;
                    manageStock($toManageStock->warehouse_id, $oldTransferItem->product_id, $toquantity);
                }

                $fromQuantity = 0;

                $fromQuantity = $fromQuantity + $oldTransferItem->quantity;

                manageStock($oldTransfer->from_warehouse_id, $oldTransferItem->product_id, $fromQuantity);
            }

            $this->transferRepository->delete($id);

            DB::commit();

            return $this->sendSuccess('Transfer delete successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
