<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ServiceType;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerReportController extends Controller
{
    /**
     * Owner Dashboard Metrics & Monthly Trend.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $orderQuery = Order::query();
        $paymentQuery = Payment::query();

        if ($startDate) {
            $orderQuery->whereDate('created_at', '>=', $startDate);
            $paymentQuery->whereDate('payment_date', '>=', $startDate);
        }
        if ($endDate) {
            $orderQuery->whereDate('created_at', '<=', $endDate);
            $paymentQuery->whereDate('payment_date', '<=', $endDate);
        }

        $allOrdersInFilter = (clone $orderQuery)->with('payments')->get();
        $totalOrders = $allOrdersInFilter->count();
        $ordersBaru = $allOrdersInFilter->where('status', Order::STATUS_BARU)->count();
        $ordersDiproses = $allOrdersInFilter->where('status', Order::STATUS_DIPROSES)->count();
        $ordersSelesai = $allOrdersInFilter->where('status', Order::STATUS_SELESAI)->count();

        $totalOrderValue = (float) $allOrdersInFilter->sum('total_price');
        $totalRevenueCollected = (float) $paymentQuery->sum('amount');
        $totalOutstanding = (float) $allOrdersInFilter->sum(fn ($o) => $o->remaining_bill);

        // Monthly trends for the past 6 months (or custom range)
        $monthlyTrends = $this->calculateMonthlyTrends(6);

        // Top 5 unpaid orders for quick receivables follow-up on dashboard
        $topUnpaidOrders = $allOrdersInFilter->filter(fn ($o) => $o->remaining_bill > 0)
            ->sortByDesc('remaining_bill')
            ->values()
            ->take(5)
            ->map(fn ($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer_name' => $o->customer_name_snapshot,
                'created_at' => $o->created_at?->format('Y-m-d'),
                'total_price' => $o->total_price,
                'total_paid' => $o->total_paid,
                'remaining_bill' => $o->remaining_bill,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
            ]);

        return response()->json([
            'metrics' => [
                'total_orders' => $totalOrders,
                'orders_baru' => $ordersBaru,
                'orders_diproses' => $ordersDiproses,
                'orders_selesai' => $ordersSelesai,
                'total_order_value' => $totalOrderValue,
                'total_revenue_collected' => $totalRevenueCollected,
                'total_outstanding_receivables' => $totalOutstanding,
            ],
            'monthly_trends' => $monthlyTrends,
            'top_unpaid_orders' => $topUnpaidOrders,
            'filter' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Business Reporting: breakdown by service, period, payment status, and daily trends.
     */
    public function reports(Request $request): JsonResponse
    {
        $startDateStr = $request->query('start_date') ?: Carbon::now()->startOfMonth()->toDateString();
        $endDateStr = $request->query('end_date') ?: Carbon::now()->toDateString();

        $orders = Order::with(['payments', 'items.serviceType'])
            ->whereDate('created_at', '>=', $startDateStr)
            ->whereDate('created_at', '<=', $endDateStr)
            ->get();

        $payments = Payment::whereDate('payment_date', '>=', $startDateStr)
            ->whereDate('payment_date', '<=', $endDateStr)
            ->get();

        $totalOrders = $orders->count();
        $totalOrderValue = (float) $orders->sum('total_price');
        $paymentsCollected = (float) $payments->sum('amount');
        $totalOutstanding = (float) $orders->sum(fn ($o) => $o->remaining_bill);

        // Breakdown by Service Type (Jas, Hem Batik, Celana Panjang)
        $serviceTypes = ServiceType::all();
        $serviceBreakdown = [];
        foreach ($serviceTypes as $service) {
            $matchingItems = OrderItem::where('service_type_id', $service->id)
                ->whereIn('order_id', $orders->pluck('id'))
                ->get();

            $serviceBreakdown[] = [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => $service->name,
                'item_count' => (int) $matchingItems->sum('quantity'),
                'order_count' => $matchingItems->pluck('order_id')->unique()->count(),
            ];
        }

        // Breakdown by Payment Status
        $paymentStatusBreakdown = [
            'lunas' => $orders->filter(fn ($o) => $o->payment_status === Order::PAYMENT_STATUS_PAID)->count(),
            'sebagian' => $orders->filter(fn ($o) => $o->payment_status === Order::PAYMENT_STATUS_PARTIAL)->count(),
            'belum_dibayar' => $orders->filter(fn ($o) => $o->payment_status === Order::PAYMENT_STATUS_UNPAID)->count(),
        ];

        // Daily trend between start and end date (max 60 days)
        $dailyTrends = $this->calculateDailyTrends($startDateStr, $endDateStr, $orders, $payments);

        // Monthly trends
        $monthlyTrends = $this->calculateMonthlyTrends(12);

        // List of unpaid / partially paid orders needing follow-up
        $unpaidOrders = $orders->filter(fn ($o) => $o->remaining_bill > 0)
            ->sortByDesc('remaining_bill')
            ->values()
            ->map(fn ($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer_name' => $o->customer_name_snapshot,
                'created_at' => $o->created_at?->format('Y-m-d'),
                'total_price' => $o->total_price,
                'total_paid' => $o->total_paid,
                'remaining_bill' => $o->remaining_bill,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
            ]);

        return response()->json([
            'period' => [
                'start_date' => $startDateStr,
                'end_date' => $endDateStr,
            ],
            'summary' => [
                'total_orders' => $totalOrders,
                'total_order_value' => $totalOrderValue,
                'payments_collected' => $paymentsCollected,
                'total_outstanding_receivables' => $totalOutstanding,
            ],
            'service_breakdown' => $serviceBreakdown,
            'payment_status_breakdown' => $paymentStatusBreakdown,
            'daily_trends' => $dailyTrends,
            'monthly_trends' => $monthlyTrends,
            'unpaid_orders' => $unpaidOrders,
        ]);
    }

    /**
     * Compute monthly trends for given number of months.
     */
    private function calculateMonthlyTrends(int $months): array
    {
        $trends = [];
        $start = Carbon::now()->subMonths($months - 1)->startOfMonth();

        for ($i = 0; $i < $months; $i++) {
            $monthStart = (clone $start)->addMonths($i)->startOfMonth();
            $monthEnd = (clone $monthStart)->endOfMonth();

            $monthKey = $monthStart->format('Y-m');
            $monthLabel = $monthStart->translatedFormat('M Y');

            $monthOrders = Order::whereBetween('created_at', [$monthStart, $monthEnd])->get();
            $monthPayments = Payment::whereBetween('payment_date', [$monthStart->toDateString(), $monthEnd->toDateString()])->get();

            $trends[] = [
                'month' => $monthKey,
                'label' => $monthLabel,
                'order_count' => $monthOrders->count(),
                'order_value' => (float) $monthOrders->sum('total_price'),
                'payment_collected' => (float) $monthPayments->sum('amount'),
            ];
        }

        return $trends;
    }

    /**
     * Compute daily trends between start and end date.
     */
    private function calculateDailyTrends(string $startStr, string $endStr, $orders, $payments): array
    {
        $start = Carbon::parse($startStr);
        $end = Carbon::parse($endStr);

        // Cap to 62 days to avoid huge response
        if ($start->diffInDays($end) > 62) {
            $start = (clone $end)->subDays(62);
        }

        $trends = [];
        $current = clone $start;

        while ($current->lte($end)) {
            $dateStr = $current->toDateString();
            $dayLabel = $current->translatedFormat('d M');

            $dayOrders = $orders->filter(function ($o) use ($dateStr) {
                return $o->created_at && $o->created_at->toDateString() === $dateStr;
            });

            $dayPayments = $payments->filter(function ($p) use ($dateStr) {
                return $p->payment_date && $p->payment_date->toDateString() === $dateStr;
            });

            $trends[] = [
                'date' => $dateStr,
                'label' => $dayLabel,
                'order_count' => $dayOrders->count(),
                'order_value' => (float) $dayOrders->sum('total_price'),
                'payment_collected' => (float) $dayPayments->sum('amount'),
            ];

            $current->addDay();
        }

        return $trends;
    }

    /**
     * Seed realistic demo data for dashboard simulation.
     */
    public function seedDemo(): JsonResponse
    {
        (new \Database\Seeders\DemoDataSeeder)->run();

        return response()->json([
            'message' => 'Data demo berhasil dimuat.',
        ]);
    }

    /**
     * Clear all demo data so workshop can start fresh with real orders.
     */
    public function resetDemo(): JsonResponse
    {
        \Database\Seeders\DemoDataSeeder::reset();

        return response()->json([
            'message' => 'Data demo berhasil direset.',
        ]);
    }
}
