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
}
