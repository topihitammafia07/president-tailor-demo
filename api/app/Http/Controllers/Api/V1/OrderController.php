<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * List orders with optional status filter and search.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Order::query()->with(['items.serviceType', 'customer']);

        if ($status = $request->input('status')) {
            if (in_array($status, Order::VALID_STATUSES, true)) {
                $query->where('status', $status);
            }
        }

        if ($search = $request->input('q')) {
            $search = substr(trim($search), 0, 100);
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name_snapshot', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->input('per_page', 20), 5), 100);
        $orders = $query->latest('id')->paginate($perPage);

        return OrderResource::collection($orders);
    }

    /**
     * Store a new order atomically with items and customer snapshot.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $order = DB::transaction(function () use ($validated) {
            $customer = Customer::findOrFail($validated['customer_id']);

            $order = Order::create([
                'customer_id' => $customer->id,
                'customer_name_snapshot' => $customer->name,
                'customer_address_snapshot' => $customer->address,
                'status' => Order::STATUS_BARU,
                'total_price' => $validated['total_price'],
            ]);

            // Generate deterministic, unique order_number based on primary key
            $order->order_number = sprintf('PT-%06d', $order->id);
            $order->save();

            foreach ($validated['items'] as $itemData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'service_type_id' => $itemData['service_type_id'],
                    'quantity' => $itemData['quantity'] ?? 1,
                    'measurements_note' => $itemData['measurements_note'] ?? null,
                ]);
            }

            return $order;
        });

        $order->load(['items.serviceType', 'customer']);

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Show order details including snapshot and items with measurements.
     */
    public function show(Order $order): OrderResource
    {
        $order->load(['items.serviceType', 'customer']);

        return new OrderResource($order);
    }

    /**
     * Update order details (only allowed before status 'selesai').
     */
    public function update(UpdateOrderRequest $request, Order $order): OrderResource|JsonResponse
    {
        if ($order->status === Order::STATUS_SELESAI) {
            return response()->json([
                'message' => 'Pesanan dengan status selesai tidak dapat diubah.',
            ], 409);
        }

        $validated = $request->validated();

        DB::transaction(function () use ($order, $validated) {
            if (isset($validated['total_price'])) {
                $order->total_price = $validated['total_price'];
                $order->save();
            }

            if (isset($validated['items'])) {
                // Delete existing items and recreate
                $order->items()->delete();

                foreach ($validated['items'] as $itemData) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'service_type_id' => $itemData['service_type_id'],
                        'quantity' => $itemData['quantity'] ?? 1,
                        'measurements_note' => $itemData['measurements_note'] ?? null,
                    ]);
                }
            }
        });

        $order->load(['items.serviceType', 'customer']);

        return new OrderResource($order);
    }

    /**
     * Update production progress status with transition validation and row lock.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): OrderResource|JsonResponse
    {
        $newStatus = $request->validated('status');

        $result = DB::transaction(function () use ($order, $newStatus) {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::where('id', $order->id)->lockForUpdate()->firstOrFail();

            if (! $lockedOrder->canTransitionTo($newStatus)) {
                return response()->json([
                    'message' => "Transisi status dari '{$lockedOrder->status}' ke '{$newStatus}' tidak diizinkan.",
                ], 409);
            }

            $lockedOrder->status = $newStatus;
            $lockedOrder->save();

            return $lockedOrder;
        });

        if ($result instanceof JsonResponse) {
            return $result;
        }

        $result->load(['items.serviceType', 'customer']);

        return new OrderResource($result);
    }
}
