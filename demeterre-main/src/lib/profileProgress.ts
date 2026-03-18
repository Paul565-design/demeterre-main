import type { Product } from "@/data/products";
import type { CartItem } from "@/lib/cart";

type ProgressMetric = "cartItems" | "averageScore" | "scans";
type TierStatus = "achieved" | "current" | "locked";

interface TierGoalDefinition {
  metric: ProgressMetric;
  target: number;
}

interface TierDefinition {
  id: string;
  name: string;
  description: string;
  objective: string;
  goals: TierGoalDefinition[];
}

export interface ProfileSnapshot {
  totalCartItems: number;
  averageCartScore: number;
  recentScansCount: number;
  totalCarbon: number;
  totalWater: number;
}

export interface TierGoalProgress extends TierGoalDefinition {
  current: number;
  progress: number;
  complete: boolean;
}

export interface ProfileTierProgress extends TierDefinition {
  goals: TierGoalProgress[];
  progress: number;
  status: TierStatus;
}

export interface ProfileProgress {
  snapshot: ProfileSnapshot;
  tiers: ProfileTierProgress[];
  currentTier: ProfileTierProgress;
  nextTier: ProfileTierProgress | null;
  completedTierCount: number;
  totalTierCount: number;
}

const PROFILE_TIERS: TierDefinition[] = [
  {
    id: "debutant",
    name: "Eco debutant",
    description: "Tu poses les bases d'un panier plus responsable.",
    objective: "Premiers pas vers une consommation plus durable.",
    goals: [],
  },
  {
    id: "curieux",
    name: "Eco curieux",
    description: "Tu commences a comparer les produits avant de choisir.",
    objective: "Scanner 3 produits differents.",
    goals: [{ metric: "scans", target: 3 }],
  },
  {
    id: "apprenti",
    name: "Eco apprenti",
    description: "Ton panier commence a refleter de meilleures habitudes.",
    objective: "Composer un panier de 5 articles.",
    goals: [{ metric: "cartItems", target: 5 }],
  },
  {
    id: "conscient",
    name: "Eco conscient",
    description: "Tu vises deja des produits avec un meilleur impact moyen.",
    objective: "Atteindre un score moyen de 55/100.",
    goals: [{ metric: "averageScore", target: 55 }],
  },
  {
    id: "engage",
    name: "Eco engage",
    description: "Tu tiens un vrai panier responsable sur plusieurs achats.",
    objective: "Construire un panier de 10 articles.",
    goals: [{ metric: "cartItems", target: 10 }],
  },
  {
    id: "referent",
    name: "Eco referent",
    description: "Tu combines volume et qualite environnementale.",
    objective: "Avoir 10 articles avec un score moyen de 70/100.",
    goals: [
      { metric: "cartItems", target: 10 },
      { metric: "averageScore", target: 70 },
    ],
  },
  {
    id: "expert",
    name: "Eco expert",
    description: "Tu maitrises les reflexes eco a grande echelle.",
    objective: "Scanner 10 produits, viser 15 articles et 80/100 de score moyen.",
    goals: [
      { metric: "scans", target: 10 },
      { metric: "cartItems", target: 15 },
      { metric: "averageScore", target: 80 },
    ],
  },
];

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function clampProgress(current: number, target: number) {
  if (target <= 0) {
    return 1;
  }

  return Math.max(0, Math.min(current / target, 1));
}

function getMetricValue(snapshot: ProfileSnapshot, metric: ProgressMetric) {
  switch (metric) {
    case "cartItems":
      return snapshot.totalCartItems;
    case "averageScore":
      return snapshot.averageCartScore;
    case "scans":
      return snapshot.recentScansCount;
    default:
      return 0;
  }
}

export function buildProfileSnapshot(items: CartItem[], recentScans: Product[]): ProfileSnapshot {
  const totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalScore = items.reduce((sum, item) => sum + item.product.ecoScore * item.quantity, 0);
  const totalCarbon = items.reduce((sum, item) => sum + item.product.carbonFootprint * item.quantity, 0);
  const totalWater = items.reduce((sum, item) => sum + item.product.waterUsage * item.quantity, 0);

  return {
    totalCartItems,
    averageCartScore: totalCartItems > 0 ? Math.round(totalScore / totalCartItems) : 0,
    recentScansCount: recentScans.length,
    totalCarbon: roundToTwo(totalCarbon),
    totalWater: Math.round(totalWater),
  };
}

export function formatGoalProgress(goal: TierGoalProgress) {
  switch (goal.metric) {
    case "cartItems":
      return `${Math.round(goal.current)}/${goal.target} articles`;
    case "averageScore":
      return `${Math.round(goal.current)}/${goal.target} score`;
    case "scans":
      return `${Math.round(goal.current)}/${goal.target} scans`;
    default:
      return `${Math.round(goal.current)}/${goal.target}`;
  }
}

export function formatTierProgress(tier: Pick<ProfileTierProgress, "goals">) {
  if (tier.goals.length === 0) {
    return "Palier de depart valide";
  }

  return tier.goals.map((goal) => formatGoalProgress(goal)).join(" | ");
}

export function getProfileProgress(snapshot: ProfileSnapshot): ProfileProgress {
  const computedTiers = PROFILE_TIERS.map<ProfileTierProgress>((tier) => {
    const goals = tier.goals.map<TierGoalProgress>((goal) => {
      const current = getMetricValue(snapshot, goal.metric);
      return {
        ...goal,
        current,
        progress: clampProgress(current, goal.target),
        complete: current >= goal.target,
      };
    });

    const progress =
      goals.length === 0
        ? 1
        : goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;

    return {
      ...tier,
      goals,
      progress,
      status: "locked",
    };
  });

  let currentTierIndex = 0;
  for (let index = 1; index < computedTiers.length; index += 1) {
    const tier = computedTiers[index];
    const tierComplete = tier.goals.every((goal) => goal.complete);
    if (!tierComplete) {
      break;
    }
    currentTierIndex = index;
  }

  const nextTierIndex = currentTierIndex < computedTiers.length - 1 ? currentTierIndex + 1 : -1;

  const tiers = computedTiers.map((tier, index) => ({
    ...tier,
    status:
      index <= currentTierIndex
        ? "achieved"
        : index === nextTierIndex
          ? "current"
          : "locked",
  }));

  return {
    snapshot,
    tiers,
    currentTier: tiers[currentTierIndex],
    nextTier: nextTierIndex >= 0 ? tiers[nextTierIndex] : null,
    completedTierCount: currentTierIndex + 1,
    totalTierCount: tiers.length,
  };
}
