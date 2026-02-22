const IAP_TIMEOUT = 60000;
const BRIDGE_WAIT_TIMEOUT = 5000;
const BRIDGE_POLL_INTERVAL = 200;

function checkBridgeNow(): boolean {
  try {
    if ((window as any).webkit?.messageHandlers?.iap) return true;
  } catch {}
  try {
    if ((window as any).__iapBridgeAvailable) return true;
  } catch {}
  return false;
}

function isNativeApp(): boolean {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

async function waitForBridge(): Promise<boolean> {
  if (checkBridgeNow()) return true;
  if (!isNativeApp()) return false;

  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (checkBridgeNow()) {
        clearInterval(interval);
        resolve(true);
        return;
      }
      if (Date.now() - start > BRIDGE_WAIT_TIMEOUT) {
        clearInterval(interval);
        resolve(false);
      }
    }, BRIDGE_POLL_INTERVAL);
  });
}

function postToNative(message: Record<string, any>): void {
  if ((window as any).webkit?.messageHandlers?.iap) {
    (window as any).webkit.messageHandlers.iap.postMessage(message);
    return;
  }
  throw new Error("Native message handler not found");
}

export const InAppPurchase = {
  isAvailable(): boolean {
    return checkBridgeNow() || isNativeApp();
  },

  async purchase(productId: string): Promise<boolean> {
    const bridgeReady = await waitForBridge();
    if (!bridgeReady) {
      throw new Error("In-app purchases require the iOS app. Please install from the App Store.");
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

      try {
        postToNative({ action: "purchase", productId });
      } catch (err) {
        clearTimeout(timeout);
        delete (window as any).__iapCallback;
        reject(err);
      }
    });
  },

  async restorePurchases(): Promise<boolean> {
    const bridgeReady = await waitForBridge();
    if (!bridgeReady) {
      throw new Error("Restore requires the iOS app. Please install from the App Store.");
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

      try {
        postToNative({ action: "restore" });
      } catch (err) {
        clearTimeout(timeout);
        delete (window as any).__restoreCallback;
        reject(err);
      }
    });
  },
};
