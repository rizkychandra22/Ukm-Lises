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
        $developerRole = Role::create(['name' => 'Developer']);
        $adminRole     = Role::create(['name' => 'Admin']);
        $userRole      = Role::create(['name' => 'User']);

        // Buat User Developer Awal
        $developerUser = User::create([
            'name'     => 'Developer',
            'username' => 'dev',
            'password' => bcrypt('password'),
        ]);
        $developerUser->assignRole($developerRole);

        // Buat User Admin Awal
        $adminUser = User::create([
            'name'     => 'Admin Lises',
            'username' => 'admincore',
            'password' => bcrypt('password'),
        ]);
        $adminUser->assignRole($adminRole);
    }
}