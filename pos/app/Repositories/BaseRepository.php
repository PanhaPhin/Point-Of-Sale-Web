<?php

namespace App\Repositories;

use App\Repositories\Criteria\JSONApiFilterCriteria;
use App\Repositories\Criteria\JSONApiIncludeCriteria;
use App\Repositories\Criteria\JSONApiSortingCriteria;
use Illuminate\Pagination\Paginator;
use Prettus\Repository\Eloquent\BaseRepository as PrettusBaseRepository;
use Prettus\Repository\Exceptions\RepositoryException;

abstract class BaseRepository extends PrettusBaseRepository
{
    /**
     * Get Searchable Fields
     */
    public function getAvailableRelations(): array
    {
        return [];
    }

    /**
     * @throws RepositoryException
     */
    public function boot()
    {
        parent::boot();
        $this->pushCriteria(app(JSONApiSortingCriteria::class));
        $this->pushCriteria(app(JSONApiFilterCriteria::class));
        $this->pushCriteria(app(JSONApiIncludeCriteria::class));

        Paginator::currentPageResolver(function () {
            return request()->input('page.number', 1);
        });
    }

    public function getAllowedFields(): array
    {
        return array_merge($this->allowedFields, ['id', 'uuid']);
    }
}
