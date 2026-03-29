import { Text } from "@react-three/drei";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { useRestaurantTheme } from "./RestaurantTheme";

const TROPHY_COLORS = ["#fbbf24", "#c0c0c0", "#cd7f32", "#a855f7", "#22c55e", "#ef4444", "#3b82f6", "#ec4899", "#06b6d4", "#f97316", "#1e293b", "#dc2626"];

function TrophyCup({ position, color, unlocked }: { position: [number, number, number]; color: string; unlocked: boolean }) {
  if (!unlocked) return null;
  return (
    <group position={position}>
      {/* Cup base */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.05, 0.02, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cup body */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.035, 0.02, 0.06, 8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Cup rim */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.035, 0.005, 6, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function TrophyShelf() {
  const achievements = useOfficeGame((s) => s.achievements);
  const theme = useRestaurantTheme();

  const achievementIds = [
    "first_pizza", "pizza_10", "pizza_50", "pizza_100",
    "streak_5", "streak_10", "rich_500", "rich_2000",
    "level_5", "level_10", "no_miss_10", "prestige_1",
  ];

  return (
    <group position={[-0.65, 1.4, 0]}>
      {/* Shelf */}
      <mesh>
        <boxGeometry args={[0.15, 0.03, 1.5]} />
        <meshStandardMaterial color={theme.shelfColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Brackets */}
      <mesh position={[0, -0.08, -0.6]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={theme.shelfBracket} />
      </mesh>
      <mesh position={[0, -0.08, 0.6]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={theme.shelfBracket} />
      </mesh>
      {/* Label */}
      <Text position={[0.08, 0.12, 0]} fontSize={0.06} color="#fbbf24" anchorX="center" outlineWidth={0.005} outlineColor="#000">
        TROPHIES
      </Text>
      {/* Trophies */}
      {achievementIds.map((id, i) => (
        <TrophyCup
          key={id}
          position={[0, 0.03, -0.6 + i * 0.11]}
          color={TROPHY_COLORS[i % TROPHY_COLORS.length]}
          unlocked={!!achievements[id]}
        />
      ))}
    </group>
  );
}
