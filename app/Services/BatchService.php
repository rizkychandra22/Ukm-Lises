<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\User;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BatchService
{
    public function __construct(
        protected GoogleTranslateService $translator
    ) {}

    public function createBatch(array $data): Batch
    {
        return DB::transaction(function () use ($data) {
            // Auto translate name_id ke name_en
            $data['name_en'] = $this->translator->toEnglish($data['name_id'] ?? null);
            $data['status'] = $data['status'] ?? 'Active';

            // Buat User Otomatis untuk Angkatan Ini
            $user = User::create([
                'name'     => $data['name_id'],
                'username' => 'lises' . $data['year'], 
                'password' => Hash::make('password'),
            ]);

            $user->assignRole('User');
            $data['user_id'] = $user->id;
            $batch = Batch::create($data);

            return $batch;
        });
    }

    public function updateBatch(Batch $batch, array $data): Batch
    {
        return DB::transaction(function () use ($batch, $data) {
            $batchData = [
                'year'    => $data['year'],
                'name_id' => $data['name_id'],
                'name_en' => $this->translator->toEnglish($data['name_id'] ?? null),
                'status'  => $data['status'] ?? $batch->status ?? 'Active',
            ];
            
            $batch->update($batchData);

            // Update user secara manual JIKA admin memasukkan username atau password baru
            if ($batch->user_id) {
                $user = User::find($batch->user_id);
                if ($user) {
                    $userData = [];
                    if (!empty($data['username'])) {
                        $userData['username'] = $data['username'];
                    }
                    if (!empty($data['password'])) {
                        $userData['password'] = Hash::make($data['password']);
                    }
                    
                    if (!empty($userData)) {
                        $user->update($userData);
                    }
                }
            }

            return $batch;
        });
    }

    public function deleteBatch(Batch $batch): void
    {
        DB::transaction(function () use ($batch) {
            $userId = $batch->user_id;
            
            $batch->delete();
            if ($userId) {
                User::find($userId)?->delete();
            }
        });
    }
}