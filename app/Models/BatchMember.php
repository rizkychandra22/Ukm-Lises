<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

class BatchMember extends Model
{
    protected $fillable = [
        'batch_id', 'image', 'name',
        'major_id',
        'type', 'status', 'periode',
        'position_id', 'position_en',
        'instagram', 'whatsapp'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    /**
     * Rekening pembayaran milik anggota (bendahara).
     */
    public function payAccounts()
    {
        return $this->hasMany(PayAccount::class);
    }
}
