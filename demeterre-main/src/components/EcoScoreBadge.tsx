import { motion } from "framer-motion";
import { getScoreBg, getScoreLabel } from "@/data/products";

interface EcoScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function EcoScoreBadge({ score, size = "md" }: EcoScoreBadgeProps) {
  const dims = size === "lg" ? "w-24 h-24 text-2xl" : size === "md" ? "w-16 h-16 text-lg" : "w-10 h-10 text-xs";

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      className={`${dims} ${getScoreBg(score)} rounded-full flex flex-col items-center justify-center font-bold eco-card-shadow`}
    >
      <span className="text-white drop-shadow-sm">{score}</span>
      {size !== "sm" && (
        <span className="text-[9px] font-medium text-white/90 drop-shadow-sm">{getScoreLabel(score)}</span>
      )}
    </motion.div>
  );
}
