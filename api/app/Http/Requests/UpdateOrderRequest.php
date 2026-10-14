<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'total_price' => ['sometimes', 'required', 'integer', 'min:0'],
            'items' => ['sometimes', 'required', 'array', 'min:1'],
            'items.*.service_type_id' => ['required_with:items', 'integer', 'exists:service_types,id'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.measurements_note' => ['nullable', 'string'],
        ];
    }
}
