<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

#[Fillable(['user_id', 'year', 'name_id', 'name_en'])]

class Batch extends Model
{
    public function batchMembers()
    {
        return $this->hasMany(BatchMember::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
