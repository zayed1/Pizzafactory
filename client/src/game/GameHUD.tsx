import { useOfficeGame } from "../lib/stores/useOfficeGame";

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
  const unlockedTables = tables.filter((t) => t.unlocked).length;
  const totalTables = tables.length;

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
          top: 12,
          left: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            borderRadius: 12,
            padding: "10px 18px",
            color: "#22c55e",
            fontSize: 26,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 8,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <span>$</span>
          {money.toLocaleString()}
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            borderRadius: 10,
            padding: "8px 14px",
            color: carryColor,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(10px)",
            border: `1px solid ${carryColor}33`,
          }}
        >
          <span style={{ fontSize: 16 }}>{carrying === "none" ? "🤲" : carrying === "dough" ? "🫓" : "🍕"}</span>
          {carryLabel}{carryCount > 1 ? ` x${carryCount}` : ""}
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.65)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "#94a3b8",
            fontSize: 12,
            display: "flex",
            gap: 12,
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ color: "#22c55e" }}>Served: {totalPizzasServed}</span>
          <span style={{ color: "#ef4444" }}>Missed: {missedCustomers}</span>
        </div>
      </div>

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
        <div>1. Pick dough from machine</div>
        <div>2. Put in oven</div>
        <div>3. Take pizza to prep</div>
        <div>4. Deliver to customer</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          pointerEvents: "auto",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "95vw",
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
        />
        <UpgradeButton
          label="Carry"
          icon="🤲"
          level={upgrades.capacity.level}
          maxLevel={upgrades.capacity.maxLevel}
          cost={upgrades.capacity.cost}
          money={money}
          onClick={() => buyUpgrade("capacity")}
        />
        <UpgradeButton
          label="Oven"
          icon="🔥"
          level={upgrades.ovenSpeed.level}
          maxLevel={upgrades.ovenSpeed.maxLevel}
          cost={upgrades.ovenSpeed.cost}
          money={money}
          onClick={() => buyUpgrade("ovenSpeed")}
        />
        <UpgradeButton
          label="Dough"
          icon="🫓"
          level={upgrades.doughSpeed.level}
          maxLevel={upgrades.doughSpeed.maxLevel}
          cost={upgrades.doughSpeed.cost}
          money={money}
          onClick={() => buyUpgrade("doughSpeed")}
        />
        {prepEmployees.length < 3 && (
          <UpgradeButton
            label="Prep Staff"
            icon="👨‍🍳"
            level={upgrades.prepEmployee.level}
            maxLevel={upgrades.prepEmployee.maxLevel}
            cost={upgrades.prepEmployee.cost}
            money={money}
            onClick={() => buyUpgrade("prepEmployee")}
          />
        )}
        {unlockedTables < totalTables && (
          <UpgradeButton
            label={`Table ${unlockedTables + 1}`}
            icon="🪑"
            level={upgrades.newTable.level}
            maxLevel={upgrades.newTable.maxLevel}
            cost={upgrades.newTable.cost}
            money={money}
            onClick={() => buyUpgrade("newTable")}
          />
        )}
      </div>
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
}: {
  label: string;
  icon: string;
  level: number;
  maxLevel: number;
  cost: number;
  money: number;
  onClick: () => void;
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
        borderRadius: 10,
        padding: "8px 14px",
        color: canAfford ? "#ffffff" : "#6b7280",
        cursor: canAfford ? "pointer" : "not-allowed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        minWidth: 80,
        transition: "transform 0.15s, box-shadow 0.15s",
        backdropFilter: "blur(10px)",
        fontSize: 12,
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
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span>{label}</span>
      <span style={{ fontSize: 10, opacity: 0.8 }}>
        {maxed ? "MAX" : `Lv.${level}`}
      </span>
      {!maxed && (
        <span style={{ fontSize: 11, color: canAfford ? "#fed7aa" : "#9ca3af" }}>
          ${cost}
        </span>
      )}
    </button>
  );
}
