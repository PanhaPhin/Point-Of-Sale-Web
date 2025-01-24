<?php

namespace App\Repositories;

use App\Models\BaseUnit;
use App\Models\Product;
use App\Models\Unit;

/**
 * Class BaseUnitRepository
 */
class BaseUnitRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
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
        return BaseUnit::class;
    }

    public function baseUnitCantDelete($id): bool
    {
        $productModels = [
            Product::class,
        ];
        $unitModels = [
            Unit::class,
        ];

        $productPurchaseResult = canDelete($productModels, 'product_unit', $id);
        $productUnitResult = canDelete($unitModels, 'base_unit', $id);
        if ($productPurchaseResult || $productUnitResult) {
            return true;
        }

        return false;
    }
}
