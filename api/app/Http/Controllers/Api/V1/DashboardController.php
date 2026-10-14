<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get operational summary counts and recent orders.
     */
    public function summary(): JsonResponse
    {
        $allOrders = Order::with('payments')->get();

        $counts = [
            'total' => $allOrders->count(),
            'baru' => $allOrders->where('status', Order::STATUS_BARU)->count(),
            'diproses' => $allOrders->where('status', Order::STATUS_DIPROSES)->count(),
            'selesai' => $allOrders->where('status', Order::STATUS_SELESAI)->count(),
            'belum_lunas' => $allOrders->filter(fn ($o) => $o->remaining_bill > 0)->count(),
        ];

        $recentOrders = Order::with(['items.serviceType', 'customer', 'payments'])
            ->latest('id')
            ->limit(8)
            ->get();

        return response()->json([
            'counts' => $counts,
            'recent_orders' => OrderResource::collection($recentOrders),
        ]);
    }
}
