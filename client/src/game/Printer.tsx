import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const PRINTER_POSITION: [number, number, number] = [-0.5, 0, 0];
const INTERACT_DISTANCE = 2.0;

export function Printer({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const printerPapers = useOfficeGame((s) => s.printerPapers);
  const collectPapers = useOfficeGame((s) => s.collectPapers);
  const spawnPrinterPaper = useOfficeGame((s) => s.spawnPrinterPaper);
  const papersCarried = useOfficeGame((s) => s.papersCarried);
  const maxPapers = useOfficeGame((s) => s.maxPapers);
  const printerSpeedLevel = useOfficeGame((s) => s.upgrades.printerSpeed.level);
  const [isNear, setIsNear] = useState(false);
  const spawnTimer = useRef(0);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - PRINTER_POSITION[0], 2) +
      Math.pow(playerPos.z - PRINTER_POSITION[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near && printerPapers > 0 && papersCarried < maxPapers) {
      collectPapers();
    }

    const spawnInterval = Math.max(0.4, 1.5 - printerSpeedLevel * 0.15);
    spawnTimer.current += delta;
    if (spawnTimer.current > spawnInterval) {
      spawnTimer.current = 0;
      spawnPrinterPaper();
    }
  });

  const paperStackVisuals = [];
  const displayPapers = Math.min(printerPapers, 10);
  for (let i = 0; i < displayPapers; i++) {
    paperStackVisuals.push(
      <mesh key={i} position={[0, 0.95 + i * 0.04, 0.1]} castShadow>
        <boxGeometry args={[0.35, 0.03, 0.45]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
    );
  }

  return (
    <group position={PRINTER_POSITION}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 0.9]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      <mesh position={[0, 0.1, 0.46]}>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <mesh position={[0.25, 0.65, 0.46]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={printerPapers > 0 ? "#22c55e" : "#ef4444"} emissive={printerPapers > 0 ? "#22c55e" : "#ef4444"} emissiveIntensity={0.5} />
      </mesh>

      {paperStackVisuals}

      {isNear && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {printerPapers > 0 ? `Papers: ${printerPapers}` : "Empty..."}
        </Text>
      )}

      <pointLight
        position={[0, 1.5, 0]}
        intensity={isNear ? 2 : 0.5}
        color={isNear ? "#60a5fa" : "#ffffff"}
        distance={3}
      />
    </group>
  );
}
