<?php

namespace App\Http\Resources;

/**
 * Class UserCollection
 */
class UserCollection extends BaseCollection
{
    public $collects = UserResource::class;
}
