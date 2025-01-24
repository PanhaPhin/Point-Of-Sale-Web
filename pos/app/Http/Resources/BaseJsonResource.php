<?php

namespace App\Http\Resources;

use App\Models\Contracts\JsonResourceful;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseJsonResource extends JsonResource
{
    // DO NOT REMOVE: This is declared is with a purpose for auto-completion of the fields
    private static $usedWithCollection;

    /** @var \Eloquent|JsonResourceful */
    public $resource;

    public static function usingWithCollection()
    {
        self::$usedWithCollection = true;
    }

    public static function notUsingWithCollection()
    {
        static::$usedWithCollection = null;
    }

    public function toArray($request): array
    {
        if (self::$usedWithCollection) {
            return $this->resource->asJsonResourceWithRelationships();
        }

        $response = [
            'data' => $this->resource->asJsonResourceWithRelationships(),
        ];

        if (is_null(self::$usedWithCollection)) {
            if (! empty($included = $this->resource->prepareIncluded())) {
                $response['included'] = $included;
            }
        }

        return $response;
    }
}
