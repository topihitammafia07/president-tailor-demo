<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerApiTest extends TestCase
{
    use RefreshDatabase;

    private User $staff;

    protected function setUp(): void
    {
        parent::setUp();
        $this->staff = User::factory()->create();
    }

    public function test_staff_can_create_customer(): void
    {
        $response = $this->actingAs($this->staff, 'web')->postJson('/api/v1/customers', [
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
            'address' => 'Jl. Veteran No. 12, Sukoharjo',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Budi Santoso')
            ->assertJsonPath('data.phone', '081234567890');

        $this->assertDatabaseHas('customers', [
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
        ]);
    }

    public function test_create_customer_validates_required_fields(): void
    {
        $response = $this->actingAs($this->staff, 'web')->postJson('/api/v1/customers', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'phone', 'address']);
    }

    public function test_staff_can_search_customers(): void
    {
        Customer::create([
            'name' => 'Ahmad Dahlan',
            'phone' => '0811111111',
            'address' => 'Sukoharjo',
        ]);

        Customer::create([
            'name' => 'Siti Nurhaliza',
            'phone' => '0822222222',
            'address' => 'Solo',
        ]);

        $response = $this->actingAs($this->staff, 'web')->getJson('/api/v1/customers?q=Ahmad');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Ahmad Dahlan');
    }

    public function test_editing_customer_does_not_modify_previous_order_snapshot(): void
    {
        $customer = Customer::create([
            'name' => 'Budi Asli',
            'phone' => '081234567890',
            'address' => 'Alamat Asli',
        ]);

        $service = ServiceType::create(['slug' => 'jas', 'name' => 'Jas']);

        $order = Order::create([
            'order_number' => 'PT-000001',
            'customer_id' => $customer->id,
            'customer_name_snapshot' => $customer->name,
            'customer_address_snapshot' => $customer->address,
            'status' => Order::STATUS_BARU,
            'total_price' => 1500000,
        ]);

        // Edit customer
        $this->actingAs($this->staff, 'web')->patchJson("/api/v1/customers/{$customer->id}", [
            'name' => 'Budi Baru',
            'address' => 'Alamat Baru Pindah',
        ])->assertStatus(200);

        // Verify customer is updated
        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'name' => 'Budi Baru',
        ]);

        // Verify order snapshot remains untouched (AC-CUS-02, AC-ORD-04)
        $order->refresh();
        $this->assertEquals('Budi Asli', $order->customer_name_snapshot);
        $this->assertEquals('Alamat Asli', $order->customer_address_snapshot);
    }
}
