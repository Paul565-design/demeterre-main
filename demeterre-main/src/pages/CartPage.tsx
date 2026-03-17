import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EcoScoreBadge from "@/components/EcoScoreBadge";
import { clearCart, decreaseCartItem, getCartItems, removeCartItem, addProductToCart, type CartItem } from "@/lib/cart";

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => setItems(getCartItems());
    syncCart();
    window.addEventListener("demeterre-cart-updated", syncCart);
    return () => window.removeEventListener("demeterre-cart-updated", syncCart);
  }, []);

  const totals = useMemo(() => {
    const totalProducts = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalScore = items.reduce((sum, item) => sum + item.product.ecoScore * item.quantity, 0);
    const totalCarbon = items.reduce((sum, item) => sum + item.product.carbonFootprint * item.quantity, 0);
    const totalWater = items.reduce((sum, item) => sum + item.product.waterUsage * item.quantity, 0);

    return {
      totalProducts,
      totalScore,
      averageScore: totalProducts > 0 ? Math.round(totalScore / totalProducts) : 0,
      totalCarbon: roundToTwo(totalCarbon),
      totalWater: Math.round(totalWater),
    };
  }, [items]);

  return (
    <div className="min-h-screen px-5 pb-24 pt-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold font-serif">Panier</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tous les produits ajoutes au caddie et leur impact total.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingCart size={26} />
          </div>
        </div>
      </motion.div>

      <div className="mt-6 rounded-2xl bg-card p-4 eco-card-shadow">
        <h2 className="text-sm font-semibold font-serif">Impact total du panier</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-background p-4">
            <p className="text-xs text-muted-foreground">Articles</p>
            <p className="mt-1 text-2xl font-semibold">{totals.totalProducts}</p>
          </div>
          <div className="rounded-2xl bg-background p-4">
            <p className="text-xs text-muted-foreground">Score moyen</p>
            <div className="mt-2">
              <EcoScoreBadge score={totals.averageScore} size="sm" />
            </div>
          </div>
          <div className="rounded-2xl bg-background p-4">
            <p className="text-xs text-muted-foreground">CO2 total</p>
            <p className="mt-1 text-2xl font-semibold">{totals.totalCarbon} kg</p>
          </div>
          <div className="rounded-2xl bg-background p-4">
            <p className="text-xs text-muted-foreground">Eau totale</p>
            <p className="mt-1 text-2xl font-semibold">{totals.totalWater} L</p>
          </div>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => clearCart()}
            className="mt-4 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background"
          >
            Vider le panier
          </button>
        ) : null}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold font-serif">Produits du panier</h2>
        {items.length === 0 ? (
          <div className="rounded-2xl bg-card p-5 text-center eco-card-shadow">
            <p className="text-sm font-medium">Ton panier est vide</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ouvre une fiche produit puis clique sur Ajouter au caddie.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <motion.div
                key={item.product.barcode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-card p-4 eco-card-shadow"
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${item.product.id}`, { state: { product: item.product } })}
                    className="text-4xl"
                  >
                    {item.product.image}
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${item.product.id}`, { state: { product: item.product } })}
                      className="text-left"
                    >
                      <h3 className="truncate text-sm font-semibold">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    </button>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{roundToTwo(item.product.carbonFootprint * item.quantity)} kg CO2</span>
                      <span>{Math.round(item.product.waterUsage * item.quantity)} L eau</span>
                    </div>
                  </div>
                  <EcoScoreBadge score={item.product.ecoScore} size="sm" />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decreaseCartItem(item.product.barcode)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => addProductToCart(item.product)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCartItem(item.product.barcode)}
                    className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground"
                  >
                    <Trash2 size={14} />
                    Retirer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
