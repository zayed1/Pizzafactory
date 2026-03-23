import { useEffect, useState } from "react";
import { useOfficeGame, PLAYER_COLORS, HAT_DEFS, SKILL_DEFS, TITLE_DEFS, RESTAURANT_THEMES } from "../lib/stores/useOfficeGame";
import type { HatType, SkillId, RestaurantThemeId } from "../lib/stores/useOfficeGame";

type PauseTab = "stats" | "customize" | "prestige" | "skills";

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

  const skillPoints = useOfficeGame((s) => s.skillPoints);
  const skills = useOfficeGame((s) => s.skills);
  const unlockSkill = useOfficeGame((s) => s.unlockSkill);
  const levelStars = useOfficeGame((s) => s.levelStars);
  const zoneVisits = useOfficeGame((s) => s.zoneVisits);
  const sessionBestCombo = useOfficeGame((s) => s.sessionBestCombo);
  const sessionMaxSingleEarning = useOfficeGame((s) => s.sessionMaxSingleEarning);
  const getTitle = useOfficeGame((s) => s.getTitle);
  const titleInfo = getTitle();

  const weeklyChallenges = useOfficeGame((s) => s.weeklyChallenges);
  const personalBests = useOfficeGame((s) => s.personalBests);
  const sessionHistory = useOfficeGame((s) => s.sessionHistory);
  const customGoal = useOfficeGame((s) => s.customGoal);
  const setCustomGoal = useOfficeGame((s) => s.setCustomGoal);
  const reputation = useOfficeGame((s) => s.reputation);
  const restaurantThemeId = useOfficeGame((s) => s.restaurantThemeId);
  const unlockedThemes = useOfficeGame((s) => s.unlockedThemes);
  const setRestaurantTheme = useOfficeGame((s) => s.setRestaurantTheme);
  const unlockTheme = useOfficeGame((s) => s.unlockTheme);

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
            {titleInfo.icon} {titleInfo.title} | {minutes}:{seconds.toString().padStart(2, "0")} | ${money.toLocaleString()}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <button onClick={() => setTab("stats")} style={tabStyle("stats")}>Stats</button>
          <button onClick={() => setTab("skills")} style={tabStyle("skills")}>
            Skills {skillPoints > 0 && <span style={{ color: "#fbbf24", marginLeft: 4 }}>({skillPoints})</span>}
          </button>
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
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <MiniStat icon={"\u{1F355}"} label="Pizzas" value={`${sessionPizzas}`} />
                <MiniStat icon={"\u{1F4B0}"} label="Earned" value={`$${sessionEarned > 0 ? sessionEarned : 0}`} />
                <MiniStat icon={"\u26A1"} label="Fastest" value={fastestDelivery < 999 ? `${fastestDelivery.toFixed(1)}s` : "-"} />
                <MiniStat icon={"\u{1F4A5}"} label="Best Combo" value={`x${sessionBestCombo}`} />
                <MiniStat icon={"\u{1F4B5}"} label="Max Single" value={`$${sessionMaxSingleEarning}`} />
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

            {/* Level Stars */}
            {Object.keys(levelStars).length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                border: "1px solid rgba(251,191,36,0.15)",
              }}>
                <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Level Stars</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(levelStars).map(([lvl, stars]) => (
                    <div key={lvl} style={{ textAlign: "center" }}>
                      <div style={{ color: "#94a3b8", fontSize: 9 }}>Lv.{lvl}</div>
                      <div style={{ fontSize: 10, letterSpacing: 1 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span key={i} style={{ color: i < stars ? "#fbbf24" : "#4b5563" }}>{"\u2605"}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Challenges */}
            {weeklyChallenges.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                border: "1px solid rgba(59,130,246,0.15)",
              }}>
                <div style={{ color: "#3b82f6", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Weekly Challenges</div>
                {weeklyChallenges.map((wc) => {
                  const pct = Math.min(100, (wc.progress / wc.target) * 100);
                  return (
                    <div key={wc.id} style={{ marginBottom: 6, opacity: wc.completed ? 0.6 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: wc.completed ? "#22c55e" : "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
                        <span>{wc.icon} {wc.description}</span>
                        <span style={{ color: wc.completed ? "#22c55e" : "#fbbf24", fontSize: 9, fontWeight: 700 }}>
                          {wc.completed ? "\u2713" : `$${wc.reward}`}
                        </span>
                      </div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 2, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: wc.completed ? "#22c55e" : "#3b82f6", borderRadius: 2, transition: "width 0.3s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Personal Bests */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 12,
              border: "1px solid rgba(251,191,36,0.15)",
            }}>
              <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Personal Bests</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 10 }}>
                <div style={{ color: "#94a3b8" }}>Session Earnings: <span style={{ color: "#22c55e", fontWeight: 700 }}>${personalBests.bestSessionEarnings}</span></div>
                <div style={{ color: "#94a3b8" }}>Session Pizzas: <span style={{ color: "#f97316", fontWeight: 700 }}>{personalBests.bestSessionPizzas}</span></div>
                <div style={{ color: "#94a3b8" }}>No Miss Streak: <span style={{ color: "#ef4444", fontWeight: 700 }}>{personalBests.longestNoMiss}</span></div>
                <div style={{ color: "#94a3b8" }}>Best Combo: <span style={{ color: "#a855f7", fontWeight: 700 }}>x{personalBests.bestCombo}</span></div>
                <div style={{ color: "#94a3b8" }}>Highest Single: <span style={{ color: "#fbbf24", fontWeight: 700 }}>${personalBests.highestSingleEarning}</span></div>
              </div>
            </div>

            {/* Session History (last 5) */}
            {sessionHistory.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                border: "1px solid rgba(168,85,247,0.15)",
              }}>
                <div style={{ color: "#a855f7", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Recent Sessions</div>
                <div style={{ display: "flex", gap: 4, height: 50, alignItems: "flex-end" }}>
                  {sessionHistory.slice(-5).map((s, i) => {
                    const maxE = Math.max(...sessionHistory.slice(-5).map(h => h.earnings), 1);
                    const h = Math.max(8, (s.earnings / maxE) * 45);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{
                          width: "100%",
                          height: h,
                          background: "linear-gradient(to top, #a855f7, #c084fc)",
                          borderRadius: 3,
                          opacity: 0.7,
                        }} />
                        <span style={{ color: "#94a3b8", fontSize: 7 }}>${s.earnings}</span>
                        <span style={{ color: "#64748b", fontSize: 6 }}>{s.date.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Goal */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 12,
              border: "1px solid rgba(6,182,212,0.15)",
            }}>
              <div style={{ color: "#06b6d4", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Custom Goal</div>
              {customGoal ? (
                <div>
                  <div style={{ fontSize: 10, color: "#e2e8f0" }}>
                    {customGoal.type === "level" ? `Reach Level ${customGoal.target}` :
                     customGoal.type === "money" ? `Earn $${customGoal.target}` :
                     `Serve ${customGoal.target} pizzas`}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <button onClick={() => setCustomGoal(null)} style={{
                      background: "rgba(239,68,68,0.2)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 6,
                      padding: "2px 8px",
                      color: "#ef4444",
                      fontSize: 9,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}>Clear</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {[
                    { type: "level" as const, target: gameLevel + 3, label: `Lv.${gameLevel + 3}` },
                    { type: "money" as const, target: Math.ceil(totalMoneyEarned * 1.5 / 100) * 100, label: `$${Math.ceil(totalMoneyEarned * 1.5 / 100) * 100}` },
                    { type: "pizzas" as const, target: totalPizzasServed + 50, label: `${totalPizzasServed + 50} pizzas` },
                  ].map((g) => (
                    <button key={g.type} onClick={() => setCustomGoal({ type: g.type, target: g.target, active: true })} style={{
                      background: "rgba(6,182,212,0.15)",
                      border: "1px solid rgba(6,182,212,0.3)",
                      borderRadius: 6,
                      padding: "3px 8px",
                      color: "#06b6d4",
                      fontSize: 9,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}>{g.label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Reputation */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 12,
              border: `1px solid ${reputation >= 75 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
            }}>
              <div style={{ color: reputation >= 75 ? "#22c55e" : reputation >= 50 ? "#fbbf24" : "#ef4444", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                Restaurant Reputation: {reputation}/100
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  width: `${reputation}%`,
                  height: "100%",
                  background: reputation >= 75 ? "#22c55e" : reputation >= 50 ? "#fbbf24" : "#ef4444",
                  borderRadius: 3,
                  transition: "width 0.5s",
                }} />
              </div>
              <div style={{ color: "#94a3b8", fontSize: 9, marginTop: 4 }}>
                {reputation >= 90 ? "+20% cash bonus!" : reputation >= 75 ? "+10% cash bonus" : "Serve more, miss less to boost!"}
              </div>
            </div>

            {/* Heatmap */}
            {Object.keys(zoneVisits).length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                border: "1px solid rgba(6,182,212,0.15)",
              }}>
                <div style={{ color: "#06b6d4", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Movement Heatmap</div>
                <div style={{ display: "flex", gap: 4, height: 40 }}>
                  {["dough", "oven", "prep", "dining"].map(zone => {
                    const total = Object.values(zoneVisits).reduce((a, b) => a + b, 0) || 1;
                    const pct = ((zoneVisits[zone] || 0) / total) * 100;
                    const colors: Record<string, string> = { dough: "#f5deb3", oven: "#f97316", prep: "#a855f7", dining: "#22c55e" };
                    return (
                      <div key={zone} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{
                          flex: 1,
                          width: "100%",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: 4,
                          position: "relative",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${pct}%`,
                            background: colors[zone] || "#94a3b8",
                            opacity: 0.6,
                            borderRadius: 4,
                            transition: "height 0.3s ease",
                          }} />
                        </div>
                        <span style={{ color: colors[zone] || "#94a3b8", fontSize: 8, fontWeight: 600 }}>
                          {zone.charAt(0).toUpperCase() + zone.slice(1)}
                        </span>
                        <span style={{ color: "#64748b", fontSize: 7 }}>{Math.round(pct)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

            {/* Restaurant Theme Selector */}
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Restaurant Theme</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {RESTAURANT_THEMES.map((t) => {
                const unlocked = unlockedThemes.includes(t.id);
                const selected = restaurantThemeId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => unlocked ? setRestaurantTheme(t.id) : unlockTheme(t.id)}
                    style={{
                      background: selected ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                      border: selected ? "2px solid #a855f7" : unlocked ? "1px solid rgba(255,255,255,0.2)" : "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      opacity: unlocked ? 1 : 0.5,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{t.icon}</span>
                    <span style={{ color: "#e2e8f0", fontSize: 9, fontWeight: 600 }}>{t.name}</span>
                    {!unlocked && <span style={{ color: "#fbbf24", fontSize: 8 }}>${t.cost}</span>}
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

        {tab === "skills" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>Skill Tree</div>
              <div style={{
                background: "rgba(251,191,36,0.15)",
                borderRadius: 8,
                padding: "3px 10px",
                color: "#fbbf24",
                fontSize: 11,
                fontWeight: 700,
                border: "1px solid rgba(251,191,36,0.3)",
              }}>
                {skillPoints} points
              </div>
            </div>
            <div style={{ color: "#64748b", fontSize: 10, marginBottom: 10 }}>
              Earn 1 skill point per level up. Skills persist through prestige.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {SKILL_DEFS.map((def) => {
                const level = skills[def.id] || 0;
                const maxed = level >= def.maxLevel;
                const canUnlock = skillPoints > 0 && !maxed;
                return (
                  <button
                    key={def.id}
                    onClick={() => canUnlock && unlockSkill(def.id as SkillId)}
                    disabled={!canUnlock}
                    style={{
                      background: maxed
                        ? "rgba(34,197,94,0.15)"
                        : canUnlock
                        ? "rgba(168,85,247,0.15)"
                        : "rgba(255,255,255,0.03)",
                      border: maxed
                        ? "1px solid rgba(34,197,94,0.3)"
                        : canUnlock
                        ? "1px solid rgba(168,85,247,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      padding: "8px 10px",
                      cursor: canUnlock ? "pointer" : "default",
                      textAlign: "left",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{def.icon}</span>
                      <span style={{ color: "#e2e8f0", fontSize: 11, fontWeight: 700 }}>{def.name}</span>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 9, lineHeight: 1.4, marginBottom: 4 }}>
                      {def.description}
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: def.maxLevel }).map((_, i) => (
                        <div key={i} style={{
                          width: 12,
                          height: 4,
                          borderRadius: 2,
                          background: i < level ? "#a855f7" : "rgba(255,255,255,0.1)",
                        }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Title / Rank Display */}
            <div style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))",
              borderRadius: 10,
              padding: "10px 14px",
              marginTop: 12,
              border: "1px solid rgba(251,191,36,0.15)",
              textAlign: "center",
            }}>
              <div style={{ color: "#94a3b8", fontSize: 10, marginBottom: 4 }}>Current Rank</div>
              <div style={{ color: "#fbbf24", fontSize: 18, fontWeight: 800 }}>
                {titleInfo.icon} {titleInfo.title}
              </div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
                {TITLE_DEFS.map((t, i) => {
                  const active = titleInfo.title === t.title;
                  const unlocked = gameLevel >= t.minLevel && totalPizzasServed >= t.minPizzas;
                  return (
                    <span key={i} style={{
                      fontSize: 10,
                      color: active ? "#fbbf24" : unlocked ? "#94a3b8" : "#4b5563",
                      fontWeight: active ? 700 : 400,
                    }}>
                      {t.icon}
                    </span>
                  );
                })}
              </div>
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
