import type { Product } from "@/data/products";
import { fetchProductByBarcode, type OFFProduct } from "@/lib/openfoodfacts";
import { calculateCompositeEcoScore } from "@/lib/productScoring";
import { getProductEmoji } from "@/lib/productVisuals";

const RECENT_SCANS_KEY = "recent_scanned_products";
const MAX_RECENT_SCANS = 12;
export const RECENT_SCANS_UPDATED_EVENT = "demeterre-recent-scans-updated";

function toRecentProduct(product: OFFProduct): Product {
  return {
    id: product.barcode,
    name: product.name,
    brand: product.brand,
    category: product.category,
    barcode: product.barcode,
    image: getProductEmoji(product.name, product.category),
    imageUrl: product.imageUrl,
    quantityGrams: product.quantityGrams,
    ecoScore: product.ecoScore,
    carbonFootprint: product.carbonFootprint,
    waterUsage: product.waterUsage,
    pesticides: product.pesticides,
    packaging: product.packaging,
    origin: product.origin,
  };
}

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

export function getRecentScannedProducts(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SCANS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalized = parsed.map((item) => normalizeStoredProduct(item as Product));
    window.localStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return [];
  }
}

export async function hydrateRecentScannedProducts() {
  const products = getRecentScannedProducts();
  let changed = false;

  const hydrated = await Promise.all(
    products.map(async (product) => {
      if (product.imageUrl || !product.barcode) {
        return product;
      }

      const freshProduct = await fetchProductByBarcode(product.barcode);
      if (!freshProduct?.imageUrl) {
        return product;
      }

      changed = true;
      return {
        ...product,
        imageUrl: freshProduct.imageUrl,
      };
    })
  );

  if (changed && typeof window !== "undefined") {
    window.localStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(hydrated));
    window.dispatchEvent(new Event(RECENT_SCANS_UPDATED_EVENT));
  }

  return hydrated;
}

export function saveRecentScannedProduct(product: OFFProduct) {
  if (typeof window === "undefined") {
    return;
  }

  const recentProduct = toRecentProduct(product);
  const deduped = getRecentScannedProducts().filter((item) => item.barcode !== recentProduct.barcode);
  const next = [recentProduct, ...deduped].slice(0, MAX_RECENT_SCANS);
  window.localStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(RECENT_SCANS_UPDATED_EVENT));
}
