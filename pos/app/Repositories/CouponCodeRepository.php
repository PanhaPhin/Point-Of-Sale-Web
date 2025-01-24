<?php

namespace App\Repositories;

use App\Models\CouponCode;

/**
 * Class CouponCodeRepository
 */
class CouponCodeRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'code',
        'start_date',
        'end_date',
        'how_many_time_can_use',
        'discount_type',
        'discount',
        'how_many_time_used',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
        'code',
        'start_date',
        'end_date',
        'how_many_time_can_use',
        'discount_type',
        'discount',
        'how_many_time_used',
        'created_at',
    ];

    public function getAvailableRelations(): array
    {
        return [];
    }

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
        return CouponCode::class;
    }
}
