import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRestaurantTheme } from "./RestaurantTheme";

export function WallClock() {
  const hourRef = useRef<THREE.Mesh>(null);
  const minuteRef = useRef<THREE.Mesh>(null);
  const secondRef = useRef<THREE.Mesh>(null);
  const theme = useRestaurantTheme();
  const gameTimeRef = useRef(0);

  useFrame((_, delta) => {
    gameTimeRef.current += delta;
    const t = gameTimeRef.current;
    // Accelerated clock: 1 real second = 1 game minute
    const gameMinutes = t;
    const gameHours = t / 60;

    if (hourRef.current) {
      hourRef.current.rotation.z = -(gameHours / 12) * Math.PI * 2;
    }
    if (minuteRef.current) {
      minuteRef.current.rotation.z = -(gameMinutes / 60) * Math.PI * 2;
    }
    if (secondRef.current) {
      secondRef.current.rotation.z = -(t) * Math.PI * 2 / 60 * 10; // Fast seconds
    }
  });

  return (
    <group position={[7, 2.5, -5.65]} rotation={[0, 0, 0]}>
      {/* Clock body */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 24]} />
        <meshStandardMaterial color={theme.decorFrame} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0, 0, 0.035]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r = 0.28;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.04]}>
            <boxGeometry args={[0.02, i % 3 === 0 ? 0.06 : 0.03, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        );
      })}
      {/* Hour hand */}
      <mesh ref={hourRef} position={[0, 0, 0.045]}>
        <boxGeometry args={[0.02, 0.16, 0.01]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Minute hand */}
      <mesh ref={minuteRef} position={[0, 0, 0.05]}>
        <boxGeometry args={[0.015, 0.24, 0.01]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Second hand */}
      <mesh ref={secondRef} position={[0, 0, 0.055]}>
        <boxGeometry args={[0.005, 0.28, 0.005]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Center dot */}
      <mesh position={[0, 0, 0.06]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}
