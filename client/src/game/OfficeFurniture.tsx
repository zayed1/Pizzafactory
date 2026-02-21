import { Text } from "@react-three/drei";

function KitchenShelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.8, 0.06, 0.3]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      <mesh position={[-0.85, -0.15, 0.15]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color="#6b5210" />
      </mesh>
      <mesh position={[0.85, -0.15, 0.15]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color="#6b5210" />
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

function MenuBoard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.0, 1.2, 0.08]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1.85, 1.05, 0.02]} />
        <meshStandardMaterial color="#16213e" />
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

function HangingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <coneGeometry args={[0.2, 0.15, 8]} />
        <meshStandardMaterial color="#d97706" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={0.6} color="#fbbf24" distance={4} />
    </group>
  );
}

function WallDecor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.04]} />
        <meshStandardMaterial color="#3c1a00" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.65, 0.65, 0.02]} />
        <meshStandardMaterial color="#fef3c7" />
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

function Fridge({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.7, 2, 0.65]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.4} roughness={0.3} />
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

function KitchenDivider({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.15, 1.0, 0.8]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.85]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.3} />
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
  return (
    <group>
      <KitchenShelf position={[-2.7, 1.8, -3]} />
      <KitchenShelf position={[-2.7, 2.3, -3]} />
      <KitchenShelf position={[-2.7, 1.8, 0]} />

      <MenuBoard position={[14, 2.0, -8.7]} />

      <Fridge position={[-2.3, 0, -7.5]} />
      <Fridge position={[-2.3, 0, 5]} />

      <KitchenDivider position={[3.5, 0, -3]} />
      <KitchenDivider position={[3.5, 0, -1]} />
      <KitchenDivider position={[3.5, 0, 1]} />

      <HangingLight position={[1, 2.8, -5]} />
      <HangingLight position={[1, 2.8, 2]} />
      <HangingLight position={[12, 2.8, -4.5]} />
      <HangingLight position={[12, 2.8, 1.5]} />
      <HangingLight position={[15.5, 2.8, -1.5]} />

      <WallDecor position={[18.8, 1.8, -5]} />
      <WallDecor position={[18.8, 1.8, 2]} />

      <mesh position={[18.8, 1.5, -1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshStandardMaterial color="#3c1a00" />
      </mesh>
      <Text position={[18.75, 1.5, -1.5]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.12} color="#fef3c7" anchorX="center">
        {"Buon Appetito!"}
      </Text>

      <FloorLabel position={[1, 0.02, -1.5]} text="KITCHEN" color="#f5deb3" />
      <FloorLabel position={[7.5, 0.02, -3.5]} text="PREP" color="#a855f7" />
      <FloorLabel position={[14, 0.02, 4]} text="DINING" color="#f97316" />
    </group>
  );
}
