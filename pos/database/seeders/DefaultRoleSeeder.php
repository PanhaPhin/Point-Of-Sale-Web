<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DefaultRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => ' Admin',
            ],
        ];

        foreach ($roles as $role) {
            $role = Role::whereName($role['name'])->first();
            if (empty($role)) {
                $role = Role::create($role);
            }
        }
        /** @var Role $adminRole */
        $adminRole = Role::whereName('admin')->first();

        $allPermissions = Permission::pluck('name', 'id');
        $adminRole->givePermissionTo($allPermissions);
    }
}
