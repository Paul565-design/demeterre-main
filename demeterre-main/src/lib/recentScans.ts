import type { Product } from "@/data/products";
import type { OFFProduct } from "@/lib/openfoodfacts";

const RECENT_SCANS_KEY = "recent_scanned_products";
const MAX_RECENT_SCANS = 12;

function toRecentProduct(product: OFFProduct): Product {
  return {
    id: product.barcode,
    name: product.name,
    brand: product.brand,
    category: product.category,
    barcode: product.barcode,
    image: "📦",
    ecoScore: product.ecoScore,
    carbonFootprint: product.carbonFootprint,
    waterUsage: product.waterUsage,
    pesticides: product.pesticides,
    packaging: product.packaging,
    origin: product.origin,
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
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentScannedProduct(product: OFFProduct) {
  if (typeof window === "undefined") {
    return;
  }

  const recentProduct = toRecentProduct(product);
  const deduped = getRecentScannedProducts().filter((item) => item.barcode !== recentProduct.barcode);
  const next = [recentProduct, ...deduped].slice(0, MAX_RECENT_SCANS);
  window.localStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(next));
}
