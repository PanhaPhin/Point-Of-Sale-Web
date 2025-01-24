<?php

namespace App\Http\Requests;

use App\Models\BaseUnit;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateBaseUnitRequest
 */
class UpdateBaseUnitRequest extends FormRequest
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
        $rules = BaseUnit::$rules;
        $rules['name'] = 'required|unique:base_units,name,'.$this->route('base_unit');

        return $rules;
    }
}
