import type { Product } from "@/data/products";
import { fetchProductByBarcode } from "@/lib/openfoodfacts";
import { calculateCompositeEcoScore } from "@/lib/productScoring";
import { getProductEmoji } from "@/lib/productVisuals";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = "demeterre_cart";

function normalizeStoredProduct(product: Product): Product {
  return {
    ...product,
    image: product.image || getProductEmoji(product.name, product.category),
    ecoScore: calculateCompositeEcoScore({
      category: product.category,
      carbonFootprint: product.carbonFootprint,
      quantityGrams: product.quantityGrams,
      waterUsage: product.waterUsage,
      pesticides: product.pesticides,
      packaging: product.packaging,
      origin: product.origin,
    }).finalScore,
  };
}

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
    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalized = parsed.map((item) => ({
      ...(item as CartItem),
      product: normalizeStoredProduct((item as CartItem).product),
    }));

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
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

export async function hydrateCartItems() {
  const items = getCartItems();
  let changed = false;

  const hydrated = await Promise.all(
    items.map(async (item) => {
      if (item.product.imageUrl || !item.product.barcode) {
        return item;
      }

      const freshProduct = await fetchProductByBarcode(item.product.barcode);
      if (!freshProduct?.imageUrl) {
        return item;
      }

      changed = true;
      return {
        ...item,
        product: {
          ...item.product,
          imageUrl: freshProduct.imageUrl,
        },
      };
    })
  );

  if (changed) {
    writeCart(hydrated);
  }

  return hydrated;
}
