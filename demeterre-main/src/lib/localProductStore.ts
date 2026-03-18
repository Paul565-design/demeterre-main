import type { Product } from "@/data/products";
import { calculateCompositeEcoScore } from "@/lib/productScoring";
import { getProductEmoji } from "@/lib/productVisuals";
import type { OFFProduct } from "@/lib/openfoodfacts";

const LOCAL_PRODUCT_DB_KEY = "demeterre-local-product-db";
const RECENT_SCANS_KEY = "recent_scanned_products";
const MAX_RECENT_SCANS = 12;
export const RECENT_SCANS_UPDATED_EVENT = "demeterre-recent-scans-updated";

function toStoredProduct(product: OFFProduct): Product {
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
    id: product.barcode || product.id,
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

function readLocalProductsMap(): Record<string, Product> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_PRODUCT_DB_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const normalizedEntries = Object.entries(parsed).map(([barcode, product]) => [
      barcode,
      normalizeStoredProduct(product as Product),
    ]);

    const normalizedMap = Object.fromEntries(normalizedEntries);
    window.localStorage.setItem(LOCAL_PRODUCT_DB_KEY, JSON.stringify(normalizedMap));
    return normalizedMap;
  } catch {
    return {};
  }
}

function writeLocalProductsMap(productsByBarcode: Record<string, Product>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_PRODUCT_DB_KEY, JSON.stringify(productsByBarcode));
}

function readRecentProducts(): Product[] {
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

function writeRecentProducts(products: Product[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(RECENT_SCANS_UPDATED_EVENT));
}

export function saveProductToLocalStore(product: OFFProduct) {
  if (typeof window === "undefined" || !product.barcode) {
    return;
  }

  const storedProduct = toStoredProduct(product);
  const productsByBarcode = readLocalProductsMap();

  productsByBarcode[storedProduct.barcode] = storedProduct;
  writeLocalProductsMap(productsByBarcode);
}

export function getStoredProductByBarcode(barcode: string): OFFProduct | null {
  if (!barcode.trim()) {
    return null;
  }

  const product = readLocalProductsMap()[barcode.trim()];
  if (!product) {
    return null;
  }

  return toOFFProduct(product);
}

export function searchStoredProducts(query: string): OFFProduct[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) {
    return [];
  }

  return Object.values(readLocalProductsMap())
    .filter((product) => {
      const haystack = [product.name, product.brand, product.category, product.barcode].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, 20)
    .map((product) => toOFFProduct(product));
}

function toOFFProduct(product: Product): OFFProduct {
  const normalized = normalizeStoredProduct(product);

  return {
    id: normalized.barcode || normalized.id,
    name: normalized.name,
    brand: normalized.brand,
    category: normalized.category,
    barcode: normalized.barcode,
    imageUrl: normalized.imageUrl || "",
    quantityGrams: normalized.quantityGrams,
    ecoScore: normalized.ecoScore,
    ecoScoreGrade: "unknown",
    carbonFootprint: normalized.carbonFootprint,
    waterUsage: normalized.waterUsage,
    pesticides: normalized.pesticides,
    packaging: normalized.packaging,
    origin: normalized.origin,
    nutriscoreGrade: "unknown",
    novaGroup: 0,
  };
}

export function getRecentScannedProducts(): Product[] {
  return readRecentProducts();
}

export function saveRecentScannedProduct(product: OFFProduct) {
  if (typeof window === "undefined" || !product.barcode) {
    return;
  }

  saveProductToLocalStore(product);

  const recentProduct = toStoredProduct(product);
  const deduped = readRecentProducts().filter((item) => item.barcode !== recentProduct.barcode);
  const next = [recentProduct, ...deduped].slice(0, MAX_RECENT_SCANS);
  writeRecentProducts(next);
}
