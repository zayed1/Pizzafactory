import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export const Player = forwardRef<THREE.Group>(function Player(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  const playerSpeed = useOfficeGame((s) => s.playerSpeed);
  const papersCarried = useOfficeGame((s) => s.papersCarried);

  useImperativeHandle(ref, () => groupRef.current!, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const keys = getKeys() as any;
    const direction = new THREE.Vector3();

    if (keys.forward) direction.z -= 1;
    if (keys.back) direction.z += 1;
    if (keys.left) direction.x -= 1;
    if (keys.right) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      groupRef.current.position.x += direction.x * playerSpeed * delta;
      groupRef.current.position.z += direction.z * playerSpeed * delta;

      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle;

      groupRef.current.position.x = Math.max(-1.5, Math.min(15.5, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-6, Math.min(6, groupRef.current.position.z));
    }
  });

  const paperElements = [];
  for (let i = 0; i < 10; i++) {
    if (i < papersCarried) {
      paperElements.push(
        <mesh key={i} position={[0, 1.55 + i * 0.06, -0.15]} castShadow>
          <boxGeometry args={[0.3, 0.04, 0.4]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
      );
    }
  }

  return (
    <group ref={groupRef} position={[1, 0, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.7, 8]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.5, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      <mesh position={[0.08, 1.35, 0.15]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.08, 1.35, 0.15]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {paperElements}
    </group>
  );
});
