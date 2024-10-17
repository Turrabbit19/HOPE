<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DaysTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $days = [
            ['name' => 'Chủ nhật'],
            ['name' => 'Thứ 2'],
            ['name' => 'Thứ 3'],
            ['name' => 'Thứ 4'],
            ['name' => 'Thứ 5'],
            ['name' => 'Thứ 6'],
            ['name' => 'Thứ 7'],
        ];

        DB::table('days')->insert($days);
    }
}
