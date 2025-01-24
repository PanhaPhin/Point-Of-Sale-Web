<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * App\Models\SmsTemplate
 *
 * @property int $id
 * @property string $template_name
 * @property string $content
 * @property string $type
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereTemplateName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SmsTemplate whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class SmsTemplate extends BaseModel implements JsonResourceful
{
    use HasFactory, \App\Traits\HasJsonResourcefulData;

    public const JSON_API_TYPE = 'sms_templates';

    protected $table = 'sms_templates';

    protected $fillable = ['template_name', 'content', 'type', 'status'];

    const SMS_TYPE_SALE = 1;

    const SMS_TYPE_SALE_RETURN = 2;

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
