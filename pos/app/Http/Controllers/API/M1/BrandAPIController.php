<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Repositories\BrandRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandAPIController extends AppBaseController
{
    private BrandRepository $brandRepository;

    public function __construct(BrandRepository $brandRepository)
    {
        $this->brandRepository = $brandRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = getPageSize($request);
        $sort = null;
        if ($request->sort == 'product_count') {
            $sort = 'asc';
            $request->request->remove('sort');
        } elseif ($request->sort == '-product_count') {
            $sort = 'desc';
            $request->request->remove('sort');
        }
        $brands = $this->brandRepository->withCount('products')->when($sort,
            function ($q) use ($sort) {
                $q->orderBy('products_count', $sort);
            })->paginate($perPage);

        $data = [];
        foreach ($brands as $brand) {
            $data[] = $brand->prepareBrands();
        }

        return $this->sendResponse($data, 'Brands Retrieved Successfully');
    }
}
