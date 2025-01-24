<?php

namespace App\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

/**
 * Class UserCustomSort
 */
class UserCustomSort implements Sort
{
    public function __invoke(Builder $query, $descending, string $property): Builder
    {
        return $query->orderBy($property, $descending ? 'desc' : 'asc');
    }
}
