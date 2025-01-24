<?php

namespace Database\Seeders;

use App\Models\BaseUnit;
use Illuminate\Database\Seeder;

class AddIsDefaultBaseUnitTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 3; $i++) {
            $baseUnit = BaseUnit::whereId($i)->first();
            if (! empty($baseUnit)) {
                $baseUnit->update([
                    'is_default' => true,
                ]);
            }
        }
    }
}
