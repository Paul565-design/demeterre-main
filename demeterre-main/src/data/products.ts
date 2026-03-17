import { calculateCompositeEcoScore } from "@/lib/productScoring";

export interface EcoMetric {
  label: string;
  value: number;
  unit: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  image: string;
  ecoScore: number;
  carbonFootprint: number;
  waterUsage: number;
  pesticides: { level: "none" | "low" | "medium" | "high"; region: string };
  packaging: string;
  origin: string;
  alternatives?: string[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Lait Demi-Ã‰crÃ©mÃ©",
    brand: "Lactel",
    category: "Produits laitiers",
    barcode: "3428574291038",
    image: "ðŸ¥›",
    ecoScore: 0,
    carbonFootprint: 1.4,
    waterUsage: 628,
    pesticides: { level: "low", region: "Bretagne" },
    packaging: "Brique carton",
    origin: "France",
    alternatives: ["2"],
  },
  {
    id: "2",
    name: "Lait d'Avoine Bio",
    brand: "Oatly",
    category: "Boissons vÃ©gÃ©tales",
    barcode: "7394376616242",
    image: "ðŸŒ¾",
    ecoScore: 0,
    carbonFootprint: 0.3,
    waterUsage: 48,
    pesticides: { level: "none", region: "SuÃ¨de" },
    packaging: "Brique carton recyclable",
    origin: "SuÃ¨de",
  },
  {
    id: "3",
    name: "Nutella",
    brand: "Ferrero",
    category: "PÃ¢tes Ã  tartiner",
    barcode: "3017620422003",
    image: "ðŸ«",
    ecoScore: 0,
    carbonFootprint: 4.2,
    waterUsage: 1240,
    pesticides: { level: "high", region: "IndonÃ©sie / Turquie" },
    packaging: "Pot en verre + couvercle plastique",
    origin: "France (ingrÃ©dients importÃ©s)",
    alternatives: ["4"],
  },
  {
    id: "4",
    name: "PÃ¢te Ã  tartiner Nocciolata Bio",
    brand: "Rigoni di Asiago",
    category: "PÃ¢tes Ã  tartiner",
    barcode: "8001505000252",
    image: "ðŸŒ°",
    ecoScore: 0,
    carbonFootprint: 2.1,
    waterUsage: 680,
    pesticides: { level: "none", region: "Italie" },
    packaging: "Pot en verre recyclable",
    origin: "Italie",
  },
  {
    id: "5",
    name: "Coca-Cola Original",
    brand: "Coca-Cola",
    category: "Boissons",
    barcode: "5449000000996",
    image: "ðŸ¥¤",
    ecoScore: 0,
    carbonFootprint: 3.5,
    waterUsage: 1890,
    pesticides: { level: "none", region: "N/A" },
    packaging: "Bouteille plastique PET",
    origin: "France",
    alternatives: ["6"],
  },
  {
    id: "6",
    name: "Eau PÃ©tillante Bio",
    brand: "Badoit",
    category: "Boissons",
    barcode: "3179732340225",
    image: "ðŸ’§",
    ecoScore: 0,
    carbonFootprint: 0.2,
    waterUsage: 3,
    pesticides: { level: "none", region: "N/A" },
    packaging: "Bouteille verre",
    origin: "France",
  },
];

for (const product of mockProducts) {
  product.ecoScore = calculateCompositeEcoScore({
    category: product.category,
    carbonFootprint: product.carbonFootprint,
    waterUsage: product.waterUsage,
    pesticides: product.pesticides,
    packaging: product.packaging,
    origin: product.origin,
  }).finalScore;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-eco-excellent";
  if (score >= 60) return "text-eco-good";
  if (score >= 40) return "text-eco-average";
  if (score >= 20) return "text-eco-poor";
  return "text-eco-bad";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-eco-excellent";
  if (score >= 60) return "bg-eco-good";
  if (score >= 40) return "bg-eco-average";
  if (score >= 20) return "bg-eco-poor";
  return "bg-eco-bad";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "MÃ©diocre";
  if (score >= 20) return "Mauvais";
  return "Tres mauvais";
}

export function getPesticideColor(level: string): string {
  switch (level) {
    case "none": return "text-eco-excellent";
    case "low": return "text-eco-good";
    case "medium": return "text-eco-average";
    case "high": return "text-eco-bad";
    default: return "text-muted-foreground";
  }
}

export function getPesticideLabel(level: string): string {
  switch (level) {
    case "none": return "Aucun";
    case "low": return "Faible";
    case "medium": return "ModÃ©rÃ©";
    case "high": return "Ã‰levÃ©";
    default: return "Inconnu";
  }
}
