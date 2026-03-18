const DEFAULT_TIMEOUT_MS = 8000;

function parseArgs(argv) {
  const args = {
    mode: "search",
    value: "nutella",
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === "--search" && argv[index + 1]) {
      args.mode = "search";
      args.value = argv[index + 1];
      index += 1;
      continue;
    }

    if (current === "--barcode" && argv[index + 1]) {
      args.mode = "barcode";
      args.value = argv[index + 1];
      index += 1;
      continue;
    }

    if (current === "--timeout" && argv[index + 1]) {
      const timeoutMs = Number(argv[index + 1]);
      if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
        args.timeoutMs = timeoutMs;
      }
      index += 1;
    }
  }

  return args;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const startedAt = Date.now();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "demeterre-api-check/1.0",
      },
    });

    const elapsedMs = Date.now() - startedAt;
    return { response, elapsedMs };
  } finally {
    clearTimeout(timer);
  }
}

function printUsage() {
  console.log("Usage:");
  console.log("  node scripts/check-openfoodfacts.mjs --search nutella");
  console.log("  node scripts/check-openfoodfacts.mjs --barcode 3017620422003");
  console.log("  node scripts/check-openfoodfacts.mjs --search lait --timeout 12000");
}

async function main() {
  const { mode, value, timeoutMs } = parseArgs(process.argv.slice(2));

  if (!value?.trim()) {
    printUsage();
    process.exit(1);
  }

  const url =
    mode === "barcode"
      ? `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
          value.trim()
        )}?fields=code,product_name,product_name_fr,brands`
      : `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(
          value.trim()
        )}&search_simple=1&json=1&page=1&page_size=5&fields=code,product_name,product_name_fr,brands`;

  console.log(`Mode      : ${mode}`);
  console.log(`Valeur    : ${value}`);
  console.log(`Timeout   : ${timeoutMs} ms`);
  console.log(`URL       : ${url}`);
  console.log("");

  try {
    const { response, elapsedMs } = await fetchWithTimeout(url, timeoutMs);
    console.log(`HTTP      : ${response.status} ${response.statusText}`);
    console.log(`Duree     : ${elapsedMs} ms`);

    const contentType = response.headers.get("content-type") || "unknown";
    console.log(`Content   : ${contentType}`);

    const data = await response.json();

    if (mode === "barcode") {
      console.log(`status    : ${data.status}`);

      if (data.status === 0 || !data.product) {
        console.log("Resultat  : produit introuvable");
        process.exit(2);
      }

      console.log("Resultat  : OK");
      console.log(`Code      : ${data.product.code || "N/A"}`);
      console.log(`Nom       : ${data.product.product_name_fr || data.product.product_name || "N/A"}`);
      console.log(`Marque    : ${data.product.brands || "N/A"}`);
      return;
    }

    const products = Array.isArray(data.products) ? data.products : [];
    console.log(`Total     : ${data.count ?? 0}`);
    console.log(`Recus     : ${products.length}`);

    if (products.length === 0) {
      console.log("Resultat  : aucun produit retourne");
      process.exit(2);
    }

    console.log("Resultat  : OK");
    products.slice(0, 5).forEach((product, index) => {
      const name = product.product_name_fr || product.product_name || "Sans nom";
      const brand = product.brands || "Sans marque";
      const code = product.code || "Sans code";
      console.log(`${index + 1}. ${name} | ${brand} | ${code}`);
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      console.error(`Erreur    : timeout apres ${timeoutMs} ms`);
      process.exit(3);
    }

    console.error(`Erreur    : ${error instanceof Error ? error.message : String(error)}`);
    process.exit(4);
  }
}

main();
