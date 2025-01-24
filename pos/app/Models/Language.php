<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * App\Models\Language
 *
 * @property int $id
 * @property string $name
 * @property string $iso_code
 * @property int $is_default
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Language newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Language newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Language query()
 * @method static \Illuminate\Database\Eloquent\Builder|Language whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Language whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Language whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Language whereIsoCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Language whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Language whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Language extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'languages';

    public const JSON_API_TYPE = 'languages';

    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'iso_code',
    ];

    /**
     * @var array
     */
    public static $rules = [
        'name' => 'required|unique:languages,name|max:20',
        'iso_code' => 'required|unique:languages,iso_code|min:2|max:2',
    ];

    /**
     * @var string[]
     */
    public $casts = [
        'name' => 'string',
        'iso_code' => 'string',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('languages.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'name' => $this->name,
            'iso_code' => $this->iso_code,
        ];

        return $fields;
    }
}
