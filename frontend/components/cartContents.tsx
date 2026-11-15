"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getProductImageUrl } from "@/service/productService";
import {
  getCartItems,
  removeFromCart,
  setCartItemQuantity,
  subscribeToCartChanges,
  type CartItem,
} from "@/service/cartService";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function CartContents() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    function loadCart() {
      try {
        setItems(getCartItems());
        setError("");
      } catch {
        setError("Keranjang tidak dapat dimuat. Data penyimpanan tidak valid.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
    return subscribeToCartChanges(loadCart);
  }, []);

  function updateCart(action: () => void) {
    try {
      action();
      setItems(getCartItems());
      setError("");
    } catch {
      setError("Perubahan keranjang gagal disimpan. Silakan coba lagi.");
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (isLoading) {
    return <p className="py-12 text-center text-slate-600">Memuat keranjang...</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <section aria-label="Barang di keranjang" className="space-y-4">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">Keranjangmu masih kosong.</p>
            <Link
              href="/#produk"
              className="mt-5 inline-flex rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800"
            >
              Lihat produk
            </Link>
          </div>
        ) : (
          items.map((item) => {
            const imageUrl = getProductImageUrl(item.image_path);
            return (
              <article
                key={item.id}
                className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={`Foto ${item.name}`}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-slate-900">
                    <Link
                      href={`/barangDipilih/${item.id}`}
                      className="hover:text-cyan-800"
                    >
                      {item.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {currencyFormatter.format(item.price)} per barang
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button
                      type="button"
                      aria-label={`Kurangi jumlah ${item.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateCart(() =>
                          setCartItemQuantity(item.id, item.quantity - 1),
                        )
                      }
                      className="px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>
                    <span
                      aria-label={`Jumlah ${item.name}`}
                      className="min-w-10 text-center text-sm font-medium"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Tambah jumlah ${item.name}`}
                      onClick={() =>
                        updateCart(() =>
                          setCartItemQuantity(item.id, item.quantity + 1),
                        )
                      }
                      className="px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                  <p className="min-w-32 text-right font-semibold text-cyan-800">
                    {currencyFormatter.format(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => updateCart(() => removeFromCart(item.id))}
                    className="text-sm font-medium text-red-700 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Ringkasan</h2>
        <div className="mt-5 flex justify-between gap-4 text-sm text-slate-600">
          <span>Total barang</span>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="mt-4 flex justify-between gap-4 border-t border-slate-200 pt-4 font-semibold text-slate-900">
          <span>Total belanja</span>
          <span>{currencyFormatter.format(total)}</span>
        </div>
      </aside>
    </div>
  );
}
