import { useState, useEffect } from "react";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { useIAPStore } from "./IAPStore";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(
      "ontouchstart" in window || window.innerWidth < 900
    );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export function GameHUD() {
  const money = useOfficeGame((s) => s.money);
  const carrying = useOfficeGame((s) => s.carrying);
  const carryCount = useOfficeGame((s) => s.carryCount);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const missedCustomers = useOfficeGame((s) => s.missedCustomers);
  const upgrades = useOfficeGame((s) => s.upgrades);
  const buyUpgrade = useOfficeGame((s) => s.buyUpgrade);
  const tables = useOfficeGame((s) => s.tables);
  const prepEmployees = useOfficeGame((s) => s.prepEmployees);
  const ovens = useOfficeGame((s) => s.ovens);
  const streak = useOfficeGame((s) => s.streak);
  const bestStreak = useOfficeGame((s) => s.bestStreak);
  const gameLevel = useOfficeGame((s) => s.gameLevel);
  const levelProgress = useOfficeGame((s) => s.levelProgress);
  const pizzasForNextLevel = useOfficeGame((s) => s.pizzasForNextLevel);
  const totalMoneyEarned = useOfficeGame((s) => s.totalMoneyEarned);
  const gameStartTime = useOfficeGame((s) => s.gameStartTime);
  const unlockedTables = tables.filter((t) => t.unlocked).length;
  const totalTables = tables.length;
  const isMobile = useIsMobile();

  const elapsed = gameStartTime > 0 ? Math.max(1, Math.floor((Date.now() - gameStartTime) / 60000)) : 1;
  const earningsPerMin = Math.round(totalMoneyEarned / elapsed);

  const carryLabel =
    carrying === "none" ? "Empty" :
    carrying === "dough" ? "Dough" :
    carrying === "pizza_raw" ? "Pizza (raw)" :
    "Pizza (ready)";

  const carryColor =
    carrying === "none" ? "#94a3b8" :
    carrying === "dough" ? "#f5deb3" :
    carrying === "pizza_raw" ? "#e8a849" :
    "#22c55e";

  const levelPct = Math.min(100, (levelProgress / pizzasForNextLevel) * 100);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: isMobile ? 6 : 12,
          left: isMobile ? 6 : 12,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 3 : 6,
          pointerEvents: "auto",
          maxWidth: isMobile ? "45vw" : "auto",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            borderRadius: isMobile ? 8 : 12,
            padding: isMobile ? "6px 12px" : "10px 18px",
            color: "#22c55e",
            fontSize: isMobile ? 18 : 26,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(34,197,94,0.3)",
            cursor: "pointer",
          }}
          onClick={() => useIAPStore.getState().openShop()}
        >
          <span>$</span>
          {money.toLocaleString()}
          <span style={{ fontSize: isMobile ? 10 : 14, color: "#fbbf24", marginLeft: 4 }}>+</span>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            borderRadius: 8,
            padding: isMobile ? "4px 10px" : "8px 14px",
            color: carryColor,
            fontSize: isMobile ? 11 : 14,
            display: "flex",
            alignItems: "center",
            gap: 4,
            backdropFilter: "blur(10px)",
            border: `1px solid ${carryColor}33`,
          }}
        >
          <span style={{ fontSize: isMobile ? 12 : 16 }}>{carrying === "none" ? "🤲" : carrying === "dough" ? "🫓" : "🍕"}</span>
          {carryLabel}{carryCount > 1 ? ` x${carryCount}` : ""}
        </div>

        {streak > 0 && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.8), rgba(234,88,12,0.8))",
              borderRadius: 8,
              padding: isMobile ? "3px 8px" : "6px 14px",
              color: "#ffffff",
              fontSize: isMobile ? 11 : 14,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 4,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(249,115,22,0.5)",
            }}
          >
            <span style={{ fontSize: isMobile ? 13 : 18 }}>🔥</span>
            x{streak}
            {!isMobile && <span style={{ fontSize: 11, opacity: 0.8 }}>+${streak * 5} bonus</span>}
          </div>
        )}

        <div
          style={{
            background: "rgba(0,0,0,0.65)",
            borderRadius: 6,
            padding: isMobile ? "3px 8px" : "6px 12px",
            color: "#94a3b8",
            fontSize: isMobile ? 9 : 12,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "#22c55e" }}>✓{totalPizzasServed}</span>
            <span style={{ color: "#ef4444" }}>✗{missedCustomers}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "#06b6d4" }}>${earningsPerMin}/m</span>
            <span style={{ color: "#f97316" }}>🔥{bestStreak}</span>
          </div>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            borderRadius: 8,
            padding: isMobile ? "4px 8px" : "8px 14px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(168,85,247,0.3)",
          }}
        >
          <div style={{ color: "#a855f7", fontSize: isMobile ? 10 : 13, fontWeight: "bold", marginBottom: 2 }}>
            Lv.{gameLevel}
          </div>
          <div style={{
            width: "100%",
            height: isMobile ? 4 : 6,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 3,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${levelPct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #a855f7, #c084fc)",
              borderRadius: 3,
              transition: "width 0.3s ease",
            }} />
          </div>
          <div style={{ color: "#9ca3af", fontSize: isMobile ? 8 : 10, marginTop: 2 }}>
            {levelProgress}/{pizzasForNextLevel}
          </div>
        </div>
      </div>

      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.75)",
            borderRadius: 10,
            padding: "8px 12px",
            color: "#94a3b8",
            fontSize: 12,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(148,163,184,0.15)",
            lineHeight: 1.6,
          }}
        >
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>How to Play</div>
          <div>WASD - Move</div>
          <div>Q - Drop item</div>
          <div>1. Pick dough from machine</div>
          <div>2. Put in oven</div>
          <div>3. Take pizza to prep</div>
          <div>4. Deliver to customer</div>
          <div style={{ marginTop: 4, color: "#f97316", fontSize: 11 }}>Serve fast for streak bonus!</div>
          <div style={{ color: "#a855f7", fontSize: 11 }}>ESC - Pause & Stats</div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: isMobile ? 240 : 12,
          left: isMobile ? 0 : 0,
          right: 0,
          display: "flex",
          gap: isMobile ? 4 : 6,
          pointerEvents: "auto",
          justifyContent: isMobile ? "flex-start" : "center",
          overflowX: isMobile ? "auto" : "visible",
          overflowY: "hidden",
          paddingLeft: isMobile ? 8 : 0,
          paddingRight: isMobile ? 8 : 0,
          paddingBottom: isMobile ? 4 : 0,
          WebkitOverflowScrolling: "touch",
          flexWrap: isMobile ? "nowrap" : "wrap",
          maxWidth: "100vw",
        }}
      >
        <UpgradeButton
          label="Speed"
          icon="⚡"
          level={upgrades.speed.level}
          maxLevel={upgrades.speed.maxLevel}
          cost={upgrades.speed.cost}
          money={money}
          onClick={() => buyUpgrade("speed")}
          compact={isMobile}
        />
        <UpgradeButton
          label="Carry"
          icon="🤲"
          level={upgrades.capacity.level}
          maxLevel={upgrades.capacity.maxLevel}
          cost={upgrades.capacity.cost}
          money={money}
          onClick={() => buyUpgrade("capacity")}
          compact={isMobile}
        />
        <UpgradeButton
          label="Oven"
          icon="🔥"
          level={upgrades.ovenSpeed.level}
          maxLevel={upgrades.ovenSpeed.maxLevel}
          cost={upgrades.ovenSpeed.cost}
          money={money}
          onClick={() => buyUpgrade("ovenSpeed")}
          compact={isMobile}
        />
        <UpgradeButton
          label="Dough"
          icon="🫓"
          level={upgrades.doughSpeed.level}
          maxLevel={upgrades.doughSpeed.maxLevel}
          cost={upgrades.doughSpeed.cost}
          money={money}
          onClick={() => buyUpgrade("doughSpeed")}
          compact={isMobile}
        />
        <UpgradeButton
          label="Prep"
          icon="✂️"
          level={upgrades.prepSpeed.level}
          maxLevel={upgrades.prepSpeed.maxLevel}
          cost={upgrades.prepSpeed.cost}
          money={money}
          onClick={() => buyUpgrade("prepSpeed")}
          compact={isMobile}
        />
        {ovens.length < 3 && (
          <UpgradeButton
            label={`Oven+`}
            icon="🏭"
            level={upgrades.newOven.level}
            maxLevel={upgrades.newOven.maxLevel}
            cost={upgrades.newOven.cost}
            money={money}
            onClick={() => buyUpgrade("newOven")}
            compact={isMobile}
          />
        )}
        {prepEmployees.length < 3 && (
          <UpgradeButton
            label="Staff"
            icon="👨‍🍳"
            level={upgrades.prepEmployee.level}
            maxLevel={upgrades.prepEmployee.maxLevel}
            cost={upgrades.prepEmployee.cost}
            money={money}
            onClick={() => buyUpgrade("prepEmployee")}
            compact={isMobile}
          />
        )}
        {unlockedTables < totalTables && (
          <UpgradeButton
            label={`Table`}
            icon="🪑"
            level={upgrades.newTable.level}
            maxLevel={upgrades.newTable.maxLevel}
            cost={upgrades.newTable.cost}
            money={money}
            onClick={() => buyUpgrade("newTable")}
            compact={isMobile}
          />
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}

function UpgradeButton({
  label,
  icon,
  level,
  maxLevel,
  cost,
  money,
  onClick,
  compact = false,
}: {
  label: string;
  icon: string;
  level: number;
  maxLevel: number;
  cost: number;
  money: number;
  onClick: () => void;
  compact?: boolean;
}) {
  const maxed = level >= maxLevel;
  const canAfford = money >= cost && !maxed;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      style={{
        background: maxed
          ? "rgba(100,100,100,0.6)"
          : canAfford
          ? "linear-gradient(135deg, rgba(249,115,22,0.9), rgba(234,88,12,0.9))"
          : "rgba(50,50,50,0.8)",
        border: maxed
          ? "2px solid #666"
          : canAfford ? "2px solid #f97316" : "2px solid #404040",
        borderRadius: compact ? 8 : 10,
        padding: compact ? "4px 6px" : "6px 10px",
        color: canAfford ? "#ffffff" : "#6b7280",
        cursor: canAfford ? "pointer" : "not-allowed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        minWidth: compact ? 52 : 70,
        flexShrink: 0,
        transition: "transform 0.15s, box-shadow 0.15s",
        backdropFilter: "blur(10px)",
        fontSize: compact ? 9 : 11,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
      }}
      onMouseEnter={(e) => {
        if (canAfford) {
          (e.target as HTMLElement).style.transform = "scale(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = "scale(1)";
      }}
    >
      <span style={{ fontSize: compact ? 14 : 18 }}>{icon}</span>
      <span>{label}</span>
      <span style={{ fontSize: compact ? 8 : 10, opacity: 0.8 }}>
        {maxed ? "MAX" : `Lv.${level}`}
      </span>
      {!maxed && (
        <span style={{ fontSize: compact ? 8 : 10, color: canAfford ? "#fed7aa" : "#9ca3af" }}>
          ${cost}
        </span>
      )}
    </button>
  );
}
