import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const OVEN_POS: [number, number, number] = [0, 0, 1.5];
const INTERACT_DISTANCE = 2.0;

function OvenProgressBar({ progress, maxTime }: { progress: number; maxTime: number }) {
  const barRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (barRef.current) {
      const pct = Math.min(progress / maxTime, 1);
      const w = pct * 0.78;
      barRef.current.scale.x = Math.max(0.01, w);
      barRef.current.position.x = -0.39 + w / 2;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      <mesh>
        <boxGeometry args={[0.8, 0.1, 0.05]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh ref={barRef} position={[-0.39, 0, 0.01]}>
        <boxGeometry args={[1, 0.08, 0.02]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
    </group>
  );
}

export function Oven({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const oven = useOfficeGame((s) => s.oven);
  const carrying = useOfficeGame((s) => s.carrying);
  const placeDoughInOven = useOfficeGame((s) => s.placeDoughInOven);
  const pickupFromOven = useOfficeGame((s) => s.pickupFromOven);
  const updateOven = useOfficeGame((s) => s.updateOven);
  const ovenCookTime = useOfficeGame((s) => s.ovenCookTime);
  const [isNear, setIsNear] = useState(false);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - OVEN_POS[0], 2) +
      Math.pow(playerPos.z - OVEN_POS[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near) {
      if (carrying === "dough" && !oven.hasDough && !oven.isCooking && !oven.pizzaReady) {
        placeDoughInOven();
      }
      if (carrying === "none" && oven.pizzaReady) {
        pickupFromOven();
      }
    }

    updateOven(delta);
  });

  const glowColor = oven.isCooking ? "#f97316" : oven.pizzaReady ? "#22c55e" : "#64748b";

  return (
    <group position={OVEN_POS}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.9, 1.0]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      <mesh position={[0, 0.45, 0.51]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      <mesh position={[0, 0.45, 0.53]}>
        <boxGeometry args={[0.6, 0.4, 0.01]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={oven.isCooking ? 0.8 : oven.pizzaReady ? 0.5 : 0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[0.5, 0.92, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 6]} />
        <meshStandardMaterial color="#525252" />
      </mesh>

      {oven.isCooking && (
        <>
          <mesh position={[0, 0.45, 0.2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
            <meshStandardMaterial color="#f5deb3" />
          </mesh>
          <OvenProgressBar progress={oven.cookProgress} maxTime={ovenCookTime} />
          <Text
            position={[0, 2.1, 0]}
            fontSize={0.18}
            color="#f97316"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            Cooking...
          </Text>
        </>
      )}

      {oven.pizzaReady && (
        <>
          <mesh position={[0, 0.95, 0.2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
            <meshStandardMaterial color="#e8a849" />
          </mesh>
          <Text
            position={[0, 2.1, 0]}
            fontSize={0.2}
            color="#22c55e"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            Pizza Ready!
          </Text>
          <pointLight position={[0, 1.2, 0]} intensity={1.5} color="#22c55e" distance={2.5} />
        </>
      )}

      {!oven.isCooking && !oven.pizzaReady && isNear && carrying === "dough" && (
        <Text
          position={[0, 2.1, 0]}
          fontSize={0.18}
          color="#60a5fa"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Place dough
        </Text>
      )}

      <Text
        position={[0, 1.4, 0.55]}
        fontSize={0.16}
        color="#fbbf24"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        OVEN
      </Text>

      <pointLight
        position={[0, 0.5, 0.6]}
        intensity={oven.isCooking ? 3 : 0.5}
        color="#f97316"
        distance={2}
      />
    </group>
  );
}
