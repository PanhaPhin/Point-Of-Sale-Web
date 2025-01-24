<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = Role::$rules;
        $rules['name'] = 'required|unique:roles,name,'.$this->route('role.id');

        return $rules;
    }

    /**
     * @return string[]
     */
    public function messages(): array
    {
        return [
            'permissions.required' => 'Please select any permission',
        ];
    }
}
