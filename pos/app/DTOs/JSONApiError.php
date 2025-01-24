<?php

namespace App\DTOs;

use Illuminate\Contracts\Support\Arrayable;

/**
 * Class JSONApiError
 *
 * @OA\Schema(
 *   schema="JSONApiError",
 *   type="object"
 * )
 */
class JSONApiError implements Arrayable
{
    /**
     * @OA\Property(
     *     title="status",
     *     description="HTTP Status Code",
     *     format="int64"
     * )
     *
     * @var int
     */
    public $success;

    /**
     * @OA\Property(
     *     title="title",
     *     description="Error Title"
     * )
     *
     * @var string
     */
    public $message;

    public function __construct(array $input)
    {
        if (isset($input['success'])) {
            $this->success = $input['success'];
        }
        if (isset($input['message'])) {
            $this->message = $input['message'];
        }
    }

    public function toArray()
    {
        return [
            'success' => $this->success,
            'message' => $this->message,
        ];
    }
}
