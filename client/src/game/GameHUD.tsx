import { useState, useEffect, useCallback, useRef } from "react";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { useIAPStore } from "./IAPStore";
import { TutorialOverlay } from "./Tutorial";
import { MiniMap } from "./MiniMap";

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

function LevelUpOverlay({ level, onDismiss }: { level: number; onDismiss: () => void }) {
  const [particles, setParticles] = useState<{ x: number; y: number; color: string; size: number; vx: number; vy: number; id: number }[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Generate confetti particles
    const colors = ["#fbbf24", "#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#f97316"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 6 + 2),
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

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
        zIndex: 100,
        pointerEvents: "auto",
        background: "rgba(0,0,0,0.4)",
        opacity: show ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={onDismiss}
    >
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confetti-fall-${p.id % 5} 2s ease-out forwards`,
            transform: `translate(${p.vx * 20}px, ${p.vy * 40}px) rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Level Up text */}
      <div
        style={{
          textAlign: "center",
          animation: "levelup-bounce 0.6s ease-out",
        }}
      >
        <div style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#fbbf24",
          textShadow: "0 0 30px rgba(251,191,36,0.6), 0 4px 8px rgba(0,0,0,0.5)",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: 4,
        }}>
          LEVEL UP!
        </div>
        <div style={{
          fontSize: 96,
          fontWeight: 900,
          color: "#ffffff",
          textShadow: "0 0 40px rgba(168,85,247,0.6), 0 4px 8px rgba(0,0,0,0.5)",
          fontFamily: "'Inter', sans-serif",
          marginTop: -10,
        }}>
          {level}
        </div>
        <div style={{
          fontSize: 16,
          color: "#94a3b8",
          marginTop: 8,
          fontFamily: "'Inter', sans-serif",
        }}>
          Tap to continue
        </div>
      </div>
    </div>
  );
}

function NotificationStack() {
  const notifications = useOfficeGame((s) => s.notifications);

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: "absolute",
      top: 60,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "center",
      zIndex: 50,
      pointerEvents: "none",
    }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: "rgba(0,0,0,0.9)",
            borderRadius: 12,
            padding: "8px 16px",
            color: n.color,
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
            backdropFilter: "blur(10px)",
            border: `2px solid ${n.color}44`,
            animation: "notif-slide 0.3s ease-out",
            fontFamily: "'Inter', sans-serif",
            boxShadow: `0 0 20px ${n.color}33`,
          }}
        >
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          {n.text}
        </div>
      ))}
    </div>
  );
}

