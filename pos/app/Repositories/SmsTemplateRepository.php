<?php

namespace App\Repositories;

use App\Models\SmsTemplate;

/**
 * Class SmsTemplateRepository
 */
class SmsTemplateRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'template_name',
        'content',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'template_name',
        'content',
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
        return SmsTemplate::class;
    }

    public function updateSmsTemplate($input, $id)
    {
        $smsTemplate = SmsTemplate::whereId($id)->firstOrFail();
        $smsTemplate->update([
            'content' => $input['content'],
        ]);

        return $smsTemplate;
    }
}
