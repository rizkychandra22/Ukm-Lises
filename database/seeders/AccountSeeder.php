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
        $developerRole = Role::firstOrCreate(['name' => 'Developer']);
        $adminRole     = Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'User']);

        // Buat User Developer Awal
        $developerUser = User::firstOrCreate([
            'name'     => 'Developer',
            'username' => 'dev',
            'password' => bcrypt('password'),
        ]);
        $developerUser->assignRole($developerRole);

        // Buat User Admin Awal
        $adminUser = User::firstOrCreate([
            'name'     => 'Admin Lises',
            'username' => 'admincore',
            'password' => bcrypt('password'),
        ]);
        $adminUser->assignRole($adminRole);
    }
}