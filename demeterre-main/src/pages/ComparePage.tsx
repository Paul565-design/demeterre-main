import { useState } from "react";
import { motion } from "framer-motion";
import EcoScoreBadge from "@/components/EcoScoreBadge";
import { mockProducts, getPesticideLabel } from "@/data/products";

export default function ComparePage() {
  const [left, setLeft] = useState(mockProducts[0].id);
  const [right, setRight] = useState(mockProducts[1].id);

  const pLeft = mockProducts.find((p) => p.id === left)!;
  const pRight = mockProducts.find((p) => p.id === right)!;

  const rows = [
    { label: "Score Éco", left: pLeft.ecoScore, right: pRight.ecoScore, unit: "/100" },
    { label: "CO₂", left: pLeft.carbonFootprint, right: pRight.carbonFootprint, unit: "kg" },
    { label: "Eau", left: pLeft.waterUsage, right: pRight.waterUsage, unit: "L" },
    { label: "Pesticides", left: getPesticideLabel(pLeft.pesticides.level), right: getPesticideLabel(pRight.pesticides.level), unit: "" },
  ];

  const betterLeft = (l: number, r: number, inverse = false) =>
    inverse ? l > r : l < r;

  return (
    <div className="min-h-screen pb-24 pt-12 px-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold font-serif text-center">Comparer</h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">
          Choisissez deux produits à comparer
        </p>
      </motion.div>

      {/* Selectors */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[{ val: left, set: setLeft }, { val: right, set: setRight }].map(({ val, set }, idx) => (
          <div key={idx}>
            <select
              value={val}
              onChange={(e) => set(e.target.value)}
              className="w-full rounded-xl bg-card border border-border px-3 py-2.5 text-sm outline-none"
            >
              {mockProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.image} {p.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[pLeft, pRight].map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 eco-card-shadow"
          >
            <span className="text-4xl">{p.image}</span>
            <p className="text-xs font-semibold text-center">{p.name}</p>
            <p className="text-[10px] text-muted-foreground">{p.brand}</p>
            <EcoScoreBadge score={p.ecoScore} size="md" />
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-6 rounded-2xl bg-card p-4 eco-card-shadow">
        <h3 className="text-sm font-semibold mb-3 font-serif">Détails</h3>
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center border-b border-border py-3 last:border-0"
          >
            <span className="flex-1 text-xs font-medium text-right pr-3">
              {typeof row.left === "number" ? (
                <span
                  className={
                    row.label === "Score Éco"
                      ? betterLeft(row.left as number, row.right as number, true)
                        ? "text-eco-excellent font-bold"
                        : ""
                      : betterLeft(row.left as number, row.right as number)
                      ? "text-eco-excellent font-bold"
                      : ""
                  }
                >
                  {row.left} {row.unit}
                </span>
              ) : (
                <span>{row.left}</span>
              )}
            </span>
            <span className="w-16 text-center text-[10px] text-muted-foreground font-medium">
              {row.label}
            </span>
            <span className="flex-1 text-xs font-medium pl-3">
              {typeof row.right === "number" ? (
                <span
                  className={
                    row.label === "Score Éco"
                      ? betterLeft(row.right as number, row.left as number, true)
                        ? "text-eco-excellent font-bold"
                        : ""
                      : betterLeft(row.right as number, row.left as number)
                      ? "text-eco-excellent font-bold"
                      : ""
                  }
                >
                  {row.right} {row.unit}
                </span>
              ) : (
                <span>{row.right}</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
