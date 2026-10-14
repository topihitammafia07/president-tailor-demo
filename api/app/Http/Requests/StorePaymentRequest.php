<?php

namespace App\Http\Requests;

use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'string', Rule::in(Payment::VALID_METHODS)],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal pembayaran wajib diisi.',
            'amount.numeric' => 'Nominal pembayaran harus berupa angka.',
            'amount.min' => 'Nominal pembayaran harus lebih dari 0.',
            'payment_date.required' => 'Tanggal pembayaran wajib diisi.',
            'payment_date.date' => 'Format tanggal pembayaran tidak valid.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'payment_method.in' => 'Metode pembayaran harus salah satu dari: tunai, transfer_bank, atau qris.',
        ];
    }
}
