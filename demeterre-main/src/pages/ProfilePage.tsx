import { motion } from "framer-motion";
import {
  Award,
  Leaf,
  Lightbulb,
  MapPin,
  Recycle,
  ShoppingBag,
  Target,
  UserCircle2,
} from "lucide-react";

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

const profileStats = [
  { icon: Award, label: "Niveau", value: "Eco debutant" },
  { icon: Target, label: "Objectif du mois", value: "12 achats responsables" },
  { icon: MapPin, label: "Zone", value: "Paris, France" },
];

export default function ProfilePage() {
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
            <h1 className="mt-1 text-2xl font-bold font-serif">Prénom Nom</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Profil de demonstration avec quelques informations simulees pour preparer la future version.
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/70">
            <UserCircle2 size={40} className="text-primary" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Score eco</p>
            <p className="mt-2 text-2xl font-bold text-primary">78/100</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Derniere action</p>
            <p className="mt-2 text-sm font-semibold">3 produits scannes</p>
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
              className="flex items-center gap-3 rounded-2xl bg-card p-4 eco-card-shadow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <item.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
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
          Une section integree au profil pour afficher des recommandations utiles au quotidien.
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
