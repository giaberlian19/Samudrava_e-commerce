<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminProductCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_read_products_but_cannot_create_them(): void
    {
        $this->getJson('/api/products')->assertOk();

        $this->postJson('/api/products', [
            'name' => 'Keyboard',
            'price' => 1500,
            'stock' => 5,
        ])->assertUnauthorized();
    }

    public function test_non_admin_cannot_create_update_or_delete_products(): void
    {
        $product = Product::create([
            'name' => 'Keyboard',
            'harga' => 1500,
            'stock' => 5,
        ]);
        Sanctum::actingAs(User::factory()->create(['role' => 'pelanggan']));

        $this->postJson('/api/products', [
            'name' => 'New product',
            'price' => 2000,
            'stock' => 3,
        ])->assertForbidden();

        $this->putJson("/api/products/{$product->id}", [
            'name' => 'Updated product',
        ])->assertForbidden();

        $this->deleteJson("/api/products/{$product->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Keyboard',
        ]);
    }

    public function test_admin_can_create_update_and_delete_products(): void
    {
        $category = Category::create(['name' => 'Elektronik']);
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $createResponse = $this->postJson('/api/products', [
            'name' => 'Keyboard',
            'description' => 'Keyboard mekanis',
            'price' => 125000.50,
            'stock' => 8,
            'category_id' => $category->id,
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('name', 'Keyboard')
            ->assertJsonPath('description', 'Keyboard mekanis');

        $productId = $createResponse->json('id');
        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'name' => 'Keyboard',
            'stock' => 8,
            'category_id' => $category->id,
        ]);

        $this->putJson("/api/products/{$productId}", [
            'name' => 'Keyboard Pro',
            'description' => 'Keyboard mekanis dengan lampu RGB',
            'price' => 145000.75,
            'stock' => 12,
        ])->assertOk()
            ->assertJsonPath('name', 'Keyboard Pro')
            ->assertJsonPath('description', 'Keyboard mekanis dengan lampu RGB');

        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'name' => 'Keyboard Pro',
            'stock' => 12,
        ]);

        $this->getJson("/api/products/{$productId}")
            ->assertOk()
            ->assertJsonPath('description', 'Keyboard mekanis dengan lampu RGB');

        $this->deleteJson("/api/products/{$productId}")->assertOk();

        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_admin_must_provide_a_product_description(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $this->postJson('/api/products', [
            'name' => 'Keyboard',
            'price' => 125000,
            'stock' => 2,
        ])->assertUnprocessable()
            ->assertInvalid('description');
    }

    public function test_admin_can_upload_replace_and_delete_a_product_photo(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $pngContent = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
        );
        $createResponse = $this->post('/api/products', [
            'name' => 'Product with photo',
            'description' => 'Produk dengan foto',
            'price' => 125000,
            'stock' => 2,
            'image' => UploadedFile::fake()->createWithContent(
                'product.png',
                $pngContent,
            ),
        ], ['Accept' => 'application/json']);

        $createResponse->assertCreated();
        $productId = $createResponse->json('id');
        $oldImagePath = $createResponse->json('image_path');
        Storage::disk('public')->assertExists($oldImagePath);

        $replacementImage = UploadedFile::fake()->createWithContent(
            'replacement.png',
            $pngContent,
        );
        $updateResponse = $this->post("/api/products/{$productId}", [
            '_method' => 'PUT',
            'name' => 'Product with photo',
            'description' => 'Produk dengan foto',
            'price' => 125000,
            'stock' => 2,
            'category_id' => '',
            'image' => $replacementImage,
        ], ['Accept' => 'application/json']);

        $updateResponse->assertOk();
        $newImagePath = $updateResponse->json('image_path');
        $this->assertNotSame($oldImagePath, $newImagePath);
        Storage::disk('public')->assertMissing($oldImagePath);
        Storage::disk('public')->assertExists($newImagePath);

        $this->deleteJson("/api/products/{$productId}")->assertOk();
        Storage::disk('public')->assertMissing($newImagePath);
    }

    public function test_category_options_match_the_website_categories(): void
    {
        $this->seed(CategorySeeder::class);

        $response = $this->getJson('/api/categories');

        $response->assertOk()
            ->assertJsonCount(8, 'data');

        foreach ([
            'Elektronik',
            'Fashion',
            'Kosmetik',
            'Rumah Tangga',
            'Olahraga',
            'Makanan & Minuman',
            'Buku & Alat Tulis',
            'Bayi & Anak',
        ] as $categoryName) {
            $response->assertJsonFragment(['name' => $categoryName]);
        }
    }
}
