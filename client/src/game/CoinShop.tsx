import { useIAPStore, COIN_PACKS, CoinPack } from "./IAPStore";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function CoinShop() {
  const shopOpen = useIAPStore((s) => s.shopOpen);
  const closeShop = useIAPStore((s) => s.closeShop);
  const purchasing = useIAPStore((s) => s.purchasing);
  const purchaseError = useIAPStore((s) => s.purchaseError);
  const purchasePack = useIAPStore((s) => s.purchasePack);
  const money = useOfficeGame((s) => s.money);

  if (!shopOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        zIndex: 200,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #1e1b2e 0%, #0f0d1a 100%)",
          borderRadius: 20,
          padding: "24px 20px",
          maxWidth: 380,
          width: "90%",
          maxHeight: "85vh",
          overflow: "auto",
          border: "2px solid rgba(168,85,247,0.4)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ color: "#fbbf24", fontSize: 22, fontWeight: "bold", margin: 0 }}>
              Coin Shop
            </h2>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>
              Balance: <span style={{ color: "#22c55e", fontWeight: "bold" }}>${money.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={closeShop}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              color: "#fff",
              width: 36,
              height: 36,
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            X
          </button>
        </div>

        {purchaseError && (
          <div style={{
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#fca5a5",
            fontSize: 13,
            marginBottom: 12,
          }}>
            {purchaseError}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {COIN_PACKS.map((pack) => (
            <CoinPackCard
              key={pack.id}
              pack={pack}
              purchasing={purchasing}
              onPurchase={() => purchasePack(pack)}
            />
          ))}
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ color: "#64748b", fontSize: 11, lineHeight: 1.5 }}>
            Purchases are processed through the App Store.
            <br />
            Coins are added to your in-game balance immediately.
          </div>
        </div>
      </div>
    </div>
  );
}

function CoinPackCard({
  pack,
  purchasing,
  onPurchase,
}: {
  pack: CoinPack;
  purchasing: boolean;
  onPurchase: () => void;
}) {
  return (
    <button
      onClick={onPurchase}
      disabled={purchasing}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: 14,
        border: pack.popular
          ? "2px solid #f97316"
          : "1px solid rgba(255,255,255,0.1)",
        background: pack.popular
          ? "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))"
          : "rgba(255,255,255,0.05)",
        cursor: purchasing ? "not-allowed" : "pointer",
        opacity: purchasing ? 0.6 : 1,
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {pack.popular && (
        <div style={{
          position: "absolute",
          top: -1,
          right: 16,
          background: "#f97316",
          color: "#fff",
          fontSize: 9,
          fontWeight: "bold",
          padding: "2px 8px",
          borderRadius: "0 0 6px 6px",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}>
          Best Value
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          fontSize: 28,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(251,191,36,0.15)",
          borderRadius: 10,
        }}>
          💰
        </div>
        <div>
          <div style={{
            color: "#fbbf24",
            fontSize: 18,
            fontWeight: "bold",
          }}>
            ${pack.coins.toLocaleString()}
          </div>
          {pack.bonus && (
            <div style={{
              color: "#22c55e",
              fontSize: 12,
              fontWeight: "bold",
            }}>
              {pack.bonus} bonus value
            </div>
          )}
        </div>
      </div>
      <div style={{
        background: pack.popular
          ? "linear-gradient(135deg, #f97316, #ea580c)"
          : "rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "8px 16px",
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
      }}>
        {purchasing ? "..." : pack.price}
      </div>
    </button>
  );
}
