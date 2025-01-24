<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\PermissionCollection;
use App\Http\Resources\PermissionResource;
use App\Repositories\PermissionRepository;
use Illuminate\Http\Request;

class PermissionController extends AppBaseController
{
    /** @var PermissionRepository */
    private $permissionRepository;

    public function __construct(PermissionRepository $permissionRepo)
    {
        $this->permissionRepository = $permissionRepo;
    }

    public function getPermissions(Request $request)
    {
        $perPage = getPageSize($request);
        $permissions = $this->permissionRepository->paginate($perPage);

        PermissionResource::usingWithCollection();

        return new PermissionCollection($permissions);
    }
}
