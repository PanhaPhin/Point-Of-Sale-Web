<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateHoldRequest;
use App\Http\Requests\UpdateHoldRequest;
use App\Http\Resources\HoldCollection;
use App\Http\Resources\HoldResource;
use App\Models\Hold;
use App\Repositories\HoldRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class HoldAPIController extends AppBaseController
{
    /** @var holdRepository */
    private $holdRepository;

    public function __construct(HoldRepository $holdRepository)
    {
        $this->holdRepository = $holdRepository;
    }

    public function index(): HoldCollection
    {
        $holds = $this->holdRepository->get();

        HoldResource::usingWithCollection();

        return new HoldCollection($holds);
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

    public function store(CreateHoldRequest $request): HoldResource
    {
        $input = $request->all();
        $hold = $this->holdRepository->storeHold($input);

        return new HoldResource($hold);
    }

    public function show($id): HoldResource
    {
        $sale = $this->holdRepository->find($id);

        return new HoldResource($sale);
    }

    public function edit($id): HoldResource
    {
        $hold = Hold::findOrFail($id);
        $hold = $hold->load('holdItems.product.stocks', 'warehouse');

        return new HoldResource($hold);
    }

    public function update(UpdateHoldRequest $request, $id): HoldResource
    {
        $reference = Hold::whereId($id)->first()->value('reference_code');

        if ($reference == $request->reference_code) {
            $input = $request->all();
            $hold = $this->holdRepository->updateHold($input, $id);

            return new HoldResource($hold);
        }

        $input = $request->all();
        $hold = $this->holdRepository->storeHold($input);

        return new HoldResource($hold);
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
