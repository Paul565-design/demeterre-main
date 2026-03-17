import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bug,
  ChevronUp,
  CloudRain,
  Droplets,
  Factory,
  Heart,
  MapPin,
  Package,
  Package2,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import EcoScoreBadge from "@/components/EcoScoreBadge";
import ProductCard from "@/components/ProductCard";
import { mockProducts, getPesticideColor, getPesticideLabel, type Product } from "@/data/products";
import { fetchProductByBarcode, type OFFProduct } from "@/lib/openfoodfacts";
import { calculateCompositeEcoScore, getEthicsScore } from "@/lib/productScoring";
import { findRecommendedAlternative } from "@/lib/productRecommendations";

type UnifiedProduct = {
  name: string;
  brand: string;
  category: string;
  image: string;
  imageUrl: string;
  ecoScore: number;
  carbonFootprint: number;
  waterUsage: number;
  pesticides: {
    level: "none" | "low" | "medium" | "high";
    region: string;
  };
  packaging: string;
  origin: string;
  barcode: string;
};

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function getCategoryAverage(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("boisson")) return 1.2;
  if (normalized.includes("lait")) return 1.8;
  if (normalized.includes("tartiner") || normalized.includes("chocol")) return 3.4;
  if (normalized.includes("fruit")) return 0.8;
  if (normalized.includes("legume")) return 0.7;
  return 1.6;
}

function getCarbonBreakdown(product: UnifiedProduct) {
  const packagingText = product.packaging.toLowerCase();
  const originText = product.origin.toLowerCase();

  const packagingRatio = packagingText.includes("verre") ? 0.18 : packagingText.includes("plastique") ? 0.16 : 0.14;
  const transportRatio =
    originText.includes("france") || originText.includes("bretagne")
      ? 0.18
      : originText.includes("italie") || originText.includes("suede")
        ? 0.24
        : 0.28;
  const productionRatio = 1 - packagingRatio - transportRatio;

  return {
    production: roundToTwo(product.carbonFootprint * productionRatio),
    transport: roundToTwo(product.carbonFootprint * transportRatio),
    packaging: roundToTwo(product.carbonFootprint * packagingRatio),
    average: getCategoryAverage(product.category),
  };
}

function getPesticideDetails(level: UnifiedProduct["pesticides"]["level"], region: string) {
  switch (level) {
    case "none":
      return {
        levelLabel: "Aucun",
        detected: ["Aucune trace significative detectee", "Controle visuel conforme"],
        risk: "Risque tres faible",
        healthImpact: "Impact tres limite sur la sante",
        environmentalImpact: "Impact environnemental tres faible",
        levelColor: "text-eco-excellent",
      };
    case "low":
      return {
        levelLabel: "Faible",
        detected: ["Glyphosate (traces)", "Chlorpyrifos (traces)"],
        risk: "Risque faible",
        healthImpact: "Impact minimal sur la sante",
        environmentalImpact: "Impact minimal sur les sols et l'eau",
        levelColor: "text-eco-good",
      };
    case "medium":
      return {
        levelLabel: "Modere",
        detected: ["Residus multi-sources", "Traces de fongicides"],
        risk: "Risque modere",
        healthImpact: "Vigilance recommandee en consommation repetitive",
        environmentalImpact: "Impact modere sur la biodiversite locale",
        levelColor: "text-eco-average",
      };
    case "high":
      return {
        levelLabel: "Eleve",
        detected: ["Residus detectes a plusieurs etapes", "Traitements phytosanitaires frequents"],
        risk: "Risque eleve",
        healthImpact: "Impact sanitaire plus sensible en cas d'exposition repetee",
        environmentalImpact: "Impact fort sur l'ecosysteme local",
        levelColor: "text-eco-bad",
      };
    default:
      return {
        levelLabel: getPesticideLabel(level),
        detected: ["Informations non disponibles"],
        risk: "Risque inconnu",
        healthImpact: "Impact sante non documente",
        environmentalImpact: "Impact environnemental non documente",
        levelColor: getPesticideColor(level),
      };
  }
}

function getEthicsDetails(product: UnifiedProduct) {
  const originText = product.origin.toLowerCase();
  const score = getEthicsScore(product.origin);

  const labels = [
    originText.includes("france") ? "FR Origine France" : `Origine ${product.origin}`,
    score >= 60 ? "Commerce equitable probable" : "Traçabilite partielle",
  ];

  const workConditions =
    originText.includes("france")
      ? "Reglementees (droit du travail francais)"
      : originText.includes("italie") || originText.includes("suede")
        ? "Cadre europeen avec controles reguliers"
        : "Controles variables selon la filiere";

  const summary =
    score >= 60 ? "Bonnes pratiques estimees" : "Pratiques correctes mais perfectibles";

  return { score, labels, workConditions, summary };
}

