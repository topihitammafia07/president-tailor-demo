<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ServiceTypeSeeder::class);

        User::updateOrCreate(
            ['email' => 'owner@presidenttailor.com'],
            [
                'name' => 'Owner President Tailor',
                'password' => bcrypt('owner123'),
                'role' => User::ROLE_OWNER,
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@presidenttailor.com'],
            [
                'name' => 'Staf President Tailor',
                'password' => bcrypt('password123'),
                'role' => User::ROLE_STAFF,
            ]
        );
    }
}
