<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'date',
        'title_id',
        'title_en',
        'slug',
        'summary_id',
        'summary_en',
        'description_id',
        'description_en',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
