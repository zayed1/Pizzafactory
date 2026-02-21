import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, CustomerTable as CustomerTableType } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const INTERACT_DISTANCE = 2.0;

function CustomerModel({ table }: { table: CustomerTableType }) {
  if (!table.hasCustomer) return null;

  const patienceRatio = 1 - table.customerTimer / table.customerMaxTime;
  const color = patienceRatio > 0.5 ? "#22c55e" : patienceRatio > 0.25 ? "#f59e0b" : "#ef4444";

  return (
    <group position={[0, 0, 0.9]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.6, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.25, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      <mesh position={[0.05, 0.98, 0.1]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.05, 0.98, 0.1]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <group position={[0, 1.4, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.08, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-0.3 + patienceRatio * 0.3, 0, 0.01]}>
          <boxGeometry args={[patienceRatio * 0.58, 0.06, 0.02]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      <Text
        position={[0, 1.65, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {Math.ceil(table.customerMaxTime - table.customerTimer)}s
      </Text>
    </group>
  );
}

export function CustomerTableComp({
  table,
  playerRef,
}: {
  table: CustomerTableType;
  playerRef: React.RefObject<THREE.Group | null>;
}) {
  const [isNear, setIsNear] = useState(false);
  const carrying = useOfficeGame((s) => s.carrying);
  const deliverToTable = useOfficeGame((s) => s.deliverToTable);

  useFrame(() => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - table.position[0], 2) +
      Math.pow(playerPos.z - table.position[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near && carrying === "pizza_ready" && table.hasCustomer && !table.served) {
      deliverToTable(table.id);
    }
  });

  if (!table.unlocked) {
    return (
      <group position={table.position}>
        <mesh position={[0, 0.3, 0.45]} receiveShadow>
          <boxGeometry args={[1.0, 0.6, 0.9]} />
          <meshStandardMaterial color="#475569" opacity={0.3} transparent />
        </mesh>
        <Text position={[0, 1.0, 0.45]} fontSize={0.18} color="#64748b" anchorX="center" outlineWidth={0.01} outlineColor="#000000">
          Locked
        </Text>
      </group>
    );
  }

  return (
    <group position={table.position}>
      <mesh position={[0, 0.28, 0.45]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 12]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <mesh position={[0, 0.13, 0.45]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 0.0, 0.45]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      <CustomerModel table={table} />

      {isNear && carrying === "pizza_ready" && table.hasCustomer && (
        <Text
          position={[0, 2.0, 0.45]}
          fontSize={0.18}
          color="#22c55e"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Deliver!
        </Text>
      )}

      <Text
        position={[0, -0.15, 0.45]}
        fontSize={0.12}
        color="#a1a1aa"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {`TABLE ${table.id + 1}`}
      </Text>
    </group>
  );
}
