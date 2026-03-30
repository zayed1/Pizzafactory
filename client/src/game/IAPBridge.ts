import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from "@revenuecat/purchases-capacitor";

let configured = false;
let configError: string | null = null;

function isNativeApp(): boolean {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

async function ensureConfigured(): Promise<boolean> {
  if (configured) return true;
  if (!isNativeApp()) return false;

  const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY || "appl_djWHVGaMeTnRUwUSzSPsrpzRcEA";
  if (!apiKey) {
    configError = "RevenueCat API key not set.";
    console.error("RevenueCat:", configError);
    return false;
  }

  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey });
    configured = true;
    configError = null;
    console.log("RevenueCat: Configured successfully");
    return true;
  } catch (err: any) {
    configError = err?.message || "RevenueCat configuration failed";
    console.error("RevenueCat: Configuration failed", err);
    return false;
  }
}

export const InAppPurchase = {
  isAvailable(): boolean {
    return isNativeApp();
  },

  async initialize(): Promise<boolean> {
    return ensureConfigured();
  },

  async purchase(productId: string): Promise<boolean> {
    const ready = await ensureConfigured();
    if (!ready) {
      throw new Error(configError || "In-app purchases require the iOS app.");
    }

    try {
      const offerings = await Purchases.getOfferings();
      const allPackages = offerings.current?.availablePackages || [];
      const pkg = allPackages.find((p) => p.product.identifier === productId);

      if (pkg) {
        const result = await Purchases.purchasePackage({ aPackage: pkg });
        return !!result?.customerInfo;
      }

      const productsResult = await Purchases.getProducts({
        productIdentifiers: [productId],
      });
      const product = productsResult.products?.find(
        (p) => p.identifier === productId
      );

      if (!product) {
        throw new Error(
          `Product "${productId}" not found. Make sure it's set up in both App Store Connect and RevenueCat.`
        );
      }

      const result = await Purchases.purchaseStoreProduct({ product });
      return !!result?.customerInfo;
    } catch (err: any) {
      if (err?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return false;
      }
      console.error("RevenueCat: Purchase error", err);
      throw new Error(err?.message || "Purchase failed");
    }
  },

  async restorePurchases(): Promise<boolean> {
    const ready = await ensureConfigured();
    if (!ready) {
      throw new Error(configError || "Restore requires the iOS app.");
    }

    try {
      const result = await Purchases.restorePurchases();
      return !!result?.customerInfo;
    } catch (err: any) {
      console.error("RevenueCat: Restore error", err);
      throw new Error(err?.message || "Restore failed");
    }
  },
};
