<?php

namespace App\Http\Resources;

/**
 * Class ExpenseCollection
 */
class ExpenseCollection extends BaseCollection
{
    public $collects = ExpenseResource::class;
}
