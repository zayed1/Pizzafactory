import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { useOfficeGame } from "./lib/stores/useOfficeGame";
import { OfficeScene } from "./game/OfficeScene";
import { GameHUD } from "./game/GameHUD";
import { StartMenu } from "./game/StartMenu";

const keyMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "back", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
];

function App() {
  const phase = useOfficeGame((s) => s.phase);

  if (phase === "menu") {
    return <StartMenu />;
  }

  return (
    <KeyboardControls map={keyMap}>
      <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
        <Canvas
          shadows
          camera={{
            position: [7, 14, 14],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            powerPreference: "default",
          }}
          style={{ background: "#1a1a2e" }}
        >
          <color attach="background" args={["#1a1a2e"]} />
          <Suspense fallback={null}>
            <OfficeScene />
          </Suspense>
        </Canvas>
        <GameHUD />
      </div>
    </KeyboardControls>
  );
}

export default App;
