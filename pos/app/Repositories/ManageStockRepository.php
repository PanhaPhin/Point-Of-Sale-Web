<?php

namespace App\Repositories;

use App\Models\ManageStock;

/**
 * Class ManageStockRepository
 */
class ManageStockRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at'
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'created_at'
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
        return ManageStock::class;
    }
}
