<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AssignAllPermissionAdminRole extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'manage_roles',
                'display_name' => 'Manage Roles',
            ],
            [
                'name' => 'manage_brands',
                'display_name' => 'Manage Brands',
            ],
            [
                'name' => 'manage_currency',
                'display_name' => 'Manage Currency',
            ],
            [
                'name' => 'manage_warehouses',
                'display_name' => 'Manage Warehouses',
            ],
            [
                'name' => 'manage_units',
                'display_name' => 'Manage Units',
            ],
            [
                'name' => 'manage_product_categories',
                'display_name' => 'Manage Product Categories',
            ],
            [
                'name' => 'manage_products',
                'display_name' => 'Manage Products ',
            ],
            [
                'name' => 'manage_suppliers',
                'display_name' => 'Manage Suppliers',
            ],
            [
                'name' => 'manage_customers',
                'display_name' => 'Manage Customers',
            ],
            [
                'name' => 'manage_users',
                'display_name' => 'Manage Users',
            ],
            [
                'name' => 'manage_expense_categories',
                'display_name' => 'Manage Expense Categories',
            ],
            [
                'name' => 'manage_expenses',
                'display_name' => 'Manage Expenses',
            ],
            [
                'name' => 'manage_adjustments',
                'display_name' => 'Manage Adjustments',
            ],
            [
                'name' => 'manage_transfers',
                'display_name' => 'Manage Transfers',
            ], [
                'name' => 'manage_setting',
                'display_name' => 'Manage Setting',
            ],
            [
                'name' => 'manage_dashboard',
                'display_name' => 'Manage Dashboard',
            ],
            [
                'name' => 'manage_pos_screen',
                'display_name' => 'Manage Pos Screen',
            ],
            [
                'name' => 'manage_purchase',
                'display_name' => 'Manage Purchase',
            ],
            [
                'name' => 'manage_sale',
                'display_name' => 'Manage Sale',
            ],
            [
                'name' => 'manage_purchase_return',
                'display_name' => 'Manage Purchase Return',
            ],
            [
                'name' => 'manage_sale_return',
                'display_name' => 'Manage Sale Return',
            ],

        ];

        /** @var Role $adminRole */
        $adminRole = Role::whereName(Role::ADMIN)->first();

        if (empty($adminRole)) {
            $adminRole = Role::create([
                'name' => 'admin',
                'display_name' => ' Admin',
            ]);
        }

        foreach ($permissions as $permission) {
            $permissionExist = Permission::where('name', $permission['name'])->exists();
            if (! $permissionExist) {
                Permission::create($permission);
            }
        }

        $allPermissions = Permission::pluck('name', 'id');
        $adminRole->syncPermissions($allPermissions);
    }
}
