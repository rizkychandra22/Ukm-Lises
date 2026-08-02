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

    /**
     * Membuat data angkatan baru sekaligus otomatis membuatkan akun User dengan Spatie Role "User".
     */
    public function createBatch(array $data): Batch
    {
        return DB::transaction(function () use ($data) {
            // Auto translate name_id ke name_en
            $data['name_en'] = $this->translator->toEnglish($data['name_id'] ?? null);
            $data['status']  = $data['status'] ?? 'Active';

            // 1. Buat User Otomatis untuk Angkatan Ini
            $user = User::create([
                'name'     => $data['name_id'],
                'username' => 'lises' . $data['year'], 
                'password' => Hash::make('password'),
            ]);

            // 2. Assign Spatie Role "User" ke akun angkatan ini
            $user->assignRole('User');

            // 3. Buat Data Batch & Sambungkan ke ID User
            $data['user_id'] = $user->id;
            $batch           = Batch::create($data);

            return $batch;
        });
    }

    /**
     * Perbarui data angkatan dan sinkronkan data user terkait (Nama, Username, Password).
     */
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

            // Perbarui data user terkait
            if ($batch->user_id) {
                $user = User::find($batch->user_id);
                if ($user) {
                    $userData = [];

                    // SINKRONISASI: Update nama user jika nama angkatan diubah
                    if (!empty($data['name_id'])) {
                        $userData['name'] = $data['name_id'];
                    }

                    // Update username jika diisi oleh Admin/Developer
                    if (!empty($data['username'])) {
                        $userData['username'] = $data['username'];
                    }

                    // Update password jika diisi oleh Admin/Developer
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

    /**
     * Hapus data angkatan beserta akun user terkait.
     */
    public function deleteBatch(Batch $batch): void
    {
        DB::transaction(function () use ($batch) {
            $userId = $batch->user_id;
            
            $batch->delete();
            
            if ($userId) {
                $user = User::find($userId);
                if ($user) {
                    $user->delete();
                }
            }
        });
    }
}