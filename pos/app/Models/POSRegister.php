<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\POSRegister
 *
 * @property int $id
 * @property float $cash_in_hand
 * @property \Illuminate\Support\Carbon|null $closed_at
 * @property float|null $cash_in_hand_while_closing
 * @property float|null $bank_transfer
 * @property float|null $cheque
 * @property float|null $other
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister query()
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereBankTransfer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereCashInHand($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereCashInHandWhileClosing($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereCheque($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereClosedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereOther($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|POSRegister whereUserId($value)
 *
 * @mixin \Eloquent
 */
class POSRegister extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'pos_register';

    public $fillable = [
        'cash_in_hand',
        'closed_at',
        'cash_in_hand_while_closing',
        'bank_transfer',
        'cheque',
        'other',
        'total_sale',
        'total_return',
        'total_amount',
        'notes',
        'user_id',
    ];

    public $casts = [
        'closed_at' => 'datetime',
        'cash_in_hand_while_closing' => 'double',
        'bank_transfer' => 'double',
        'cheque' => 'double',
        'other' => 'double',
        'notes' => 'string',
        'total_sale' => 'double',
        'total_return' => 'double',
        'total_amount' => 'double',
    ];

    public static $rules = [
        'cash_in_hand' => 'required|numeric',
    ];

    /**
     * @return string[]
     */
    public function getIdFilterFields(): array
    {
        return [
            'id' => self::class,
        ];
    }

    public function prepareLinks(): array
    {
        return [];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'cash_in_hand_while_closing' => $this->cash_in_hand_while_closing,
            'cash_in_hand' => $this->cash_in_hand,
            'notes' => $this->notes,
            'closed_at' => $this->closed_at,
            'created_at' => $this->created_at,
            'user' => $this->user,
        ];

        return $fields;
    }

    /**
     * Get the user that owns the POSRegister
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
