import { useMemo } from "react";

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
      <mesh position={[0.1, 0.8, 0.05]} castShadow>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

function WaterCooler({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 1.0, 0.4]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.4, 8]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.0, 1.2, 0.3]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <mesh position={[-0.25, 0.85, 0.1]}>
        <boxGeometry args={[0.15, 0.25, 0.15]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.85, 0.1]}>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0.25, 0.85, 0.1]}>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[-0.15, 0.35, 0.1]}>
        <boxGeometry args={[0.15, 0.25, 0.15]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0.15, 0.35, 0.1]}>
        <boxGeometry args={[0.15, 0.28, 0.15]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
    </group>
  );
}

export function OfficeFurniture() {
  return (
    <group>
      <Plant position={[-1.3, 0, -5.5]} />
      <Plant position={[-1.3, 0, 5.5]} />
      <Plant position={[15, 0, -5.5]} />
      <Plant position={[15, 0, 5.5]} />
      <WaterCooler position={[2, 0, -5.5]} />
      <Bookshelf position={[14.5, 0, 0]} />
    </group>
  );
}
