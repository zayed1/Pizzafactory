import { useMemo } from "react";

export function OfficeFloor() {
  const kitchenTiles = useMemo(() => {
    const tiles: { color: string; x: number; z: number }[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        tiles.push({
          color: (i + j) % 2 === 0 ? "#e8e0d4" : "#d4c8b8",
          x: -1 + i * 2,
          z: -5 + j * 2,
        });
      }
    }
    return tiles;
  }, []);

  return (
    <group>
      {/* Kitchen floor tiles (left zone) */}
      {kitchenTiles.map((tile, idx) => (
        <mesh key={`kt-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[tile.x, -0.01, tile.z]} receiveShadow>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial color={tile.color} />
        </mesh>
      ))}

      {/* Corridor / work area (center) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.5, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 12]} />
        <meshStandardMaterial color="#c9b896" />
      </mesh>

      {/* Dining area (right zone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[11.5, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 12]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-1, 1.5, 0]}>
        <boxGeometry args={[0.25, 3, 12]} />
        <meshStandardMaterial color="#f5e6d0" />
      </mesh>
      {/* Right wall */}
      <mesh position={[14, 1.5, 0]}>
        <boxGeometry args={[0.25, 3, 12]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Back wall */}
      <mesh position={[6.5, 1.5, -6]}>
        <boxGeometry args={[15.2, 3, 0.25]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>
      {/* Front wall */}
      <mesh position={[6.5, 1.5, 6]}>
        <boxGeometry args={[15.2, 3, 0.25]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>

      {/* Wall trim - left */}
      <mesh position={[-0.85, 1.8, 0]}>
        <boxGeometry args={[0.05, 0.6, 11.5]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>

      {/* Wall trim - back */}
      <mesh position={[6.5, 1.5, -5.85]}>
        <boxGeometry args={[14.8, 0.6, 0.05]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[6.5, 2.99, 0]}>
        <boxGeometry args={[15.2, 0.05, 12.2]} />
        <meshStandardMaterial color="#f5eedc" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}
