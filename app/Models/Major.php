<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    protected $fillable = [
        'faculty_id', 'faculty_en', 'name_id', 'name_en', 'degree'
    ];

    public function batchMembers()
    {
        return $this->hasMany(BatchMember::class);
    }
}