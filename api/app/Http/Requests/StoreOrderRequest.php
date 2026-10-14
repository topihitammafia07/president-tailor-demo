<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'total_price' => ['required', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.service_type_id' => ['required', 'integer', 'exists:service_types,id'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.measurements_note' => ['nullable', 'string'],
        ];
    }
}
