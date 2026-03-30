import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function StartMenu() {
  const startGame = useOfficeGame((s) => s.startGame);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #7c2d12 100%)",
        fontFamily: "'Inter', sans-serif",
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.05) 35px, rgba(255,255,255,0.05) 70px)",
        }}
      />

      <div
        style={{
          textAlign: "center",
          zIndex: 1,
          animation: "fadeInUp 0.8s ease-out",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 8 }}>🍕</div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: 8,
            textShadow: "0 4px 20px rgba(249,115,22,0.5)",
            letterSpacing: -1,
          }}
        >
          Pizza Factory
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#fed7aa",
            marginBottom: 44,
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          Make dough, bake pizzas, prepare toppings, and serve customers before they leave!
          Upgrade your factory and become the pizza king!
        </p>

        <button
          onClick={startGame}
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            border: "none",
            borderRadius: 16,
            padding: "18px 60px",
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(249,115,22,0.5)",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            const btn = e.target as HTMLElement;
            btn.style.transform = "scale(1.05) translateY(-2px)";
            btn.style.boxShadow = "0 12px 40px rgba(249,115,22,0.7)";
          }}
          onMouseLeave={(e) => {
            const btn = e.target as HTMLElement;
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "0 8px 30px rgba(249,115,22,0.5)";
          }}
        >
          Start Making Pizza!
        </button>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 20,
            justifyContent: "center",
            color: "#fdba74",
            fontSize: 13,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 16 }}>🫓</span> Make Dough
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 16 }}>🔥</span> Bake
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 16 }}>👨‍🍳</span> Prepare
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 16 }}>💰</span> Serve & Earn
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            color: "#9a3412",
            fontSize: 12,
            background: "rgba(0,0,0,0.2)",
            borderRadius: 8,
            padding: "6px 16px",
            display: "inline-block",
          }}
        >
          Use WASD or Arrow Keys to move
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
