<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_BARU = 'baru';

    public const STATUS_DIPROSES = 'diproses';

    public const STATUS_SELESAI = 'selesai';

    public const VALID_STATUSES = [
        self::STATUS_BARU,
        self::STATUS_DIPROSES,
        self::STATUS_SELESAI,
    ];

    public const PAYMENT_STATUS_UNPAID = 'belum_dibayar';

    public const PAYMENT_STATUS_PARTIAL = 'sebagian';

    public const PAYMENT_STATUS_PAID = 'lunas';

    protected $fillable = [
        'order_number',
        'customer_id',
        'customer_name_snapshot',
        'customer_address_snapshot',
        'status',
        'total_price',
    ];

    protected $appends = [
        'total_paid',
        'remaining_bill',
        'payment_status',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'integer',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Total payments successfully recorded for this order.
     */
    public function getTotalPaidAttribute(): float
    {
        return (float) ($this->relationLoaded('payments')
            ? $this->payments->sum('amount')
            : $this->payments()->sum('amount'));
    }

    /**
     * Remaining unpaid bill for this order.
     */
    public function getRemainingBillAttribute(): float
    {
        $remaining = (float) $this->total_price - $this->total_paid;

        return max(0.0, $remaining);
    }

    /**
     * Calculated payment status based on bill and payments.
     */
    public function getPaymentStatusAttribute(): string
    {
        $paid = $this->total_paid;
        $total = (float) $this->total_price;

        if ($paid <= 0) {
            return self::PAYMENT_STATUS_UNPAID;
        }

        if ($paid >= $total) {
            return self::PAYMENT_STATUS_PAID;
        }

        return self::PAYMENT_STATUS_PARTIAL;
    }

    /**
     * Check if a status transition is allowed.
     */
    public function canTransitionTo(string $newStatus): bool
    {
        $allowedTransitions = [
            self::STATUS_BARU => [self::STATUS_DIPROSES],
            self::STATUS_DIPROSES => [self::STATUS_SELESAI],
            self::STATUS_SELESAI => [], // Tidak boleh berubah setelah selesai (sesuai A-03)
        ];

        return in_array($newStatus, $allowedTransitions[$this->status] ?? [], true);
    }
}
