import { motion } from "framer-motion";
import { ScanLine, Search, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { fetchProductByBarcode } from "@/lib/openfoodfacts";
import { toast } from "sonner";

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => {
      detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
    };
  }
}

const EXAMPLE_BARCODES = [
  { code: "3017620422003", label: "Nutella" },
  { code: "5449000000996", label: "Coca-Cola" },
  { code: "3228857000166", label: "President Beurre" },
  { code: "7622210449283", label: "Oreo" },
  { code: "3175681851856", label: "Volvic" },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const secureCameraContext = window.isSecureContext;
  const isLocalhostHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const zxingControlsRef = useRef<IScannerControls | null>(null);
  const detectionRafRef = useRef<number | null>(null);
  const detectorRef = useRef<{ detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>> } | null>(
    null
  );
  const handleScanRef = useRef<(code: string) => Promise<void>>(async () => {});
  const lastDetectedCodeRef = useRef<string>("");
  const detectionCooldownUntilRef = useRef<number>(0);

  const [searching, setSearching] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<string | null>(null);

  const stopCamera = (options?: { clearFeedback?: boolean }) => {
    if (zxingControlsRef.current) {
      zxingControlsRef.current.stop();
      zxingControlsRef.current = null;
    }
    if (zxingReaderRef.current) {
      zxingReaderRef.current = null;
    }
    if (detectionRafRef.current !== null) {
      cancelAnimationFrame(detectionRafRef.current);
      detectionRafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
    if (options?.clearFeedback !== false) {
      setCameraError(null);
      setCameraStatus(null);
    }
  };

  const handleScan = useCallback(async (code: string) => {
    if (!code.trim()) {
      toast.error("Veuillez entrer un code-barres");
      return;
    }

    setSearching(true);
    const product = await fetchProductByBarcode(code.trim());
    setSearching(false);

    if (product) {
      navigate(`/product/${product.barcode}`, { state: { product } });
      return;
    }

    toast.error("Produit non trouve dans la base de donnees");
  }, [navigate]);

  useEffect(() => {
    handleScanRef.current = handleScan;
  }, [handleScan]);

  const startCamera = async () => {
    if (cameraLoading || cameraActive) {
      return;
    }

    if (!secureCameraContext && !isLocalhostHost) {
      setCameraStatus(null);
      setCameraError("Chrome sur telephone bloque la camera en HTTP. Utilisez cette app en HTTPS sur mobile, ou localhost sur ordinateur.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("La camera n'est pas disponible sur ce navigateur.");
      return;
    }

    try {
      setCameraError(null);
      setCameraStatus(null);
      setCameraLoading(true);

      if (!window.BarcodeDetector) {
        if (!videoRef.current) {
          setCameraError("Impossible d'initialiser la previsualisation video.");
          stopCamera();
          return;
        }

        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_128,
          BarcodeFormat.QR_CODE,
        ]);
        const reader = new BrowserMultiFormatReader(hints, {
          delayBetweenScanAttempts: 120,
          delayBetweenScanSuccess: 800,
        });
        zxingReaderRef.current = reader;
        setCameraActive(true);
        setCameraStatus("Camera activee. Detection fallback ZXing activee.");

        const controls = await reader.decodeFromConstraints(
          {
            video: { facingMode: { ideal: "environment" } },
            audio: false,
          },
          videoRef.current,
          (result) => {
            const detectedCode = result?.getText()?.trim();
            if (!detectedCode) {
              return;
            }
            if (Date.now() < detectionCooldownUntilRef.current) {
              return;
            }

            lastDetectedCodeRef.current = detectedCode;
            detectionCooldownUntilRef.current = Date.now() + 2500;
            setBarcode(detectedCode);
            toast.success(`Code detecte: ${detectedCode}`);
            void handleScanRef.current(detectedCode);
          }
        );
        zxingControlsRef.current = controls;
        setCameraLoading(false);
        return;
      }

      detectorRef.current = window.BarcodeDetector
        ? new window.BarcodeDetector({
            formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "qr_code"],
          })
        : null;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      if (!videoRef.current) {
        setCameraError("Impossible d'initialiser la previsualisation video.");
        stopCamera();
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setCameraActive(true);
      setCameraLoading(false);
      setCameraStatus("Camera activee. Cadrez un code-barres dans la zone.");
    } catch {
      stopCamera({ clearFeedback: false });
      setCameraError("Impossible d'activer la camera. Verifiez les permissions et HTTPS/localhost.");
    }
  };

  useEffect(() => {
    if (!cameraActive || !detectorRef.current) {
      if (detectionRafRef.current !== null) {
        cancelAnimationFrame(detectionRafRef.current);
        detectionRafRef.current = null;
      }
      return;
    }

    const tick = async () => {
      const now = Date.now();
      const video = videoRef.current;

      if (!cameraActive || !video || !detectorRef.current) {
        return;
      }

      if (video.readyState >= 2 && now >= detectionCooldownUntilRef.current) {
        try {
          const detections = await detectorRef.current.detect(video);
          const detectedCode = detections.find((item) => item.rawValue?.trim())?.rawValue?.trim();

          if (detectedCode) {
            lastDetectedCodeRef.current = detectedCode;
            detectionCooldownUntilRef.current = Date.now() + 2500;
            setBarcode(detectedCode);
            toast.success(`Code detecte: ${detectedCode}`);
            void handleScanRef.current(detectedCode);
          }
        } catch {
          // Ignore transient frame decoding errors.
        }
      }

      detectionRafRef.current = requestAnimationFrame(tick);
    };

    detectionRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (detectionRafRef.current !== null) {
        cancelAnimationFrame(detectionRafRef.current);
        detectionRafRef.current = null;
      }
    };
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center px-5 pb-24 pt-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-center font-serif text-2xl font-bold">Scanner</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Activez la camera ou entrez un code-barres</p>
        {!secureCameraContext && !isLocalhostHost && (
          <p className="mt-2 max-w-xs text-center text-xs text-muted-foreground">
            Sur Chrome mobile, la camera fonctionne seulement en HTTPS.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 w-full max-w-xs"
      >
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Code-barres (ex: 3017620422003)"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleScan(barcode)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mt-6 aspect-square w-full max-w-xs overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-card"
      >
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${cameraActive ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          playsInline
          aria-label="Apercu camera"
        />

        <div className="absolute left-3 top-3 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-primary" />
        <div className="absolute right-3 top-3 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-primary" />
        <div className="absolute bottom-3 left-3 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-primary" />
        <div className="absolute bottom-3 right-3 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-primary" />

        {cameraActive && (
          <div className="scanner-line absolute left-4 right-4 h-0.5 bg-accent shadow-[0_0_8px_2px_hsl(var(--accent))]" />
        )}

        <div className="flex h-full items-center justify-center">
          {!cameraActive && cameraLoading ? (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <Zap size={48} className="text-accent" />
            </motion.div>
          ) : !cameraActive ? (
            <ScanLine size={48} className="text-muted-foreground/40" />
          ) : (
            <div />
          )}
        </div>
      </motion.div>

      {cameraStatus && !cameraError && <p className="mt-3 max-w-xs text-center text-xs text-primary">{cameraStatus}</p>}
      {cameraError && <p className="mt-3 max-w-xs text-center text-xs text-destructive">{cameraError}</p>}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => void (cameraActive ? stopCamera() : startCamera())}
          disabled={cameraLoading}
          className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-accent-foreground disabled:opacity-60"
        >
          <ScanLine size={20} />
          {cameraLoading ? "Activation..." : cameraActive ? "Arreter la camera" : "Activer la camera"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => void handleScan(barcode)}
          disabled={searching}
          className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Search size={18} />
          {searching ? "Recherche..." : "Rechercher"}
        </motion.button>
      </div>

      <div className="mt-6 w-full max-w-xs">
        <p className="mb-2 text-xs text-muted-foreground">Essayez un code-barres :</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_BARCODES.map((ex) => (
            <button
              key={ex.code}
              onClick={() => {
                setBarcode(ex.code);
                void handleScan(ex.code);
              }}
              disabled={searching}
              className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
