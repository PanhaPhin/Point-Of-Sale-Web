<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Http\Resources\BrandCollection;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use App\Models\Product;
use App\Repositories\BrandRepository;
use Illuminate\Http\Request;

class BrandAPIController extends AppBaseController
{
    /** @var BrandRepository */
    private $brandRepository;

    public function __construct(BrandRepository $brandRepository)
    {
        $this->brandRepository = $brandRepository;
    }

    public function index(Request $request): BrandCollection
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

        BrandResource::usingWithCollection();

        return new BrandCollection($brands);
    }

    public function store(CreateBrandRequest $request): BrandResource
    {
        $input = $request->all();
        $brand = $this->brandRepository->storeBrand($input);

        BrandResource::usingWithCollection();

        return new BrandResource($brand);
    }

    public function show($id): BrandResource
    {
        $brand = Brand::withCount('products')->findOrFail($id);

        return new BrandResource($brand);
    }

    public function update(UpdateBrandRequest $request, $id)
    {
        $input = $request->all();

        $brand = $this->brandRepository->updateBrand($input, $id);

        return new BrandResource($brand);
    }

    public function destroy($id)
    {
        $productModels = [
            Product::class,
        ];
        $productResult = canDelete($productModels, 'brand_id', $id);

        if ($productResult) {
            return $this->sendError('Brand can\'t be deleted.');
        }

        Brand::findOrFail($id)->delete();

        return $this->sendSuccess('Brand deleted successfully');
    }
}
