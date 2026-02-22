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

function App() {
  const phase = useOfficeGame((s) => s.phase);
  const isMobile = useIsMobile();

  if (phase === "menu") {
    return <StartMenu />;
  }

  const cameraPosition: [number, number, number] = isMobile
    ? [8, 20, 20]
    : [8, 16, 16];
  const cameraFov = isMobile ? 50 : 40;

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
