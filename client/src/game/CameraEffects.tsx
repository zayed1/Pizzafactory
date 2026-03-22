import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function CameraEffects() {
  const { camera } = useThree();
  const streak = useOfficeGame((s) => s.streak);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const showLevelUp = useOfficeGame((s) => s.showLevelUp);
  const prevServed = useRef(totalPizzasServed);
  const shakeIntensity = useRef(0);
  const shakeDecay = useRef(0);
  const basePos = useRef({ x: camera.position.x, y: camera.position.y, z: camera.position.z });

  useEffect(() => {
    basePos.current = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  }, []);

  useFrame((_, delta) => {
    // Trigger shake on delivery
    if (totalPizzasServed > prevServed.current) {
      const diff = totalPizzasServed - prevServed.current;
      shakeIntensity.current = Math.min(0.15, diff * 0.05 + (streak >= 5 ? 0.08 : 0));
      shakeDecay.current = 0.3;
    }
    prevServed.current = totalPizzasServed;

    // Level up big shake
    if (showLevelUp && shakeDecay.current <= 0) {
      shakeIntensity.current = 0.2;
      shakeDecay.current = 0.5;
    }

    // Apply shake
    if (shakeDecay.current > 0) {
      shakeDecay.current -= delta;
      const t = shakeDecay.current / 0.3;
      const intensity = shakeIntensity.current * t;
      camera.position.x = basePos.current.x + (Math.random() - 0.5) * intensity;
      camera.position.y = basePos.current.y + (Math.random() - 0.5) * intensity;
    } else {
      // Smoothly return to base
      camera.position.x += (basePos.current.x - camera.position.x) * delta * 10;
      camera.position.y += (basePos.current.y - camera.position.y) * delta * 10;
    }
  });

  return null;
}
