import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, OVEN_POSITIONS } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

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
    <group position={[0, 2.0, 0]}>
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

function SingleOven({ ovenId, playerRef }: { ovenId: number; playerRef: React.RefObject<THREE.Group | null> }) {
  const ovens = useOfficeGame((s) => s.ovens);
  const carrying = useOfficeGame((s) => s.carrying);
  const placeDoughInOven = useOfficeGame((s) => s.placeDoughInOven);
  const pickupFromOven = useOfficeGame((s) => s.pickupFromOven);
  const updateOven = useOfficeGame((s) => s.updateOven);
  const ovenCookTime = useOfficeGame((s) => s.ovenCookTime);
  const phase = useOfficeGame((s) => s.phase);
  const [isNear, setIsNear] = useState(false);

  const oven = ovens[ovenId];
  const pos = OVEN_POSITIONS[ovenId];

  useFrame((_, delta) => {
    if (!playerRef.current || !oven || phase !== "playing") return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - pos[0], 2) +
      Math.pow(playerPos.z - pos[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near) {
      if (carrying === "dough" && !oven.hasDough && !oven.isCooking && !oven.pizzaReady) {
        placeDoughInOven(ovenId);
      }
      if (carrying === "none" && oven.pizzaReady) {
        pickupFromOven(ovenId);
      }
    }

    updateOven(ovenId, delta);
  });

  if (!oven) return null;

  const glowColor = oven.isCooking ? "#f97316" : oven.pizzaReady ? "#22c55e" : "#64748b";

  return (
    <group position={pos}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.0, 1.2]} />
        <meshStandardMaterial color="#8b3a3a" />
      </mesh>

      <mesh position={[0, 0.5, -0.02]} castShadow>
        <boxGeometry args={[1.3, 0.9, 1.15]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>

      {[[-0.55, 0.2], [-0.55, 0.8], [0.55, 0.2], [0.55, 0.8], [-0.55, 0.5], [0.55, 0.5]].map(([x, y], i) => (
        <mesh key={i} position={[x as number, y as number, 0.61]}>
          <boxGeometry args={[0.12, 0.12, 0.02]} />
          <meshStandardMaterial color="#7a3030" />
        </mesh>
      ))}

      <mesh position={[0, 0.5, 0.61]} castShadow>
        <boxGeometry args={[0.85, 0.65, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0, 0.5, 0.63]}>
        <boxGeometry args={[0.7, 0.5, 0.01]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={oven.isCooking ? 1.0 : oven.pizzaReady ? 0.5 : 0.05}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh position={[0.3, 0.85, 0.62]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 6]} />
        <meshStandardMaterial color="#525252" metalness={0.6} />
      </mesh>

      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.3]} />
        <meshStandardMaterial color="#7a3030" />
      </mesh>

      <mesh position={[0.1, 1.35, -0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.5, 8]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      <mesh position={[0.1, 1.62, -0.3]}>
        <cylinderGeometry args={[0.12, 0.1, 0.05, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {oven.isCooking && (
        <>
          <OvenProgressBar progress={oven.cookProgress} maxTime={ovenCookTime} />
          <Text
            position={[0, 2.3, 0]}
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
          <mesh position={[0, 1.12, 0.2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
            <meshStandardMaterial color="#e8a849" />
          </mesh>
          <Text
            position={[0, 2.3, 0]}
            fontSize={0.2}
            color="#22c55e"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            Pizza Ready!
          </Text>
          <pointLight position={[0, 1.3, 0]} intensity={1.5} color="#22c55e" distance={2.5} />
        </>
      )}

      {!oven.isCooking && !oven.pizzaReady && isNear && carrying === "dough" && (
        <Text
          position={[0, 2.3, 0]}
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
        position={[0, 1.55, 0.62]}
        fontSize={0.14}
        color="#fbbf24"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000000"
        fontWeight="bold"
      >
        {`OVEN ${ovenId + 1}`}
      </Text>

      <pointLight
        position={[0, 0.5, 0.8]}
        intensity={oven.isCooking ? 4 : 0.3}
        color="#f97316"
        distance={2.5}
      />
    </group>
  );
}

export function OvenSystem({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const ovens = useOfficeGame((s) => s.ovens);

  return (
    <>
      {ovens.map((oven) => (
        <SingleOven key={oven.id} ovenId={oven.id} playerRef={playerRef} />
      ))}
    </>
  );
}
