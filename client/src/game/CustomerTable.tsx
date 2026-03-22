import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, CustomerTable as CustomerTableType } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";
import { useRestaurantTheme } from "./RestaurantTheme";

const INTERACT_DISTANCE = 2.0;

// Deterministic customer appearance based on table id + color hash
const SKIN_TONES = ["#deb887", "#c68642", "#8d5524", "#f1c27d", "#e0ac69", "#ffdbac"];
const ACCESSORY_SEED_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ec4899"];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function Chair({ position, rotation, theme }: { position: [number, number, number]; rotation: number; theme: ReturnType<typeof useRestaurantTheme> }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-0.12, 0.13, -0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color={theme.chairLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0.12, 0.13, -0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color={theme.chairLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[-0.12, 0.13, 0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color={theme.chairLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0.12, 0.13, 0.12]}>
        <cylinderGeometry args={[0.025, 0.025, 0.26, 6]} />
        <meshStandardMaterial color={theme.chairLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0, 0.27, 0]} castShadow>
        <boxGeometry args={[0.3, 0.03, 0.3]} />
        <meshStandardMaterial color={theme.chairSeat} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0, 0.42, -0.13]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.03]} />
        <meshStandardMaterial color={theme.chairSeat} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
    </group>
  );
}

function DiningTable({ theme }: { theme: ReturnType<typeof useRestaurantTheme> }) {
  return (
    <group>
      <mesh position={[0, 0.38, 0.45]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.04, 0.7]} />
        <meshStandardMaterial color={theme.tableSurface} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[-0.35, 0.18, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color={theme.tableLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0.35, 0.18, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color={theme.tableLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[-0.35, 0.18, 0.7]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color={theme.tableLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0.35, 0.18, 0.7]}>
        <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
        <meshStandardMaterial color={theme.tableLeg} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
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

function CustomerTypeBadge({ type, specialOrder, servingsNeeded, servingsReceived }: { type: string; specialOrder: string; servingsNeeded: number; servingsReceived: number }) {
  const badges: Record<string, { text: string; color: string }> = {
    vip: { text: "\u2605 VIP", color: "#fbbf24" },
    tipper: { text: "\u{1F4B5} TIP", color: "#22c55e" },
    patient: { text: "\u{1F60A} CHILL", color: "#60a5fa" },
    rush: { text: "\u26A1 RUSH", color: "#ef4444" },
  };

  const specBadges: Record<string, { text: string; color: string }> = {
    double: { text: `\u{1F355}x2 ${servingsReceived}/${servingsNeeded}`, color: "#f97316" },
    express: { text: "\u26A1 EXPRESS", color: "#ef4444" },
    group: { text: `\u{1F37D}\uFE0F x3 ${servingsReceived}/${servingsNeeded}`, color: "#a855f7" },
  };

  const badge = type !== "normal" ? badges[type] : null;
  const specBadge = specialOrder !== "none" ? specBadges[specialOrder] : null;

  return (
    <>
      {badge && (
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
      )}
      {specBadge && (
        <Text
          position={[0, badge ? 1.85 : 1.65, 0]}
          fontSize={0.13}
          color={specBadge.color}
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {specBadge.text}
        </Text>
      )}
    </>
  );
}

function CustomerModel({ table }: { table: CustomerTableType }) {
  const animProgress = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const prevHasCustomer = useRef(false);
  const exitAnim = useRef(0);
  const [showExit, setShowExit] = useState(false);

  // Deterministic appearance from customer color + hair color (acts as a seed)
  const appearance = useMemo(() => {
    const seed = hashCode((table.customerColor || "") + (table.customerHairColor || "") + table.id);
    const skinTone = SKIN_TONES[seed % SKIN_TONES.length];
    const accColor = ACCESSORY_SEED_COLORS[(seed >> 4) % ACCESSORY_SEED_COLORS.length];
    const hasGlasses = (seed % 5) === 0; // 20% chance
    const isTall = (seed % 7) === 0; // ~14% chance
    const isShort = !isTall && (seed % 6) === 0; // ~14% chance (child-like)
    const hasScarf = (seed % 8) === 0; // ~12% chance
    const hasBag = (seed % 9) === 0; // ~11% chance
    const heightScale = isTall ? 1.15 : isShort ? 0.75 : 1.0;
    return { skinTone, accColor, hasGlasses, isTall, isShort, hasScarf, hasBag, heightScale };
  }, [table.customerColor, table.customerHairColor, table.id]);

  useFrame((_, delta) => {
    if (table.hasCustomer && animProgress.current < 1) {
      animProgress.current = Math.min(1, animProgress.current + delta * 4);
    }
    if (!table.hasCustomer && prevHasCustomer.current) {
      setShowExit(true);
      exitAnim.current = 1;
    }
    if (showExit) {
      exitAnim.current = Math.max(0, exitAnim.current - delta * 3);
      if (exitAnim.current <= 0) setShowExit(false);
    }
    if (table.hasCustomer && !prevHasCustomer.current) {
      animProgress.current = 0;
    }
    prevHasCustomer.current = table.hasCustomer;

    if (groupRef.current) {
      const scale = table.hasCustomer ? animProgress.current : exitAnim.current;
      const bounce = table.hasCustomer && animProgress.current < 1
        ? 1 + Math.sin(animProgress.current * Math.PI) * 0.2
        : 1;
      groupRef.current.scale.setScalar(scale * bounce);
      groupRef.current.position.y = table.hasCustomer
        ? (1 - animProgress.current) * -0.5
        : 0;
    }
  });

  if (!table.hasCustomer && !showExit) return null;

  const patienceRatio = table.hasCustomer ? 1 - table.customerTimer / table.customerMaxTime : 1;
  const color = patienceRatio > 0.5 ? "#22c55e" : patienceRatio > 0.25 ? "#f59e0b" : "#ef4444";
  const bodyColor = table.customerColor || "#6b7280";
  const hairColor = table.customerHairColor || "#4a3728";
  const mood = getMoodEmoji(patienceRatio);
  const isVIP = table.customerType === "vip";
  const { skinTone, accColor, hasGlasses, hasScarf, hasBag, heightScale } = appearance;

  return (
    <group ref={groupRef} position={[0, 0, 0.9]}>
      {/* VIP glow ring */}
      {isVIP && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.32, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      )}

      <group scale={[1, heightScale, 1]}>
        {/* Legs */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Body - lower */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.25, 8]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {/* Body - upper */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.2, 8]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {/* Scarf */}
        {hasScarf && (
          <mesh position={[0, 0.68, 0]}>
            <torusGeometry args={[0.13, 0.025, 6, 12]} />
            <meshStandardMaterial color={accColor} />
          </mesh>
        )}

        {/* Head */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <sphereGeometry args={[0.14, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>

        {/* Glasses */}
        {hasGlasses && (
          <>
            {/* Left lens */}
            <mesh position={[0.055, 0.84, 0.12]}>
              <torusGeometry args={[0.03, 0.005, 4, 8]} />
              <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Right lens */}
            <mesh position={[-0.055, 0.84, 0.12]}>
              <torusGeometry args={[0.03, 0.005, 4, 8]} />
              <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0.84, 0.13]}>
              <boxGeometry args={[0.04, 0.005, 0.005]} />
              <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
            </mesh>
          </>
        )}

        {/* VIP crown */}
        {isVIP && (
          <mesh position={[0, 1.0, 0]}>
            <coneGeometry args={[0.08, 0.1, 5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
        )}

        {/* Eyes */}
        <mesh position={[0.04, 0.84, 0.1]}>
          <sphereGeometry args={[hasGlasses ? 0.018 : 0.02, 6, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.04, 0.84, 0.1]}>
          <sphereGeometry args={[hasGlasses ? 0.018 : 0.02, 6, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Mouth */}
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

        {/* Angry eyebrows */}
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

        {/* Bag accessory */}
        {hasBag && (
          <mesh position={[0.2, 0.35, 0]} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color={accColor} />
          </mesh>
        )}
      </group>

      {/* Patience bar (outside scale group so it stays readable) */}
      <group position={[0, 1.2 * heightScale, 0]}>
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
        position={[0.32, 1.2 * heightScale, 0]}
        fontSize={0.18}
        anchorX="center"
      >
        {mood}
      </Text>

      <Text
        position={[0, 1.45 * heightScale, 0]}
        fontSize={0.16}
        color={color}
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {Math.ceil(table.customerMaxTime - table.customerTimer)}s
      </Text>

      <CustomerTypeBadge type={table.customerType} specialOrder={table.specialOrder} servingsNeeded={table.servingsNeeded} servingsReceived={table.servingsReceived} />

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
  const theme = useRestaurantTheme();

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
      <DiningTable theme={theme} />

      <Chair position={[-0.55, 0, 0.45]} rotation={Math.PI / 2} theme={theme} />
      <Chair position={[0.55, 0, 0.45]} rotation={-Math.PI / 2} theme={theme} />

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
