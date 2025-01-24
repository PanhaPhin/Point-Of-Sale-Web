<?php

namespace Database\Seeders;

use App\Models\SmsSetting;
use Illuminate\Database\Seeder;

class DefaultSmsSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exists = SmsSetting::where('key', 'url')->exists();
        if (! $exists) {
            SmsSetting::create(['key' => 'url', 'value' => 'http://test.com/api/test.php']);
        }

        $exists = SmsSetting::where('key', 'mobile_key')->exists();
        if (! $exists) {
            SmsSetting::create(['key' => 'mobile_key', 'value' => '']);
        }

        $exists = SmsSetting::where('key', 'message_key')->exists();
        if (! $exists) {
            SmsSetting::create(['key' => 'message_key', 'value' => '']);
        }

        $exists = SmsSetting::where('key', 'payload')->exists();
        if (! $exists) {
            SmsSetting::create(['key' => 'payload', 'value' => '']);
        }
    }
}
