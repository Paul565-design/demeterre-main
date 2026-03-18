import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Leaf,
  Lightbulb,
  Lock,
  MapPin,
  Recycle,
  ShoppingBag,
  Target,
  TrendingUp,
  UserCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCartItems } from "@/lib/cart";
import {
  buildProfileSnapshot,
  getProfileProgress,
  type ProfileProgress,
} from "@/lib/profileProgress";
import { RECENT_SCANS_UPDATED_EVENT, getRecentScannedProducts } from "@/lib/recentScans";

const tips = [
  {
    icon: ShoppingBag,
    title: "Privilegier le vrac",
    desc: "Reduisez les emballages en achetant en vrac et en prenant vos propres contenants.",
  },
  {
    icon: Leaf,
    title: "Manger local et de saison",
    desc: "Choisir des produits proches de chez vous limite le transport et reduit votre impact carbone.",
  },
  {
    icon: Recycle,
    title: "Mieux trier les emballages",
    desc: "Favorisez le carton, le verre et les formats rechargeables quand ils sont disponibles.",
  },
];

function createInitialProfileProgress(): ProfileProgress {
  return getProfileProgress(
    buildProfileSnapshot([], [])
  );
}

function getTierStatusMeta(status: "achieved" | "current" | "locked") {
  if (status === "achieved") {
    return {
      label: "Valide",
      icon: CheckCircle2,
      badgeClass: "bg-primary/15 text-primary",
    };
  }

  if (status === "current") {
    return {
      label: "En cours",
      icon: CircleDashed,
      badgeClass: "bg-accent/20 text-accent-foreground",
    };
  }

  return {
    label: "Verrouille",
    icon: Lock,
    badgeClass: "bg-muted text-muted-foreground",
  };
}

export default function ProfilePage() {
  const [profileProgress, setProfileProgress] = useState<ProfileProgress>(createInitialProfileProgress);
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  useEffect(() => {
    const syncProfile = () => {
      const snapshot = buildProfileSnapshot(getCartItems(), getRecentScannedProducts());
      setProfileProgress(getProfileProgress(snapshot));
    };

    syncProfile();
    window.addEventListener("demeterre-cart-updated", syncProfile);
    window.addEventListener(RECENT_SCANS_UPDATED_EVENT, syncProfile);

    return () => {
      window.removeEventListener("demeterre-cart-updated", syncProfile);
      window.removeEventListener(RECENT_SCANS_UPDATED_EVENT, syncProfile);
    };
  }, []);

  const { snapshot, currentTier, nextTier, tiers, completedTierCount, totalTierCount } = profileProgress;

  const profileStats = [
    { icon: Award, label: "Niveau", value: currentTier.name, collapsible: true },
    {
      icon: Target,
      label: "Objectif du moment",
      value: nextTier ? nextTier.objective : "Tous les paliers sont completes.",
      collapsible: false,
    },
    { icon: MapPin, label: "Zone", value: "Paris, France", collapsible: false },
  ];

  return (
    <div className="min-h-screen px-5 pb-24 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20 p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Profil utilisateur</p>
            <h1 className="mt-1 text-2xl font-bold font-serif">{currentTier.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{currentTier.description}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/70">
            <UserCircle2 size={40} className="text-primary" />
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          <TrendingUp size={14} className="text-primary" />
          <span>
            {completedTierCount}/{totalTierCount} paliers valides
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Score eco moyen</p>
            <p className="mt-2 text-2xl font-bold text-primary">{snapshot.averageCartScore}/100</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Produits scannes</p>
            <p className="mt-2 text-2xl font-bold text-primary">{snapshot.recentScansCount}</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Articles panier</p>
            <p className="mt-2 text-2xl font-bold text-primary">{snapshot.totalCartItems}</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Prochain cap</p>
            <p className="mt-2 text-sm font-semibold">{nextTier ? nextTier.name : "Expert valide"}</p>
          </div>
        </div>
      </motion.div>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <UserCircle2 size={18} className="text-primary" />
          <h2 className="text-lg font-semibold">Informations du profil</h2>
        </div>

        <div className="flex flex-col gap-3">
          {profileStats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              className="rounded-2xl bg-card p-4 eco-card-shadow"
            >
              {item.collapsible ? (
                <button
                  type="button"
                  onClick={() => setIsLevelOpen((value) => !value)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                  {isLevelOpen ? (
                    <ChevronUp size={18} className="shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown size={18} className="shrink-0 text-muted-foreground" />
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              )}

              {item.collapsible ? (
                <AnimatePresence initial={false}>
                  {isLevelOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-2 border-t border-border pt-4">
                        {tiers.map((tier) => {
                          const statusMeta = getTierStatusMeta(tier.status);
                          const StatusIcon = statusMeta.icon;

                          return (
                            <div key={tier.id} className="rounded-xl bg-background px-3 py-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold">{tier.name}</p>
                                  <p className="truncate text-[11px] text-muted-foreground">{tier.objective}</p>
                                </div>
                                <div
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${statusMeta.badgeClass}`}
                                >
                                  <StatusIcon size={12} />
                                  <span>{statusMeta.label}</span>
                                </div>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-500"
                                  style={{ width: `${Math.round(tier.progress * 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              ) : null}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-accent" />
          <h2 className="text-lg font-semibold">Eco-conseils</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Quelques habitudes simples pour gagner les prochains paliers plus facilement.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * index }}
              className="rounded-2xl bg-card p-5 eco-card-shadow"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <tip.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{tip.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
