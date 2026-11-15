"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/service/adminProductService";
import { getAuthAccount, subscribeToAuthChanges } from "@/service/authService";
import {
  getProductImageUrl,
  getCategories,
  getProducts,
  type Product,
  type ProductCategory,
} from "@/service/productService";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  image: File | null;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  image: null,
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan saat mengelola produk.";
}

export default function AdminPage() {
  const router = useRouter();
  const account = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthAccount,
    () => null,
  );
  const token = account?.role === "admin" ? account.token : null;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!account || !account.token) {
      router.replace("/form/login");
      return;
    }

    if (account.role !== "admin") {
      router.replace("/");
    }
  }, [account, router]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    async function loadAdminData() {
      setIsLoading(true);
      try {
        const [loadedProducts, loadedCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (isActive) {
          setProducts(loadedProducts);
          setCategories(loadedCategories);
          setError("");
        }
      } catch (loadError) {
        if (isActive) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadAdminData();
    return () => {
      isActive = false;
    };
  }, [token]);

  async function reloadProducts() {
    const loadedProducts = await getProducts();
    setProducts(loadedProducts);
  }

  function startEditing(product: Product) {
    setImageInputKey((key) => key + 1);
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      stock: String(product.stock),
      categoryId:
        product.category_id === null ? "" : String(product.category_id),
      image: null,
    });
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setEditingProductId(null);
    setForm(emptyForm);
    setImageInputKey((key) => key + 1);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      return;
    }

    const product: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: form.categoryId ? Number(form.categoryId) : null,
      image: form.image,
    };

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingProductId === null) {
        await createProduct(product, token);
        setSuccess("Produk berhasil ditambahkan.");
      } else {
        await updateProduct(editingProductId, product, token);
        setSuccess("Produk berhasil diperbarui.");
      }

      resetForm();
      await reloadProducts();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (
      !token ||
      !window.confirm(`Yakin ingin menghapus produk "${product.name}"?`)
    ) {
      return;
    }

    setDeletingProductId(product.id);
    setError("");
    setSuccess("");

    try {
      await deleteProduct(product.id, token);
      setSuccess("Produk berhasil dihapus.");
      await reloadProducts();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeletingProductId(null);
    }
  }

  const editingProduct = products.find(
    (product) => product.id === editingProductId,
  );
  const editingImageUrl = getProductImageUrl(editingProduct?.image_path);

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <p role="status" className="text-slate-600">
          Memeriksa akses admin...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-700">
          Panel pengelolaan
        </p>
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
          Admin — Kelola produk
        </h1>

        <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {editingProductId === null ? "Tambah produk" : "Edit produk"}
            </h2>
            {editingImageUrl && (
              <Image
                src={editingImageUrl}
                alt={`Foto ${form.name}`}
                width={112}
                height={112}
                unoptimized
                className="h-28 w-28 rounded-lg object-cover"
              />
            )}
            <div>
              <label
                htmlFor="product-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Nama produk
              </label>
              <input
                id="product-name"
                type="text"
                required
                maxLength={255}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-700 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="product-image"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Foto produk
              </label>
              <input
                key={imageInputKey}
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setForm({
                    ...form,
                    image: event.target.files?.[0] ?? null,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-50 file:px-3 file:py-1.5 file:font-semibold file:text-cyan-800"
              />
              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, atau WebP, maksimal 5 MB.
                {editingProductId !== null && " Kosongkan jika tidak diganti."}
              </p>
            </div>
            {form.image && (
              <p className="text-sm text-slate-600">
                Foto dipilih: {form.image.name}
              </p>
            )}
            <div>
              <label
                htmlFor="product-description"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Deskripsi produk
              </label>
              <textarea
                id="product-description"
                required
                maxLength={5000}
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-700 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="product-price"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Harga (Rp)
              </label>
              <input
                id="product-price"
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-700 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="product-stock"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Stok
              </label>
              <input
                id="product-stock"
                type="number"
                required
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) =>
                  setForm({ ...form, stock: event.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-700 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="product-category"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Kategori
              </label>
              <select
                id="product-category"
                value={form.categoryId}
                onChange={(event) =>
                  setForm({ ...form, categoryId: event.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-700 focus:outline-none"
              >
                <option value="">Tanpa kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="text-sm text-green-700">
                {success}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-50"
              >
                {isSaving
                  ? "Menyimpan..."
                  : editingProductId === null
                    ? "Tambah produk"
                    : "Simpan perubahan"}
              </button>
              {editingProductId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          <section
            aria-labelledby="product-list-title"
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-6 py-5">
              <h2
                id="product-list-title"
                className="text-lg font-semibold text-slate-900"
              >
                Daftar produk
              </h2>
            </div>
            {isLoading ? (
              <p role="status" className="p-6 text-slate-600">
                Memuat produk...
              </p>
            ) : products.length === 0 ? (
              <p className="p-6 text-slate-600">Belum ada produk.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Foto
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Produk
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Kategori
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Harga
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Stok
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => {
                      const imageUrl = getProductImageUrl(product.image_path);
                      return (
                        <tr key={product.id}>
                          <td className="px-5 py-4">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={`Foto ${product.name}`}
                                width={48}
                                height={48}
                                unoptimized
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {product.name}
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {product.category?.name ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {currencyFormatter.format(product.price)}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {product.stock}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => startEditing(product)}
                                className="font-semibold text-cyan-800 hover:text-cyan-600"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={deletingProductId === product.id}
                                onClick={() => void handleDelete(product)}
                                className="font-semibold text-red-700 hover:text-red-900 disabled:opacity-50"
                              >
                                {deletingProductId === product.id
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
