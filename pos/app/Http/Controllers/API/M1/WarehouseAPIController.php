<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Repositories\WarehouseRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class WarehouseAPIController
 */
class WarehouseAPIController extends AppBaseController
{
    private WarehouseRepository $warehouseRepository;

    public function __construct(WarehouseRepository $warehouseRepository)
    {
        $this->warehouseRepository = $warehouseRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = getPageSize($request);
        $warehouses = $this->warehouseRepository->paginate($perPage);
        $data = [];
        foreach ($warehouses as $warehouse) {
            $data[] = $warehouse->prepareWarehouses();
        }

        return $this->sendResponse($data, 'Warehouses Retrieved Successfully');
    }
}