function getProgressWidth(value: number, total: number) {
  if (total <= 0) {
    return "0%";
  }
  return `${Math.max(8, Math.min(100, (value / total) * 100))}%`;
}

function DetailProgressRow({
  icon: Icon,
  label,
  value,
  total,
  colorClass,
}: {
  icon: typeof Factory;
  label: string;
  value: number;
  total: number;
  colorClass: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm">
        <Icon size={17} className="text-primary" />
        <span className="text-muted-foreground">{label} :</span>
        <span className="font-semibold text-foreground">{value} kg CO2</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-muted">
        <div
          className={`h-3 rounded-full ${colorClass}`}
          style={{ width: getProgressWidth(value, total) }}
        />
      </div>
    </div>
  );
}

function AnalysisCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Bug;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] bg-card p-5 eco-card-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-primary">
            <Icon size={28} />
          </div>
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        <ChevronUp size={22} className="mt-2 text-muted-foreground" />
      </div>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateProduct = (location.state as { product?: OFFProduct | Product } | null)?.product || null;
  const [offProduct, setOFFProduct] = useState<OFFProduct | null>(
    stateProduct && "imageUrl" in stateProduct ? (stateProduct as OFFProduct) : null
  );
  const [localStateProduct] = useState<Product | null>(
    stateProduct && "image" in stateProduct && !("imageUrl" in stateProduct) ? (stateProduct as Product) : null
  );
  const [loading, setLoading] = useState(false);

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

  const product: UnifiedProduct | null = mockProduct
    ? {
        name: mockProduct.name,
        brand: mockProduct.brand,
        category: mockProduct.category,
        image: mockProduct.image,
        imageUrl: "",
        ecoScore: calculateCompositeEcoScore({
          category: mockProduct.category,
          carbonFootprint: mockProduct.carbonFootprint,
          waterUsage: mockProduct.waterUsage,
          pesticides: mockProduct.pesticides,
          packaging: mockProduct.packaging,
          origin: mockProduct.origin,
        }).finalScore,
        carbonFootprint: mockProduct.carbonFootprint,
        waterUsage: mockProduct.waterUsage,
        pesticides: mockProduct.pesticides,
        packaging: mockProduct.packaging,
        origin: mockProduct.origin,
        barcode: mockProduct.barcode,
      }
      : localStateProduct
        ? {
            name: localStateProduct.name,
            brand: localStateProduct.brand,
            category: localStateProduct.category,
            image: localStateProduct.image,
            imageUrl: "",
            ecoScore: localStateProduct.ecoScore,
            carbonFootprint: localStateProduct.carbonFootprint,
            waterUsage: localStateProduct.waterUsage,
            pesticides: localStateProduct.pesticides,
            packaging: localStateProduct.packaging,
            origin: localStateProduct.origin,
            barcode: localStateProduct.barcode,
          }
      : offProduct
      ? {
          name: offProduct.name,
          brand: offProduct.brand,
          category: offProduct.category,
          image: "",
          imageUrl: offProduct.imageUrl,
          ecoScore: calculateCompositeEcoScore({
            category: offProduct.category,
            carbonFootprint: offProduct.carbonFootprint,
            waterUsage: offProduct.waterUsage,
            pesticides: offProduct.pesticides,
            packaging: offProduct.packaging,
            origin: offProduct.origin,
          }).finalScore,
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
        <p className="text-muted-foreground">Produit non trouve</p>
      </div>
    );
  }

  const metrics = [
    { icon: CloudRain, label: "Empreinte carbone", value: `${product.carbonFootprint} kg CO2`, desc: "par unite produite" },
    { icon: Droplets, label: "Eau consommee", value: `${product.waterUsage} L`, desc: "cycle de vie complet" },
    { icon: Bug, label: "Pesticides", value: getPesticideLabel(product.pesticides.level), desc: `Region : ${product.pesticides.region}`, color: getPesticideColor(product.pesticides.level) },
    { icon: Package, label: "Emballage", value: product.packaging, desc: "" },
    { icon: MapPin, label: "Origine", value: product.origin, desc: "" },
  ];

  const carbonDetails = getCarbonBreakdown(product);
  const pesticideDetails = getPesticideDetails(product.pesticides.level, product.pesticides.region);
  const ethicsDetails = getEthicsDetails(product);
  const recommendedProduct = findRecommendedAlternative(
    {
      id: mockProduct?.id ?? localStateProduct?.id ?? product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      ecoScore: product.ecoScore,
      alternatives: mockProduct?.alternatives,
      carbonFootprint: product.carbonFootprint,
      waterUsage: product.waterUsage,
      pesticides: product.pesticides,
      packaging: product.packaging,
      origin: product.origin,
    },
    mockProducts
  );

  return (
    <div className="min-h-screen pb-24">
      <div className="rounded-b-[2rem] bg-primary px-5 pb-8 pt-10">
        <button onClick={() => navigate(-1)} className="mb-4 text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-4">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded-2xl bg-white object-cover" />
          ) : (
            <span className="text-6xl">{product.image}</span>
          )}
          <div className="flex-1">
            <h1 className="font-serif text-xl font-bold text-primary-foreground">{product.name}</h1>
            <p className="text-sm text-primary-foreground/75">{product.brand}</p>
            <p className="mt-0.5 text-xs text-primary-foreground/50">{product.category}</p>
          </div>
          <EcoScoreBadge score={product.ecoScore} size="lg" />
        </div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="mb-3 font-serif text-lg font-semibold">Impact environnemental</h2>
        <div className="flex flex-col gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 eco-card-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <metric.icon size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className={`text-sm font-semibold ${metric.color || "text-foreground"}`}>{metric.value}</p>
                {metric.desc ? <p className="text-[10px] text-muted-foreground">{metric.desc}</p> : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 px-5">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Analyse detaillee</h2>
        <div className="flex flex-col gap-4">
          <AnalysisCard icon={CloudRain} title={`Empreinte carbone - ${product.carbonFootprint} kg CO2`}>
            <div className="space-y-5">
              <DetailProgressRow
                icon={Factory}
                label="Production"
                value={carbonDetails.production}
                total={product.carbonFootprint}
                colorClass="bg-primary"
              />
              <DetailProgressRow
                icon={Truck}
                label="Transport"
                value={carbonDetails.transport}
                total={product.carbonFootprint}
                colorClass="bg-[hsl(var(--accent))]"
              />
              <DetailProgressRow
                icon={Package2}
                label="Emballage"
                value={carbonDetails.packaging}
                total={product.carbonFootprint}
                colorClass="bg-[hsl(var(--eco-average))]"
              />
              <p className="text-base text-muted-foreground">
                La moyenne pour cette categorie est de ~{carbonDetails.average} kg CO2.
              </p>
            </div>
          </AnalysisCard>

          <AnalysisCard icon={Bug} title={`Pesticides - ${pesticideDetails.levelLabel}`}>
            <div className="space-y-4 text-[15px] leading-7">
              <p className={`text-2xl font-semibold ${pesticideDetails.levelColor}`}>
                Niveau : {pesticideDetails.levelLabel}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Region :</span> {product.pesticides.region}
              </p>
              <div>
                <p className="font-semibold text-foreground">Pesticides identifies :</p>
                <ul className="mt-2 list-disc pl-6 text-muted-foreground">
                  {pesticideDetails.detected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Risque :</span> {pesticideDetails.risk}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Impact sante :</span> {pesticideDetails.healthImpact}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Impact environnement :</span> {pesticideDetails.environmentalImpact}
              </p>
            </div>
          </AnalysisCard>

          <AnalysisCard icon={Heart} title="Ethique & bien-etre">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--eco-good))] text-3xl font-bold text-white">
                  {ethicsDetails.score}
                </div>
                <div>
                  <p className="text-2xl font-semibold">Score ethique</p>
                  <p className="text-lg text-muted-foreground">{ethicsDetails.summary}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">Labels :</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ethicsDetails.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-muted px-4 py-2 text-sm text-primary"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 text-muted-foreground">
                  <ShieldCheck size={18} className="mt-1 text-primary" />
                  <p>
                    <span className="font-semibold text-foreground">Conditions de travail :</span>{" "}
                    {ethicsDetails.workConditions}
                  </p>
                </div>
              </div>
            </div>
          </AnalysisCard>
        </div>
      </div>

      {recommendedProduct ? (
        <div className="mt-8 px-5">
          <div className="mb-3 flex items-center gap-2">
            <RefreshCw size={18} className="text-primary" />
            <h2 className="font-serif text-lg font-semibold">Produit recommande</h2>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Nous te recommandons un produit similaire avec un meilleur score environnemental.
          </p>
          <ProductCard product={recommendedProduct} index={0} navigationState={{ product: recommendedProduct }} />
        </div>
      ) : null}
    </div>
  );
}
