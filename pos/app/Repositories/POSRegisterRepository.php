<?php

namespace App\Repositories;

use App\Models\POSRegister;

/**
 * Class POSRegisterRepository
 */
class POSRegisterRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'cash_in_hand',
        'closed_at',
        'cash_in_hand_while_closing',
        'bank_transfer',
        'cheque',
        'other',
        'total_sale',
        'total_return',
        'total_amount',
        'notes',
        'user_id',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'cash_in_hand',
        'closed_at',
        'cash_in_hand_while_closing',
        'bank_transfer',
        'cheque',
        'other',
        'total_sale',
        'total_return',
        'total_amount',
        'notes',
        'user_id',
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
        return POSRegister::class;
    }
}
