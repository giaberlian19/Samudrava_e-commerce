<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

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
            'harga' => ['required_without:price', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);

        $validated['harga'] = $validated['harga'] ?? $validated['price'];
        unset($validated['price']);

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
            'harga' => ['sometimes', 'required_without:price', 'numeric', 'min:0'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
        ]);

        if (array_key_exists('price', $validated)) {
            $validated['harga'] = $validated['harga'] ?? $validated['price'];
            unset($validated['price']);
        }

        $product->update($validated);

        return response()->json($product->refresh()->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    public function delete(Product $products)
    {
        return $this->destroy($products);
    }
}
