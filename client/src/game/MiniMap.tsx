import { useOfficeGame } from "../lib/stores/useOfficeGame";

// Game world approximate bounds
const WORLD_X_MIN = 0;
const WORLD_X_MAX = 14;
const WORLD_Z_MIN = -6;
const WORLD_Z_MAX = 6;
const MAP_W = 120;
const MAP_H = 80;

function worldToMap(x: number, z: number): [number, number] {
  const mx = ((x - WORLD_X_MIN) / (WORLD_X_MAX - WORLD_X_MIN)) * MAP_W;
  const my = ((z - WORLD_Z_MIN) / (WORLD_Z_MAX - WORLD_Z_MIN)) * MAP_H;
  return [Math.max(0, Math.min(MAP_W, mx)), Math.max(0, Math.min(MAP_H, my))];
}

export function MiniMap({ playerPos }: { playerPos: [number, number] }) {
  const tables = useOfficeGame((s) => s.tables);
  const ovens = useOfficeGame((s) => s.ovens);

  const [px, py] = worldToMap(playerPos[0], playerPos[1]);

  // Find impatient customers (>60% timer)
  const impatientTables = tables.filter(
    (t) => t.unlocked && t.hasCustomer && !t.served && t.customerTimer / t.customerMaxTime > 0.6
  );

  // Find ready ovens
  const readyOvens = ovens.filter((o) => o.pizzaReady);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 12,
        width: MAP_W,
        height: MAP_H,
        background: "rgba(0,0,0,0.75)",
        borderRadius: 8,
        border: "1px solid rgba(148,163,184,0.2)",
        backdropFilter: "blur(6px)",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 25,
      }}
    >
      {/* Zone labels */}
      <div style={{ position: "absolute", left: 4, top: MAP_H / 2 - 6, color: "#f5deb3", fontSize: 6, opacity: 0.5 }}>D</div>
      <div style={{ position: "absolute", left: MAP_W * 0.28, top: MAP_H / 2 - 6, color: "#f97316", fontSize: 6, opacity: 0.5 }}>O</div>
      <div style={{ position: "absolute", left: MAP_W * 0.55, top: MAP_H / 2 - 6, color: "#a855f7", fontSize: 6, opacity: 0.5 }}>P</div>
      <div style={{ position: "absolute", left: MAP_W * 0.82, top: MAP_H / 2 - 6, color: "#22c55e", fontSize: 6, opacity: 0.5 }}>T</div>

      {/* Ready ovens */}
      {readyOvens.map((o, i) => {
        const [ox, oy] = worldToMap(4, -2 + i * 2);
        return (
          <div
            key={`oven-${i}`}
            style={{
              position: "absolute",
              left: ox - 3,
              top: oy - 3,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 4px #22c55e",
            }}
          />
        );
      })}

      {/* Impatient customers */}
      {impatientTables.map((t) => {
        const [tx, ty] = worldToMap(11, -4 + t.id * 2.5);
        return (
          <div
            key={`table-${t.id}`}
            style={{
              position: "absolute",
              left: tx - 3,
              top: ty - 3,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 4px #ef4444",
              animation: "pulse 1s infinite",
            }}
          />
        );
      })}

      {/* Player */}
      <div
        style={{
          position: "absolute",
          left: px - 4,
          top: py - 4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#3b82f6",
          border: "1px solid #fff",
          boxShadow: "0 0 6px #3b82f6",
        }}
      />
    </div>
  );
}
