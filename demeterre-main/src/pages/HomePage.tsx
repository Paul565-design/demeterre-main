import { motion } from "framer-motion";
import { ScanLine, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ThemeToggle from "@/components/ThemeToggle";
import type { Product } from "@/data/products";
import { searchProducts, type OFFProduct } from "@/lib/openfoodfacts";
import { getRecentScannedProducts } from "@/lib/recentScans";

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [apiResults, setApiResults] = useState<OFFProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    setRecentProducts(getRecentScannedProducts());
  }, []);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (q.length < 3) {
      setApiResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const { products } = await searchProducts(q);
    setApiResults(products);
    setLoading(false);
  };

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const onSearchChange = (value: string) => {
    setSearch(value);
    if (timer) {
      clearTimeout(timer);
    }
    const nextTimer = setTimeout(() => handleSearch(value), 500);
    setTimer(nextTimer);
  };

  const filteredRecentProducts = recentProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">
      <div className="rounded-b-[2rem] bg-primary px-5 pb-10 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Demeterre</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">Scannez, classez, consommez mieux.</p>
          </div>
          <ThemeToggle />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mt-5"
        >
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl bg-background py-3 pl-10 pr-4 text-sm shadow-lg outline-none placeholder:text-muted-foreground"
          />
        </motion.div>
      </div>

      <div className="-mt-4 px-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/scan")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 font-semibold text-accent-foreground eco-card-shadow"
        >
          <ScanLine size={20} />
          Scanner un produit
        </motion.button>
      </div>

      <div className="mt-6 px-5">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        )}

        {searched && !loading && apiResults.length > 0 && (
          <>
            <h2 className="mb-3 text-lg font-semibold font-serif">Resultats</h2>
            <div className="flex flex-col gap-3">
              {apiResults.slice(0, 10).map((product, i) => (
                <motion.div
                  key={product.barcode + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/product/${product.barcode}`, { state: { product } })}
                  className="flex cursor-pointer items-center gap-4 rounded-2xl bg-card p-4 eco-card-shadow transition-transform active:scale-[0.98]"
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">📦</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      EcoScore: {product.ecoScoreGrade?.toUpperCase() || "?"}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${
                      product.ecoScore >= 80
                        ? "bg-eco-excellent"
                        : product.ecoScore >= 60
                          ? "bg-eco-good"
                          : product.ecoScore >= 40
                            ? "bg-eco-average"
                            : product.ecoScore >= 20
                              ? "bg-eco-poor"
                              : "bg-eco-bad"
                    }`}
                  >
                    {product.ecoScore}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {searched && !loading && apiResults.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun resultat trouve</p>
        )}

        {!searched && (
          <>
            <h2 className="mb-3 text-lg font-semibold font-serif">Produits recents</h2>
            {filteredRecentProducts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredRecentProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-card p-5 text-center eco-card-shadow">
                <p className="text-sm font-medium">Aucun produit scanne pour le moment</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Scanne un produit et il apparaitra ici automatiquement.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
