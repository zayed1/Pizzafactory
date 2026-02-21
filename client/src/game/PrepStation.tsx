import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, PrepEmployee } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const INTERACT_DISTANCE = 2.0;

const PREP_POSITIONS: [number, number, number][] = [
  [5, 0, -4],
  [7.5, 0, -4],
  [10, 0, -4],
];

function PrepProgressBar({ emp, prepWorkTime }: { emp: PrepEmployee; prepWorkTime: number }) {
  const barRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (barRef.current && emp.isWorking) {
      const pct = Math.min(emp.workProgress / prepWorkTime, 1);
      const w = pct * 0.78;
      barRef.current.scale.x = Math.max(0.01, w);
      barRef.current.position.x = -0.39 + w / 2;
    }
  });

  if (!emp.isWorking) return null;

  return (
    <group position={[0, 2.0, -0.5]}>
      <mesh>
        <boxGeometry args={[0.8, 0.1, 0.05]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh ref={barRef} position={[-0.39, 0, 0.01]}>
        <boxGeometry args={[1, 0.08, 0.02]} />
        <meshStandardMaterial color="#a855f7" />
      </mesh>
    </group>
  );
}

function PrepWorker({ emp, color }: { emp: PrepEmployee; color: string }) {
  return (
    <group position={[0, 0, -0.7]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.18, 0.25, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {emp.isWorking && (
        <>
          <mesh position={[0.05, 0.88, 0.1]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.05, 0.88, 0.1]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </>
      )}

      {!emp.isWorking && !emp.pizzaReady && (
        <>
          <mesh position={[0.05, 0.87, 0.1]}>
            <boxGeometry args={[0.05, 0.012, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.05, 0.87, 0.1]}>
            <boxGeometry args={[0.05, 0.012, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </>
      )}
    </group>
  );
}

export function PrepStation({
  emp,
  index,
  playerRef,
}: {
  emp: PrepEmployee;
  index: number;
  playerRef: React.RefObject<THREE.Group | null>;
}) {
  const [isNear, setIsNear] = useState(false);
  const carrying = useOfficeGame((s) => s.carrying);
  const deliverToPrep = useOfficeGame((s) => s.deliverToPrep);
  const pickupFromPrep = useOfficeGame((s) => s.pickupFromPrep);
  const updatePrepEmployee = useOfficeGame((s) => s.updatePrepEmployee);
  const prepWorkTime = useOfficeGame((s) => s.prepWorkTime);
  const pos = PREP_POSITIONS[index] || PREP_POSITIONS[0];
  const colors = ["#8b5cf6", "#06b6d4", "#ec4899"];

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - pos[0], 2) +
      Math.pow(playerPos.z - pos[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near) {
      if (carrying === "pizza_raw" && !emp.hasPizza && !emp.isWorking && !emp.pizzaReady) {
        deliverToPrep(emp.id);
      }
      if (carrying === "none" && emp.pizzaReady) {
        pickupFromPrep(emp.id);
      }
    }

    updatePrepEmployee(emp.id, delta);
  });

  return (
    <group position={pos}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.05, 0.9]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>
      <mesh position={[-0.6, 0.15, -0.35]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#a1a1aa" />
      </mesh>
      <mesh position={[0.6, 0.15, -0.35]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#a1a1aa" />
      </mesh>
      <mesh position={[-0.6, 0.15, 0.35]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#a1a1aa" />
      </mesh>
      <mesh position={[0.6, 0.15, 0.35]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#a1a1aa" />
      </mesh>

      {emp.isWorking && (
        <mesh position={[0, 0.38, 0.1]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
          <meshStandardMaterial color="#e8a849" />
        </mesh>
      )}

      {emp.pizzaReady && (
        <>
          <group position={[0, 0.38, 0.1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
              <meshStandardMaterial color="#d4740a" />
            </mesh>
            <mesh position={[0.05, 0.04, 0.03]}>
              <sphereGeometry args={[0.03, 6, 6]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[-0.06, 0.04, -0.04]}>
              <sphereGeometry args={[0.03, 6, 6]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            <mesh position={[0.02, 0.04, -0.06]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#fbbf24" />
            </mesh>
          </group>
          <Text
            position={[0, 1.6, 0]}
            fontSize={0.2}
            color="#22c55e"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            Ready!
          </Text>
          <pointLight position={[0, 1, 0]} intensity={1} color="#22c55e" distance={2} />
        </>
      )}

      <PrepWorker emp={emp} color={colors[index % colors.length]} />
      <PrepProgressBar emp={emp} prepWorkTime={prepWorkTime} />

      {emp.isWorking && (
        <Text
          position={[0, 2.3, -0.5]}
          fontSize={0.15}
          color="#a855f7"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Preparing...
        </Text>
      )}

      <Text
        position={[0, -0.1, 0.6]}
        fontSize={0.13}
        color="#a1a1aa"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {`PREP ${index + 1}`}
      </Text>
    </group>
  );
}

export { PREP_POSITIONS };
