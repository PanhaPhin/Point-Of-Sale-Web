<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductAPIController extends AppBaseController
{
    private ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $products = $this->productRepository;

        if ($request->get('product_unit')) {
            $products->where('product_unit', $request->get('product_unit'));
        }

        if ($request->get('warehouse_id') && $request->get('warehouse_id') != 'null') {
            $warehouseId = $request->get('warehouse_id');
            $products->whereHas('stock', function ($q) use ($warehouseId) {
                $q->where('manage_stocks.warehouse_id', $warehouseId);
            })->with([
                'stock' => function (HasOne $query) use ($warehouseId) {
                    $query->where('manage_stocks.warehouse_id', $warehouseId);
                },
            ]);
        }

        $products = $products->get();
        $data = [];
        foreach ($products as $product) {
            $data[] = $product->prepareProducts();
        }

        return $this->sendResponse($data, 'Products retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $product = $this->productRepository->find($id);
        $data = $product->prepareProducts();

        return $this->sendResponse($data, 'Product Retrieved Successfully');
    }

    public function getProductByCategory($id): JsonResponse
    {
        $products = $this->productRepository->whereProductCategoryId($id)->get();
        $data = [];
        foreach ($products as $product) {
            $data[] = $product->prepareProducts();
        }

        return $this->sendResponse($data, 'Product Retrieved Successfully.');
    }

    public function getProductByBrand($id): JsonResponse
    {
        $products = $this->productRepository->whereBrandId($id)->get();
        $data = [];
        foreach ($products as $product) {
            $data[] = $product->prepareProducts();
        }

        return $this->sendResponse($data, 'Product Retrieved Successfully.');
    }

    /**
     * @param $id
     */
    public function getProductByBrandAndCategory(Request $request): JsonResponse
    {
        $products = $this->productRepository->whereBrandId($request->brand_Id)->whereProductCategoryId($request->category_id)->get();
        $data = [];
        foreach ($products as $product) {
            $data[] = $product->prepareProducts();
        }

        return $this->sendResponse($data, 'Product Retrieved Successfully.');
    }
}
