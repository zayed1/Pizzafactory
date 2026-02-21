import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function GameHUD() {
  const money = useOfficeGame((s) => s.money);
  const papersCarried = useOfficeGame((s) => s.papersCarried);
  const maxPapers = useOfficeGame((s) => s.maxPapers);
  const upgrades = useOfficeGame((s) => s.upgrades);
  const buyUpgrade = useOfficeGame((s) => s.buyUpgrade);
  const employees = useOfficeGame((s) => s.employees);
  const unlockedDesks = employees.filter((e) => e.unlocked).length;
  const totalDesks = employees.length;

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
          top: 16,
          left: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.7)",
            borderRadius: 12,
            padding: "12px 20px",
            color: "#22c55e",
            fontSize: 28,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 8,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <span style={{ fontSize: 24 }}>$</span>
          {money.toLocaleString()}
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.7)",
            borderRadius: 12,
            padding: "10px 16px",
            color: "#f5f5dc",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(245,245,220,0.2)",
          }}
        >
          <span>📄</span>
          {papersCarried}/{maxPapers}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0,0,0,0.7)",
          borderRadius: 12,
          padding: "8px 14px",
          color: "#94a3b8",
          fontSize: 13,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(148,163,184,0.2)",
        }}
      >
        <div style={{ marginBottom: 4, color: "#e2e8f0", fontWeight: 600 }}>Controls</div>
        <div>W/A/S/D - Move</div>
        <div>Walk near printer to collect</div>
        <div>Walk near desk to deliver</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          pointerEvents: "auto",
        }}
      >
        <UpgradeButton
          label="Speed"
          icon="⚡"
          level={upgrades.speed.level}
          cost={upgrades.speed.cost}
          money={money}
          onClick={() => buyUpgrade("speed")}
        />
        <UpgradeButton
          label="Capacity"
          icon="📦"
          level={upgrades.capacity.level}
          cost={upgrades.capacity.cost}
          money={money}
          onClick={() => buyUpgrade("capacity")}
        />
        <UpgradeButton
          label="Printer"
          icon="🖨️"
          level={upgrades.printerSpeed.level}
          cost={upgrades.printerSpeed.cost}
          money={money}
          onClick={() => buyUpgrade("printerSpeed")}
        />
        {unlockedDesks < totalDesks && (
          <UpgradeButton
            label={`Desk ${unlockedDesks + 1}`}
            icon="🪑"
            level={upgrades.newDesk.level}
            cost={upgrades.newDesk.cost}
            money={money}
            onClick={() => buyUpgrade("newDesk")}
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
  cost,
  money,
  onClick,
}: {
  label: string;
  icon: string;
  level: number;
  cost: number;
  money: number;
  onClick: () => void;
}) {
  const canAfford = money >= cost;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      style={{
        background: canAfford
          ? "linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))"
          : "rgba(50,50,50,0.8)",
        border: canAfford ? "2px solid #22c55e" : "2px solid #404040",
        borderRadius: 12,
        padding: "10px 16px",
        color: canAfford ? "#ffffff" : "#6b7280",
        cursor: canAfford ? "pointer" : "not-allowed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minWidth: 90,
        transition: "transform 0.15s, box-shadow 0.15s",
        backdropFilter: "blur(10px)",
        fontSize: 13,
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
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span>{label}</span>
      <span style={{ fontSize: 11, opacity: 0.8 }}>Lv.{level}</span>
      <span style={{ fontSize: 12, color: canAfford ? "#bbf7d0" : "#9ca3af" }}>
        ${cost}
      </span>
    </button>
  );
}
