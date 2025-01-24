<?php

namespace App\Models;

use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class BaseUnit
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit query()
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit whereUpdatedAt($value)
 *
 * @property int $is_default
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BaseUnit whereIsDefault($value)
 *
 * @mixin \Eloquent
 */
class BaseUnit extends BaseModel
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'base_units';

    protected $fillable = ['name'];

    public static $rules = [
        'name' => 'required|unique:base_units',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('base-units.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = ['name' => $this->name];

        return $fields;
    }
}
