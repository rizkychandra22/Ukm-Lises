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
        $masterRole = Role::create(['name' => 'Master']);
        $adminRole  = Role::create(['name' => 'Admin']);

        // Buat User Master Awal
        $masterUser = User::create([
            'name'     => 'Master Akun',
            'username' => 'mastercore',
            'password' => bcrypt('password'),
        ]);
        $masterUser->assignRole($masterRole);

        // Buat User Admin Awal
        $adminUser = User::create([
            'name'     => 'Admin Lises',
            'username' => 'admincore',
            'password' => bcrypt('password'),
        ]);
        $adminUser->assignRole($adminRole);
    }
}