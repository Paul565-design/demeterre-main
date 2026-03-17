import type { Product } from "@/data/products";
import { calculateCompositeEcoScore } from "@/lib/productScoring";

type RecommendationTarget = Pick<
  Product,
  "id" | "name" | "brand" | "category" | "ecoScore" | "alternatives" | "carbonFootprint" | "waterUsage" | "pesticides" | "packaging" | "origin"
>;

const PRODUCT_GROUPS = [
  { group: "pomme_de_terre", keywords: ["pomme de terre", "pommes de terre", "patate", "patates"] },
  { group: "pomme", keywords: ["pomme", "pommes"] },
  { group: "banane", keywords: ["banane"] },
  { group: "tomate", keywords: ["tomate"] },
  { group: "carotte", keywords: ["carotte"] },
  { group: "fraise", keywords: ["fraise"] },
  { group: "orange", keywords: ["orange"] },
  { group: "courgette", keywords: ["courgette"] },
  { group: "raisin", keywords: ["raisin"] },
  { group: "brocoli", keywords: ["brocoli", "broccoli"] },
  { group: "lait", keywords: ["lait", "avoine"] },
  { group: "tartiner", keywords: ["nutella", "tartiner", "nocciolata"] },
  { group: "boisson_sucree", keywords: ["coca", "cola", "soda"] },
  { group: "eau", keywords: ["eau"] },
  { group: "volaille", keywords: ["poulet", "dinde", "volaille"] },
  { group: "steak", keywords: ["steak", "boeuf", "hache"] },
  { group: "vegetal", keywords: ["vegetal", "veggie", "boulettes"] },
];

const GROUP_EMOJIS: Record<string, string> = {
  pomme: "🍎",
  banane: "🍌",
  tomate: "🍅",
  carotte: "🥕",
  fraise: "🍓",
  orange: "🍊",
  courgette: "🥒",
  raisin: "🍇",
  brocoli: "🥦",
  pomme_de_terre: "🥔",
  lait: "🥛",
  tartiner: "🌰",
  boisson_sucree: "🥤",
  eau: "💧",
  volaille: "🍗",
  steak: "🥩",
  vegetal: "🌿",
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getProductGroup(text: string) {
  const normalized = normalize(text);
  for (const { group, keywords } of PRODUCT_GROUPS) {
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    for (const keyword of sortedKeywords) {
      const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(keyword)}([^a-z0-9]|$)`, "i");
      if (pattern.test(normalized)) {
        return group;
      }
    }
  }
  return null;
}

function getCategoryFamily(category: string) {
  const normalized = normalize(category);

  if (normalized.includes("viande") || normalized.includes("meat") || normalized.includes("boeuf") || normalized.includes("poulet")) {
    return "viande";
  }
  if (normalized.includes("lait") || normalized.includes("vegetal")) {
    return "lait";
  }
  if (normalized.includes("boisson") || normalized.includes("eau") || normalized.includes("soda")) {
    return "boisson";
  }
  if (normalized.includes("tartiner") || normalized.includes("pate")) {
    return "tartiner";
  }
  if (normalized.includes("fruit")) {
    return "fruit";
  }
  if (normalized.includes("legume")) {
    return "legume";
  }

  return normalized;
}

function getTokens(text: string) {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function getSimilarityScore(target: Pick<Product, "name" | "brand" | "category">, candidate: Product) {
  const targetNameTokens = getTokens(target.name);
  const candidateNameTokens = new Set(getTokens(candidate.name));
  const nameMatches = targetNameTokens.filter((token) => candidateNameTokens.has(token)).length;

  const sameBrand = normalize(target.brand) === normalize(candidate.brand) ? 1 : 0;
  const sameFamily = getCategoryFamily(target.category) === getCategoryFamily(candidate.category) ? 3 : 0;
  const sameCategory = normalize(target.category) === normalize(candidate.category) ? 2 : 0;

  return nameMatches * 2 + sameBrand + sameFamily + sameCategory;
}

function buildGeneratedRecommendation(target: RecommendationTarget) {
  const group = getProductGroup(target.name) ?? getCategoryFamily(target.category);
  const image = GROUP_EMOJIS[group] ?? "🌿";

  const improvedCarbon = Math.max(0.12, Math.round(target.carbonFootprint * 0.45 * 100) / 100);
  const improvedWater = Math.max(10, Math.round(target.waterUsage * 0.45));
  const generatedPesticides = { level: "none" as const, region: target.origin.includes("France") ? "France" : "Europe" };
  const generatedPackaging = "Emballage recyclable";
  const generatedOrigin = target.origin.includes("France") ? "France" : "Europe";

  const generatedScore = calculateCompositeEcoScore({
    category: target.category,
    carbonFootprint: improvedCarbon,
    waterUsage: improvedWater,
    pesticides: generatedPesticides,
    packaging: generatedPackaging,
    origin: generatedOrigin,
  }).finalScore;

  return {
    id: `generated-${normalize(target.name).replace(/[^a-z0-9]+/g, "-")}`,
    name: `${target.name} - alternative recommandee`,
    brand: "Selection Demeterre",
    category: target.category,
    barcode: `generated-${target.id}`,
    image,
    ecoScore: Math.max(generatedScore, target.ecoScore + 8),
    carbonFootprint: improvedCarbon,
    waterUsage: improvedWater,
    pesticides: generatedPesticides,
    packaging: generatedPackaging,
    origin: generatedOrigin,
  } satisfies Product;
}

export function findRecommendedAlternative(target: RecommendationTarget, products: Product[]) {
  const targetGroup = getProductGroup(target.name);

  const explicitAlternatives = products
    .filter((product) => {
      if (!target.alternatives?.includes(product.id) || product.ecoScore <= target.ecoScore) {
        return false;
      }
      if (!targetGroup) {
        return true;
      }
      return getProductGroup(product.name) === targetGroup;
    })
    .sort((a, b) => b.ecoScore - a.ecoScore);

  if (explicitAlternatives.length > 0) {
    return explicitAlternatives[0];
  }

  const candidates = products
    .filter((product) => {
      if (product.id === target.id || product.ecoScore <= target.ecoScore) {
        return false;
      }

      if (targetGroup) {
        return getProductGroup(product.name) === targetGroup;
      }

      return getCategoryFamily(product.category) === getCategoryFamily(target.category);
    })
    .map((product) => ({
      product,
      similarity: getSimilarityScore(target, product),
    }))
    .sort((a, b) => b.similarity - a.similarity || b.product.ecoScore - a.product.ecoScore);

  if (candidates.length > 0) {
    return candidates[0].product;
  }

  return buildGeneratedRecommendation(target);
}
