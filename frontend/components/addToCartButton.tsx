"use client";

import { useState } from "react";
import { addToCart } from "@/service/cartService";
import type { Product } from "@/service/productService";

export default function AddToCartButton({ product }: { product: Product }) {
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    try {
      addToCart(product);
      setMessage(`${product.name} berhasil ditambahkan ke keranjang.`);
    } catch {
      setMessage("Barang gagal ditambahkan. Silakan coba lagi.");
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
      >
        Tambah ke keranjang
      </button>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-cyan-800">
        {message}
      </p>
    </div>
  );
}
