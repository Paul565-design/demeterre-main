export type PesticideLevel = "none" | "low" | "medium" | "high";

export type ScoreableProduct = {
  category: string;
  carbonFootprint: number;
  waterUsage: number;
  pesticides: {
    level: PesticideLevel;
    region: string;
  };
  packaging: string;
  origin: string;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function scoreFromRange(value: number, best: number, worst: number) {
  if (value <= best) {
    return 100;
  }
  if (value >= worst) {
    return 0;
  }

  const ratio = (value - best) / (worst - best);
  return clamp(Math.round((1 - ratio) * 100));
}

function getCategoryBenchmarks(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("viande") || normalized.includes("meat") || normalized.includes("beef")) {
    return { carbonBest: 2, carbonWorst: 30, waterBest: 400, waterWorst: 1800 };
  }
  if (normalized.includes("lait") || normalized.includes("dairy")) {
    return { carbonBest: 0.2, carbonWorst: 3, waterBest: 40, waterWorst: 700 };
  }
  if (normalized.includes("boisson") || normalized.includes("beverage")) {
    return { carbonBest: 0.05, carbonWorst: 4, waterBest: 3, waterWorst: 2000 };
  }
  if (normalized.includes("tartiner") || normalized.includes("chocol")) {
    return { carbonBest: 0.5, carbonWorst: 5, waterBest: 150, waterWorst: 1400 };
  }
  if (normalized.includes("fruit")) {
    return { carbonBest: 0.1, carbonWorst: 1.8, waterBest: 20, waterWorst: 300 };
  }
  if (normalized.includes("legume") || normalized.includes("vegetable")) {
    return { carbonBest: 0.1, carbonWorst: 1.5, waterBest: 15, waterWorst: 180 };
  }

  return { carbonBest: 0.2, carbonWorst: 6, waterBest: 20, waterWorst: 800 };
}

export function getEthicsScore(origin: string) {
  const normalized = origin.toLowerCase();

  if (normalized.includes("france")) return 75;
  if (
    normalized.includes("italie") ||
    normalized.includes("suede") ||
    normalized.includes("allemagne") ||
    normalized.includes("belgique")
  ) {
    return 68;
  }
  if (normalized.includes("espagne") || normalized.includes("portugal") || normalized.includes("europe")) {
    return 62;
  }
  if (normalized.includes("maroc") || normalized.includes("turquie")) {
    return 52;
  }
  return 45;
}

export function getPackagingScore(packaging: string) {
  const normalized = packaging.toLowerCase();

  if (normalized.includes("recyclable")) return 88;
  if (normalized.includes("carton")) return 80;
  if (normalized.includes("verre")) return 72;
  if (normalized.includes("sous-vide")) return 42;
  if (normalized.includes("plastique") && normalized.includes("barquette")) return 25;
  if (normalized.includes("plastique")) return 32;
  if (normalized.includes("non renseigne")) return 50;
  return 58;
}

export function getPesticideScore(level: PesticideLevel) {
  switch (level) {
    case "none":
      return 100;
    case "low":
      return 75;
    case "medium":
      return 45;
    case "high":
      return 15;
    default:
      return 40;
  }
}

export function calculateCompositeEcoScore(product: ScoreableProduct) {
  const benchmarks = getCategoryBenchmarks(product.category);
  const carbonScore = scoreFromRange(product.carbonFootprint, benchmarks.carbonBest, benchmarks.carbonWorst);
  const waterScore = scoreFromRange(product.waterUsage, benchmarks.waterBest, benchmarks.waterWorst);
  const pesticideScore = getPesticideScore(product.pesticides.level);
  const ethicsScore = getEthicsScore(product.origin);
  const packagingScore = getPackagingScore(product.packaging);

  const finalScore = Math.round(
    carbonScore * 0.4 +
    waterScore * 0.2 +
    pesticideScore * 0.2 +
    ethicsScore * 0.1 +
    packagingScore * 0.1
  );

  return {
    finalScore,
    subscores: {
      carbonScore,
      waterScore,
      pesticideScore,
      ethicsScore,
      packagingScore,
    },
  };
}
