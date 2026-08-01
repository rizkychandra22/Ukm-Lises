<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        'title_id',
        'title_en',
        'desc_id',
        'desc_en',
        'image',
        'is_active',
        'is_index',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_index' => 'boolean',
    ];
}
