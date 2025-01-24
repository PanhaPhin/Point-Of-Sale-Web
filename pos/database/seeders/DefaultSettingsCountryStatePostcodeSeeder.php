<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class DefaultSettingsCountryStatePostcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exists = Setting::where('key', 'country')->exists();
        if (! $exists) {
            Setting::create(['key' => 'country', 'value' => 'India']);
        }

        $exists = Setting::where('key', 'state')->exists();
        if (! $exists) {
            Setting::create(['key' => 'state', 'value' => 'Gujarat']);
        }

        $exists = Setting::where('key', 'city')->exists();
        if (! $exists) {
            Setting::create(['key' => 'city', 'value' => 'Surat']);
        }
    }
}
