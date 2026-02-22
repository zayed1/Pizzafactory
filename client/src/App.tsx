import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { useOfficeGame } from "./lib/stores/useOfficeGame";
import { OfficeScene } from "./game/OfficeScene";
import { GameHUD } from "./game/GameHUD";
import { StartMenu } from "./game/StartMenu";
import { PauseMenu } from "./game/PauseMenu";
import { TouchControls } from "./game/TouchControls";
import { CoinShop } from "./game/CoinShop";

const keyMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "back", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "drop", keys: ["KeyQ"] },
];

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

function useIsPortrait() {
  const [isPortrait, setIsPortrait] = useState(false);
  useEffect(() => {
    const check = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsPortrait(isTouchDevice && window.innerHeight > window.innerWidth);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return isPortrait;
}

function RotateScreen() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 64,
          animation: "rotatePhone 2s ease-in-out infinite",
        }}
      >
        📱
      </div>
      <div style={{ fontSize: 22, fontWeight: "bold", color: "#f97316" }}>
        Rotate Your Device
      </div>
      <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", maxWidth: 260, lineHeight: 1.6 }}>
        Pizza Factory works best in landscape mode. Please rotate your phone sideways to play.
      </div>
      <div
        style={{
          width: 80,
          height: 2,
          background: "linear-gradient(90deg, transparent, #f97316, transparent)",
          marginTop: 8,
        }}
      />
      <style>{`
        @keyframes rotatePhone {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-30deg); }
          75% { transform: rotate(-90deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const phase = useOfficeGame((s) => s.phase);
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();

  if (isPortrait) {
    return <RotateScreen />;
  }

  if (phase === "menu") {
    return <StartMenu />;
  }

  const cameraPosition: [number, number, number] = isMobile
    ? [8, 18, 16]
    : [8, 16, 16];
  const cameraFov = isMobile ? 45 : 40;

  return (
    <KeyboardControls map={keyMap}>
      <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
        <Canvas
          shadows
          camera={{
            position: cameraPosition,
            fov: cameraFov,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            powerPreference: "default",
          }}
          style={{ background: "#1a0f0a" }}
        >
          <color attach="background" args={["#1a0f0a"]} />
          <fog attach="fog" args={["#1a0f0a", 30, 50]} />
          <Suspense fallback={null}>
            <OfficeScene />
          </Suspense>
        </Canvas>
        <GameHUD />
        <PauseMenu />
        <TouchControls />
        <CoinShop />
      </div>
    </KeyboardControls>
  );
}

export default App;
