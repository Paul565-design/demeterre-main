import { calculateCompositeEcoScore } from "@/lib/productScoring";
import { getStoredProductByBarcode, saveProductToLocalStore, searchStoredProducts } from "@/lib/localProductStore";

const OFF_API = "https://world.openfoodfacts.org/api/v2";
const OFF_TIMEOUT_MS = 8000;

export interface OFFProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  imageUrl: string;
  quantityGrams?: number;
  ecoScore: number;
  ecoScoreGrade: string;
  carbonFootprint: number;
  waterUsage: number;
  pesticides: { level: "none" | "low" | "medium" | "high"; region: string };
  packaging: string;
  origin: string;
  nutriscoreGrade: string;
  novaGroup: number;
}

function estimateWaterUsage(categories: string): number {
  const cat = (categories || "").toLowerCase();
  if (cat.includes("viande") || cat.includes("meat") || cat.includes("beef")) return 1500;
  if (cat.includes("lait") || cat.includes("milk") || cat.includes("dairy")) return 600;
  if (cat.includes("chocolat") || cat.includes("chocolate") || cat.includes("cacao")) return 1200;
  if (cat.includes("cafÃ©") || cat.includes("coffee")) return 1100;
  if (cat.includes("jus") || cat.includes("juice") || cat.includes("boisson") || cat.includes("beverage")) return 200;
  if (cat.includes("lÃ©gume") || cat.includes("vegetable")) return 100;
  if (cat.includes("fruit")) return 180;
  if (cat.includes("cÃ©rÃ©ale") || cat.includes("cereal") || cat.includes("bread") || cat.includes("pain")) return 300;
  return 250;
}

function estimatePesticideLevel(labels: string, categories: string): "none" | "low" | "medium" | "high" {
  const l = (labels || "").toLowerCase();
  if (l.includes("bio") || l.includes("organic")) return "none";
  const cat = (categories || "").toLowerCase();
  if (cat.includes("fruit") || cat.includes("lÃ©gume") || cat.includes("vegetable")) return "medium";
  if (cat.includes("cÃ©rÃ©ale") || cat.includes("cereal")) return "low";
  return "low";
}

function parseQuantityToGrams(quantityText: string | undefined, quantityValue: unknown, quantityUnit: unknown) {
  if (typeof quantityValue === "number" && Number.isFinite(quantityValue)) {
    const unit = typeof quantityUnit === "string" ? quantityUnit.toLowerCase().trim() : "";

    if (unit === "kg") return Math.round(quantityValue * 1000);
    if (unit === "g" || unit === "") return Math.round(quantityValue);
    if (unit === "mg") return Math.round(quantityValue / 1000);
  }

  const normalized = (quantityText || "").toLowerCase().replace(",", ".").trim();
  if (!normalized) {
    return undefined;
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(kg|g|mg)\b/);
  if (!match) {
    return undefined;
  }

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) {
    return undefined;
  }

  if (match[2] === "kg") return Math.round(value * 1000);
  if (match[2] === "mg") return Math.round(value / 1000);
  return Math.round(value);
}

function parseOFFProduct(data: any): OFFProduct {
  const product = data.product || data;
  const categories = product.categories || product.categories_tags?.join(", ") || "";
  const labels = product.labels || "";
  const origins = product.origins || product.origin || product.countries || "Inconnu";
  const category = product.categories?.split(",")[0]?.trim() || "Autre";
  const carbonFootprint = product.ecoscore_data?.agribalyse?.co2_total
    ? Math.round(product.ecoscore_data.agribalyse.co2_total * 100) / 100
    : Math.round((Math.random() * 3 + 0.5) * 10) / 10;
  const waterUsage = estimateWaterUsage(categories);
  const pesticides = {
    level: estimatePesticideLevel(labels, categories),
    region: origins.split(",")[0]?.trim() || "Inconnu",
  } as const;
  const packaging = product.packaging || "Non renseignÃ©";
  const origin = origins.split(",")[0]?.trim() || "Inconnu";
  const quantityGrams = parseQuantityToGrams(product.quantity, product.product_quantity, product.product_quantity_unit);
  const { finalScore } = calculateCompositeEcoScore({
    category,
    carbonFootprint,
    quantityGrams,
    waterUsage,
    pesticides: { ...pesticides },
    packaging,
    origin,
  });

  return {
    id: product.code || product._id || "",
    name: product.product_name_fr || product.product_name || "Produit inconnu",
    brand: product.brands || "Marque inconnue",
    category,
    barcode: product.code || "",
    imageUrl: product.image_front_url || product.image_url || "",
    quantityGrams,
    ecoScore: finalScore,
    ecoScoreGrade: product.ecoscore_grade || "unknown",
    carbonFootprint,
    waterUsage,
    pesticides: { ...pesticides },
    packaging,
    origin,
    nutriscoreGrade: product.nutriscore_grade || "unknown",
    novaGroup: product.nova_group || 0,
  };
}

async function fetchOFF(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OFF_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  try {
    const res = await fetchOFF(`${OFF_API}/product/${barcode}?fields=code,product_name,product_name_fr,brands,categories,categories_tags,labels,origins,origin,countries,packaging,quantity,product_quantity,product_quantity_unit,image_front_url,image_url,ecoscore_grade,ecoscore_data,nutriscore_grade,nova_group`);
    const data = await res.json();
    if (data.status === 0) return null;
    const product = parseOFFProduct(data);
    saveProductToLocalStore(product);
    return product;
  } catch {
    return getStoredProductByBarcode(barcode);
  }
}

export async function searchProducts(query: string, page = 1): Promise<{ products: OFFProduct[]; count: number }> {
  try {
    const res = await fetchOFF(
      `${OFF_API}/search?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page=${page}&page_size=20&fields=code,product_name,product_name_fr,brands,categories,categories_tags,labels,origins,origin,countries,packaging,quantity,product_quantity,product_quantity_unit,image_front_url,image_url,ecoscore_grade,ecoscore_data,nutriscore_grade,nova_group&lc=fr&cc=fr`
    );
    const data = await res.json();
    return {
      products: (data.products || [])
        .filter((p: any) => p.product_name || p.product_name_fr)
        .map((p: any) => parseOFFProduct({ product: p })),
      count: data.count || 0,
    };
  } catch {
    const localProducts = searchStoredProducts(query);
    return { products: localProducts, count: localProducts.length };
  }
}
