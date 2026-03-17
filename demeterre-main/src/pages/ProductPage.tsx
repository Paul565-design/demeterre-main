import { motion } from "framer-motion";
import { ArrowLeft, CloudRain, Droplets, Bug, Package, MapPin, RefreshCw } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import EcoScoreBadge from "@/components/EcoScoreBadge";
import ProductCard from "@/components/ProductCard";
import { mockProducts, getPesticideLabel, getPesticideColor } from "@/data/products";
import { fetchProductByBarcode, type OFFProduct } from "@/lib/openfoodfacts";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [offProduct, setOFFProduct] = useState<OFFProduct | null>(
    (location.state as any)?.product || null
  );
  const [loading, setLoading] = useState(false);

  // Check if it's a local mock product
  const mockProduct = mockProducts.find((p) => p.id === id);

  useEffect(() => {
    if (!mockProduct && !offProduct && id) {
      setLoading(true);
      fetchProductByBarcode(id).then((p) => {
        setOFFProduct(p);
        setLoading(false);
      });
    }
  }, [id, mockProduct, offProduct]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <CloudRain size={32} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  // Unified product data
  const product = mockProduct
    ? {
        name: mockProduct.name,
        brand: mockProduct.brand,
        category: mockProduct.category,
        image: mockProduct.image,
        imageUrl: "",
        ecoScore: mockProduct.ecoScore,
        carbonFootprint: mockProduct.carbonFootprint,
        waterUsage: mockProduct.waterUsage,
        pesticides: mockProduct.pesticides,
        packaging: mockProduct.packaging,
        origin: mockProduct.origin,
        barcode: mockProduct.barcode,
      }
    : offProduct
    ? {
        name: offProduct.name,
        brand: offProduct.brand,
        category: offProduct.category,
        image: "",
        imageUrl: offProduct.imageUrl,
        ecoScore: offProduct.ecoScore,
        carbonFootprint: offProduct.carbonFootprint,
        waterUsage: offProduct.waterUsage,
        pesticides: offProduct.pesticides,
        packaging: offProduct.packaging,
        origin: offProduct.origin,
        barcode: offProduct.barcode,
      }
    : null;

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Produit non trouvé</p>
      </div>
    );
  }

  const alternatives = mockProduct?.alternatives
    ?.map((altId) => mockProducts.find((p) => p.id === altId))
    .filter(Boolean) as typeof mockProducts | undefined;

  const metrics = [
    { icon: CloudRain, label: "Empreinte carbone", value: `${product.carbonFootprint} kg CO₂`, desc: "par unité produite" },
    { icon: Droplets, label: "Eau consommée", value: `${product.waterUsage} L`, desc: "cycle de vie complet" },
    { icon: Bug, label: "Pesticides", value: getPesticideLabel(product.pesticides.level), desc: `Région : ${product.pesticides.region}`, color: getPesticideColor(product.pesticides.level) },
    { icon: Package, label: "Emballage", value: product.packaging, desc: "" },
    { icon: MapPin, label: "Origine", value: product.origin, desc: "" },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-primary px-5 pb-8 pt-10 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-4 text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-4">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded-2xl object-cover bg-white" />
          ) : (
            <span className="text-6xl">{product.image}</span>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary-foreground font-serif">{product.name}</h1>
            <p className="text-sm text-primary-foreground/75">{product.brand}</p>
            <p className="mt-0.5 text-xs text-primary-foreground/50">{product.category}</p>
          </div>
          <EcoScoreBadge score={product.ecoScore} size="lg" />
        </div>
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-lg font-semibold font-serif mb-3">Impact environnemental</h2>
        <div className="flex flex-col gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 eco-card-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <m.icon size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className={`text-sm font-semibold ${m.color || "text-foreground"}`}>{m.value}</p>
                {m.desc && <p className="text-[10px] text-muted-foreground">{m.desc}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {alternatives && alternatives.length > 0 && (
        <div className="px-5 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={18} className="text-primary" />
            <h2 className="text-lg font-semibold font-serif">Meilleures alternatives</h2>
          </div>
          <div className="flex flex-col gap-3">
            {alternatives.map((alt, i) => (
              <ProductCard key={alt.id} product={alt} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
