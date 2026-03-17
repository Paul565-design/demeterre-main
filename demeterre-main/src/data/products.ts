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
  imageUrl?: string;
  quantityGrams?: number;
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
    name: "Lait Demi-Ecreme",
    brand: "Lactel",
    category: "Produits laitiers",
    barcode: "3428574291038",
    image: "🥛",
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
    category: "Boissons vegetales",
    barcode: "7394376616242",
    image: "🌾",
    ecoScore: 0,
    carbonFootprint: 0.3,
    waterUsage: 48,
    pesticides: { level: "none", region: "Suede" },
    packaging: "Brique carton recyclable",
    origin: "Suede",
  },
  {
    id: "3",
    name: "Nutella",
    brand: "Ferrero",
    category: "Pates a tartiner",
    barcode: "3017620422003",
    image: "🍫",
    ecoScore: 0,
    carbonFootprint: 4.2,
    waterUsage: 1240,
    pesticides: { level: "high", region: "Indonesie / Turquie" },
    packaging: "Pot en verre + couvercle plastique",
    origin: "France (ingredients importes)",
    alternatives: ["4"],
  },
  {
    id: "4",
    name: "Pate a tartiner Nocciolata Bio",
    brand: "Rigoni di Asiago",
    category: "Pates a tartiner",
    barcode: "8001505000252",
    image: "🌰",
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
    image: "🥤",
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
    name: "Eau Petillante Bio",
    brand: "Badoit",
    category: "Boissons",
    barcode: "3179732340225",
    image: "💧",
    ecoScore: 0,
    carbonFootprint: 0.2,
    waterUsage: 3,
    pesticides: { level: "none", region: "N/A" },
    packaging: "Bouteille verre",
    origin: "France",
  },
  {
    id: "7",
    name: "Pomme Bio de France",
    brand: "Vergers de France",
    category: "Fruits",
    barcode: "2000000000007",
    image: "🍎",
    ecoScore: 0,
    carbonFootprint: 0.22,
    waterUsage: 47,
    pesticides: { level: "low", region: "France" },
    packaging: "Vrac",
    origin: "France",
  },
  {
    id: "8",
    name: "Banane Equitable",
    brand: "Terra Bio",
    category: "Fruits",
    barcode: "2000000000008",
    image: "🍌",
    ecoScore: 0,
    carbonFootprint: 0.52,
    waterUsage: 118,
    pesticides: { level: "low", region: "Equateur" },
    packaging: "Etiquette papier",
    origin: "Equateur",
  },
  {
    id: "9",
    name: "Tomate de Saison France",
    brand: "Maraichage local",
    category: "Legumes",
    barcode: "2000000000009",
    image: "🍅",
    ecoScore: 0,
    carbonFootprint: 0.31,
    waterUsage: 52,
    pesticides: { level: "low", region: "France" },
    packaging: "Vrac",
    origin: "France",
  },
  {
    id: "10",
    name: "Carotte France",
    brand: "Potager local",
    category: "Legumes",
    barcode: "2000000000010",
    image: "🥕",
    ecoScore: 0,
    carbonFootprint: 0.18,
    waterUsage: 31,
    pesticides: { level: "low", region: "France" },
    packaging: "Vrac",
    origin: "France",
  },
  {
    id: "11",
    name: "Fraise France plein champ",
    brand: "Fraises de saison",
    category: "Fruits",
    barcode: "2000000000011",
    image: "🍓",
    ecoScore: 0,
    carbonFootprint: 0.41,
    waterUsage: 74,
    pesticides: { level: "low", region: "France" },
    packaging: "Barquette carton",
    origin: "France",
  },
  {
    id: "12",
    name: "Pomme de terre France",
    brand: "Terroirs de France",
    category: "Legumes",
    barcode: "2000000000012",
    image: "🥔",
    ecoScore: 0,
    carbonFootprint: 0.16,
    waterUsage: 27,
    pesticides: { level: "low", region: "France" },
    packaging: "Sac papier",
    origin: "France",
  },
  {
    id: "13",
    name: "Orange Espagne",
    brand: "Costa Iberica",
    category: "Fruits",
    barcode: "2000000000013",
    image: "🍊",
    ecoScore: 0,
    carbonFootprint: 0.29,
    waterUsage: 66,
    pesticides: { level: "low", region: "Espagne" },
    packaging: "Vrac",
    origin: "Espagne",
  },
  {
    id: "14",
    name: "Courgette France",
    brand: "Maraichage local",
    category: "Legumes",
    barcode: "2000000000014",
    image: "🥒",
    ecoScore: 0,
    carbonFootprint: 0.27,
    waterUsage: 43,
    pesticides: { level: "low", region: "France" },
    packaging: "Vrac",
    origin: "France",
  },
  {
    id: "15",
    name: "Raisin France",
    brand: "Vignobles locaux",
    category: "Fruits",
    barcode: "2000000000015",
    image: "🍇",
    ecoScore: 0,
    carbonFootprint: 0.33,
    waterUsage: 59,
    pesticides: { level: "low", region: "France" },
    packaging: "Barquette carton",
    origin: "France",
  },
  {
    id: "16",
    name: "Brocoli France",
    brand: "Potager local",
    category: "Legumes",
    barcode: "2000000000016",
    image: "🥦",
    ecoScore: 0,
    carbonFootprint: 0.2,
    waterUsage: 35,
    pesticides: { level: "low", region: "France" },
    packaging: "Vrac",
    origin: "France",
  },
  {
    id: "17",
    name: "Filet de Poulet Fermier",
    brand: "Volaille de France",
    category: "Viandes et derives",
    barcode: "2000000000017",
    image: "🍗",
    ecoScore: 0,
    carbonFootprint: 4.1,
    waterUsage: 1200,
    pesticides: { level: "low", region: "France" },
    packaging: "Barquette carton",
    origin: "France",
  },
  {
    id: "18",
    name: "Escalope de Dinde France",
    brand: "Tradition volaille",
    category: "Viandes et derives",
    barcode: "2000000000018",
    image: "🍗",
    ecoScore: 0,
    carbonFootprint: 3.6,
    waterUsage: 1100,
    pesticides: { level: "low", region: "France" },
    packaging: "Barquette carton",
    origin: "France",
  },
  {
    id: "19",
    name: "Steak Hache Vegetal",
    brand: "Green Delice",
    category: "Viandes et derives",
    barcode: "2000000000019",
    image: "🌿",
    ecoScore: 0,
    carbonFootprint: 1.9,
    waterUsage: 260,
    pesticides: { level: "none", region: "France" },
    packaging: "Barquette carton recyclable",
    origin: "France",
  },
  {
    id: "20",
    name: "Boulettes Vegetales Bio",
    brand: "Bio demain",
    category: "Viandes et derives",
    barcode: "2000000000020",
    image: "🌱",
    ecoScore: 0,
    carbonFootprint: 1.4,
    waterUsage: 210,
    pesticides: { level: "none", region: "France" },
    packaging: "Sachet recyclable",
    origin: "France",
  },
];

for (const product of mockProducts) {
  product.ecoScore = calculateCompositeEcoScore({
    category: product.category,
    carbonFootprint: product.carbonFootprint,
    quantityGrams: product.quantityGrams,
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
  if (score >= 40) return "Moyen";
  if (score >= 20) return "Mediocre";
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
    case "medium": return "Modere";
    case "high": return "Eleve";
    default: return "Inconnu";
  }
}
