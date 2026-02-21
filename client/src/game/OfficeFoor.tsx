import { useMemo } from "react";

export function OfficeFloor() {
  const kitchenTiles = useMemo(() => {
    const tiles: { color: string; x: number; z: number }[] = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        tiles.push({
          color: (i + j) % 2 === 0 ? "#e8e0d4" : "#d4c8b8",
          x: -2 + i * 2,
          z: -8 + j * 2,
        });
      }
    }
    return tiles;
  }, []);

  return (
    <group>
      {kitchenTiles.map((tile, idx) => (
        <mesh key={`kt-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[tile.x, -0.01, tile.z]} receiveShadow>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial color={tile.color} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14, -0.01, -1]} receiveShadow>
        <planeGeometry args={[12, 14]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>

      <mesh position={[-3, 1.5, -1]}>
        <boxGeometry args={[0.25, 3, 16]} />
        <meshStandardMaterial color="#f5e6d0" />
      </mesh>
      <mesh position={[19, 1.5, -1]}>
        <boxGeometry args={[0.25, 3, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[8, 1.5, -9]}>
        <boxGeometry args={[22.4, 3, 0.25]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>
      <mesh position={[8, 1.5, 7]}>
        <boxGeometry args={[22.4, 3, 0.25]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>

      <mesh position={[-2.85, 1.8, -1]}>
        <boxGeometry args={[0.05, 0.6, 15.5]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>

      <mesh position={[8, 1.5, -8.85]}>
        <boxGeometry args={[22, 0.6, 0.05]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>

      <mesh position={[8, 2.99, -1]}>
        <boxGeometry args={[22.2, 0.05, 15.8]} />
        <meshStandardMaterial color="#f5eedc" opacity={0.25} transparent />
      </mesh>

      <mesh position={[8.5, 0, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 14]} />
        <meshStandardMaterial color="#8b6914" opacity={0.4} transparent />
      </mesh>
    </group>
  );
}
