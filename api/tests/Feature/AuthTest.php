<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_anonymous_request_to_private_api_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/customers');

        $response->assertStatus(401);
    }

    public function test_staff_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'staff@presidenttailor.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/login', [
            'email' => 'staff@presidenttailor.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.email', 'staff@presidenttailor.com');

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_with_invalid_credentials_fails(): void
    {
        User::factory()->create([
            'email' => 'staff@presidenttailor.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/login', [
            'email' => 'staff@presidenttailor.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_staff_can_access_me_endpoint(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'web')->getJson('/api/v1/me');

        $response->assertStatus(200)
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', $user->email);
    }

    public function test_staff_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'web')->postJson('/logout');

        $response->assertStatus(200);
        $this->assertGuest();
    }
}
