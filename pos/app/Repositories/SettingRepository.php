<?php

namespace App\Repositories;

use App\DotenvEditor;
use App\Models\Setting;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SettingRepository
 */
class SettingRepository extends BaseRepository
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
        return Setting::class;
    }

    /**
     * @return mixed
     */
    public function updateSettings($input)
    {
        try {
            DB::beginTransaction();
            if (isset($input['logo']) && ! empty($input['logo'])) {
                /** @var Setting $setting */
                $setting = Setting::where('key', '=', 'logo')->first();
                //                $setting->clearMediaCollection(Setting::PATH);
                $media = $setting->addMedia($input['logo'])->toMediaCollection(Setting::PATH, config('app.media_disc'));
                $setting = $setting->refresh();
                $setting->update(['value' => $media->getFullUrl()]);
                $input['logo'] = $setting->getLogoAttribute();
            }

            $settingInputArray = Arr::only($input, [
                'currency', 'email', 'company_name', 'phone', 'developed', 'footer', 'default_language',
                'default_customer', 'default_warehouse', 'stripe_key', 'stripe_secret', 'sms_gateway', 'twillo_sid',
                'twillo_token', 'twillo_from', 'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password',
                'smtp_Encryption', 'address', 'show_version_on_footer', 'country', 'state', 'city', 'postcode',
                'date_format', 'purchase_code', 'purchase_return_code', 'sale_code', 'sale_return_code', 'expense_code',
                'is_currency_right',
            ]);

            foreach ($settingInputArray as $key => $value) {
                if ($key == 'show_version_on_footer' || $key == 'is_currency_right') {
                    if (empty($value)) {
                        Setting::where('key', '=', $key)->first()->update(['value' => false]);
                    }
                }

                if (isset($value) && ! empty($value)) {
                    Setting::where('key', '=', $key)->first()->update(['value' => $value]);
                }
            }
            $input['logo'] = Setting::where('key', '=', 'logo')->first()->logo;
            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    public function updateMailEnvSetting($input)
    {
        $env = new DotenvEditor();
        $inputArr = Arr::except($input, ['_token']);
        $env->setAutoBackup(true);

        $envData = [
            'MAIL_MAILER' => (empty($inputArr['mail_mailer'])) ? '' : $inputArr['mail_mailer'],
            'MAIL_HOST' => (empty($inputArr['mail_host'])) ? '' : $inputArr['mail_host'],
            'MAIL_PORT' => (empty($inputArr['mail_port'])) ? '' : $inputArr['mail_port'],
            'MAIL_USERNAME' => (empty($inputArr['mail_username'])) ? '' : $inputArr['mail_username'],
            'MAIL_PASSWORD' => (empty($inputArr['mail_password'])) ? '' : $inputArr['mail_password'],
            'MAIL_FROM_ADDRESS' => (empty($inputArr['mail_from_address'])) ? '' : $inputArr['mail_from_address'],
            'MAIL_ENCRYPTION' => (empty($inputArr['mail_encryption'])) ? '' : $inputArr['mail_encryption'],
        ];

        foreach ($envData as $key => $value) {
            $this->createOrUpdateEnv($env, $key, $value);
        }
    }

    public function createOrUpdateEnv($env, $key, $value): bool
    {
        if (! $env->keyExists($key)) {
            $env->addData([
                $key => $value,
            ]);

            return true;
        }
        $env->changeEnv([
            $key => $value,
        ]);

        return true;
    }

    /**
     * @return mixed
     */
    public function getEnvData()
    {
        $env = new DotenvEditor();
        $key = $env->getContent();
        $data = collect($key)->only([
            'MAIL_MAILER', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USERNAME', 'MAIL_PASSWORD', 'MAIL_FROM_ADDRESS', 'MAIL_ENCRYPTION',
        ])->toArray();

        return [
            'mail_mailer' => $data['MAIL_MAILER'],
            'mail_host' => $data['MAIL_HOST'],
            'mail_port' => $data['MAIL_PORT'],
            'mail_username' => $data['MAIL_USERNAME'],
            'mail_password' => $data['MAIL_PASSWORD'],
            'mail_from_address' => $data['MAIL_FROM_ADDRESS'],
            'mail_encryption' => $data['MAIL_ENCRYPTION'],
        ];
    }
}
