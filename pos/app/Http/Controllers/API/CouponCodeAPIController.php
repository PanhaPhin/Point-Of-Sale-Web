<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\StoreCouponCodeRequest;
use App\Http\Requests\UpdateCouponCodeRequest;
use App\Http\Resources\CouponCodeCollection;
use App\Http\Resources\CouponCodeResource;
use App\Models\CouponCode;
use App\Repositories\CouponCodeRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CouponCodeAPIController extends AppBaseController
{
    /** @var CouponCodeRepository */
    private $couponCodeRepository;

    public function __construct(CouponCodeRepository $couponCodeRepository)
    {
        $this->couponCodeRepository = $couponCodeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $perPage = getPageSize($request);
        $couponCodes = $this->couponCodeRepository;

        $couponCodes = $couponCodes->paginate($perPage);
        CouponCodeResource::usingWithCollection();

        return new CouponCodeCollection($couponCodes);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCouponCodeRequest $request)
    {
        $input = $request->all();
        $couponCode = $this->couponCodeRepository->create($input);
        $couponCode->products()->sync($input['products']);

        return new CouponCodeResource($couponCode);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(CouponCode $couponCode)
    {
        return new CouponCodeResource($couponCode);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCouponCodeRequest $request, CouponCode $couponCode)
    {
        $input = Arr::except($request->all(), 'products');
        $this->couponCodeRepository->where('id', $couponCode->id)->update($input);
        $couponCode->products()->sync($request->products);

        return new CouponCodeResource($couponCode);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(CouponCode $couponCode)
    {
        $couponCode->delete();

        return $this->sendSuccess('Coupon code deleted successfully.');
    }
}
