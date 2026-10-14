<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['slug' => 'jas', 'name' => 'Jas'],
            ['slug' => 'hem-batik', 'name' => 'Hem Batik'],
            ['slug' => 'celana-panjang', 'name' => 'Celana Panjang'],
        ];

        foreach ($services as $service) {
            DB::table('service_types')->updateOrInsert(
                ['slug' => $service['slug']],
                [
                    'name' => $service['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
