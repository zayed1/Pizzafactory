import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function CameraEffects() {
  const { camera } = useThree();
  const streak = useOfficeGame((s) => s.streak);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const missedCustomers = useOfficeGame((s) => s.missedCustomers);
  const showLevelUp = useOfficeGame((s) => s.showLevelUp);
  const carrying = useOfficeGame((s) => s.carrying);
  const prevServed = useRef(totalPizzasServed);
  const prevMissed = useRef(missedCustomers);
  const shakeIntensity = useRef(0);
  const shakeDecay = useRef(0);
  const basePos = useRef({ x: camera.position.x, y: camera.position.y, z: camera.position.z });
  const baseFov = useRef(50);
  const targetFov = useRef(50);

  useEffect(() => {
    basePos.current = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    if ((camera as THREE.PerspectiveCamera).fov) {
      baseFov.current = (camera as THREE.PerspectiveCamera).fov;
      targetFov.current = baseFov.current;
    }
  }, []);

  useFrame((_, delta) => {
    // Trigger shake on delivery
    if (totalPizzasServed > prevServed.current) {
      const diff = totalPizzasServed - prevServed.current;
      shakeIntensity.current = Math.min(0.15, diff * 0.05 + (streak >= 5 ? 0.08 : 0));
      shakeDecay.current = 0.3;
    }
    prevServed.current = totalPizzasServed;

    // Screen shake on customer loss
    if (missedCustomers > prevMissed.current) {
      shakeIntensity.current = 0.18;
      shakeDecay.current = 0.4;
    }
    prevMissed.current = missedCustomers;

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

    // Dynamic camera zoom: zoom in slightly when carrying, zoom out when moving freely
    const perspCam = camera as THREE.PerspectiveCamera;
    if (perspCam.fov) {
      if (carrying !== "none") {
        targetFov.current = baseFov.current - 3; // slight zoom in
      } else if (streak >= 8) {
        targetFov.current = baseFov.current + 2; // slight zoom out for epic feel
      } else {
        targetFov.current = baseFov.current;
      }
      perspCam.fov += (targetFov.current - perspCam.fov) * Math.min(1, delta * 3);
      perspCam.updateProjectionMatrix();
    }
  });

  return null;
}
