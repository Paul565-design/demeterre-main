import { fetchProductByBarcode } from "@/lib/openfoodfacts";
import {
  getRecentScannedProducts,
  RECENT_SCANS_UPDATED_EVENT,
} from "@/lib/localProductStore";

export { getRecentScannedProducts, RECENT_SCANS_UPDATED_EVENT, saveRecentScannedProduct } from "@/lib/localProductStore";

export async function hydrateRecentScannedProducts() {
  const products = getRecentScannedProducts();
  let changed = false;

  const hydrated = await Promise.all(
    products.map(async (product) => {
      if (product.imageUrl || !product.barcode) {
        return product;
      }

      const freshProduct = await fetchProductByBarcode(product.barcode);
      if (!freshProduct?.imageUrl) {
        return product;
      }

      changed = true;
      return {
        ...product,
        imageUrl: freshProduct.imageUrl,
      };
    })
  );

  if (changed && typeof window !== "undefined") {
    window.localStorage.setItem("recent_scanned_products", JSON.stringify(hydrated));
    window.dispatchEvent(new Event(RECENT_SCANS_UPDATED_EVENT));
  }

  return hydrated;
}
