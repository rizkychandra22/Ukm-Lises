<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        // Buat Role
        Role::firstOrCreate(['name' => 'Developer']);
        Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'User']);

        // Buat User Developer Awal
        $developerUser = User::firstOrCreate([
            'name'     => 'Developer',
            'username' => 'dev',
            'password' => bcrypt(env('SEEDER_PASSWORD', 'RahasiaLises')),
        ]);
        $developerUser->assignRole('Developer');

        // Buat User Admin Awal
        $adminUser = User::firstOrCreate([
            'name'     => 'Admin Lises',
            'username' => 'admincore',
            'password' => bcrypt(env('SEEDER_PASSWORD', 'RahasiaLises')),
        ]);
        $adminUser->assignRole('Admin');
    }
}