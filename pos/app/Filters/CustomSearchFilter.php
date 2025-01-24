<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

/**
 * Class CustomSearchFilter
 */
class CustomSearchFilter implements Filter
{
    public $searchableFields;

    public function __construct($searchableFields)
    {
        $this->searchableFields = $searchableFields;
        $filterSearchFields = request()->get('filter')['search_fields'] ?? [];
        if (! empty($filterSearchFields)) {
            $this->searchableFields = explode(',', $filterSearchFields);
        }
    }

    public function __invoke(Builder $query, $value, string $property): Builder
    {
        $customQuery = $query;
        if (is_array($value)) {
            foreach ($this->searchableFields as $searchableField) {
                foreach ($value as $string) {
                    $customQuery->orWhere($searchableField, 'LIKE', '%'.$string.'%');
                }
            }
        } else {
            foreach ($this->searchableFields as $searchableField) {
                $customQuery->orWhere($searchableField, 'LIKE', '%'.$value.'%');
            }
        }

        return $customQuery;
    }
}
