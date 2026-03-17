export interface ProduceRankingEntry {
  id: string;
  produce: string;
  produceLabel: string;
  emoji: string;
  country: string;
  ecoScore: number;
  carbonFootprint: number;
  waterUsage: number;
  pesticideLevel: "Aucun" | "Faible" | "Modere";
  notes: string;
}

export const produceRankingDatabase: ProduceRankingEntry[] = [
  { id: "banana-ec", produce: "banana", produceLabel: "Banane", emoji: "🍌", country: "Equateur", ecoScore: 91, carbonFootprint: 0.52, waterUsage: 118, pesticideLevel: "Faible", notes: "Transport maritime optimise" },
  { id: "banana-co", produce: "banana", produceLabel: "Banane", emoji: "🍌", country: "Colombie", ecoScore: 88, carbonFootprint: 0.57, waterUsage: 121, pesticideLevel: "Faible", notes: "Production reguliere" },
  { id: "banana-cr", produce: "banana", produceLabel: "Banane", emoji: "🍌", country: "Costa Rica", ecoScore: 84, carbonFootprint: 0.61, waterUsage: 128, pesticideLevel: "Modere", notes: "Bon rendement agricole" },
  { id: "banana-pe", produce: "banana", produceLabel: "Banane", emoji: "🍌", country: "Perou", ecoScore: 81, carbonFootprint: 0.66, waterUsage: 134, pesticideLevel: "Faible", notes: "Filiere bio frequente" },
  { id: "banana-do", produce: "banana", produceLabel: "Banane", emoji: "🍌", country: "Republique dominicaine", ecoScore: 78, carbonFootprint: 0.69, waterUsage: 139, pesticideLevel: "Modere", notes: "Disponibilite stable" },
  { id: "tomato-fr", produce: "tomato", produceLabel: "Tomate", emoji: "🍅", country: "France", ecoScore: 93, carbonFootprint: 0.31, waterUsage: 52, pesticideLevel: "Faible", notes: "Culture de saison" },
  { id: "tomato-es", produce: "tomato", produceLabel: "Tomate", emoji: "🍅", country: "Espagne", ecoScore: 86, carbonFootprint: 0.42, waterUsage: 64, pesticideLevel: "Modere", notes: "Production mediterraneenne" },
  { id: "tomato-it", produce: "tomato", produceLabel: "Tomate", emoji: "🍅", country: "Italie", ecoScore: 84, carbonFootprint: 0.45, waterUsage: 68, pesticideLevel: "Modere", notes: "Filiere reguliere" },
  { id: "tomato-ma", produce: "tomato", produceLabel: "Tomate", emoji: "🍅", country: "Maroc", ecoScore: 80, carbonFootprint: 0.51, waterUsage: 73, pesticideLevel: "Modere", notes: "Import courant" },
  { id: "tomato-nl", produce: "tomato", produceLabel: "Tomate", emoji: "🍅", country: "Pays-Bas", ecoScore: 72, carbonFootprint: 0.74, waterUsage: 59, pesticideLevel: "Faible", notes: "Serre plus energivore" },
  { id: "apple-fr", produce: "apple", produceLabel: "Pomme", emoji: "🍎", country: "France", ecoScore: 94, carbonFootprint: 0.22, waterUsage: 47, pesticideLevel: "Faible", notes: "Circuit court favorise" },
  { id: "apple-it", produce: "apple", produceLabel: "Pomme", emoji: "🍎", country: "Italie", ecoScore: 89, carbonFootprint: 0.27, waterUsage: 49, pesticideLevel: "Faible", notes: "Production alpine stable" },
  { id: "apple-de", produce: "apple", produceLabel: "Pomme", emoji: "🍎", country: "Allemagne", ecoScore: 86, carbonFootprint: 0.3, waterUsage: 53, pesticideLevel: "Faible", notes: "Bon stockage" },
  { id: "apple-pl", produce: "apple", produceLabel: "Pomme", emoji: "🍎", country: "Pologne", ecoScore: 83, carbonFootprint: 0.33, waterUsage: 56, pesticideLevel: "Modere", notes: "Volume eleve" },
  { id: "apple-es", produce: "apple", produceLabel: "Pomme", emoji: "🍎", country: "Espagne", ecoScore: 79, carbonFootprint: 0.38, waterUsage: 61, pesticideLevel: "Modere", notes: "Irrigation plus forte" },
  { id: "carrot-fr", produce: "carrot", produceLabel: "Carotte", emoji: "🥕", country: "France", ecoScore: 96, carbonFootprint: 0.18, waterUsage: 31, pesticideLevel: "Faible", notes: "Tres bon rendement" },
  { id: "carrot-be", produce: "carrot", produceLabel: "Carotte", emoji: "🥕", country: "Belgique", ecoScore: 91, carbonFootprint: 0.21, waterUsage: 34, pesticideLevel: "Faible", notes: "Proximite logistique" },
  { id: "carrot-de", produce: "carrot", produceLabel: "Carotte", emoji: "🥕", country: "Allemagne", ecoScore: 88, carbonFootprint: 0.24, waterUsage: 36, pesticideLevel: "Faible", notes: "Production stable" },
  { id: "carrot-nl", produce: "carrot", produceLabel: "Carotte", emoji: "🥕", country: "Pays-Bas", ecoScore: 84, carbonFootprint: 0.28, waterUsage: 39, pesticideLevel: "Modere", notes: "Bonne conservation" },
  { id: "carrot-es", produce: "carrot", produceLabel: "Carotte", emoji: "🥕", country: "Espagne", ecoScore: 78, carbonFootprint: 0.35, waterUsage: 46, pesticideLevel: "Modere", notes: "Transport plus long" },
  { id: "strawberry-fr", produce: "strawberry", produceLabel: "Fraise", emoji: "🍓", country: "France", ecoScore: 90, carbonFootprint: 0.41, waterUsage: 74, pesticideLevel: "Faible", notes: "Saison locale favorable" },
  { id: "strawberry-es", produce: "strawberry", produceLabel: "Fraise", emoji: "🍓", country: "Espagne", ecoScore: 82, carbonFootprint: 0.53, waterUsage: 89, pesticideLevel: "Modere", notes: "Production massive" },
  { id: "strawberry-ma", produce: "strawberry", produceLabel: "Fraise", emoji: "🍓", country: "Maroc", ecoScore: 79, carbonFootprint: 0.58, waterUsage: 92, pesticideLevel: "Modere", notes: "Import rapide" },
  { id: "strawberry-it", produce: "strawberry", produceLabel: "Fraise", emoji: "🍓", country: "Italie", ecoScore: 77, carbonFootprint: 0.6, waterUsage: 95, pesticideLevel: "Modere", notes: "Qualite reguliere" },
  { id: "strawberry-nl", produce: "strawberry", produceLabel: "Fraise", emoji: "🍓", country: "Pays-Bas", ecoScore: 68, carbonFootprint: 0.83, waterUsage: 76, pesticideLevel: "Faible", notes: "Serre chauffee" },
  { id: "potato-fr", produce: "potato", produceLabel: "Pomme de terre", emoji: "🥔", country: "France", ecoScore: 95, carbonFootprint: 0.16, waterUsage: 27, pesticideLevel: "Faible", notes: "Tres bon score global" },
  { id: "potato-be", produce: "potato", produceLabel: "Pomme de terre", emoji: "🥔", country: "Belgique", ecoScore: 90, carbonFootprint: 0.19, waterUsage: 29, pesticideLevel: "Faible", notes: "Production proche" },
  { id: "potato-de", produce: "potato", produceLabel: "Pomme de terre", emoji: "🥔", country: "Allemagne", ecoScore: 87, carbonFootprint: 0.22, waterUsage: 31, pesticideLevel: "Faible", notes: "Stockage efficace" },
  { id: "potato-nl", produce: "potato", produceLabel: "Pomme de terre", emoji: "🥔", country: "Pays-Bas", ecoScore: 84, carbonFootprint: 0.24, waterUsage: 34, pesticideLevel: "Modere", notes: "Rendement eleve" },
  { id: "potato-eg", produce: "potato", produceLabel: "Pomme de terre", emoji: "🥔", country: "Egypte", ecoScore: 75, carbonFootprint: 0.39, waterUsage: 48, pesticideLevel: "Modere", notes: "Transport plus impactant" },
  { id: "orange-es", produce: "orange", produceLabel: "Orange", emoji: "🍊", country: "Espagne", ecoScore: 92, carbonFootprint: 0.29, waterUsage: 66, pesticideLevel: "Faible", notes: "Reference mediterraneenne" },
  { id: "orange-it", produce: "orange", produceLabel: "Orange", emoji: "🍊", country: "Italie", ecoScore: 88, carbonFootprint: 0.32, waterUsage: 69, pesticideLevel: "Faible", notes: "Bonne proximite europeenne" },
  { id: "orange-ma", produce: "orange", produceLabel: "Orange", emoji: "🍊", country: "Maroc", ecoScore: 84, carbonFootprint: 0.37, waterUsage: 73, pesticideLevel: "Modere", notes: "Import frequent" },
  { id: "orange-pt", produce: "orange", produceLabel: "Orange", emoji: "🍊", country: "Portugal", ecoScore: 83, carbonFootprint: 0.38, waterUsage: 71, pesticideLevel: "Faible", notes: "Volumes plus limites" },
  { id: "orange-za", produce: "orange", produceLabel: "Orange", emoji: "🍊", country: "Afrique du Sud", ecoScore: 76, carbonFootprint: 0.57, waterUsage: 82, pesticideLevel: "Modere", notes: "Transport long courrier" },
  { id: "zucchini-fr", produce: "zucchini", produceLabel: "Courgette", emoji: "🥒", country: "France", ecoScore: 91, carbonFootprint: 0.27, waterUsage: 43, pesticideLevel: "Faible", notes: "Bonne saisonnalite" },
  { id: "zucchini-es", produce: "zucchini", produceLabel: "Courgette", emoji: "🥒", country: "Espagne", ecoScore: 85, carbonFootprint: 0.34, waterUsage: 49, pesticideLevel: "Modere", notes: "Production reguliere" },
  { id: "zucchini-it", produce: "zucchini", produceLabel: "Courgette", emoji: "🥒", country: "Italie", ecoScore: 83, carbonFootprint: 0.36, waterUsage: 51, pesticideLevel: "Modere", notes: "Filiere stable" },
  { id: "zucchini-ma", produce: "zucchini", produceLabel: "Courgette", emoji: "🥒", country: "Maroc", ecoScore: 79, carbonFootprint: 0.43, waterUsage: 58, pesticideLevel: "Modere", notes: "Import courant" },
  { id: "zucchini-nl", produce: "zucchini", produceLabel: "Courgette", emoji: "🥒", country: "Pays-Bas", ecoScore: 71, carbonFootprint: 0.64, waterUsage: 45, pesticideLevel: "Faible", notes: "Serre plus energivore" },
  { id: "grape-fr", produce: "grape", produceLabel: "Raisin", emoji: "🍇", country: "France", ecoScore: 88, carbonFootprint: 0.33, waterUsage: 59, pesticideLevel: "Faible", notes: "Production locale qualitative" },
  { id: "grape-it", produce: "grape", produceLabel: "Raisin", emoji: "🍇", country: "Italie", ecoScore: 85, carbonFootprint: 0.37, waterUsage: 63, pesticideLevel: "Modere", notes: "Bonne disponibilite" },
  { id: "grape-es", produce: "grape", produceLabel: "Raisin", emoji: "🍇", country: "Espagne", ecoScore: 82, carbonFootprint: 0.39, waterUsage: 66, pesticideLevel: "Modere", notes: "Production mediterraneenne" },
  { id: "grape-gr", produce: "grape", produceLabel: "Raisin", emoji: "🍇", country: "Grece", ecoScore: 79, carbonFootprint: 0.42, waterUsage: 68, pesticideLevel: "Modere", notes: "Volumes plus modestes" },
  { id: "grape-eg", produce: "grape", produceLabel: "Raisin", emoji: "🍇", country: "Egypte", ecoScore: 73, carbonFootprint: 0.55, waterUsage: 79, pesticideLevel: "Modere", notes: "Transport plus long" },
  { id: "broccoli-fr", produce: "broccoli", produceLabel: "Brocoli", emoji: "🥦", country: "France", ecoScore: 94, carbonFootprint: 0.2, waterUsage: 35, pesticideLevel: "Faible", notes: "Tres faible impact" },
  { id: "broccoli-es", produce: "broccoli", produceLabel: "Brocoli", emoji: "🥦", country: "Espagne", ecoScore: 87, carbonFootprint: 0.28, waterUsage: 41, pesticideLevel: "Modere", notes: "Production de volume" },
  { id: "broccoli-it", produce: "broccoli", produceLabel: "Brocoli", emoji: "🥦", country: "Italie", ecoScore: 84, carbonFootprint: 0.31, waterUsage: 44, pesticideLevel: "Faible", notes: "Bonne regularite" },
  { id: "broccoli-be", produce: "broccoli", produceLabel: "Brocoli", emoji: "🥦", country: "Belgique", ecoScore: 82, carbonFootprint: 0.33, waterUsage: 39, pesticideLevel: "Faible", notes: "Proximite interessante" },
  { id: "broccoli-nl", produce: "broccoli", produceLabel: "Brocoli", emoji: "🥦", country: "Pays-Bas", ecoScore: 76, carbonFootprint: 0.48, waterUsage: 37, pesticideLevel: "Faible", notes: "Serre ou stockage plus energivore" },
];

export function getProduceOptions() {
  return produceRankingDatabase
    .reduce<Array<{ produce: string; produceLabel: string; emoji: string }>>((acc, entry) => {
      if (!acc.some((item) => item.produce === entry.produce)) {
        acc.push({
          produce: entry.produce,
          produceLabel: entry.produceLabel,
          emoji: entry.emoji,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.produceLabel.localeCompare(b.produceLabel, "fr"));
}

export function getTopCountriesByProduce(produce: string, limit = 5) {
  return produceRankingDatabase
    .filter((entry) => entry.produce === produce)
    .sort((a, b) => b.ecoScore - a.ecoScore || a.carbonFootprint - b.carbonFootprint)
    .slice(0, limit);
}
