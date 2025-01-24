<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class AddSettingPrefixCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! keyExist('purchase_code')) {
            Setting::create(['key' => 'purchase_code', 'value' => 'PU']);
        }
        if (! keyExist('purchase_return_code')) {
            Setting::create(['key' => 'purchase_return_code', 'value' => 'PR']);
        }
        if (! keyExist('sale_code')) {
            Setting::create(['key' => 'sale_code', 'value' => 'SA']);
        }
        if (! keyExist('sale_return_code')) {
            Setting::create(['key' => 'sale_return_code', 'value' => 'SR']);
        }
        if (! keyExist('expense_code')) {
            Setting::create(['key' => 'expense_code', 'value' => 'EX']);
        }
    }
}
