<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayAccount extends Model
{
    protected $fillable = [
        'batch_member_id',
        'type',
        'name_account',
        'no_account',
    ];

    protected $casts = [
        'no_account' => 'encrypted',
    ];

    /**
     * Rekening milik anggota (bendahara).
     */
    public function batchMember()
    {
        return $this->belongsTo(BatchMember::class);
    }
}
