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
  const [showUpgrades, setShowUpgrades] = useState(!isMobile);

  const elapsed = gameStartTime > 0 ? Math.max(1, Math.floor((Date.now() - gameStartTime) / 60000)) : 1;
  const earningsPerMin = Math.round(totalMoneyEarned / elapsed);

  const carryIcon =
    carrying === "none" ? "\u{1F932}" :
    carrying === "dough" ? "\u{1FAD3}" : "\u{1F355}";

  const carryLabel =
    carrying === "none" ? "Empty" :
    carrying === "dough" ? "Dough" :
    carrying === "pizza_raw" ? "Raw" :
    "Ready";

  const carryColor =
    carrying === "none" ? "#64748b" :
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
      {/* === TOP BAR === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "6px 8px" : "10px 16px",
          pointerEvents: "auto",
          gap: isMobile ? 4 : 8,
        }}
      >
        {/* Left: Money + Carry */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8 }}>
          {/* Money */}
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              borderRadius: 10,
              padding: isMobile ? "5px 10px" : "8px 16px",
              color: "#22c55e",
              fontSize: isMobile ? 16 : 22,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 4,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34,197,94,0.3)",
              cursor: "pointer",
            }}
            onClick={() => useIAPStore.getState().openShop()}
          >
            <span style={{ fontSize: isMobile ? 12 : 16 }}>$</span>
            {money.toLocaleString()}
            <span style={{ fontSize: isMobile ? 9 : 12, color: "#fbbf24", marginLeft: 2 }}>+</span>
          </div>

          {/* Carrying */}
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              borderRadius: 10,
              padding: isMobile ? "5px 8px" : "8px 12px",
              color: carryColor,
              fontSize: isMobile ? 11 : 13,
              display: "flex",
              alignItems: "center",
              gap: 4,
              backdropFilter: "blur(10px)",
              border: `1px solid ${carryColor}33`,
            }}
          >
            <span style={{ fontSize: isMobile ? 13 : 16 }}>{carryIcon}</span>
            {carryLabel}{carryCount > 1 ? ` x${carryCount}` : ""}
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.85), rgba(234,88,12,0.85))",
                borderRadius: 10,
                padding: isMobile ? "5px 8px" : "8px 12px",
                color: "#fff",
                fontSize: isMobile ? 12 : 14,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 3,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(249,115,22,0.5)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              {"\u{1F525}"} x{streak}
              {!isMobile && <span style={{ fontSize: 11, opacity: 0.8, marginLeft: 2 }}>+${streak * 5}</span>}
            </div>
          )}
        </div>

        {/* Center: Level */}
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            borderRadius: 10,
            padding: isMobile ? "4px 10px" : "6px 16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(168,85,247,0.3)",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 10,
            minWidth: isMobile ? 90 : 140,
          }}
        >
          <span style={{ color: "#a855f7", fontSize: isMobile ? 11 : 14, fontWeight: "bold" }}>
            Lv.{gameLevel}
          </span>
          <div style={{
            flex: 1,
            height: isMobile ? 4 : 6,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 3,
            overflow: "hidden",
            minWidth: isMobile ? 40 : 60,
          }}>
            <div style={{
              width: `${levelPct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #a855f7, #c084fc)",
              borderRadius: 3,
              transition: "width 0.3s ease",
            }} />
          </div>
          <span style={{ color: "#9ca3af", fontSize: isMobile ? 8 : 10 }}>
            {levelProgress}/{pizzasForNextLevel}
          </span>
        </div>

        {/* Right: Stats */}
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            borderRadius: 10,
            padding: isMobile ? "5px 8px" : "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 12,
            backdropFilter: "blur(10px)",
            fontSize: isMobile ? 10 : 12,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ color: "#22c55e" }}>{"\u2713"} {totalPizzasServed}</span>
          <span style={{ color: "#ef4444" }}>{"\u2717"} {missedCustomers}</span>
          {!isMobile && (
            <>
              <span style={{ color: "#06b6d4" }}>${earningsPerMin}/m</span>
              <span style={{ color: "#f97316" }}>{"\u{1F525}"} {bestStreak}</span>
            </>
          )}
        </div>
      </div>

      {/* === HOW TO PLAY (desktop only) === */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 12,
            background: "rgba(0,0,0,0.7)",
            borderRadius: 10,
            padding: "8px 12px",
            color: "#94a3b8",
            fontSize: 11,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(148,163,184,0.1)",
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Controls</div>
          <div>WASD - Move | Q - Drop</div>
          <div style={{ color: "#f97316", fontSize: 10, marginTop: 2 }}>ESC - Pause</div>
        </div>
      )}

      {/* === BOTTOM: Upgrade Bar === */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "auto",
        }}
      >
        {/* Toggle button for mobile */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
            <button
              onClick={() => setShowUpgrades(!showUpgrades)}
              style={{
                background: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(249,115,22,0.4)",
                borderRadius: "8px 8px 0 0",
                padding: "3px 16px",
                color: "#f97316",
                fontSize: 10,
                fontWeight: "bold",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {showUpgrades ? "\u25BC Upgrades" : "\u25B2 Upgrades"}
            </button>
          </div>
        )}

        {showUpgrades && (
          <div
            style={{
              display: "flex",
              gap: isMobile ? 4 : 6,
              justifyContent: "center",
              padding: isMobile ? "4px 4px 6px" : "6px 12px 10px",
              background: isMobile ? "rgba(0,0,0,0.6)" : "transparent",
              backdropFilter: isMobile ? "blur(8px)" : "none",
              overflowX: isMobile ? "auto" : "visible",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              flexWrap: isMobile ? "nowrap" : "wrap",
            }}
          >
            <UpgradeButton
              label="Speed"
              icon="\u26A1"
              level={upgrades.speed.level}
              maxLevel={upgrades.speed.maxLevel}
              cost={upgrades.speed.cost}
              money={money}
              onClick={() => buyUpgrade("speed")}
              compact={isMobile}
            />
            <UpgradeButton
              label="Carry"
              icon="\u{1F932}"
              level={upgrades.capacity.level}
              maxLevel={upgrades.capacity.maxLevel}
              cost={upgrades.capacity.cost}
              money={money}
              onClick={() => buyUpgrade("capacity")}
              compact={isMobile}
            />
            <UpgradeButton
              label="Oven"
              icon="\u{1F525}"
              level={upgrades.ovenSpeed.level}
              maxLevel={upgrades.ovenSpeed.maxLevel}
              cost={upgrades.ovenSpeed.cost}
              money={money}
              onClick={() => buyUpgrade("ovenSpeed")}
              compact={isMobile}
            />
            <UpgradeButton
              label="Dough"
              icon="\u{1FAD3}"
              level={upgrades.doughSpeed.level}
              maxLevel={upgrades.doughSpeed.maxLevel}
              cost={upgrades.doughSpeed.cost}
              money={money}
              onClick={() => buyUpgrade("doughSpeed")}
              compact={isMobile}
            />
            <UpgradeButton
              label="Prep"
              icon="\u2702\uFE0F"
              level={upgrades.prepSpeed.level}
              maxLevel={upgrades.prepSpeed.maxLevel}
              cost={upgrades.prepSpeed.cost}
              money={money}
              onClick={() => buyUpgrade("prepSpeed")}
              compact={isMobile}
            />
            {ovens.length < 3 && (
              <UpgradeButton
                label="Oven+"
                icon="\u{1F3ED}"
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
                icon="\u{1F468}\u200D\u{1F373}"
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
                label="Table"
                icon="\u{1FA91}"
                level={upgrades.newTable.level}
                maxLevel={upgrades.newTable.maxLevel}
                cost={upgrades.newTable.cost}
                money={money}
                onClick={() => buyUpgrade("newTable")}
                compact={isMobile}
              />
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
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
          : "rgba(30,30,30,0.85)",
        border: maxed
          ? "2px solid #555"
          : canAfford ? "2px solid #f97316" : "2px solid #333",
        borderRadius: compact ? 8 : 10,
        padding: compact ? "4px 6px" : "6px 10px",
        color: canAfford ? "#ffffff" : "#6b7280",
        cursor: canAfford ? "pointer" : "not-allowed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        minWidth: compact ? 52 : 68,
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
