<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Http\Resources\ProductCategoryCollection;
use App\Http\Resources\ProductCategoryResource;
use App\Models\Product;
use App\Repositories\ProductCategoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCategoryAPIController extends AppBaseController
{
    /** @var productCategoryRepository */
    private $productCategoryRepository;

    public function __construct(ProductCategoryRepository $productCategoryRepository)
    {
        $this->productCategoryRepository = $productCategoryRepository;
    }

    public function index(Request $request): ProductCategoryCollection
    {
        $perPage = getPageSize($request);
        $sort = null;
        if ($request->sort == 'products_count') {
            $sort = 'asc';
            $request->request->remove('sort');
        } elseif ($request->sort == '-products_count') {
            $sort = 'desc';
            $request->request->remove('sort');
        }
        $productCategory = $this->productCategoryRepository->withCount('products')->when($sort,
            function ($q) use ($sort) {
                $q->orderBy('products_count', $sort);
            })->paginate($perPage);

        ProductCategoryResource::usingWithCollection();

        return new ProductCategoryCollection($productCategory);
    }

    public function store(CreateProductCategoryRequest $request): ProductCategoryResource
    {
        $input = $request->all();
        $productCategory = $this->productCategoryRepository->storeProductCategory($input);

        return new ProductCategoryResource($productCategory);
    }

    public function show($id): ProductCategoryResource
    {
        $productCategory = $this->productCategoryRepository->withCount('products')->find($id);

        return new ProductCategoryResource($productCategory);
    }

    public function update(UpdateProductCategoryRequest $request, $id): ProductCategoryResource
    {
        $input = $request->all();
        $productCategory = $this->productCategoryRepository->updateProductCategory($input, $id);

        return new ProductCategoryResource($productCategory);
    }

    public function destroy($id): JsonResponse
    {
        $productModels = [
            Product::class,
        ];
        $result = canDelete($productModels, 'product_category_id', $id);
        if ($result) {
            return $this->sendError(__('messages.error.product_category_can_not_delete'));
        }
        $this->productCategoryRepository->delete($id);

        return $this->sendSuccess(__('messages.success.product_category_delete'));
    }
}
