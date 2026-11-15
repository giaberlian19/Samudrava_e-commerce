<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_defaults_to_customer_when_role_is_omitted(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Nama Pelanggan',
            'email' => 'pelanggan@example.com',
            'password' => 'password',
        ]);

        $response->assertCreated()
            ->assertJsonPath('role', 'pelanggan');

        $this->assertDatabaseHas('users', [
            'email' => 'pelanggan@example.com',
            'role' => 'pelanggan',
        ]);
    }

    public function test_registration_creates_seller_account_when_seller_role_is_selected(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Nama Penjual',
            'email' => 'penjual@example.com',
            'password' => 'password',
            'role' => 'penjual',
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'Register penjual berhasil')
            ->assertJsonPath('role', 'penjual');

        $this->assertDatabaseHas('users', [
            'email' => 'penjual@example.com',
            'role' => 'penjual',
        ]);
    }

    public function test_registration_rejects_admin_role(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Nama Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $response->assertUnprocessable()
            ->assertInvalid('role');

        $this->assertDatabaseMissing('users', [
            'email' => 'admin@example.com',
        ]);
    }

    public function test_seller_can_log_in_with_seller_role(): void
    {
        User::factory()->create([
            'email' => 'penjual@example.com',
            'password' => 'password',
            'role' => 'penjual',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'penjual@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Login Penjual berhasil')
            ->assertJsonPath('role', 'penjual');
    }
}
