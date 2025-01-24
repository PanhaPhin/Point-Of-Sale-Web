<?php

namespace App\Http\Requests;

use App\Models\Warehouse;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateWarehouseRequest
 */
class UpdateWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function rules(): array
    {
        $rules = Warehouse::$rules;
        $rules['name'] = 'required|unique:warehouses,name,'.$this->route('warehouse');
        $rules['email'] = 'nullable|email|unique:warehouses,email,'.$this->route('warehouse');

        return $rules;
    }
}
