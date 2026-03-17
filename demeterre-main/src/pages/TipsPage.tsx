import { motion } from "framer-motion";
import { Lightbulb, ShoppingBag, Recycle, Apple, Droplets } from "lucide-react";

const tips = [
  {
    icon: ShoppingBag,
    title: "Privilégiez le vrac",
    desc: "Réduisez les emballages en achetant en vrac. Apportez vos propres contenants pour encore moins de déchets.",
  },
  {
    icon: Apple,
    title: "Mangez local et de saison",
    desc: "Les produits locaux et de saison ont une empreinte carbone bien plus faible grâce au transport réduit.",
  },
  {
    icon: Recycle,
    title: "Vérifiez la recyclabilité",
    desc: "Préférez les emballages recyclables ou compostables. Le verre et le carton sont meilleurs que le plastique.",
  },
  {
    icon: Droplets,
    title: "Attention à l'eau virtuelle",
    desc: "1 kg de bœuf = 15 400 L d'eau. Réduire la viande a un impact énorme sur votre empreinte eau.",
  },
];

export default function TipsPage() {
  return (
    <div className="min-h-screen pb-24 pt-12 px-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 justify-center">
          <Lightbulb size={24} className="text-accent" />
          <h1 className="text-2xl font-bold font-serif">Éco-conseils</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground text-center">
          Des gestes simples pour un impact positif
        </p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-4">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-2xl bg-card p-5 eco-card-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <tip.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{tip.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
