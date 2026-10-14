<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerReportingAndPaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    private User $staff;

    private ServiceType $serviceJas;

    private ServiceType $serviceBatik;

    private ServiceType $serviceCelana;

    private Customer $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->owner()->create([
            'email' => 'owner.test@presidenttailor.com',
        ]);
        $this->staff = User::factory()->staff()->create([
            'email' => 'staff.test@presidenttailor.com',
        ]);

        $this->serviceJas = ServiceType::create(['slug' => 'jas', 'name' => 'Jas']);
        $this->serviceBatik = ServiceType::create(['slug' => 'hem-batik', 'name' => 'Hem Batik']);
        $this->serviceCelana = ServiceType::create(['slug' => 'celana-panjang', 'name' => 'Celana Panjang']);

        $this->customer = Customer::create([
            'name' => 'Pak Harun',
            'phone' => '081234567890',
            'address' => 'Sukoharjo',
        ]);
    }

    public function test_staff_cannot_access_owner_dashboard_or_reports(): void
    {
        $this->actingAs($this->staff, 'web');

        $this->getJson('/api/v1/owner/dashboard')->assertStatus(403)
            ->assertJson([
                'message' => 'Akses ditolak. Fitur laporan bisnis hanya dapat diakses oleh Owner.',
            ]);

        $this->getJson('/api/v1/owner/reports')->assertStatus(403)
            ->assertJson([
                'message' => 'Akses ditolak. Fitur laporan bisnis hanya dapat diakses oleh Owner.',
            ]);
    }

    public function test_owner_can_access_owner_dashboard_and_reports(): void
    {
        $this->actingAs($this->owner, 'web');

        $dash = $this->getJson('/api/v1/owner/dashboard')->assertStatus(200);
        $dash->assertJsonStructure([
            'metrics' => [
                'total_orders',
                'orders_baru',
                'orders_diproses',
                'orders_selesai',
                'total_order_value',
                'total_revenue_collected',
                'total_outstanding_receivables',
            ],
            'monthly_trends',
        ]);

        $reports = $this->getJson('/api/v1/owner/reports')->assertStatus(200);
        $reports->assertJsonStructure([
            'period',
            'summary' => [
                'total_orders',
                'total_order_value',
                'payments_collected',
                'total_outstanding_receivables',
            ],
            'service_breakdown',
            'payment_status_breakdown',
            'daily_trends',
            'monthly_trends',
            'unpaid_orders',
        ]);
    }

    public function test_payment_recording_partial_and_full(): void
    {
        $this->actingAs($this->staff, 'web');

        $order = Order::create([
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'total_price' => 1500000,
            'status' => Order::STATUS_BARU,
        ]);

        $this->assertEquals(Order::PAYMENT_STATUS_UNPAID, $order->payment_status);
        $this->assertEquals(1500000, $order->remaining_bill);

        // 1. Partial payment (DP 500.000)
        $payment1 = $this->postJson("/api/v1/orders/{$order->id}/payments", [
            'amount' => 500000,
            'payment_date' => now()->toDateString(),
            'payment_method' => Payment::METHOD_TUNAI,
            'notes' => 'DP awal jahit',
        ])->assertStatus(201);

        $order->refresh();
        $this->assertEquals(500000, $order->total_paid);
        $this->assertEquals(1000000, $order->remaining_bill);
        $this->assertEquals(Order::PAYMENT_STATUS_PARTIAL, $order->payment_status);

        // 2. Full payment (Pelunasan 1.000.000)
        $payment2 = $this->postJson("/api/v1/orders/{$order->id}/payments", [
            'amount' => 1000000,
            'payment_date' => now()->toDateString(),
            'payment_method' => Payment::METHOD_TRANSFER,
            'notes' => 'Pelunasan transfer BCA',
        ])->assertStatus(201);

        $order->refresh();
        $this->assertEquals(1500000, $order->total_paid);
        $this->assertEquals(0, $order->remaining_bill);
        $this->assertEquals(Order::PAYMENT_STATUS_PAID, $order->payment_status);
    }

    public function test_payment_cannot_exceed_remaining_bill(): void
    {
        $this->actingAs($this->staff, 'web');

        $order = Order::create([
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'total_price' => 500000,
            'status' => Order::STATUS_BARU,
        ]);

        $this->postJson("/api/v1/orders/{$order->id}/payments", [
            'amount' => 500001,
            'payment_date' => now()->toDateString(),
            'payment_method' => Payment::METHOD_TUNAI,
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_payment_validates_positive_amount_and_method(): void
    {
        $this->actingAs($this->staff, 'web');

        $order = Order::create([
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'total_price' => 500000,
            'status' => Order::STATUS_BARU,
        ]);

        // Zero amount
        $this->postJson("/api/v1/orders/{$order->id}/payments", [
            'amount' => 0,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'tunai',
        ])->assertStatus(422)->assertJsonValidationErrors(['amount']);

        // Invalid method
        $this->postJson("/api/v1/orders/{$order->id}/payments", [
            'amount' => 100000,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'bitcoin',
        ])->assertStatus(422)->assertJsonValidationErrors(['payment_method']);
    }

    public function test_owner_dashboard_and_reporting_calculations(): void
    {
        // Create 2 orders:
        // Order 1: Jas (Rp 1.000.000), paid Rp 400.000
        $order1 = Order::create([
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'total_price' => 1000000,
            'status' => Order::STATUS_BARU,
        ]);
        $order1->items()->create([
            'service_type_id' => $this->serviceJas->id,
            'quantity' => 1,
            'measurements_note' => 'Standard',
        ]);
        Payment::create([
            'order_id' => $order1->id,
            'amount' => 400000,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'tunai',
        ]);

        // Order 2: Hem Batik (Rp 500.000), paid Rp 500.000 (lunas)
        $order2 = Order::create([
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'total_price' => 500000,
            'status' => Order::STATUS_SELESAI,
        ]);
        $order2->items()->create([
            'service_type_id' => $this->serviceBatik->id,
            'quantity' => 1,
            'measurements_note' => 'Standard',
        ]);
        Payment::create([
            'order_id' => $order2->id,
            'amount' => 500000,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'transfer_bank',
        ]);

        $this->actingAs($this->owner, 'web');

        // Test dashboard metrics
        $dashResponse = $this->getJson('/api/v1/owner/dashboard')->assertStatus(200);
        $this->assertEquals(2, $dashResponse->json('metrics.total_orders'));
        $this->assertEquals(1, $dashResponse->json('metrics.orders_baru'));
        $this->assertEquals(1, $dashResponse->json('metrics.orders_selesai'));
        $this->assertEquals(1500000, $dashResponse->json('metrics.total_order_value'));
        $this->assertEquals(900000, $dashResponse->json('metrics.total_revenue_collected'));
        $this->assertEquals(600000, $dashResponse->json('metrics.total_outstanding_receivables'));

        // Test reports breakdown
        $reportResponse = $this->getJson('/api/v1/owner/reports')->assertStatus(200);
        $this->assertEquals(2, $reportResponse->json('summary.total_orders'));
        $this->assertEquals(1500000, $reportResponse->json('summary.total_order_value'));
        $this->assertEquals(900000, $reportResponse->json('summary.payments_collected'));
        $this->assertEquals(600000, $reportResponse->json('summary.total_outstanding_receivables'));

        // Breakdown by payment status
        $this->assertEquals(1, $reportResponse->json('payment_status_breakdown.lunas'));
        $this->assertEquals(1, $reportResponse->json('payment_status_breakdown.sebagian'));
        $this->assertEquals(0, $reportResponse->json('payment_status_breakdown.belum_dibayar'));

        // Unpaid orders list should have 1 order with remaining_bill 600.000
        $this->assertCount(1, $reportResponse->json('unpaid_orders'));
        $this->assertEquals(600000, $reportResponse->json('unpaid_orders.0.remaining_bill'));
    }
}
