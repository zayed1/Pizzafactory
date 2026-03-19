import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const DOUGH_MAKER_POS: [number, number, number] = [1.5, 0, 0];
const INTERACT_DISTANCE = 2.0;

function MixerBowl() {
  const bladeRef = useRef<THREE.Group>(null);
  const phase = useOfficeGame((s) => s.phase);

  useFrame((_, delta) => {
    if (bladeRef.current && phase === "playing") {
      bladeRef.current.rotation.y += delta * 3;
    }
  });

  return (
    <group position={[0, 0.7, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.28, 0.35, 12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.05, 12]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>

      <group ref={bladeRef} position={[0, 0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export function DoughMaker({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const doughReady = useOfficeGame((s) => s.doughReady);
  const pickupDough = useOfficeGame((s) => s.pickupDough);
  const spawnDough = useOfficeGame((s) => s.spawnDough);
  const carrying = useOfficeGame((s) => s.carrying);
  const doughSpawnInterval = useOfficeGame((s) => s.doughSpawnInterval);
  const phase = useOfficeGame((s) => s.phase);
  const [isNear, setIsNear] = useState(false);
  const spawnTimer = useRef(0);

  useFrame((_, delta) => {
    if (!playerRef.current || phase !== "playing") return;

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
    const row = Math.floor(i / 3);
    const col = i % 3;
    doughVisuals.push(
      <mesh key={i} position={[0.6 + col * 0.22, 0.52 + row * 0.18, 0]} castShadow>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
    );
  }

  return (
    <group position={DOUGH_MAKER_POS}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color="#e8e0d4" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.62, 0.02, 0.62]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.3} />
      </mesh>

      <mesh position={[0.15, 0.85, -0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 6]} />
        <meshStandardMaterial color="#737373" metalness={0.5} />
      </mesh>
      <mesh position={[0.15, 1.05, -0.15]}>
        <boxGeometry args={[0.25, 0.06, 0.06]} />
        <meshStandardMaterial color="#525252" metalness={0.5} />
      </mesh>

      <MixerBowl />

      <mesh position={[0.8, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial color="#d4c8b8" />
      </mesh>
      <mesh position={[0.8, 0.51, 0]}>
        <boxGeometry args={[0.82, 0.02, 0.72]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.3} />
      </mesh>

      {doughVisuals}

      <Text
        position={[0, 1.6, 0]}
        fontSize={0.2}
        color="#f5deb3"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`Dough: ${doughReady}`}
      </Text>

      {isNear && carrying === "none" && doughReady > 0 && (
        <Text
          position={[0, 1.85, 0]}
          fontSize={0.16}
          color="#60a5fa"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Picking up...
        </Text>
      )}

      <pointLight
        position={[0, 1.2, 0]}
        intensity={isNear ? 1.5 : 0.3}
        color={isNear ? "#fbbf24" : "#f5deb3"}
        distance={3}
      />
    </group>
  );
}
