<?php

namespace App\Models;

use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\ExpenseCategory
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExpenseCategory whereUpdatedAt($value)
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Expense> $expenses
 * @property-read int|null $expenses_count
 *
 * @mixin \Eloquent
 */
class ExpenseCategory extends BaseModel
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'expense_categories';

    const JSON_API_TYPE = 'expense_categories';

    protected $fillable = [
        'name',
        'description',
    ];

    public static $rules = [
        'name' => 'required|unique:expense_categories',
        'description' => 'nullable',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('expense-categories.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'name' => $this->name,
            'description' => $this->description,
        ];

        return $fields;
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'expense_category_id', 'id');
    }
}
