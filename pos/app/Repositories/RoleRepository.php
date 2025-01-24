<?php

namespace App\Repositories;

use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class RoleRepository
 */
class RoleRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'display_name',
        'created_at',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Role::class;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model
     */
    public function storeRole($input)
    {
        try {
            DB::beginTransaction();
            $input['display_name'] = $input['name'];
            /** @var Role $role */
            $role = Role::create($input);
            $role->givePermissionTo($input['permissions']);
            DB::commit();

            return $role;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function updateRole($input, $id)
    {
        try {
            DB::beginTransaction();
            $input['display_name'] = $input['name'];
            /** @var Role $role */
            $role = Role::find($id);
            $role->update($input);
            $role->syncPermissions($input['permissions']);
            DB::commit();

            return $role;
        } catch (Exception $exception) {
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }
}
