<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * App\Models\MailTemplate
 *
 * @property int $id
 * @property string $template_name
 * @property string $content
 * @property string $type
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereTemplateName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailTemplate whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class MailTemplate extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    public const JSON_API_TYPE = 'mail_templates';

    protected $table = 'mail_templates';

    protected $fillable = ['template_name', 'content', 'type', 'status'];

    const MAIL_TYPE_SALE = 1;

    const MAIL_TYPE_SALE_RETURN = 2;

    const ACTIVE = 1;

    const INACTIVE = 0;

    public static $rules = [
        'content' => 'required',
    ];

    public function prepareLinks(): array
    {
        return [

        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'template_name' => $this->template_name,
            'content' => $this->content,
            'type' => $this->type,
            'status' => $this->status,
        ];

        return $fields;
    }
}
