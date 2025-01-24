<?php

namespace App\Traits;

use App\Models\Contracts\JsonResourceful;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

trait HasJsonResourcefulData
{
    public $parentRelations = [];

    public function getIdFilterFields(): array
    {
        return [];
    }

    public function getResourceType()
    {
        return defined('static::JSON_API_TYPE') ? static::JSON_API_TYPE : '';
    }

    public function prepareData()
    {
        return [
            'type' => $this->getResourceType(),
            'id' => $this->id,
        ];
    }

    public function asJsonResourceWithRelationships()
    {
        $jsonResource = $this->asJsonResource();

        if (! empty($relationships = $this->prepareRelationships())) {
            return array_merge(
                $jsonResource,
                ['relationships' => $relationships]
            );
        }

        return $jsonResource;
    }

    public function asJsonResource(): array
    {
        $preparedAttributes = $this->prepareAttributes();

        return array_merge(
            $this->prepareData(),
            [
                'attributes' => $preparedAttributes,
                'links' => $this->prepareLinks(),
            ]
        );
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function prepareAllowedFields()
    {
        $allowedFields = request()->get('fields');
        if (empty($allowedFields)) {
            return;
        }

        $allowedFields = explode(',', request()->get('fields')[self::JSON_API_TYPE]);

        $fields = [];
        foreach ($allowedFields as $field) {
            // do not expose id column to the frontend
            // we are already sending uuid column, so skipping it
            if (in_array($field, ['id', 'uuid'])) {
                continue;
            }
            $fields = array_merge($fields, [$field => $this->$field]);
        }

        $fields = $this->replaceRelatedIdsWithUUIDs($fields);

        return $fields;
    }

    /**
     * Links for given relationships list records filter by this record
     */
    public function relationLinks(): array
    {
        return [];
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    private function inIncludeQuery($relationName): bool
    {
        $includedRelations = explode(',', request()->get('include'));

        foreach ($includedRelations as $relation) {
            $subRelationName = explode('.', $relation);

            if (in_array($relationName, $subRelationName)) {
                return true;
            }
        }

        return false;
    }

    public function prepareIncluded(): array
    {
        $loadedRelations = $this->getRelations();

        $included = [];
        $relationFields = request()->input('includeFields');
        $relationNames = [];
        if (! empty($relationFields)) {
            $relationNames = array_keys($relationFields);
        }
        foreach ($loadedRelations as $relationName => $relationValue) {
            if (is_null($relationValue)) {
                continue;
            }

            if (! $this->inIncludeQuery($relationName)) {
                continue;
            }

            if ($relationValue instanceof Collection) {
                /** @var JsonResourceful $relatedModel */
                foreach ($relationValue as $relatedModel) {
                    $included[] = $relatedModel->asJsonResource();
                }
            } else {
                $newFields = [];
                if (in_array(Str::camel($relationName), $relationNames)) {
                    $extraFields = $relationFields[$relationName];
                    $extraFields = is_array($extraFields) ? $extraFields : explode(',', $extraFields);

                    $availableRelations = get_class($relationValue)::$availableRelations;
                    $newFields = [];
                    foreach ($extraFields as $field) {
                        if (array_key_exists($field, $availableRelations)) {
                            $relation = $availableRelations[$field];
                            $newFields[$field] = $relationValue->$relation->uuid ?? null;
                        }
                    }
                }

                /** @var \Eloquent|JsonResourceful $relationValue */
                $include = $relationValue->asJsonResource();
                if (in_array('parent_id', array_keys($relationValue->getAttributes()))) {
                    $include['attributes']['parent_id'] = $relationValue->parent->uuid ?? null;
                }

                $include['attributes'] = array_merge($include['attributes'], $newFields);

                $included[] = $include;
            }
        }

        return $included;
    }

    public function prepareRelationships(): array
    {
        $loadedRelations = $this->getRelations();

        $relationships = [];
        foreach ($loadedRelations as $relationName => $relationValue) {
            if (! $this->inIncludeQuery($relationName)) {
                continue;
            }

            $relationName = Str::snake($relationName);

            if (is_null($relationValue)) {
                $relationships[$relationName] = null;

                continue;
            }

            $relationshipData = [];
            if ($relationValue instanceof Collection) {
                /** @var \Eloquent|JsonResourceful $relatedModel */
                foreach ($relationValue as $relatedModel) {
                    $relationshipData[] = $relatedModel->prepareData();
                }
                $relationships[$relationName] = [
                    'data' => $relationshipData,
                ];

                $relationLinks = $this->relationLinks();

                if (isset($relationLinks[$relationName])) {
                    $relationships[$relationName]['links']['self'] = $relationLinks[$relationName];
                }
            } else {
                /** @var \Eloquent|JsonResourceful $relationValue */
                $relationships[$relationName] = [
                    'data' => $relationValue->prepareData(),
                    'links' => $relationValue->prepareLinks(),
                ];
            }
        }

        return $relationships;
    }
}
