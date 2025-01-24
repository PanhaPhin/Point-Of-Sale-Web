<?php

namespace Database\Seeders;

use App\Models\Language;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DefaultLanguageTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionExits = Permission::where('name', 'manage_language')->first();

        if (! $permissionExits) {
            Permission::create([
                'name' => 'manage_language',
                'display_name' => 'Manage Language',
            ]);
        }

        $adminRole = Role::whereName(Role::ADMIN)->first();

        if (empty($adminRole)) {
            $adminRole = Role::create([
                'name' => 'admin',
                'display_name' => ' Admin',
            ]);

        }
        $permission = Permission::where('name', 'manage_language')->pluck('name', 'id');
        $adminRole->givePermissionTo($permission);

        Language::create(['name' => 'Arabic', 'iso_code' => 'ar', 'is_default' => false]);
        Language::create(['name' => 'Chinese', 'iso_code' => 'cn', 'is_default' => false]);
        Language::create(['name' => 'English', 'iso_code' => 'en', 'is_default' => true]);
        Language::create(['name' => 'French', 'iso_code' => 'fr', 'is_default' => false]);
        Language::create(['name' => 'German', 'iso_code' => 'gr', 'is_default' => false]);
        Language::create(['name' => 'Spanish', 'iso_code' => 'sp', 'is_default' => false]);
        Language::create(['name' => 'Turkish', 'iso_code' => 'tr', 'is_default' => false]);
        Language::create(['name' => 'vietnamese', 'iso_code' => 'vi', 'is_default' => false]);
    }
}
