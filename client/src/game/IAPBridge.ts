const IAP_TIMEOUT = 60000;

export const InAppPurchase = {
  async purchase(productId: string): Promise<boolean> {
    if (typeof (window as any).webkit?.messageHandlers?.iap === "undefined") {
      throw new Error("Native purchase bridge not available");
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        delete (window as any).__iapCallback;
        reject(new Error("Purchase timed out"));
      }, IAP_TIMEOUT);

      (window as any).__iapCallback = (success: boolean) => {
        clearTimeout(timeout);
        delete (window as any).__iapCallback;
        resolve(success);
      };

      (window as any).webkit.messageHandlers.iap.postMessage({
        action: "purchase",
        productId,
      });
    });
  },

  async restorePurchases(): Promise<boolean> {
    if (typeof (window as any).webkit?.messageHandlers?.iap === "undefined") {
      throw new Error("Native purchase bridge not available");
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        delete (window as any).__restoreCallback;
        reject(new Error("Restore timed out"));
      }, IAP_TIMEOUT);

      (window as any).__restoreCallback = (success: boolean) => {
        clearTimeout(timeout);
        delete (window as any).__restoreCallback;
        resolve(success);
      };

      (window as any).webkit.messageHandlers.iap.postMessage({
        action: "restore",
      });
    });
  },
};
