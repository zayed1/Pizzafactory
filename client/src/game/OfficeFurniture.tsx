import { Text } from "@react-three/drei";
import { useRestaurantTheme, ThemeColors } from "./RestaurantTheme";

function KitchenShelf({ position, theme }: { position: [number, number, number]; theme: ThemeColors }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.8, 0.06, 0.3]} />
        <meshStandardMaterial color={theme.shelfColor} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[-0.85, -0.15, 0.15]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color={theme.shelfBracket} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0.85, -0.15, 0.15]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color={theme.shelfBracket} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[-0.5, 0.08, 0.05]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[-0.2, 0.08, 0.05]}>
        <cylinderGeometry args={[0.05, 0.05, 0.14, 8]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0.1, 0.08, 0.05]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 8]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      <mesh position={[0.4, 0.06, 0.05]}>
        <boxGeometry args={[0.12, 0.15, 0.08]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
    </group>
  );
}

function MenuBoard({ position, theme }: { position: [number, number, number]; theme: ThemeColors }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.0, 1.2, 0.08]} />
        <meshStandardMaterial color={theme.menuBoardBg} metalness={theme.furnitureMetalness * 0.5} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1.85, 1.05, 0.02]} />
        <meshStandardMaterial color={theme.menuBoardInner} />
      </mesh>
      <Text position={[0, 0.3, 0.05]} fontSize={0.2} color="#fbbf24" anchorX="center" fontWeight="bold">
        PIZZA FACTORY
      </Text>
      <Text position={[0, 0.05, 0.05]} fontSize={0.1} color="#94a3b8" anchorX="center">
        Fresh & Hot!
      </Text>
      <Text position={[-0.5, -0.15, 0.05]} fontSize={0.08} color="#f97316" anchorX="center">
        Margherita
      </Text>
      <Text position={[0.3, -0.15, 0.05]} fontSize={0.08} color="#f97316" anchorX="center">
        Pepperoni
      </Text>
      <Text position={[-0.5, -0.3, 0.05]} fontSize={0.08} color="#f97316" anchorX="center">
        Supreme
      </Text>
      <Text position={[0.3, -0.3, 0.05]} fontSize={0.08} color="#f97316" anchorX="center">
        Hawaiian
      </Text>
    </group>
  );
}

function HangingLight({ position, theme }: { position: [number, number, number]; theme: ThemeColors }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <coneGeometry args={[0.2, 0.15, 8]} />
        <meshStandardMaterial color={theme.lightFixture} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={theme.lightBulb} emissive={theme.lightEmissive} emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={theme.lightIntensity} color={theme.lightEmissive} distance={4} />
    </group>
  );
}

function WallDecor({ position, theme }: { position: [number, number, number]; theme: ThemeColors }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.04]} />
        <meshStandardMaterial color={theme.decorFrame} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.65, 0.65, 0.02]} />
        <meshStandardMaterial color={theme.decorInner} />
      </mesh>
      <mesh position={[0, 0.05, 0.05]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 8]} />
        <meshStandardMaterial color="#e8a849" />
      </mesh>
      <mesh position={[0.05, 0.09, 0.06]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.06, 0.09, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

function Fridge({ position, theme }: { position: [number, number, number]; theme: ThemeColors }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.7, 2, 0.65]} />
        <meshStandardMaterial color={theme.fridgeBody} metalness={Math.max(0.4, theme.furnitureMetalness)} roughness={0.3} />
      </mesh>
      <mesh position={[0.25, 1.3, 0.33]}>
        <boxGeometry args={[0.04, 0.3, 0.04]} />
        <meshStandardMaterial color="#737373" />
      </mesh>
      <mesh position={[0.25, 0.5, 0.33]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#737373" />
      </mesh>
      <mesh position={[0, 0.85, 0.33]}>
        <boxGeometry args={[0.65, 0.02, 0.02]} />
        <meshStandardMaterial color="#a1a1aa" />
      </mesh>
    </group>
  );
}

function FloorLabel({ position, text, color }: { position: [number, number, number]; text: string; color: string }) {
  return (
    <Text
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.35}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
      fontWeight="bold"
    >
      {text}
    </Text>
  );
}

export function OfficeFurniture() {
  const theme = useRestaurantTheme();

  return (
    <group>
      {/* Kitchen shelves on left wall */}
      <KitchenShelf position={[-0.7, 1.8, -2.5]} theme={theme} />
      <KitchenShelf position={[-0.7, 2.3, -2.5]} theme={theme} />
      <KitchenShelf position={[-0.7, 1.8, 2.5]} theme={theme} />

      {/* Menu board on back wall */}
      <MenuBoard position={[11, 2.0, -5.7]} theme={theme} />

      {/* Fridges on left wall */}
      <Fridge position={[-0.3, 0, -4.5]} theme={theme} />
      <Fridge position={[-0.3, 0, 4.5]} theme={theme} />

      {/* Hanging lights */}
      <HangingLight position={[1.5, 2.8, 0]} theme={theme} />
      <HangingLight position={[4, 2.8, 0]} theme={theme} />
      <HangingLight position={[7, 2.8, 0]} theme={theme} />
      <HangingLight position={[10, 2.8, -2.5]} theme={theme} />
      <HangingLight position={[10, 2.8, 2.5]} theme={theme} />

      {/* Wall decor on right wall */}
      <WallDecor position={[13.8, 1.8, -3]} theme={theme} />
      <WallDecor position={[13.8, 1.8, 3]} theme={theme} />

      {/* Buon Appetito sign on right wall */}
      <mesh position={[13.8, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshStandardMaterial color={theme.decorFrame} metalness={theme.furnitureMetalness} roughness={theme.furnitureRoughness} />
      </mesh>
      <Text position={[13.75, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.12} color={theme.decorInner} anchorX="center">
        {"Buon Appetito!"}
      </Text>

      {/* Floor zone labels */}
      <FloorLabel position={[1.5, 0.02, 2]} text="DOUGH" color="#f5deb3" />
      <FloorLabel position={[4, 0.02, 4.5]} text="OVEN" color="#f97316" />
      <FloorLabel position={[7, 0.02, 4.5]} text="PREP" color="#a855f7" />
      <FloorLabel position={[11, 0.02, 4.5]} text="DINING" color="#22c55e" />
    </group>
  );
}
