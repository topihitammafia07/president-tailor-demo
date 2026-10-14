<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Get list of payments for a given order.
     */
    public function index(Order $order): JsonResponse
    {
        $payments = $order->payments()->latest('id')->get();

        return response()->json([
            'data' => PaymentResource::collection($payments),
            'order_number' => $order->order_number,
            'total_price' => $order->total_price,
            'total_paid' => $order->total_paid,
            'remaining_bill' => $order->remaining_bill,
            'payment_status' => $order->payment_status,
        ]);
    }

    /**
     * Store a new payment for a given order.
     */
    public function store(StorePaymentRequest $request, Order $order): JsonResponse
    {
        $amount = (float) $request->validated('amount');

        return DB::transaction(function () use ($request, $order, $amount) {
            // Lock order for update to prevent race conditions in payment calculation
            $lockedOrder = Order::where('id', $order->id)->lockForUpdate()->firstOrFail();

            $currentRemaining = $lockedOrder->remaining_bill;

            if ($amount > $currentRemaining) {
                throw ValidationException::withMessages([
                    'amount' => [
                        sprintf(
                            'Nominal pembayaran (Rp %s) melebihi sisa tagihan pesanan (Rp %s).',
                            number_format($amount, 0, ',', '.'),
                            number_format($currentRemaining, 0, ',', '.')
                        ),
                    ],
                ]);
            }

            $payment = Payment::create([
                'order_id' => $lockedOrder->id,
                'amount' => $amount,
                'payment_date' => $request->validated('payment_date'),
                'payment_method' => $request->validated('payment_method'),
                'notes' => $request->validated('notes'),
                'created_by' => $request->user()?->id,
            ]);

            // Refresh order
            $lockedOrder->unsetRelation('payments');

            return response()->json([
                'message' => 'Pembayaran berhasil dicatat.',
                'data' => new PaymentResource($payment),
                'order' => [
                    'id' => $lockedOrder->id,
                    'order_number' => $lockedOrder->order_number,
                    'total_price' => $lockedOrder->total_price,
                    'total_paid' => $lockedOrder->total_paid,
                    'remaining_bill' => $lockedOrder->remaining_bill,
                    'payment_status' => $lockedOrder->payment_status,
                ],
            ], 201);
        });
    }
}
