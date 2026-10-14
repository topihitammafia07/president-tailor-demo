<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_id' => $this->customer_id,
            'customer_name_snapshot' => $this->customer_name_snapshot,
            'customer_address_snapshot' => $this->customer_address_snapshot,
            'status' => $this->status,
            'total_price' => $this->total_price,
            'total_paid' => $this->total_paid,
            'remaining_bill' => $this->remaining_bill,
            'payment_status' => $this->payment_status,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
