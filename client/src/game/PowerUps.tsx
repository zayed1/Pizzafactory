import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, PowerUpSpawn } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

const POWERUP_COLORS: Record<string, string> = {
  speed_boost: "#06b6d4",
  freeze_patience: "#60a5fa",
  double_money: "#fbbf24",
};

const POWERUP_ICONS: Record<string, string> = {
  speed_boost: "\u26A1",
  freeze_patience: "\u2744\uFE0F",
  double_money: "$",
};

const COLLECT_DISTANCE = 1.5;

function PowerUpItem({ spawn, playerRef }: { spawn: PowerUpSpawn; playerRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const collectPowerUp = useOfficeGame((s) => s.collectPowerUp);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Rotate and bob
    meshRef.current.rotation.y += delta * 3;
    meshRef.current.position.y = spawn.position[1] + Math.sin(Date.now() * 0.003) * 0.15;

    // Check proximity to player
    if (playerRef.current) {
      const px = playerRef.current.position.x;
      const pz = playerRef.current.position.z;
      const dist = Math.sqrt(
        Math.pow(px - spawn.position[0], 2) + Math.pow(pz - spawn.position[2], 2)
      );
      if (dist < COLLECT_DISTANCE) {
        collectPowerUp(spawn.id);
      }
    }
  });

  const color = POWERUP_COLORS[spawn.type];

  return (
    <group position={[spawn.position[0], 0, spawn.position[2]]}>
      <mesh ref={meshRef} position={[0, spawn.position[1], 0]} castShadow>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={1} color={color} distance={3} />
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {POWERUP_ICONS[spawn.type]}
      </Text>
      {/* Ground ring glow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.4, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export function PowerUpSystem({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const powerUpSpawns = useOfficeGame((s) => s.powerUpSpawns);

  return (
    <>
      {powerUpSpawns.map((spawn) => (
        <PowerUpItem key={spawn.id} spawn={spawn} playerRef={playerRef} />
      ))}
    </>
  );
}
