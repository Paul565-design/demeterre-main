import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import EcoScoreBadge from "@/components/EcoScoreBadge";
import { getProduceOptions, getTopCountriesByProduce } from "@/data/rankings";
import { getSeasonalityInfo } from "@/lib/seasonality";

export default function ComparePage() {
  const produceOptions = useMemo(() => getProduceOptions(), []);
  const [selectedProduce, setSelectedProduce] = useState(produceOptions[0]?.produce ?? "banana");

  const ranking = useMemo(() => getTopCountriesByProduce(selectedProduce, 5), [selectedProduce]);
  const activeProduce = produceOptions.find((item) => item.produce === selectedProduce) ?? produceOptions[0];
  const seasonalHighlights = useMemo(() => {
    return produceOptions
      .map((option) => {
        const seasonality = getSeasonalityInfo(option.produceLabel);
        const bestEntry = getTopCountriesByProduce(option.produce, 1)[0];

        if (!seasonality?.inSeason || !bestEntry) {
          return null;
        }

        return {
          ...option,
          score: bestEntry.ecoScore,
          country: bestEntry.country,
          note: seasonality.note,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [produceOptions]);
  const currentMonthLabel = useMemo(
    () => new Date().toLocaleDateString("fr-FR", { month: "long" }),
    []
  );

  return (
    <div className="min-h-screen px-5 pb-24 pt-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-center text-2xl font-bold font-serif">Classement</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Top 5 des meilleurs pays selon les donnees de la base
        </p>
      </motion.div>

      <div className="mt-6 rounded-2xl bg-card p-4 eco-card-shadow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">De saison</p>
            <h2 className="mt-1 text-lg font-semibold font-serif">Top fruits et legumes du moment</h2>
            <p className="text-xs text-muted-foreground">
              Selection basee sur le mois actuel : {currentMonthLabel}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {seasonalHighlights.length} en saison
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {seasonalHighlights.map((item) => (
            <button
              key={item.produce}
              type="button"
              onClick={() => setSelectedProduce(item.produce)}
              className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                item.produce === selectedProduce
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-lg">{item.emoji}</span>
                <EcoScoreBadge score={item.score} size="sm" />
              </div>
              <p className="mt-2 text-sm font-semibold">{item.produceLabel}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Meilleur choix actuel : {item.country}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-4 eco-card-shadow">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Produit analyse</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            {activeProduce?.emoji ?? "🥬"}
          </div>
          <div className="flex-1">
            <select
              value={selectedProduce}
              onChange={(e) => setSelectedProduce(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none"
            >
              {produceOptions.map((option) => (
                <option key={option.produce} value={option.produce}>
                  {option.emoji} {option.produceLabel}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              Exemple disponible pour 10 fruits et legumes.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {produceOptions.map((option) => (
          <button
            key={option.produce}
            type="button"
            onClick={() => setSelectedProduce(option.produce)}
            className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
              option.produce === selectedProduce
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card"
            }`}
          >
            <span className="text-lg">{option.emoji}</span>
            <p className="mt-1 text-sm font-medium">{option.produceLabel}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card p-4 eco-card-shadow">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold font-serif">
              {activeProduce?.emoji} Top 5 {activeProduce?.produceLabel?.toLowerCase()}
            </h2>
            <p className="text-xs text-muted-foreground">Classement par pays depuis la base locale</p>
          </div>
          {ranking[0] ? <EcoScoreBadge score={ranking[0].ecoScore} size="sm" /> : null}
        </div>

        <div className="mt-4 space-y-3">
          {ranking.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{entry.country}</p>
                      <p className="text-xs text-muted-foreground">{entry.notes}</p>
                    </div>
                    <EcoScoreBadge score={entry.ecoScore} size="sm" />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-card px-2 py-3">
                  <p className="text-[11px] text-muted-foreground">CO2</p>
                  <p className="mt-1 text-sm font-semibold">{entry.carbonFootprint} kg</p>
                </div>
                <div className="rounded-xl bg-card px-2 py-3">
                  <p className="text-[11px] text-muted-foreground">Eau</p>
                  <p className="mt-1 text-sm font-semibold">{entry.waterUsage} L</p>
                </div>
                <div className="rounded-xl bg-card px-2 py-3">
                  <p className="text-[11px] text-muted-foreground">Pesticides</p>
                  <p className="mt-1 text-sm font-semibold">{entry.pesticideLevel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
