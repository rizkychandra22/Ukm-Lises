<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Batch;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batches = [
            '2013' => 'KUJANG SILIWANGI',
            '2014' => 'PUCUK JAMBU',
            '2015' => 'AWEUHAN PADJADJARAN',
            '2016' => 'KANDAGA MADENDA',
            '2017' => 'WASTU KANCANA',
            '2018' => 'INDRA PRAHASTA',
            '2019' => 'SILALATU PADJADJARAN',
            '2020' => 'GANDHARA NATAPRAWIRA',
            '2021' => 'ANGGALARANG DHARMA WIJAYA',
            '2022' => 'PANDAWA RAKA ADINATA',
            '2023' => 'ADIWARNA DIRANDA',
        ];

        foreach ($batches as $year => $nameId) {
            // Check if batch already exists to prevent duplicate entries
            if (!Batch::where('year', $year)->exists()) {
                // Create a user for this batch (matching the app's auto-creation behavior)
                $user = User::create([
                    'name' => 'Angkatan ' . $nameId,
                    'username' => 'lises' . $year,
                    'password' => Hash::make('password'),
                ]);

                $user->assignRole('User');

                // Create the batch
                Batch::create([
                    'user_id' => $user->id,
                    'year' => $year,
                    'name_id' => $nameId,
                    'name_en' => $nameId, // Fallback for name_en as it's required in migration
                    'status' => 'Deactive', // Setting older batches to Deactive
                ]);
            }
        }
    }
}
