<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateBaseUnitRequest;
use App\Http\Requests\UpdateBaseUnitRequest;
use App\Http\Resources\BaseUnitCollection;
use App\Http\Resources\BaseUnitResource;
use App\Models\BaseUnit;
use App\Repositories\BaseUnitRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class BaseUnitAPIController
 */
class BaseUnitAPIController extends AppBaseController
{
    /**
     * @var BaseUnitRepository
     */
    private $baseUnitRepository;

    public function __construct(BaseUnitRepository $baseUnitRepository)
    {
        $this->baseUnitRepository = $baseUnitRepository;
    }

    public function index(Request $request): BaseUnitCollection
    {
        $perPage = getPageSize($request);
        $baseUnits = $this->baseUnitRepository;

        $baseUnits = $baseUnits->paginate($perPage);

        BaseUnitResource::usingWithCollection();

        return new BaseUnitCollection($baseUnits);
    }

    /**
     * @throws ValidatorException
     */
    public function store(CreateBaseUnitRequest $request): BaseUnitResource
    {
        $input = $request->all();
        $baseUnit = $this->baseUnitRepository->create($input);
        BaseUnitResource::usingWithCollection();

        return new BaseUnitResource($baseUnit);
    }

    public function show($id): BaseUnitResource
    {
        $baseUnit = $this->baseUnitRepository->find($id);

        return new BaseUnitResource($baseUnit);
    }

    public function edit($id): BaseUnitResource
    {
        $baseUnit = $this->baseUnitRepository->find($id);

        return new BaseUnitResource($baseUnit);
    }

    /**
     * @throws ValidatorException
     */
    public function update(UpdateBaseUnitRequest $request, $id): BaseUnitResource
    {
        $input = $request->all();
        $baseUnit = $this->baseUnitRepository->update($input, $id);

        return new BaseUnitResource($baseUnit);
    }

    public function destroy($id): JsonResponse
    {
        $defaultBaseUnit = BaseUnit::whereId($id)->where('is_default', true)->exists();

        if ($defaultBaseUnit) {
            return $this->sendError('Default Base unit can\'t be deleted.');
        }

        $baseUnitUse = $this->baseUnitRepository->baseUnitCantDelete($id);
        if ($baseUnitUse) {
            return $this->sendError('Base unit can\'t be deleted.');
        }
        $this->baseUnitRepository->delete($id);

        return $this->sendSuccess('Base unit deleted successfully');
    }
}
