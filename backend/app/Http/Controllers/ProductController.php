<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Data produk berhasil diambil.',
            'data' => Product::with('category')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'harga' => ['required_without:price', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $validated['harga'] = $validated['harga'] ?? $validated['price'];
        unset($validated['price'], $validated['image']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            if (! is_string($imagePath)) {
                return response()->json([
                    'message' => 'Foto produk gagal disimpan.',
                ], 500);
            }

            $validated['image_path'] = $imagePath;
        }

        $product = Product::create($validated);

        return response()->json($product->load('category'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:5000'],
            'harga' => ['sometimes', 'required_without:price', 'numeric', 'min:0'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if (array_key_exists('price', $validated)) {
            $validated['harga'] = $validated['harga'] ?? $validated['price'];
        }

        unset($validated['price'], $validated['image']);

        $previousImagePath = $product->image_path;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            if (! is_string($imagePath)) {
                return response()->json([
                    'message' => 'Foto produk gagal disimpan.',
                ], 500);
            }

            $validated['image_path'] = $imagePath;
        }

        $product->update($validated);

        if (isset($imagePath) && $previousImagePath) {
            $this->deleteProductImage($previousImagePath, $product->id);
        }

        return response()->json($product->refresh()->load('category'));
    }

    public function destroy(Product $product)
    {
        $imagePath = $product->image_path;
        $product->delete();
        $this->deleteProductImage($imagePath, $product->id);

        return response()->json([
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    private function deleteProductImage(?string $imagePath, int $productId): void
    {
        if ($imagePath && ! Storage::disk('public')->delete($imagePath)) {
            Log::warning('Foto produk gagal dihapus dari penyimpanan.', [
                'product_id' => $productId,
                'image_path' => $imagePath,
            ]);
        }
    }

    public function delete(Product $products)
    {
        return $this->destroy($products);
    }
}
