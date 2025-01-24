<?php

namespace App\Http\Resources;

use App\Models\Contracts\JsonResourceful;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BaseCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        $response = [
            'data' => $this->collection->map(function (JsonResource $resource) use ($request) {
                return $resource->toArray($request);
            }),
        ];

        /**
         * As per JSON API Specs, we should only return unique records in includes per type and ID
         * Collect all relationships data and prepare unique array of records
         */
        $includedAssocArr = [];
        /** @var JsonResourceful $item */
        foreach ($this->collection as $item) {
            $includedItems = $item->prepareIncluded();
            foreach ($includedItems as $includedItem) {
                // Key with type-id
                $key = $item->getResourceType().'-'.$includedItem['id'];
                if (! isset($includedAssocArr[$key])) {
                    $includedAssocArr[$key] = $includedItem;
                }
            }
        }

        if (count($includedAssocArr)) {
            $response['included'] = array_values($includedAssocArr);
        }

        return $response;
    }
}
