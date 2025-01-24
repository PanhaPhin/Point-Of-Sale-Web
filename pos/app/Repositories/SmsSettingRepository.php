<?php

namespace App\Repositories;

use App\Models\SmsSetting;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SmsSettingRepository
 */
class SmsSettingRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'key',
        'value',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'key',
        'value',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return SmsSetting::class;
    }

    /**
     * @return mixed
     */
    public function updateSmsSettings($input)
    {
        try {
            DB::beginTransaction();

            $smsSettingKeys = [];

            foreach ($input['sms_data'] as $key => $value) {
                $keyExist = SmsSetting::where('key', $value['key'])->exists();
                $smsSettingKeys[] = $value['key'];
                if ($keyExist) {
                    if (isset($value) && ! empty($value)) {
                        SmsSetting::where('key', $value['key'])->first()->update(['value' => $value['value']]);
                    }
                } else {
                    SmsSetting::create([
                        'key' => $value['key'],
                        'value' => $value['value'],
                    ]);
                }
            }

            $smsSettingKeys = array_merge($smsSettingKeys, ['url', 'mobile_key', 'message_key', 'payload']);

            $deleteKeysRecords = SmsSetting::whereNotIn('key', $smsSettingKeys)->delete();

            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }
}
