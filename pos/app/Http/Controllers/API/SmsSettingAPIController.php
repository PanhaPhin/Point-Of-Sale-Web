<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\SmsSettingResource;
use App\Models\SmsSetting;
use App\Repositories\SmsSettingRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SmsSettingAPIController extends AppBaseController
{
    /** @var SmsSettingRepository */
    private $smsSettingRepository;

    public function __construct(SmsSettingRepository $smsSettingRepository)
    {
        $this->smsSettingRepository = $smsSettingRepository;
    }

    public function index(): JsonResponse
    {
        $smsSettings = SmsSetting::where('key', '!=', 'sms_status')->select('key', 'value')->get();
        $data = $smsSettings->toArray();
        $status = SmsSetting::where('key', 'sms_status')->select('key', 'value')->first();

        return $this->sendResponse(new SmsSettingResource(['sms_status' => $status, 'attributes' => $data]),
            'Sms Setting data retrieved successfully.');
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

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(int $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(int $id)
    {
        //
    }

    /**
     * @param $id
     */
    public function update(Request $request): JsonResponse
    {
        $input = $request->all();
        $smsSettings = $this->smsSettingRepository->updateSmsSettings($input);

        return $this->sendResponse($input['sms_data'], 'Sms Setting data updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        //
    }
}
