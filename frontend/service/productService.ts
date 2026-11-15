const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number | null;
  category: ProductCategory | null;
  image_path: string | null;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getCollection(result: unknown): unknown[] {
  if (Array.isArray(result)) {
    return result;
  }

  if (isRecord(result) && Array.isArray(result.data)) {
    return result.data;
  }

  throw new Error("Format data dari API tidak sesuai");
}

function normalizeCategory(value: unknown): ProductCategory | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    throw new Error("Format kategori dari API tidak sesuai");
  }

  const id = Number(value.id);
  if (!Number.isInteger(id) || typeof value.name !== "string") {
    throw new Error("Format kategori dari API tidak sesuai");
  }

  return {
    id,
    name: value.name,
    description:
      typeof value.description === "string" ? value.description : null,
  };
}

function normalizeProduct(value: unknown): Product {
  if (!isRecord(value)) {
    throw new Error("Format produk dari API tidak sesuai");
  }

  const id = Number(value.id);
  const price = Number(value.price ?? value.harga);
  const stock = Number(value.stock);
  const description = value.description;
  const categoryId =
    value.category_id === null || value.category_id === undefined
      ? null
      : Number(value.category_id);
  const imagePath = value.image_path;

  if (
    !Number.isInteger(id) ||
    typeof value.name !== "string" ||
    (description !== null &&
      description !== undefined &&
      typeof description !== "string") ||
    !Number.isFinite(price) ||
    !Number.isInteger(stock) ||
    (categoryId !== null && !Number.isInteger(categoryId)) ||
    (imagePath !== null &&
      imagePath !== undefined &&
      typeof imagePath !== "string")
  ) {
    throw new Error("Format produk dari API tidak sesuai");
  }

  return {
    id,
    name: value.name,
    description: typeof description === "string" ? description : null,
    price,
    stock,
    category_id: categoryId,
    category: normalizeCategory(value.category),
    image_path: typeof imagePath === "string" ? imagePath : null,
  };
}

async function getApiResponse(path: string): Promise<unknown> {
  if (!API_URL) {
    throw new Error("Alamat API belum dikonfigurasi");
  }

  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data dari API");
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const products = getCollection(await getApiResponse("/products"));
  return products.map(normalizeProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!API_URL) {
    throw new Error("Alamat API belum dikonfigurasi");
  }

  const response = await fetch(`${API_URL}/products/${id}`);
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Gagal mengambil detail produk");
  }

  return normalizeProduct(await response.json());
}

export async function getCategories(): Promise<ProductCategory[]> {
  const categories = getCollection(await getApiResponse("/categories"));
  return categories.map((category) => {
    const normalized = normalizeCategory(category);
    if (!normalized) {
      throw new Error("Format kategori dari API tidak sesuai");
    }

    return normalized;
  });
}

export function getProductImageUrl(imagePath: string | null | undefined) {
  if (!API_URL || !imagePath) {
    return null;
  }

  const apiBaseUrl = API_URL.replace(/\/api\/?$/, "");
  const encodedPath = imagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${apiBaseUrl}/storage/${encodedPath}`;
}
