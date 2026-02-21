import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const DOUGH_MAKER_POS: [number, number, number] = [0, 0, -2];
const INTERACT_DISTANCE = 2.0;

export function DoughMaker({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const doughReady = useOfficeGame((s) => s.doughReady);
  const pickupDough = useOfficeGame((s) => s.pickupDough);
  const spawnDough = useOfficeGame((s) => s.spawnDough);
  const carrying = useOfficeGame((s) => s.carrying);
  const doughSpawnInterval = useOfficeGame((s) => s.doughSpawnInterval);
  const [isNear, setIsNear] = useState(false);
  const spawnTimer = useRef(0);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - DOUGH_MAKER_POS[0], 2) +
      Math.pow(playerPos.z - DOUGH_MAKER_POS[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near && doughReady > 0 && carrying === "none") {
      pickupDough();
    }

    spawnTimer.current += delta;
    if (spawnTimer.current >= doughSpawnInterval) {
      spawnTimer.current = 0;
      spawnDough();
    }
  });

  const doughVisuals = [];
  const display = Math.min(doughReady, 8);
  for (let i = 0; i < display; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    doughVisuals.push(
      <mesh key={i} position={[-0.12 + col * 0.24, 0.85 + row * 0.2, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
    );
  }

  return (
    <group position={DOUGH_MAKER_POS}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.7, 0.8]} />
        <meshStandardMaterial color="#a3a3a3" />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.9, 0.04, 0.7]} />
        <meshStandardMaterial color="#d4d4d4" />
      </mesh>

      <mesh position={[0, 0.9, -0.3]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.4, 8]} />
        <meshStandardMaterial color="#737373" />
      </mesh>

      <mesh position={[0, 1.15, -0.3]}>
        <boxGeometry args={[0.3, 0.1, 0.15]} />
        <meshStandardMaterial color="#525252" />
      </mesh>

      {doughVisuals}

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.22}
        color="#f5deb3"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`Dough: ${doughReady}`}
      </Text>

      {isNear && carrying === "none" && doughReady > 0 && (
        <Text
          position={[0, 2.1, 0]}
          fontSize={0.18}
          color="#60a5fa"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Picking up...
        </Text>
      )}

      <pointLight
        position={[0, 1.5, 0]}
        intensity={isNear ? 2 : 0.5}
        color={isNear ? "#fbbf24" : "#f5deb3"}
        distance={3}
      />
    </group>
  );
}
