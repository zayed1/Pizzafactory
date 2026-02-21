import { Text } from "@react-three/drei";

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </group>
  );
}

function PizzaSign({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.08, 1.5, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[1.5, 0.6, 0.05]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <Text
        position={[0, 2.35, 0.04]}
        fontSize={0.22}
        color="#fbbf24"
        anchorX="center"
        fontWeight="bold"
      >
        PIZZA FACTORY
      </Text>
    </group>
  );
}

function FloorArrow({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.3, 0.8]} />
        <meshStandardMaterial color="#fbbf24" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.5]}>
        <coneGeometry args={[0.25, 0.3, 3]} />
        <meshStandardMaterial color="#fbbf24" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

export function OfficeFurniture() {
  return (
    <group>
      <Plant position={[-2, 0, -7.5]} />
      <Plant position={[-2, 0, 5.5]} />
      <Plant position={[17.5, 0, -7.5]} />
      <Plant position={[17.5, 0, 5.5]} />

      <PizzaSign position={[8, 0, 6.5]} />

      <FloorArrow position={[2, 0, -2]} rotation={0} />
      <FloorArrow position={[2, 0, 1.5]} rotation={Math.PI} />
      <FloorArrow position={[8, 0, 0]} rotation={Math.PI / 2} />
    </group>
  );
}
