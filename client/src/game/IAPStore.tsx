import { create } from "zustand";

export interface CoinPack {
  id: string;
  productId: string;
  coins: number;
  price: string;
  bonus: string;
  popular?: boolean;
}

export const COIN_PACKS: CoinPack[] = [
  {
    id: "pack_100",
    productId: "com.pizzafactory.coins100",
    coins: 100,
    price: "$0.99",
    bonus: "",
  },
  {
    id: "pack_500",
    productId: "com.pizzafactory.coins500",
    coins: 500,
    price: "$3.99",
    bonus: "+25%",
  },
  {
    id: "pack_2000",
    productId: "com.pizzafactory.coins2000",
    coins: 2000,
    price: "$9.99",
    bonus: "+60%",
    popular: true,
  },
  {
    id: "pack_5000",
    productId: "com.pizzafactory.coins5000",
    coins: 5000,
    price: "$19.99",
    bonus: "+100%",
  },
];

interface IAPState {
  shopOpen: boolean;
  purchasing: boolean;
  purchaseError: string | null;
  openShop: () => void;
  closeShop: () => void;
  purchasePack: (pack: CoinPack) => Promise<void>;
}

export const useIAPStore = create<IAPState>((set) => ({
  shopOpen: false,
  purchasing: false,
  purchaseError: null,

  openShop: () => set({ shopOpen: true, purchaseError: null }),
  closeShop: () => set({ shopOpen: false, purchaseError: null }),

  purchasePack: async (pack: CoinPack) => {
    const state = useIAPStore.getState();
    if (state.purchasing) return;
    set({ purchasing: true, purchaseError: null });

    try {
      const { InAppPurchase } = await import("./IAPBridge");

      if (!InAppPurchase.isAvailable()) {
        set({ purchasing: false, purchaseError: "In-app purchases are only available in the iOS app" });
        return;
      }

      const success = await InAppPurchase.purchase(pack.productId);
      if (success) {
        const { useOfficeGame } = await import("../lib/stores/useOfficeGame");
        useOfficeGame.getState().addMoney(pack.coins);
        set({ purchasing: false });
      } else {
        set({ purchasing: false, purchaseError: "Purchase cancelled" });
      }
    } catch (err: any) {
      set({ purchasing: false, purchaseError: err?.message || "Purchase failed" });
    }
  },
}));
