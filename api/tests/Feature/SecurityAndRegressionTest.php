<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityAndRegressionTest extends TestCase
{
    use RefreshDatabase;

    private User $staff;

    private ServiceType $serviceJas;

    private ServiceType $serviceBatik;

    private ServiceType $serviceCelana;

    protected function setUp(): void
    {
        parent::setUp();
        $this->staff = User::factory()->create();
        $this->serviceJas = ServiceType::create(['slug' => 'jas', 'name' => 'Jas']);
        $this->serviceBatik = ServiceType::create(['slug' => 'hem-batik', 'name' => 'Hem Batik']);
        $this->serviceCelana = ServiceType::create(['slug' => 'celana-panjang', 'name' => 'Celana Panjang']);
    }

    /**
     * E2E Flow: Login -> Create Customer -> Create Order -> Nota Snapshot -> Status Transition -> Dashboard Count
     */
    public function test_full_e2e_operational_flow(): void
    {
        // 1. Authenticate
        $this->actingAs($this->staff, 'web');

        // 2. Create customer
        $custResponse = $this->postJson('/api/v1/customers', [
            'name' => 'Drs. Supardi',
            'phone' => '081298765432',
            'address' => 'Jl. Jenderal Sudirman No. 45, Sukoharjo',
        ])->assertStatus(201);

        $customerId = $custResponse->json('data.id');

        // 3. Create order with Jas and Celana Panjang
        $orderResponse = $this->postJson('/api/v1/orders', [
            'customer_id' => $customerId,
            'total_price' => 1750000,
            'items' => [
                [
                    'service_type_id' => $this->serviceJas->id,
                    'quantity' => 1,
                    'measurements_note' => 'Pundak 44cm, Panjang 72cm, Dada 100cm',
                ],
                [
                    'service_type_id' => $this->serviceCelana->id,
                    'quantity' => 1,
                    'measurements_note' => 'Pinggang 82cm, Panjang 98cm',
                ],
            ],
        ])->assertStatus(201);

        $orderId = $orderResponse->json('data.id');
        $this->assertEquals('PT-000001', $orderResponse->json('data.order_number'));
        $this->assertEquals('baru', $orderResponse->json('data.status'));
        $this->assertEquals('Drs. Supardi', $orderResponse->json('data.customer_name_snapshot'));
        $this->assertEquals('Jl. Jenderal Sudirman No. 45, Sukoharjo', $orderResponse->json('data.customer_address_snapshot'));

        // 4. Verify order detail (Nota Data Groups)
        $detailResponse = $this->getJson("/api/v1/orders/{$orderId}")->assertStatus(200);
        $this->assertEquals('PT-000001', $detailResponse->json('data.order_number'));
        $this->assertEquals(1750000, $detailResponse->json('data.total_price'));
        $this->assertCount(2, $detailResponse->json('data.items'));

        // 5. Check initial dashboard counts
        $dash1 = $this->getJson('/api/v1/dashboard/summary')->assertStatus(200);
        $this->assertEquals(1, $dash1->json('counts.total'));
        $this->assertEquals(1, $dash1->json('counts.baru'));
        $this->assertEquals(0, $dash1->json('counts.diproses'));
        $this->assertEquals(0, $dash1->json('counts.selesai'));

        // 6. Transition to diproses
        $this->patchJson("/api/v1/orders/{$orderId}/status", [
            'status' => Order::STATUS_DIPROSES,
        ])->assertStatus(200);

        $dash2 = $this->getJson('/api/v1/dashboard/summary')->assertStatus(200);
        $this->assertEquals(1, $dash2->json('counts.total'));
        $this->assertEquals(0, $dash2->json('counts.baru'));
        $this->assertEquals(1, $dash2->json('counts.diproses'));

        // 7. Transition to selesai
        $this->patchJson("/api/v1/orders/{$orderId}/status", [
            'status' => Order::STATUS_SELESAI,
        ])->assertStatus(200);

        $dash3 = $this->getJson('/api/v1/dashboard/summary')->assertStatus(200);
        $this->assertEquals(1, $dash3->json('counts.total'));
        $this->assertEquals(0, $dash3->json('counts.diproses'));
        $this->assertEquals(1, $dash3->json('counts.selesai'));
    }

    /**
     * Security: SQL injection string in customer search does not leak data or error
     */
    public function test_customer_search_handles_sql_injection_attempt_safely(): void
    {
        Customer::create([
            'name' => 'Target Customer',
            'phone' => '081234567890',
            'address' => 'Sukoharjo',
        ]);

        $this->actingAs($this->staff, 'web');

        // Attempt SQL injection query
        $response = $this->getJson('/api/v1/customers?q='.urlencode("' OR '1'='1"))
            ->assertStatus(200);

        // Should return 0 matches, not leak the database records
        $this->assertCount(0, $response->json('data'));
    }

    /**
     * Security: XSS input stored safely and outputted without corruption
     */
    public function test_xss_payload_handled_safely(): void
    {
        $this->actingAs($this->staff, 'web');

        $xssName = '<script>alert("xss")</script> Bambang';
        $xssNote = '<img src=x onerror=alert(1)> Ukuran L';

        $custResponse = $this->postJson('/api/v1/customers', [
            'name' => $xssName,
            'phone' => '081234567891',
            'address' => 'Solo',
        ])->assertStatus(201);

        $customerId = $custResponse->json('data.id');

        $orderResponse = $this->postJson('/api/v1/orders', [
            'customer_id' => $customerId,
            'total_price' => 500000,
            'items' => [
                [
                    'service_type_id' => $this->serviceBatik->id,
                    'quantity' => 1,
                    'measurements_note' => $xssNote,
                ],
            ],
        ])->assertStatus(201);

        // String stored verbatim and delivered as JSON text, not executed
        $this->assertEquals($xssName, $orderResponse->json('data.customer_name_snapshot'));
        $this->assertEquals($xssNote, $orderResponse->json('data.items.0.measurements_note'));
    }

    /**
     * Validation: Negative total price, zero quantity, empty items rejected
     */
    public function test_invalid_order_payloads_rejected_with_422(): void
    {
        $this->actingAs($this->staff, 'web');

        $customer = Customer::create([
            'name' => 'Test Customer',
            'phone' => '081234567890',
            'address' => 'Sukoharjo',
        ]);

        // Negative price
        $this->postJson('/api/v1/orders', [
            'customer_id' => $customer->id,
            'total_price' => -50000,
            'items' => [
                [
                    'service_type_id' => $this->serviceJas->id,
                    'quantity' => 1,
                    'measurements_note' => 'Bahu 40cm',
                ],
            ],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['total_price']);

        // Empty items array
        $this->postJson('/api/v1/orders', [
            'customer_id' => $customer->id,
            'total_price' => 500000,
            'items' => [],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['items']);

        // Zero quantity
        $this->postJson('/api/v1/orders', [
            'customer_id' => $customer->id,
            'total_price' => 500000,
            'items' => [
                [
                    'service_type_id' => $this->serviceJas->id,
                    'quantity' => 0,
                    'measurements_note' => 'Bahu 40cm',
                ],
            ],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.quantity']);

        // Invalid service type ID
        $this->postJson('/api/v1/orders', [
            'customer_id' => $customer->id,
            'total_price' => 500000,
            'items' => [
                [
                    'service_type_id' => 99999,
                    'quantity' => 1,
                    'measurements_note' => 'Bahu 40cm',
                ],
            ],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.service_type_id']);
    }

    /**
     * Scope integrity: Out of scope routes return 404
     */
    public function test_out_of_scope_endpoints_do_not_exist(): void
    {
        $this->actingAs($this->staff, 'web');

        $this->getJson('/api/v1/payments')->assertStatus(404);
        $this->getJson('/api/v1/reports')->assertStatus(404);
        $this->getJson('/api/v1/inventory')->assertStatus(404);
        $this->getJson('/api/v1/revenue')->assertStatus(404);
        $this->getJson('/api/v1/fittings')->assertStatus(404);
    }

    /**
     * Unauthenticated request without explicit Accept: application/json header returns 401 JSON and not 500 error
     */
    public function test_unauthenticated_plain_http_request_returns_401_json_not_500(): void
    {
        $response = $this->get('/api/v1/service-types');

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
