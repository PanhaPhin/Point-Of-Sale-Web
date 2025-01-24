<?php

namespace App\Http\Resources;

/**
 * Class ProductCollection
 */
class ProductCollection extends BaseCollection
{
    public $collects = ProductResource::class;
}
