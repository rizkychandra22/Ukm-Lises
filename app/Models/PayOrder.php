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
        'event_session_id',
        'qty',
        'total_price',
        'notes',
        'pay_account_id',
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
     * Pesanan memiliki sesi event (untuk event eksklusif).
     */
    public function eventSession()
    {
        return $this->belongsTo(EventSession::class);
    }

    /**
     * Pesanan memiliki akun pembayaran.
     */
    public function payAccount()
    {
        return $this->belongsTo(PayAccount::class);
    }

    /**
     * Generate kode order unik: EVT + dd + mm + 4 random digits + 2-digit start year + 2-digit end year
     * Contoh: EVT180454712526  (tanggal 18, bulan 04, random 5471, periode 2025-2026)
     */
    public static function generateOrderCode(): string
    {
        $now = now();
        $day   = $now->format('d');    // 2-digit day
        $month = $now->format('m');    // 2-digit month

        // Tentukan periode akademik: Juli–Desember = tahun ini - tahun depan, Januari–Juni = tahun lalu - tahun ini
        $year = (int) $now->format('Y');
        if ($now->month >= 7) {
            $startYear = $year;
            $endYear   = $year + 1;
        } else {
            $startYear = $year - 1;
            $endYear   = $year;
        }

        $suffix = substr((string) $startYear, -2) . substr((string) $endYear, -2);

        // Generate kode unik dengan 4 digit random, pastikan tidak duplikat
        do {
            $random = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            $code = "EVT{$day}{$month}{$random}{$suffix}";
        } while (static::where('order_code', $code)->exists());

        return $code;
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
