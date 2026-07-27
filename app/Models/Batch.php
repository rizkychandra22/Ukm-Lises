<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['year', 'name_id', 'name_en'])]

class Batch extends Model
{
    public function batchMembers()
    {
        return $this->hasMany(BatchMember::class);
    }
}
