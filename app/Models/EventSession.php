<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventSession extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'start_time',
        'end_time',
        'ticket_allocation',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function orders()
    {
        return $this->hasMany(PayOrder::class);
    }

    protected $appends = ['remaining_tickets'];

    public function getRemainingTicketsAttribute(): int
    {
        $sold = $this->orders()
            ->where('status', 'success')
            ->sum('qty');

        return max(0, $this->ticket_allocation - $sold);
    }
}
