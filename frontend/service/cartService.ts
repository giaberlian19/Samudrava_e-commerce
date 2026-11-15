import type { Product } from "./productService";

export interface CartItem extends Product {
  quantity: number;
}

const CART_STORAGE_KEY = "samudrava-cart";
export const CART_UPDATED_EVENT = "samudrava-cart-updated";

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    Number.isFinite(item.id) &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
  if (storedItems === null) {
    return [];
  }

  const parsedItems: unknown = JSON.parse(storedItems);
  if (!Array.isArray(parsedItems) || !parsedItems.every(isCartItem)) {
    throw new Error("Data keranjang tidak valid");
  }

  return parsedItems;
}

function saveCartItems(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addToCart(product: Product) {
  const items = getCartItems();
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    items.push({ ...product, quantity: 1 });
  }

  saveCartItems(items);
}

export function setCartItemQuantity(id: number, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Jumlah barang harus minimal satu");
  }

  const items = getCartItems();
  const item = items.find((cartItem) => cartItem.id === id);
  if (!item) {
    throw new Error("Barang tidak ditemukan di keranjang");
  }

  item.quantity = quantity;
  saveCartItems(items);
}

export function removeFromCart(id: number) {
  const items = getCartItems();
  saveCartItems(items.filter((item) => item.id !== id));
}

export function subscribeToCartChanges(callback: () => void) {
  function handleStorageChange(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      callback();
    }
  }

  window.addEventListener(CART_UPDATED_EVENT, callback);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
    window.removeEventListener("storage", handleStorageChange);
  };
}
