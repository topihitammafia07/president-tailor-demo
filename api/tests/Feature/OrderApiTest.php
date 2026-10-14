<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    private User $staff;

    private Customer $customer;

    private ServiceType $serviceJas;

    private ServiceType $serviceCelana;

    protected function setUp(): void
    {
        parent::setUp();
        $this->staff = User::factory()->create();
        $this->customer = Customer::create([
            'name' => 'Joko Widodo',
            'phone' => '08123456789',
            'address' => 'Solo',
        ]);
        $this->serviceJas = ServiceType::create(['slug' => 'jas', 'name' => 'Jas']);
        $this->serviceCelana = ServiceType::create(['slug' => 'celana-panjang', 'name' => 'Celana Panjang']);
    }

    public function test_staff_can_create_order_with_unique_number_and_measurements(): void
    {
        $payload = [
            'customer_id' => $this->customer->id,
            'total_price' => 2500000,
            'items' => [
                [
                    'service_type_id' => $this->serviceJas->id,
                    'quantity' => 1,
                    'measurements_note' => 'Bahu 46cm, Panjang Jas 75cm, Tangan 60cm',
                ],
                [
                    'service_type_id' => $this->serviceCelana->id,
                    'quantity' => 2,
                    'measurements_note' => 'Pinggang 84cm, Panjang Celana 100cm',
                ],
            ],
        ];

        $response = $this->actingAs($this->staff, 'web')->postJson('/api/v1/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.order_number', 'PT-000001')
            ->assertJsonPath('data.customer_name_snapshot', 'Joko Widodo')
            ->assertJsonPath('data.total_price', 2500000)
            ->assertJsonPath('data.status', 'baru')
            ->assertJsonCount(2, 'data.items');

        // Verify items and measurements
        $this->assertDatabaseHas('orders', [
            'order_number' => 'PT-000001',
            'customer_name_snapshot' => 'Joko Widodo',
        ]);

        $this->assertDatabaseHas('order_items', [
            'service_type_id' => $this->serviceJas->id,
            'measurements_note' => 'Bahu 46cm, Panjang Jas 75cm, Tangan 60cm',
        ]);
    }

    public function test_status_transition_rules(): void
    {
        $order = Order::create([
            'order_number' => 'PT-000001',
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'status' => Order::STATUS_BARU,
            'total_price' => 1000000,
        ]);

        // Invalid jump: baru -> selesai (rejected 409)
        $this->actingAs($this->staff, 'web')
            ->patchJson("/api/v1/orders/{$order->id}/status", ['status' => Order::STATUS_SELESAI])
            ->assertStatus(409);

        // Valid transition: baru -> diproses
        $this->actingAs($this->staff, 'web')
            ->patchJson("/api/v1/orders/{$order->id}/status", ['status' => Order::STATUS_DIPROSES])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'diproses');

        // Valid transition: diproses -> selesai
        $this->actingAs($this->staff, 'web')
            ->patchJson("/api/v1/orders/{$order->id}/status", ['status' => Order::STATUS_SELESAI])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'selesai');

        // Invalid transition after selesai: selesai -> baru / diproses (rejected 409)
        $this->actingAs($this->staff, 'web')
            ->patchJson("/api/v1/orders/{$order->id}/status", ['status' => Order::STATUS_BARU])
            ->assertStatus(409);
    }

    public function test_cannot_edit_order_after_selesai(): void
    {
        $order = Order::create([
            'order_number' => 'PT-000001',
            'customer_id' => $this->customer->id,
            'customer_name_snapshot' => $this->customer->name,
            'customer_address_snapshot' => $this->customer->address,
            'status' => Order::STATUS_SELESAI,
            'total_price' => 1000000,
        ]);

        $this->actingAs($this->staff, 'web')
            ->patchJson("/api/v1/orders/{$order->id}", ['total_price' => 1200000])
            ->assertStatus(409);
    }
}
