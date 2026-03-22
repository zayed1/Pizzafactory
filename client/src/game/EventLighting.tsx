import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function EventLighting() {
  const activeEvent = useOfficeGame((s) => s.activeEvent);
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!light1.current || !light2.current) return;

    if (!activeEvent) {
      light1.current.intensity = 0;
      light2.current.intensity = 0;
      return;
    }

    const t = Math.sin(Date.now() * 0.003) * 0.5 + 0.5;

    if (activeEvent.type === "double_pay") {
      light1.current.color.setHex(0x22c55e);
      light2.current.color.setHex(0x16a34a);
      light1.current.intensity = 0.5 + t * 0.5;
      light2.current.intensity = 0.5 + (1 - t) * 0.5;
    } else if (activeEvent.type === "rush_hour") {
      light1.current.color.setHex(0xef4444);
      light2.current.color.setHex(0xf97316);
      light1.current.intensity = 0.6 + t * 0.6;
      light2.current.intensity = 0.6 + (1 - t) * 0.6;
    } else if (activeEvent.type === "tips_rain") {
      light1.current.color.setHex(0xfbbf24);
      light2.current.color.setHex(0xf59e0b);
      light1.current.intensity = 0.5 + t * 0.5;
      light2.current.intensity = 0.5 + (1 - t) * 0.5;
    }
  });

  return (
    <>
      <pointLight ref={light1} position={[3, 4, 0]} distance={15} intensity={0} />
      <pointLight ref={light2} position={[10, 4, 0]} distance={15} intensity={0} />
    </>
  );
}
