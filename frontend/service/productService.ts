// Alamat dasar API dibaca dari konfigurasi lingkungan frontend.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Bentuk data produk yang digunakan oleh frontend.
export interface Product {
  id: number;
  name: string;
  price: number;
}

// Mengambil daftar produk dan melempar error jika server memberi respons gagal.
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data produk");
  }

  const result = await response.json();

  // Memastikan respons API berbentuk Array.
  if (Array.isArray(result)) {
    return result;
  }

  // Mengantisipasi respons Laravel yang menggunakan data.
  if (Array.isArray(result.data)) {
    return result.data;
  }

  throw new Error("Format data produk dari API tidak sesuai");
}
