<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    public const METHOD_TUNAI = 'tunai';

    public const METHOD_TRANSFER = 'transfer_bank';

    public const METHOD_QRIS = 'qris';

    public const VALID_METHODS = [
        self::METHOD_TUNAI,
        self::METHOD_TRANSFER,
        self::METHOD_QRIS,
    ];

    protected $fillable = [
        'order_id',
        'amount',
        'payment_date',
        'payment_method',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date' => 'date:Y-m-d',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
