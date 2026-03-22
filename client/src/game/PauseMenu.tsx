import { useEffect, useState } from "react";
import { useOfficeGame, PLAYER_COLORS, HAT_DEFS } from "../lib/stores/useOfficeGame";
import type { HatType } from "../lib/stores/useOfficeGame";

type PauseTab = "stats" | "customize" | "prestige";

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
  const sessionStartMoney = useOfficeGame((s) => s.sessionStartMoney);
  const sessionPizzas = useOfficeGame((s) => s.sessionPizzas);
  const fastestDelivery = useOfficeGame((s) => s.fastestDelivery);
  const prestigeLevel = useOfficeGame((s) => s.prestigeLevel);
  const prestigeMultiplier = useOfficeGame((s) => s.prestigeMultiplier);
  const doPrestige = useOfficeGame((s) => s.doPrestige);
  const playerColor = useOfficeGame((s) => s.playerColor);
  const playerHat = useOfficeGame((s) => s.playerHat);
  const unlockedHats = useOfficeGame((s) => s.unlockedHats);
  const unlockedColors = useOfficeGame((s) => s.unlockedColors);
  const setPlayerColor = useOfficeGame((s) => s.setPlayerColor);
  const setPlayerHat = useOfficeGame((s) => s.setPlayerHat);
  const unlockCosmetic = useOfficeGame((s) => s.unlockCosmetic);

  const [tab, setTab] = useState<PauseTab>("stats");
  const [confirmPrestige, setConfirmPrestige] = useState(false);

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
  const sessionEarned = money - sessionStartMoney;

  const tabStyle = (t: PauseTab) => ({
    background: tab === t ? "rgba(168,85,247,0.3)" : "transparent",
    border: tab === t ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "6px 12px",
    color: tab === t ? "#c084fc" : "#94a3b8",
    fontSize: 11,
    fontWeight: 600 as const,
    cursor: "pointer" as const,
    fontFamily: "'Inter', sans-serif",
  });

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
          padding: "24px 32px",
          minWidth: 380,
          maxWidth: 480,
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 800, margin: 0 }}>
            {"\u23F8\uFE0F"} Paused
            {prestigeLevel > 0 && (
              <span style={{ fontSize: 12, color: "#fbbf24", marginLeft: 8 }}>
                {"\u{1F31F}"} P{prestigeLevel} ({prestigeMultiplier}x)
              </span>
            )}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
            {minutes}:{seconds.toString().padStart(2, "0")} | ${money.toLocaleString()}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
          <button onClick={() => setTab("stats")} style={tabStyle("stats")}>Stats</button>
          <button onClick={() => setTab("customize")} style={tabStyle("customize")}>Customize</button>
          <button onClick={() => setTab("prestige")} style={tabStyle("prestige")}>Prestige</button>
        </div>

        {tab === "stats" && (
          <>
            {/* Session stats highlight */}
            <div style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))",
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 12,
              border: "1px solid rgba(249,115,22,0.2)",
            }}>
              <div style={{ color: "#f97316", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>This Session</div>
              <div style={{ display: "flex", gap: 16 }}>
                <MiniStat icon={"\u{1F355}"} label="Pizzas" value={`${sessionPizzas}`} />
                <MiniStat icon={"\u{1F4B0}"} label="Earned" value={`$${sessionEarned > 0 ? sessionEarned : 0}`} />
                <MiniStat icon={"\u26A1"} label="Fastest" value={fastestDelivery < 999 ? `${fastestDelivery.toFixed(1)}s` : "-"} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              <StatBox label="Total Earned" value={`$${totalMoneyEarned.toLocaleString()}`} color="#fbbf24" />
              <StatBox label="Pizzas Served" value={`${totalPizzasServed}`} color="#f97316" />
              <StatBox label="Missed" value={`${missedCustomers}`} color="#ef4444" />
              <StatBox label="Success" value={`${successRate}%`} color={successRate > 80 ? "#22c55e" : "#ef4444"} />
              <StatBox label="Best Streak" value={`x${bestStreak}`} color="#f97316" />
              <StatBox label="Level" value={`${gameLevel}`} color="#a855f7" />
              <StatBox label="$/min" value={`$${earningsPerMin}`} color="#06b6d4" />
              <StatBox label="Factory" value={`${ovens.length}O ${prepEmployees.length}P ${unlockedTables}T`} color="#94a3b8" />
            </div>
          </>
        )}

        {tab === "customize" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Outfit Color</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {PLAYER_COLORS.map((c) => {
                const unlocked = unlockedColors.includes(c);
                const selected = playerColor === c;
                return (
                  <button
                    key={c}
                    onClick={() => unlocked ? setPlayerColor(c) : unlockCosmetic("color", c)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: c,
                      border: selected ? "3px solid #a855f7" : unlocked ? "2px solid rgba(255,255,255,0.3)" : "2px dashed rgba(255,255,255,0.15)",
                      cursor: "pointer",
                      opacity: unlocked ? 1 : 0.4,
                      position: "relative",
                    }}
                  >
                    {!unlocked && <span style={{ fontSize: 8, position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)", color: "#94a3b8", whiteSpace: "nowrap" }}>$50</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Hat</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {HAT_DEFS.map((h) => {
                const unlocked = unlockedHats.includes(h.hat);
                const selected = playerHat === h.hat;
                const icons: Record<string, string> = { chef: "\u{1F468}\u200D\u{1F373}", tall_chef: "\u{1F9D1}\u200D\u{1F373}", beret: "\u{1F3A8}", crown: "\u{1F451}", none: "\u274C" };
                return (
                  <button
                    key={h.hat}
                    onClick={() => unlocked ? setPlayerHat(h.hat) : unlockCosmetic("hat", h.hat)}
                    style={{
                      background: selected ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                      border: selected ? "2px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      opacity: unlocked ? 1 : 0.5,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{icons[h.hat] || "\u{1F3A9}"}</span>
                    <span style={{ color: "#e2e8f0", fontSize: 9, fontWeight: 600 }}>{h.name}</span>
                    {!unlocked && <span style={{ color: "#fbbf24", fontSize: 8 }}>${h.cost}</span>}
                  </button>
                );
              })}
              <button
                onClick={() => setPlayerHat("none" as HatType)}
                style={{
                  background: playerHat === "none" ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                  border: playerHat === "none" ? "2px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 20 }}>{"\u274C"}</span>
                <span style={{ color: "#e2e8f0", fontSize: 9, fontWeight: 600 }}>None</span>
              </button>
            </div>
          </div>
        )}

        {tab === "prestige" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))",
              borderRadius: 12,
              padding: "16px",
              border: "1px solid rgba(251,191,36,0.2)",
              textAlign: "center",
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 36 }}>{"\u{1F31F}"}</div>
              <div style={{ color: "#fbbf24", fontSize: 18, fontWeight: 800 }}>
                Prestige Level {prestigeLevel}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                Current multiplier: {prestigeMultiplier}x earnings
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10,
              padding: "12px",
              marginBottom: 12,
              fontSize: 12,
              color: "#94a3b8",
              lineHeight: 1.8,
            }}>
              <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 4 }}>Prestige resets:</div>
              {"\u2022"} Money, upgrades, tables, staff, ovens<br/>
              {"\u2022"} Level progress<br/>
              <div style={{ color: "#22c55e", fontWeight: 700, marginTop: 6, marginBottom: 4 }}>You keep:</div>
              {"\u2022"} +20% earnings multiplier (permanent!)<br/>
              {"\u2022"} Unlocked cosmetics & achievements<br/>
              {"\u2022"} Daily challenge progress<br/>
              {prestigeLevel < 1 && <>{"\u2022"} Unlock: Gold & Green colors<br/></>}
              {prestigeLevel < 2 && <>{"\u2022"} Unlock: Beret hat (P2)<br/></>}
              {prestigeLevel < 3 && <>{"\u2022"} Unlock: Crown hat (P3)<br/></>}
            </div>

            {gameLevel >= 10 ? (
              confirmPrestige ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { doPrestige(); setConfirmPrestige(false); }}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px",
                      color: "#1e293b",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Confirm Prestige
                  </button>
                  <button
                    onClick={() => setConfirmPrestige(false)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      color: "#94a3b8",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmPrestige(true)}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))",
                    border: "2px solid rgba(251,191,36,0.4)",
                    borderRadius: 10,
                    padding: "12px",
                    color: "#fbbf24",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {"\u{1F31F}"} Prestige to Level {prestigeLevel + 1}
                </button>
              )
            ) : (
              <div style={{
                textAlign: "center",
                color: "#64748b",
                fontSize: 12,
                padding: "12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
              }}>
                Reach Level 10 to unlock Prestige (currently Lv.{gameLevel})
              </div>
            )}
          </div>
        )}

        <button
          onClick={togglePause}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            border: "none",
            borderRadius: 12,
            padding: "12px 0",
            color: "#ffffff",
            fontSize: 16,
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

        <div style={{ textAlign: "center", marginTop: 8, color: "#64748b", fontSize: 10 }}>
          ESC to resume
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
        padding: "8px 12px",
        border: `1px solid ${color}22`,
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 10, marginBottom: 2 }}>{label}</div>
      <div style={{ color, fontSize: 16, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#e2e8f0", fontSize: 12 }}>
      <span>{icon}</span>
      <span style={{ color: "#94a3b8" }}>{label}:</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