function EventBanner() {
  const activeEvent = useOfficeGame((s) => s.activeEvent);

  if (!activeEvent) return null;

  const colors: Record<string, string> = {
    rush_hour: "#ef4444",
    double_pay: "#22c55e",
    tips_rain: "#fbbf24",
  };

  const color = colors[activeEvent.type] || "#ffffff";
  const pct = (activeEvent.remaining / activeEvent.duration) * 100;

  return (
    <div style={{
      position: "absolute",
      top: 48,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.85)",
      borderRadius: 10,
      padding: "4px 14px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      border: `2px solid ${color}66`,
      backdropFilter: "blur(10px)",
      animation: "pulse 2s ease-in-out infinite",
      zIndex: 40,
      pointerEvents: "none",
    }}>
      <span style={{ fontSize: 16 }}>{activeEvent.icon}</span>
      <span style={{ color, fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
        {activeEvent.name}
      </span>
      <div style={{
        width: 50,
        height: 4,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 2,
          transition: "width 0.3s",
        }} />
      </div>
      <span style={{ color: "#9ca3af", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>
        {Math.ceil(activeEvent.remaining)}s
      </span>
    </div>
  );
}

function DailyChallengePanel({ isMobile }: { isMobile: boolean }) {
  const dailyChallenges = useOfficeGame((s) => s.dailyChallenges);
  const dailyStreak = useOfficeGame((s) => s.dailyStreak);
  const initDailyChallenges = useOfficeGame((s) => s.initDailyChallenges);
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    initDailyChallenges();
  }, []);

  const allDone = dailyChallenges.every((c) => c.completed);

  return (
    <div style={{
      position: "absolute",
      top: isMobile ? 42 : 110,
      left: isMobile ? 4 : 12,
      pointerEvents: "auto",
      zIndex: 30,
    }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          background: allDone
            ? "linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))"
            : "rgba(0,0,0,0.85)",
          border: allDone ? "1px solid #22c55e" : "1px solid rgba(249,115,22,0.3)",
          borderRadius: collapsed ? 10 : "10px 10px 0 0",
          padding: "5px 12px",
          color: allDone ? "#fff" : "#f97316",
          fontSize: isMobile ? 10 : 12,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
          backdropFilter: "blur(10px)",
        }}
      >
        {"\u{1F3AF}"} Daily {dailyStreak > 0 && <span style={{ fontSize: 9, color: "#fbbf24" }}>{"\u{1F525}"}{dailyStreak}d</span>}
        <span style={{ fontSize: 9, opacity: 0.7 }}>
          {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length}
        </span>
      </button>

      {!collapsed && (
        <div style={{
          background: "rgba(0,0,0,0.9)",
          borderRadius: "0 10px 10px 10px",
          padding: "8px 10px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(249,115,22,0.2)",
          borderTop: "none",
          minWidth: isMobile ? 180 : 220,
        }}>
          {dailyChallenges.map((c) => {
            const pct = Math.min(100, (c.progress / c.target) * 100);
            return (
              <div key={c.id} style={{
                marginBottom: 6,
                opacity: c.completed ? 0.6 : 1,
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: isMobile ? 10 : 11,
                  color: c.completed ? "#22c55e" : "#e2e8f0",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  <span>{c.icon} {c.description}</span>
                  <span style={{ color: c.completed ? "#22c55e" : "#fbbf24", fontSize: 9, fontWeight: 700 }}>
                    {c.completed ? "\u2713" : `$${c.reward}`}
                  </span>
                </div>
                <div style={{
                  height: 3,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  marginTop: 3,
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: c.completed
                      ? "#22c55e"
                      : "linear-gradient(90deg, #f97316, #fbbf24)",
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
  const showLevelUp = useOfficeGame((s) => s.showLevelUp);
  const levelUpLevel = useOfficeGame((s) => s.levelUpLevel);
  const dismissLevelUp = useOfficeGame((s) => s.dismissLevelUp);
  const comboCount = useOfficeGame((s) => s.comboCount);
  const activePowerUp = useOfficeGame((s) => s.activePowerUp);
  const currentHint = useOfficeGame((s) => s.currentHint);
  const levelStars = useOfficeGame((s) => s.levelStars);
  const getTitle = useOfficeGame((s) => s.getTitle);
  const reputation = useOfficeGame((s) => s.reputation);
  const quickOrders = useOfficeGame((s) => s.quickOrders);
  const isNightShift = useOfficeGame((s) => s.isNightShift);
  const dailyXP = useOfficeGame((s) => s.dailyXP);
  const dailyXPTarget = useOfficeGame((s) => s.dailyXPTarget);
  const dailyRewardsClaimed = useOfficeGame((s) => s.dailyRewardsClaimed);
  const claimDailyReward = useOfficeGame((s) => s.claimDailyReward);
  const recentRatings = useOfficeGame((s) => s.recentRatings);
  const playerPos = useOfficeGame((s) => s.playerPos);
  const unlockedTables = tables.filter((t) => t.unlocked).length;
  const totalTables = tables.length;
  const isMobile = useIsMobile();
  const [showUpgrades, setShowUpgrades] = useState(!isMobile);
  const [goldenFlash, setGoldenFlash] = useState(false);
  const prevMoneyRef = useRef(money);

  // Golden flash on big earnings (>$80 in one go)
  useEffect(() => {
    if (money > prevMoneyRef.current) {
      const diff = money - prevMoneyRef.current;
      if (diff >= 80) {
        setGoldenFlash(true);
        setTimeout(() => setGoldenFlash(false), 600);
      }
    }
    prevMoneyRef.current = money;
  }, [money]);

  // Calculate efficiency
  const busyOvens = ovens.filter(o => o.isCooking || o.pizzaReady).length;
  const busyPrep = prepEmployees.filter(e => e.isWorking || e.pizzaReady).length;
  const servedTables = tables.filter(t => t.unlocked && t.hasCustomer).length;
  const efficiency = Math.round(
    ((busyOvens / Math.max(1, ovens.length)) * 33 +
    (busyPrep / Math.max(1, prepEmployees.length)) * 33 +
    (servedTables / Math.max(1, unlockedTables)) * 34)
  );

  const titleInfo = getTitle();

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

  const handleDismissLevelUp = useCallback(() => {
    dismissLevelUp();
  }, [dismissLevelUp]);

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
      {/* Golden Flash on big earnings */}
      {goldenFlash && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 90,
          boxShadow: "inset 0 0 80px 20px rgba(251,191,36,0.4)",
          animation: "golden-flash 0.6s ease-out forwards",
        }} />
      )}

      {/* Level Up Celebration */}
      {showLevelUp && (
        <LevelUpOverlay level={levelUpLevel} onDismiss={handleDismissLevelUp} />
      )}

      {/* Notification Stack */}
      <NotificationStack />

      {/* Event Banner */}
      <EventBanner />

      {/* Daily Challenges */}
      <DailyChallengePanel isMobile={isMobile} />

      {/* Night Shift Indicator */}
      {isNightShift && (
        <div style={{
          position: "absolute",
          top: isMobile ? 38 : 48,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(15,23,42,0.9)",
          borderRadius: 10,
          padding: "3px 12px",
          color: "#818cf8",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          border: "1px solid rgba(129,140,248,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          zIndex: 38,
          pointerEvents: "none",
        }}>
          {"\u{1F319}"} Night Shift (2x Cash!)
        </div>
      )}

      {/* Quick Orders (top right, below controls) */}
      {quickOrders.length > 0 && !isMobile && (
        <div style={{
          position: "absolute",
          top: 105,
          right: 12,
          background: "rgba(0,0,0,0.85)",
          borderRadius: 10,
          padding: "6px 10px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(251,191,36,0.3)",
          zIndex: 30,
          pointerEvents: "none",
          maxWidth: 200,
        }}>
          <div style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
            {"\u26A1"} Quick Orders
          </div>
          {quickOrders.map((qo) => {
            const pct = Math.min(100, (qo.progress / qo.target) * 100);
            return (
              <div key={qo.id} style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 10, color: "#e2e8f0", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "space-between" }}>
                  <span>{qo.icon} {qo.description}</span>
                  <span style={{ color: "#fbbf24", fontSize: 9 }}>{Math.ceil(qo.timeRemaining)}s</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#fbbf24", borderRadius: 2, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reputation Bar */}
      {!isMobile && (
        <div style={{
          position: "absolute",
          bottom: 100,
          right: 12,
          background: "rgba(0,0,0,0.8)",
          borderRadius: 10,
          padding: "6px 10px",
          backdropFilter: "blur(10px)",
          border: `1px solid ${reputation >= 75 ? "rgba(34,197,94,0.3)" : reputation >= 50 ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.3)"}`,
          pointerEvents: "none",
          zIndex: 30,
        }}>
          <div style={{ color: "#94a3b8", fontSize: 9, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>Reputation</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 40, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${reputation}%`,
                height: "100%",
                background: reputation >= 75 ? "#22c55e" : reputation >= 50 ? "#fbbf24" : "#ef4444",
                borderRadius: 3,
                transition: "width 0.5s ease",
              }} />
            </div>
            <span style={{
              color: reputation >= 75 ? "#22c55e" : reputation >= 50 ? "#fbbf24" : "#ef4444",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
            }}>
              {reputation}
            </span>
          </div>
        </div>
      )}

      {/* Daily XP Bar */}
      {!isMobile && (
        <div style={{
          position: "absolute",
          bottom: 130,
          right: 12,
          background: "rgba(0,0,0,0.8)",
          borderRadius: 10,
          padding: "6px 10px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(59,130,246,0.3)",
          pointerEvents: dailyXP >= dailyXPTarget ? "auto" : "none",
          zIndex: 30,
          cursor: dailyXP >= dailyXPTarget && dailyRewardsClaimed < 3 ? "pointer" : "default",
        }}
          onClick={() => {
            if (dailyXP >= dailyXPTarget && dailyRewardsClaimed < 3) claimDailyReward();
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 9, fontFamily: "'Inter', sans-serif", marginBottom: 2, display: "flex", justifyContent: "space-between" }}>
            <span>Daily XP</span>
            <span style={{ color: "#fbbf24", fontSize: 8 }}>{dailyRewardsClaimed}/3 claimed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 40, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(100, (dailyXP / dailyXPTarget) * 100)}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: 3,
                transition: "width 0.5s ease",
              }} />
            </div>
            <span style={{ color: "#3b82f6", fontSize: 10, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
              {dailyXP}/{dailyXPTarget}
            </span>
          </div>
          {dailyXP >= dailyXPTarget && dailyRewardsClaimed < 3 && (
            <div style={{ color: "#fbbf24", fontSize: 8, marginTop: 2, textAlign: "center", fontWeight: 600 }}>
              Click to claim!
            </div>
          )}
        </div>
      )}

      {/* Customer Rating Popups */}
      {recentRatings.slice(-3).map((r, i) => {
        const age = (Date.now() - r.time) / 1000;
        if (age > 3) return null;
        return (
          <div key={`rating-${r.time}-${i}`} style={{
            position: "absolute",
            top: isMobile ? 70 + i * 25 : 90 + i * 30,
            right: isMobile ? 4 : 160,
            background: "rgba(0,0,0,0.8)",
            borderRadius: 8,
            padding: "3px 10px",
            fontSize: 14,
            opacity: Math.max(0, 1 - age / 3),
            transform: `translateY(${-age * 10}px)`,
            transition: "opacity 0.3s, transform 0.3s",
            pointerEvents: "none",
            zIndex: 45,
          }}>
            {r.emoji} {"⭐".repeat(r.rating)}
          </div>
        );
      })}

      {/* Mini Map (desktop only) */}
      {!isMobile && <MiniMap playerPos={playerPos} />}

      {/* Tutorial */}
      <TutorialOverlay />

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

          {/* Carrying - Circular indicator */}
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              borderRadius: "50%",
              width: isMobile ? 38 : 48,
              height: isMobile ? 38 : 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backdropFilter: "blur(10px)",
              border: `2px solid ${carryColor}`,
              boxShadow: carrying !== "none" ? `0 0 10px ${carryColor}44` : "none",
            }}
          >
            {/* Ring progress for carry state */}
            <svg style={{ position: "absolute", top: -2, left: -2, width: isMobile ? 42 : 52, height: isMobile ? 42 : 52, transform: "rotate(-90deg)" }}>
              <circle
                cx={isMobile ? 21 : 26}
                cy={isMobile ? 21 : 26}
                r={isMobile ? 17 : 21}
                fill="none"
                stroke={carryColor}
                strokeWidth="3"
                strokeDasharray={`${carrying === "none" ? 0 : carrying === "dough" ? 33 : carrying === "pizza_raw" ? 66 : 100} 100`}
                strokeLinecap="round"
                opacity={0.8}
                pathLength="100"
              />
            </svg>
            <span style={{ fontSize: isMobile ? 16 : 20, position: "relative", zIndex: 1 }}>{carryIcon}</span>
            {carryCount > 1 && (
              <span style={{ position: "absolute", bottom: -2, right: -2, background: carryColor, color: "#000", fontSize: 9, fontWeight: 800, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {carryCount}
              </span>
            )}
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

          {/* Combo indicator */}
          {comboCount >= 3 && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.85), rgba(139,92,246,0.85))",
                borderRadius: 10,
                padding: isMobile ? "5px 8px" : "8px 12px",
                color: "#fff",
                fontSize: isMobile ? 11 : 13,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 3,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(168,85,247,0.5)",
                animation: "pulse 1s ease-in-out infinite",
              }}
            >
              {"\u{26A1}"} COMBO x{comboCount}
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
            {titleInfo.icon} Lv.{gameLevel}
          </span>
          {/* Stars for previous level */}
          {levelStars[gameLevel - 1] && !isMobile && (
            <span style={{ fontSize: 10, letterSpacing: 1 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{ color: i < (levelStars[gameLevel - 1] || 0) ? "#fbbf24" : "#4b5563" }}>{"\u2605"}</span>
              ))}
            </span>
          )}
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

      {/* Active Power-Up Bar */}
      {activePowerUp && (
        <div style={{
          position: "absolute",
          top: isMobile ? 38 : 48,
          right: isMobile ? 4 : 12,
          background: "rgba(0,0,0,0.85)",
          borderRadius: 10,
          padding: "4px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "2px solid rgba(6,182,212,0.5)",
          backdropFilter: "blur(10px)",
          animation: "pulse 1.5s ease-in-out infinite",
          zIndex: 40,
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: 14 }}>
            {activePowerUp.type === "speed_boost" ? "\u26A1" : activePowerUp.type === "freeze_patience" ? "\u2744\uFE0F" : "\u{1F4B0}"}
          </span>
          <div style={{
            width: 40,
            height: 4,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${(activePowerUp.remaining / activePowerUp.duration) * 100}%`,
              height: "100%",
              background: "#06b6d4",
              borderRadius: 2,
              transition: "width 0.3s",
            }} />
          </div>
          <span style={{ color: "#06b6d4", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>
            {Math.ceil(activePowerUp.remaining)}s
          </span>
        </div>
      )}

      {/* Speedometer Efficiency Gauge */}
      {!isMobile && (
        <div style={{
          position: "absolute",
          bottom: 70,
          right: 12,
          background: "rgba(0,0,0,0.8)",
          borderRadius: 12,
          padding: "8px 10px",
          backdropFilter: "blur(10px)",
          border: `1px solid ${efficiency > 70 ? "rgba(34,197,94,0.3)" : efficiency > 40 ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.3)"}`,
          pointerEvents: "none",
          zIndex: 30,
          width: 70,
          textAlign: "center",
        }}>
          <svg width="60" height="35" viewBox="0 0 60 35" style={{ display: "block", margin: "0 auto" }}>
            {/* Background arc */}
            <path
              d="M 5 30 A 25 25 0 0 1 55 30"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Colored arc based on efficiency */}
            <path
              d="M 5 30 A 25 25 0 0 1 55 30"
              fill="none"
              stroke={efficiency > 70 ? "#22c55e" : efficiency > 40 ? "#fbbf24" : "#ef4444"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${efficiency * 0.785} 100`}
            />
            {/* Needle */}
            {(() => {
              const angle = Math.PI - (efficiency / 100) * Math.PI;
              const nx = 30 + Math.cos(angle) * 18;
              const ny = 30 - Math.sin(angle) * 18;
              return <line x1="30" y1="30" x2={nx} y2={ny} stroke="#fff" strokeWidth="2" strokeLinecap="round" />;
            })()}
            <circle cx="30" cy="30" r="3" fill="#fff" />
          </svg>
          <div style={{
            color: efficiency > 70 ? "#22c55e" : efficiency > 40 ? "#fbbf24" : "#ef4444",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            marginTop: 2,
          }}>
            {efficiency}%
          </div>
          <div style={{ color: "#94a3b8", fontSize: 8, fontFamily: "'Inter', sans-serif" }}>Efficiency</div>
        </div>
      )}

      {/* Smart Hint */}
      {currentHint && (
        <div style={{
          position: "absolute",
          bottom: isMobile ? 60 : 100,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.85)",
          borderRadius: 12,
          padding: "6px 16px",
          color: "#fbbf24",
          fontSize: isMobile ? 11 : 13,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(251,191,36,0.3)",
          animation: "notif-slide 0.3s ease-out",
          pointerEvents: "none",
          zIndex: 35,
          whiteSpace: "nowrap",
        }}>
          {"\u{1F4A1}"} {currentHint}
        </div>
      )}

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
              label="Cool"
              icon="\u2744\uFE0F"
              level={upgrades.ovenCool.level}
              maxLevel={upgrades.ovenCool.maxLevel}
              cost={upgrades.ovenCool.cost}
              money={money}
              onClick={() => buyUpgrade("ovenCool")}
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
        @keyframes levelup-bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes golden-flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes notif-slide {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes confetti-fall-0 {
          to { transform: translate(${-80 + Math.random() * 160}px, ${200 + Math.random() * 200}px) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti-fall-1 {
          to { transform: translate(${-100 + Math.random() * 200}px, ${150 + Math.random() * 250}px) rotate(-540deg); opacity: 0; }
        }
        @keyframes confetti-fall-2 {
          to { transform: translate(${-60 + Math.random() * 120}px, ${180 + Math.random() * 220}px) rotate(450deg); opacity: 0; }
        }
        @keyframes confetti-fall-3 {
          to { transform: translate(${-120 + Math.random() * 240}px, ${160 + Math.random() * 240}px) rotate(-630deg); opacity: 0; }
        }
        @keyframes confetti-fall-4 {
          to { transform: translate(${-90 + Math.random() * 180}px, ${190 + Math.random() * 210}px) rotate(360deg); opacity: 0; }
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
