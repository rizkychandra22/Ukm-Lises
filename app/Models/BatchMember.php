<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

class BatchMember extends Model
{
    protected $fillable = [
        'batch_id', 'image', 'name',
        'prodi_id', 'prodi_en',
        'type', 'status', 'periode',
        'position_id', 'position_en'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
