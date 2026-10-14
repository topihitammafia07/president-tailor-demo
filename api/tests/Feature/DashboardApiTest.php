<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    private User $staff;

    protected function setUp(): void
    {
        parent::setUp();
        $this->staff = User::factory()->create();
    }

    public function test_dashboard_summary_returns_accurate_zero_counts_when_empty(): void
    {
        $response = $this->actingAs($this->staff, 'web')->getJson('/api/v1/dashboard/summary');

        $response->assertStatus(200)
            ->assertJsonPath('counts.total', 0)
            ->assertJsonPath('counts.baru', 0)
            ->assertJsonPath('counts.diproses', 0)
            ->assertJsonPath('counts.selesai', 0)
            ->assertJsonPath('recent_orders', []);
    }

    public function test_dashboard_summary_returns_accurate_counts_with_data(): void
    {
        $customer = Customer::create([
            'name' => 'Pak Joko',
            'phone' => '0812345',
            'address' => 'Solo',
        ]);

        Order::create([
            'order_number' => 'PT-000001',
            'customer_id' => $customer->id,
            'customer_name_snapshot' => $customer->name,
            'customer_address_snapshot' => $customer->address,
            'status' => Order::STATUS_BARU,
            'total_price' => 500000,
        ]);

        Order::create([
            'order_number' => 'PT-000002',
            'customer_id' => $customer->id,
            'customer_name_snapshot' => $customer->name,
            'customer_address_snapshot' => $customer->address,
            'status' => Order::STATUS_DIPROSES,
            'total_price' => 700000,
        ]);

        Order::create([
            'order_number' => 'PT-000003',
            'customer_id' => $customer->id,
            'customer_name_snapshot' => $customer->name,
            'customer_address_snapshot' => $customer->address,
            'status' => Order::STATUS_SELESAI,
            'total_price' => 1200000,
        ]);

        $response = $this->actingAs($this->staff, 'web')->getJson('/api/v1/dashboard/summary');

        $response->assertStatus(200)
            ->assertJsonPath('counts.total', 3)
            ->assertJsonPath('counts.baru', 1)
            ->assertJsonPath('counts.diproses', 1)
            ->assertJsonPath('counts.selesai', 1)
            ->assertJsonCount(3, 'recent_orders');
    }
}
