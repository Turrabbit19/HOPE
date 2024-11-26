<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShiftsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = [
            ['name' => 'Ca 1', 'start_time' => '07:00:00', 'end_time' => '09:00:00'],
            ['name' => 'Ca 2', 'start_time' => '09:15:00', 'end_time' => '11:15:00'],
            ['name' => 'Ca 3', 'start_time' => '11:45:00', 'end_time' => '13:45:00'],
            ['name' => 'Ca 4', 'start_time' => '14:00:00', 'end_time' => '16:00:00'],
            ['name' => 'Ca 5', 'start_time' => '16:15:00', 'end_time' => '18:15:00'],
            ['name' => 'Ca 6', 'start_time' => '18:30:00', 'end_time' => '20:30:00'],
        ];

        DB::table('shifts')->insert($shifts);
    }
}
