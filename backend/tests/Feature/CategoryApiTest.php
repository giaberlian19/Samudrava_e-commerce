<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_can_be_created_and_listed(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum');

        $response = $this->postJson('/api/categories', [
            'name' => 'Elektronik',
            'description' => 'Perangkat elektronik',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Elektronik');

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Elektronik');

        $this->putJson('/api/categories/'.$response->json('data.id'), [
            'name' => 'Elektronik Rumah Tangga',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Elektronik Rumah Tangga');
    }

    public function test_product_can_be_assigned_to_a_category(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum');
        $category = Category::create(['name' => 'Aksesori']);

        $this->postJson('/api/products', [
            'name' => 'Kabel USB',
            'harga' => 12.50,
            'stock' => 5,
            'category_id' => $category->id,
        ])
            ->assertCreated()
            ->assertJsonPath('category.id', $category->id)
            ->assertJsonPath('category.name', 'Aksesori');
    }

    public function test_product_category_is_optional_and_cleared_when_category_is_deleted(): void
    {
        $this->withoutMiddleware();
        $category = Category::create(['name' => 'Perlengkapan']);
        $product = $category->products()->create([
            'name' => 'Barang lama',
            'harga' => 9.99,
            'stock' => 2,
        ]);

        $category->delete();

        $this->assertNull($product->fresh()->category_id);
    }
}
