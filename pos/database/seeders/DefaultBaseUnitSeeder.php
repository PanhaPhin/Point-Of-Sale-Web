<?php

namespace Database\Seeders;

use App\Models\BaseUnit;
use Illuminate\Database\Seeder;

class DefaultBaseUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $baseUnits = [
            ['id' => 1, 'name' => 'piece'],
            ['id' => 2, 'name' => 'meter'],
            ['id' => 3, 'name' => 'kilogram'],
        ];
        foreach ($baseUnits as $baseUnit) {
            BaseUnit::create($baseUnit);
        }
    }
}
