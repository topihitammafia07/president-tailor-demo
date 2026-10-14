<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'service_type_id' => $this->service_type_id,
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'quantity' => $this->quantity,
            'measurements_note' => $this->measurements_note,
        ];
    }
}
