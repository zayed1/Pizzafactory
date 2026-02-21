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
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
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
          opacity: 0.1,
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
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏢</div>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: 8,
            textShadow: "0 4px 20px rgba(96,165,250,0.5)",
            letterSpacing: -1,
          }}
        >
          Office Fever
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#94a3b8",
            marginBottom: 48,
            maxWidth: 400,
            lineHeight: 1.5,
          }}
        >
          Manage your office, deliver papers, earn money, and grow your business empire!
        </p>

        <button
          onClick={startGame}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            border: "none",
            borderRadius: 16,
            padding: "18px 60px",
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(59,130,246,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            const btn = e.target as HTMLElement;
            btn.style.transform = "scale(1.05) translateY(-2px)";
            btn.style.boxShadow = "0 12px 40px rgba(59,130,246,0.6)";
          }}
          onMouseLeave={(e) => {
            const btn = e.target as HTMLElement;
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "0 8px 30px rgba(59,130,246,0.4)";
          }}
        >
          Start Game
        </button>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 24,
            justifyContent: "center",
            color: "#64748b",
            fontSize: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>⌨️</span> WASD to Move
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>📄</span> Collect Papers
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>💰</span> Earn Money
          </div>
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
