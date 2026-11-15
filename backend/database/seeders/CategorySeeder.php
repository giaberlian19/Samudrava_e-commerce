<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Elektronik',
            'Fashion',
            'Kosmetik',
            'Rumah Tangga',
            'Olahraga',
            'Makanan & Minuman',
            'Buku & Alat Tulis',
            'Bayi & Anak',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate(['name' => $name]);
        }
    }
}
