import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";

export function OfficeFloor() {
  const woodTexture = useTexture("/textures/wood.jpg");

  useMemo(() => {
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(4, 3);
  }, [woodTexture]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, -0.01, 0]} receiveShadow>
        <planeGeometry args={[22, 14]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      <mesh position={[-2, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 14]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[16, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 14]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[7, 1.5, -7]}>
        <boxGeometry args={[18.4, 3, 0.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[7, 1.5, 7]}>
        <boxGeometry args={[18.4, 3, 0.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}
