<?php

namespace App\Repositories\Criteria;

use App\Sorts\UserCustomSort;
use Illuminate\Http\Request;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\Sorts\Sort;

class JSONApiSortingCriteria implements CriteriaInterface
{
    /**
     * @var Request
     */
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Apply criteria in query repository.
     *
     * @return mixed
     */
    public function apply($model, RepositoryInterface $repository)
    {
        $sortingExists = $this->request->get('sort');
        if (empty($sortingExists) && isset($model->getModel()->defaultSort)) {
            $this->request->query->set('sort', $model->getModel()->defaultSort);
        }

        $searchableFields = $repository->getFieldsSearchable();

        //        $customSort = AllowedSort::custom('custom-sort', new UserCustomSort())->defaultDirection('desc');

        return QueryBuilder::for($model)
            ->allowedSorts($searchableFields)
            ->getEloquentBuilder();
    }
}
