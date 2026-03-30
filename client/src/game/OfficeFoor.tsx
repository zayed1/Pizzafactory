import { useMemo } from "react";
import { useRestaurantTheme } from "./RestaurantTheme";

export function OfficeFloor() {
  const theme = useRestaurantTheme();

  const kitchenTiles = useMemo(() => {
    const tiles: { color: string; x: number; z: number }[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        tiles.push({
          color: (i + j) % 2 === 0 ? theme.kitchenFloorA : theme.kitchenFloorB,
          x: -1 + i * 2,
          z: -5 + j * 2,
        });
      }
    }
    return tiles;
  }, [theme.kitchenFloorA, theme.kitchenFloorB]);

  return (
    <group>
      {/* Kitchen floor tiles (left zone) */}
      {kitchenTiles.map((tile, idx) => (
        <mesh key={`kt-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[tile.x, -0.01, tile.z]} receiveShadow>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial color={tile.color} metalness={theme.floorMetalness} roughness={theme.floorRoughness} />
        </mesh>
      ))}

      {/* Corridor / work area (center) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.5, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 12]} />
        <meshStandardMaterial color={theme.corridorFloor} metalness={theme.floorMetalness} roughness={theme.floorRoughness} />
      </mesh>

      {/* Dining area (right zone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[11.5, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 12]} />
        <meshStandardMaterial color={theme.diningFloor} metalness={theme.floorMetalness * 1.5} roughness={theme.floorRoughness * 0.8} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-1, 1.5, 0]}>
        <boxGeometry args={[0.25, 3, 12]} />
        <meshStandardMaterial color={theme.wallLeft} metalness={theme.wallMetalness} roughness={theme.wallRoughness} />
      </mesh>
      {/* Right wall */}
      <mesh position={[14, 1.5, 0]}>
        <boxGeometry args={[0.25, 3, 12]} />
        <meshStandardMaterial color={theme.wallRight} metalness={theme.wallMetalness} roughness={theme.wallRoughness} />
      </mesh>
      {/* Back wall */}
      <mesh position={[6.5, 1.5, -6]}>
        <boxGeometry args={[15.2, 3, 0.25]} />
        <meshStandardMaterial color={theme.wallBack} metalness={theme.wallMetalness} roughness={theme.wallRoughness} />
      </mesh>
      {/* Front wall */}
      <mesh position={[6.5, 1.5, 6]}>
        <boxGeometry args={[15.2, 3, 0.25]} />
        <meshStandardMaterial color={theme.wallFront} metalness={theme.wallMetalness} roughness={theme.wallRoughness} />
      </mesh>

      {/* Wall trim - left */}
      <mesh position={[-0.85, 1.8, 0]}>
        <boxGeometry args={[0.05, 0.6, 11.5]} />
        <meshStandardMaterial color={theme.wallTrim} metalness={theme.wallMetalness * 2} roughness={theme.wallRoughness * 0.7} />
      </mesh>

      {/* Wall trim - back */}
      <mesh position={[6.5, 1.5, -5.85]}>
        <boxGeometry args={[14.8, 0.6, 0.05]} />
        <meshStandardMaterial color={theme.wallTrim} metalness={theme.wallMetalness * 2} roughness={theme.wallRoughness * 0.7} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[6.5, 2.99, 0]}>
        <boxGeometry args={[15.2, 0.05, 12.2]} />
        <meshStandardMaterial color={theme.ceiling} opacity={theme.ceilingOpacity} transparent />
      </mesh>
    </group>
  );
}
