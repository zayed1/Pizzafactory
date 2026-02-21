import { useEffect } from "react";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function PauseMenu() {
  const phase = useOfficeGame((s) => s.phase);
  const togglePause = useOfficeGame((s) => s.togglePause);
  const money = useOfficeGame((s) => s.money);
  const totalMoneyEarned = useOfficeGame((s) => s.totalMoneyEarned);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const missedCustomers = useOfficeGame((s) => s.missedCustomers);
  const bestStreak = useOfficeGame((s) => s.bestStreak);
  const gameLevel = useOfficeGame((s) => s.gameLevel);
  const gameStartTime = useOfficeGame((s) => s.gameStartTime);
  const ovens = useOfficeGame((s) => s.ovens);
  const prepEmployees = useOfficeGame((s) => s.prepEmployees);
  const tables = useOfficeGame((s) => s.tables);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "playing" || phase === "paused")) {
        togglePause();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, togglePause]);

  if (phase !== "paused") return null;

  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const earningsPerMin = minutes > 0 ? Math.round(totalMoneyEarned / minutes) : totalMoneyEarned;
  const successRate = totalPizzasServed + missedCustomers > 0
    ? Math.round((totalPizzasServed / (totalPizzasServed + missedCustomers)) * 100)
    : 100;
  const unlockedTables = tables.filter((t) => t.unlocked).length;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 200,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b2e 0%, #2d1f3d 100%)",
          borderRadius: 20,
          padding: "32px 40px",
          minWidth: 380,
          maxWidth: 440,
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>⏸️</div>
          <h2 style={{ color: "#e2e8f0", fontSize: 28, fontWeight: 800, margin: 0 }}>Paused</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
            Time: {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <StatBox label="Money" value={`$${money.toLocaleString()}`} color="#22c55e" />
          <StatBox label="Total Earned" value={`$${totalMoneyEarned.toLocaleString()}`} color="#fbbf24" />
          <StatBox label="Pizzas Served" value={`${totalPizzasServed}`} color="#f97316" />
          <StatBox label="Missed" value={`${missedCustomers}`} color="#ef4444" />
          <StatBox label="Best Streak" value={`x${bestStreak}`} color="#f97316" />
          <StatBox label="Success Rate" value={`${successRate}%`} color={successRate > 80 ? "#22c55e" : "#ef4444"} />
          <StatBox label="Level" value={`${gameLevel}`} color="#a855f7" />
          <StatBox label="$/min" value={`$${earningsPerMin}`} color="#06b6d4" />
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, marginBottom: 16 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Factory Status</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <MiniStat icon="🔥" label="Ovens" value={`${ovens.length}`} />
            <MiniStat icon="👨‍🍳" label="Prep Staff" value={`${prepEmployees.length}`} />
            <MiniStat icon="🪑" label="Tables" value={`${unlockedTables}/${tables.length}`} />
          </div>
        </div>

        <button
          onClick={togglePause}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            border: "none",
            borderRadius: 12,
            padding: "14px 0",
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
        >
          Resume Game
        </button>

        <div style={{ textAlign: "center", marginTop: 10, color: "#64748b", fontSize: 11 }}>
          Press ESC to resume
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 10,
        padding: "10px 14px",
        border: `1px solid ${color}22`,
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>{label}</div>
      <div style={{ color, fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#e2e8f0", fontSize: 13 }}>
      <span>{icon}</span>
      <span style={{ color: "#94a3b8" }}>{label}:</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
