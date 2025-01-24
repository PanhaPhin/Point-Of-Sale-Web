<?php

namespace App\Repositories;

use App\Models\ExpenseCategory;

/**
 * Class ExpenseCategoryRepository
 */
class ExpenseCategoryRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'description',
        'created_at',
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
    public function model()
    {
        return ExpenseCategory::class;
    }
}
