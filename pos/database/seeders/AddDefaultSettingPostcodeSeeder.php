<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class AddDefaultSettingPostcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exists = Setting::where('key', 'postcode')->exists();
        if (! $exists) {
            Setting::create(['key' => 'postcode', 'value' => '395007']);
        }
    }
}
