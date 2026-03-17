import type { Product } from "@/data/products";

const PRODUCT_KEYWORDS = [
  "pomme",
  "banane",
  "tomate",
  "carotte",
  "fraise",
  "orange",
  "courgette",
  "raisin",
  "brocoli",
  "broccoli",
  "pomme de terre",
  "patate",
  "lait",
  "avoine",
  "nutella",
  "tartiner",
  "coca",
  "cola",
  "eau",
  "poulet",
  "steak",
  "boeuf",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getPrimaryProductKeyword(text: string) {
  const normalized = normalize(text);
  return PRODUCT_KEYWORDS.find((keyword) => normalized.includes(keyword)) ?? null;
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

export function findRecommendedAlternative(
  target: Pick<Product, "id" | "name" | "brand" | "category" | "ecoScore" | "alternatives">,
  products: Product[]
) {
  const targetKeyword = getPrimaryProductKeyword(target.name);

  const explicitAlternatives = products
    .filter((product) => {
      if (!target.alternatives?.includes(product.id) || product.ecoScore <= target.ecoScore) {
        return false;
      }
      if (!targetKeyword) {
        return true;
      }
      return getPrimaryProductKeyword(product.name) === targetKeyword;
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

      if (targetKeyword) {
        return getPrimaryProductKeyword(product.name) === targetKeyword;
      }

      return true;
    })
    .map((product) => ({
      product,
      similarity: getSimilarityScore(target, product),
    }))
    .filter((entry) => entry.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity || b.product.ecoScore - a.product.ecoScore);

  return candidates[0]?.product ?? null;
}
