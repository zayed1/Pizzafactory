import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, CustomerTable as CustomerTableType } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const INTERACT_DISTANCE = 2.0;

function Chair({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-0.12, 0.13, -0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[0.12, 0.13, -0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[-0.12, 0.13, 0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[0.12, 0.13, 0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[0, 0.27, 0]} castShadow>
        <boxGeometry args={[0.3, 0.03, 0.3]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 0.42, -0.13]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.03]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
    </group>
  );
}

function DiningTable() {
  return (
    <group>
      <mesh position={[0, 0.38, 0.45]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.04, 0.7]} />
        <meshStandardMaterial color="#6d3710" />
      </mesh>
      <mesh position={[-0.35, 0.18, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[0.35, 0.18, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[-0.35, 0.18, 0.7]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[0.35, 0.18, 0.7]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>

      <mesh position={[-0.2, 0.41, 0.35]}>
        <cylinderGeometry args={[0.06, 0.06, 0.005, 8]} />
        <meshStandardMaterial color="#f5f5f4" />
      </mesh>
      <mesh position={[0.2, 0.41, 0.55]}>
        <cylinderGeometry args={[0.06, 0.06, 0.005, 8]} />
        <meshStandardMaterial color="#f5f5f4" />
      </mesh>

      <mesh position={[0, 0.41, 0.45]}>
        <cylinderGeometry args={[0.04, 0.03, 0.06, 6]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

function getMoodEmoji(patienceRatio: number): string {
  if (patienceRatio > 0.7) return "😊";
  if (patienceRatio > 0.4) return "😐";
  if (patienceRatio > 0.2) return "😟";
  return "😠";
}

function CustomerTypeBadge({ type }: { type: string }) {
  if (type === "normal") return null;

  const badges: Record<string, { text: string; color: string }> = {
    vip: { text: "\u2605 VIP", color: "#fbbf24" },
    tipper: { text: "\u{1F4B5} TIP", color: "#22c55e" },
    patient: { text: "\u{1F60A} CHILL", color: "#60a5fa" },
    rush: { text: "\u26A1 RUSH", color: "#ef4444" },
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <Text
      position={[0, 1.65, 0]}
      fontSize={0.14}
      color={badge.color}
      anchorX="center"
      outlineWidth={0.02}
      outlineColor="#000000"
      fontWeight="bold"
    >
      {badge.text}
    </Text>
  );
}

function CustomerModel({ table }: { table: CustomerTableType }) {
  if (!table.hasCustomer) return null;

  const patienceRatio = 1 - table.customerTimer / table.customerMaxTime;
  const color = patienceRatio > 0.5 ? "#22c55e" : patienceRatio > 0.25 ? "#f59e0b" : "#ef4444";
  const bodyColor = table.customerColor || "#6b7280";
  const hairColor = table.customerHairColor || "#4a3728";
  const mood = getMoodEmoji(patienceRatio);
  const isVIP = table.customerType === "vip";

  return (
    <group position={[0, 0, 0.9]}>
      {/* VIP glow ring */}
      {isVIP && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.32, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      )}

      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.25, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.2, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>

      <mesh position={[0, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.14, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>

      {/* VIP crown */}
      {isVIP && (
        <mesh position={[0, 1.0, 0]}>
          <coneGeometry args={[0.08, 0.1, 5]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      )}

      <mesh position={[0.04, 0.84, 0.1]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.04, 0.84, 0.1]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {patienceRatio > 0.4 ? (
        <mesh position={[0, 0.76, 0.11]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color={patienceRatio > 0.7 ? "#22c55e" : "#f59e0b"} />
        </mesh>
      ) : (
        <mesh position={[0, 0.76, 0.11]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )}

      {patienceRatio <= 0.25 && (
        <>
          <mesh position={[0.05, 0.86, 0.1]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.04, 0.008, 0.008]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.05, 0.86, 0.1]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.04, 0.008, 0.008]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </>
      )}

      <group position={[0, 1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.07, 0.05]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-0.25 + patienceRatio * 0.25, 0, 0.01]}>
          <boxGeometry args={[patienceRatio * 0.48, 0.05, 0.02]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      <Text
        position={[0.32, 1.2, 0]}
        fontSize={0.18}
        anchorX="center"
      >
        {mood}
      </Text>

      <Text
        position={[0, 1.45, 0]}
        fontSize={0.16}
        color={color}
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {Math.ceil(table.customerMaxTime - table.customerTimer)}s
      </Text>

      <CustomerTypeBadge type={table.customerType} />

      {/* VIP light effect */}
      {isVIP && (
        <pointLight position={[0, 0.5, 0]} intensity={1.5} color="#fbbf24" distance={2} />
      )}
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
          <meshStandardMaterial color="#475569" opacity={0.2} transparent />
        </mesh>
        <Text position={[0, 1.0, 0.45]} fontSize={0.18} color="#64748b" anchorX="center" outlineWidth={0.01} outlineColor="#000000">
          Locked
        </Text>
      </group>
    );
  }

  return (
    <group position={table.position}>
      <DiningTable />

      <Chair position={[-0.55, 0, 0.45]} rotation={Math.PI / 2} />
      <Chair position={[0.55, 0, 0.45]} rotation={-Math.PI / 2} />

      <CustomerModel table={table} />

      {isNear && carrying === "pizza_ready" && table.hasCustomer && (
        <Text
          position={[0, 1.8, 0.45]}
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
        fontSize={0.11}
        color="#78716c"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {`TABLE ${table.id + 1}`}
      </Text>
    </group>
  );
}
