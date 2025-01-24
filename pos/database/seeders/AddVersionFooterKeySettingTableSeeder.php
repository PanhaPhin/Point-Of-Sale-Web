<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class AddVersionFooterKeySettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $keyExist = Setting::where('key', 'show_version_on_footer')->exists();
        if (! $keyExist) {
            Setting::create(['key' => 'show_version_on_footer', 'value' => true]);
        }
    }
}
