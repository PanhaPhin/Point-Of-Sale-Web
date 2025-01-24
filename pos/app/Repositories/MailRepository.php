<?php

namespace App\Repositories;

use App\Models\MailTemplate;

/**
 * Class SaleRepository
 */
class MailRepository extends BaseRepository
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
        return MailTemplate::class;
    }

    public function updateMailTemplate($input, $id)
    {
        $mailTemplate = MailTemplate::whereId($id)->firstOrFail();
        $mailTemplate->update([
            'content' => $input['content'],
        ]);

        return $mailTemplate;
    }
}
