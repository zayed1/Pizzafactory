import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, HiddenTreasure } from "../lib/stores/useOfficeGame";

const COLLECT_DISTANCE = 1.2;

function TreasureItem({ treasure, playerRef }: { treasure: HiddenTreasure; playerRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const collectTreasure = useOfficeGame((s) => s.collectTreasure);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 4;
    meshRef.current.position.y = treasure.position[1] + Math.sin(Date.now() * 0.005) * 0.08;

    // Fade out as time passes (10s lifetime)
    const age = (Date.now() - treasure.spawnTime) / 1000;
    const opacity = age > 7 ? Math.max(0, 1 - (age - 7) / 3) : 1;
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.opacity = opacity;
    }

    if (playerRef.current) {
      const px = playerRef.current.position.x;
      const pz = playerRef.current.position.z;
      const dist = Math.sqrt(
        Math.pow(px - treasure.position[0], 2) + Math.pow(pz - treasure.position[2], 2)
      );
      if (dist < COLLECT_DISTANCE) {
        collectTreasure(treasure.id);
      }
    }
  });

  return (
    <group position={[treasure.position[0], 0, treasure.position[2]]}>
      <mesh ref={meshRef} position={[0, treasure.position[1], 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 12]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1.0}
          metalness={0.8}
          roughness={0.2}
          transparent
        />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={1.5} color="#fbbf24" distance={2.5} />
      {/* Sparkle ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function HiddenTreasureSystem({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const hiddenTreasures = useOfficeGame((s) => s.hiddenTreasures);

  return (
    <>
      {hiddenTreasures.map((t) => (
        <TreasureItem key={t.id} treasure={t} playerRef={playerRef} />
      ))}
    </>
  );
}
