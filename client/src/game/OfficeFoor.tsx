import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";

export function OfficeFloor() {
  const woodTexture = useTexture("/textures/wood.jpg");

  useMemo(() => {
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(5, 4);
  }, [woodTexture]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -0.01, -1]} receiveShadow>
        <planeGeometry args={[24, 16]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      <mesh position={[-3, 1.5, -1]}>
        <boxGeometry args={[0.2, 3, 16]} />
        <meshStandardMaterial color="#dc2626" opacity={0.9} />
      </mesh>
      <mesh position={[19, 1.5, -1]}>
        <boxGeometry args={[0.2, 3, 16]} />
        <meshStandardMaterial color="#dc2626" opacity={0.9} />
      </mesh>
      <mesh position={[8, 1.5, -9]}>
        <boxGeometry args={[22.4, 3, 0.2]} />
        <meshStandardMaterial color="#dc2626" opacity={0.9} />
      </mesh>
      <mesh position={[8, 1.5, 7]}>
        <boxGeometry args={[22.4, 3, 0.2]} />
        <meshStandardMaterial color="#dc2626" opacity={0.9} />
      </mesh>

      <mesh position={[8, 2.99, -1]}>
        <boxGeometry args={[22.2, 0.05, 15.8]} />
        <meshStandardMaterial color="#fef3c7" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}
