<?php

namespace App\Http\Requests;

use App\Models\Supplier;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateCustomerRequest
 */
class UpdateSupplierRequest extends FormRequest
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
        $rules = Supplier::$rules;
        $rules['email'] = 'required|email|unique:suppliers,email,'.$this->route('supplier');

        return $rules;
    }
}
