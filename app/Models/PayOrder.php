<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayOrder extends Model
{
    protected $fillable = [
        'order_code',
        'name',
        'email',
        'phone',
        'event_id',
        'qty',
        'total_price',
        'notes',
        'payment_method',
        'payment_proof',
        'order_method',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
            'qty' => 'integer',
        ];
    }

    /**
     * Pesanan milik event tertentu.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Generate kode order unik: ORD-YYYYMMDD-XXX
     */
    public static function generateOrderCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = "ORD-{$date}-";

        $lastOrder = static::where('order_code', 'like', "{$prefix}%")
            ->orderByDesc('order_code')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) str_replace($prefix, '', $lastOrder->order_code);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Boot: auto-generate order_code.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_code)) {
                $order->order_code = static::generateOrderCode();
            }
        });
    }
}
