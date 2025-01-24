<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DefaultPermissionsSeeder extends Seeder
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

        ];

        foreach ($permissions as $permission) {
            $permissionExist = Permission::whereName($permission['name'])->exists();
            if (! $permissionExist) {
                Permission::create($permission);
            }
        }
    }
}
