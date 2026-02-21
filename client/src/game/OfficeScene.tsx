import { useRef } from "react";
import * as THREE from "three";
import { OfficeFloor } from "./OfficeFoor";
import { Player } from "./Player";
import { Printer } from "./Printer";
import { Desk } from "./Desk";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { OfficeFurniture } from "./OfficeFurniture";

export function OfficeScene() {
  const playerRef = useRef<THREE.Group>(null);
  const employees = useOfficeGame((s) => s.employees);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[3, 3, 0]} intensity={0.5} color="#fbbf24" />
      <pointLight position={[10, 3, 0]} intensity={0.5} color="#60a5fa" />

      <OfficeFloor />
      <OfficeFurniture />

      <Player ref={playerRef} />

      <Printer playerRef={playerRef} />

      {employees.map((emp) => (
        <Desk key={emp.id} employee={emp} playerRef={playerRef} />
      ))}
    </>
  );
}
