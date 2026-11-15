import type { Product } from "@/service/productService";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number | null;
  image?: File | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function sendProductRequest(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  token: string,
  product?: ProductInput,
): Promise<void> {
  if (!API_URL) {
    throw new Error("Alamat API belum dikonfigurasi");
  }

  const formData = product ? new FormData() : null;
  if (formData && product) {
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", String(product.price));
    formData.append("stock", String(product.stock));
    formData.append(
      "category_id",
      product.category_id === null ? "" : String(product.category_id),
    );
    if (product.image) {
      formData.append("image", product.image);
    }
    if (method === "PUT") {
      formData.append("_method", "PUT");
    }
  }

  const requestMethod = method === "PUT" ? "POST" : method;
  const response = await fetch(`${API_URL}${path}`, {
    method: requestMethod,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(formData ? { body: formData } : {}),
  });
  const result: unknown = await response.json();

  if (!response.ok) {
    const errorMessages =
      isRecord(result) && isRecord(result.errors)
        ? Object.values(result.errors)
            .flatMap((messages) => (Array.isArray(messages) ? messages : []))
            .filter((message): message is string => typeof message === "string")
            .join(" ")
        : "";
    const message =
      errorMessages ||
      (isRecord(result) && typeof result.message === "string"
        ? result.message
        : "Permintaan produk gagal.");

    throw new Error(message);
  }
}

export function createProduct(product: ProductInput, token: string) {
  return sendProductRequest("/products", "POST", token, product);
}

export function updateProduct(
  id: Product["id"],
  product: ProductInput,
  token: string,
) {
  return sendProductRequest(`/products/${id}`, "PUT", token, product);
}

export function deleteProduct(id: Product["id"], token: string) {
  return sendProductRequest(`/products/${id}`, "DELETE", token);
}
