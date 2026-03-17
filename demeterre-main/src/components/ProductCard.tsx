import { motion } from "framer-motion";
import { Droplets, CloudRain, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EcoScoreBadge from "./EcoScoreBadge";
import { Product, getPesticideLabel } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
  navigationState?: unknown;
}

export default function ProductCard({ product, index = 0, navigationState }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/product/${product.id}`, navigationState ? { state: navigationState } : undefined)}
      className="flex cursor-pointer items-center gap-4 rounded-2xl bg-card p-4 eco-card-shadow transition-transform active:scale-[0.98]"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-14 w-14 rounded-2xl bg-white object-cover"
        />
      ) : (
        <span className="text-4xl">{product.image}</span>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <CloudRain size={12} /> {product.carbonFootprint} kg
          </span>
          <span className="flex items-center gap-0.5">
            <Droplets size={12} /> {product.waterUsage} L
          </span>
          <span className="flex items-center gap-0.5">
            <Bug size={12} /> {getPesticideLabel(product.pesticides.level)}
          </span>
        </div>
      </div>
      <EcoScoreBadge score={product.ecoScore} size="sm" />
    </motion.div>
  );
}
