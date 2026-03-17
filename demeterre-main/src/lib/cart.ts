import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = "demeterre_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("demeterre-cart-updated"));
}

export function getCartItems() {
  return readCart();
}

export function addProductToCart(product: Product) {
  const items = readCart();
  const existing = items.find((item) => item.product.barcode === product.barcode);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.unshift({ product, quantity: 1 });
  }

  writeCart(items);
}

export function decreaseCartItem(barcode: string) {
  const items = readCart()
    .map((item) =>
      item.product.barcode === barcode ? { ...item, quantity: item.quantity - 1 } : item
    )
    .filter((item) => item.quantity > 0);

  writeCart(items);
}

export function removeCartItem(barcode: string) {
  const items = readCart().filter((item) => item.product.barcode !== barcode);
  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}
