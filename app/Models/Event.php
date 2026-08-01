<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'title_id',
        'title_en',
        'slug',
        'image',
        'summary_id',
        'summary_en',
        'type',
        'date',
        'location_id',
        'location_en',
        'price',
        'ticket',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'price' => 'decimal:2',
        ];
    }

    /**
     * Event memiliki banyak pesanan tiket.
     */
    public function orders()
    {
        return $this->hasMany(PayOrder::class);
    }

    /**
     * Hitung sisa tiket yang tersedia.
     */
    public function getRemainingTicketsAttribute(): ?int
    {
        if ($this->ticket === null) {
            return null; // Unlimited
        }

        $sold = $this->orders()
            ->where('status', 'success')
            ->sum('qty');

        return max(0, $this->ticket - $sold);
    }

    /**
     * Scope: hanya event yang sudah dipublish.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Boot: auto-generate slug dari title_id.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $baseSlug = Str::slug($event->title_id);
                $slug = $baseSlug;
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }
                $event->slug = $slug;
            }
        });
    }
}
