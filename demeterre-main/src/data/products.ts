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
  ecoScore: number; // 0-100
  carbonFootprint: number; // kg CO2
  waterUsage: number; // litres
  pesticides: { level: "none" | "low" | "medium" | "high"; region: string };
  packaging: string;
  origin: string;
  alternatives?: string[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Lait Demi-Écrémé",
    brand: "Lactel",
    category: "Produits laitiers",
    barcode: "3428574291038",
    image: "🥛",
    ecoScore: 42,
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
    category: "Boissons végétales",
    barcode: "7394376616242",
    image: "🌾",
    ecoScore: 82,
    carbonFootprint: 0.3,
    waterUsage: 48,
    pesticides: { level: "none", region: "Suède" },
    packaging: "Brique carton recyclable",
    origin: "Suède",
  },
  {
    id: "3",
    name: "Nutella",
    brand: "Ferrero",
    category: "Pâtes à tartiner",
    barcode: "3017620422003",
    image: "🍫",
    ecoScore: 25,
    carbonFootprint: 4.2,
    waterUsage: 1240,
    pesticides: { level: "high", region: "Indonésie / Turquie" },
    packaging: "Pot en verre + couvercle plastique",
    origin: "France (ingrédients importés)",
    alternatives: ["4"],
  },
  {
    id: "4",
    name: "Pâte à tartiner Nocciolata Bio",
    brand: "Rigoni di Asiago",
    category: "Pâtes à tartiner",
    barcode: "8001505000252",
    image: "🌰",
    ecoScore: 68,
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
    image: "🥤",
    ecoScore: 18,
    carbonFootprint: 3.5,
    waterUsage: 1890,
    pesticides: { level: "none", region: "N/A" },
    packaging: "Bouteille plastique PET",
    origin: "France",
    alternatives: ["6"],
  },
  {
    id: "6",
    name: "Eau Pétillante Bio",
    brand: "Badoit",
    category: "Boissons",
    barcode: "3179732340225",
    image: "💧",
    ecoScore: 55,
    carbonFootprint: 0.2,
    waterUsage: 3,
    pesticides: { level: "none", region: "N/A" },
    packaging: "Bouteille verre",
    origin: "France",
  },
];

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
  if (score >= 40) return "Moyen";
  if (score >= 20) return "Médiocre";
  return "Mauvais";
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
    case "medium": return "Modéré";
    case "high": return "Élevé";
    default: return "Inconnu";
  }
}
