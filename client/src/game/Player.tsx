import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useOfficeGame, ItemType } from "../lib/stores/useOfficeGame";

const ITEM_COLORS: Record<ItemType, string> = {
  none: "#000000",
  dough: "#f5deb3",
  pizza_raw: "#e8a849",
  pizza_ready: "#d4740a",
};

const ITEM_LABELS: Record<ItemType, string> = {
  none: "",
  dough: "Dough",
  pizza_raw: "Pizza",
  pizza_ready: "Ready!",
};

export const Player = forwardRef<THREE.Group>(function Player(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  const playerSpeed = useOfficeGame((s) => s.playerSpeed);
  const carrying = useOfficeGame((s) => s.carrying);
  const carryCount = useOfficeGame((s) => s.carryCount);

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

      groupRef.current.position.x = Math.max(-2, Math.min(18, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-7, Math.min(5, groupRef.current.position.z));
    }
  });

  return (
    <group ref={groupRef} position={[5, 0, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.5, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      <mesh position={[0, 1.22, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 0.08, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0.07, 1.04, 0.15]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.07, 1.04, 0.15]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {carrying !== "none" && (
        <group>
          {Array.from({ length: carryCount }).map((_, i) => (
            <group key={i} position={[0, 1.35 + i * 0.12, -0.2]}>
              {carrying === "dough" && (
                <mesh castShadow>
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshStandardMaterial color="#f5deb3" />
                </mesh>
              )}
              {carrying === "pizza_raw" && (
                <mesh castShadow>
                  <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
                  <meshStandardMaterial color="#e8a849" />
                </mesh>
              )}
              {carrying === "pizza_ready" && (
                <group>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
                    <meshStandardMaterial color="#d4740a" />
                  </mesh>
                  <mesh position={[0.05, 0.04, 0.03]}>
                    <sphereGeometry args={[0.03, 6, 6]} />
                    <meshStandardMaterial color="#ef4444" />
                  </mesh>
                  <mesh position={[-0.06, 0.04, -0.04]}>
                    <sphereGeometry args={[0.03, 6, 6]} />
                    <meshStandardMaterial color="#22c55e" />
                  </mesh>
                </group>
              )}
            </group>
          ))}
          <Text
            position={[0, 1.6 + (carryCount - 1) * 0.12, 0]}
            fontSize={0.18}
            color={carrying === "pizza_ready" ? "#22c55e" : "#fbbf24"}
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {ITEM_LABELS[carrying]}{carryCount > 1 ? ` x${carryCount}` : ""}
          </Text>
        </group>
      )}
    </group>
  );
});
