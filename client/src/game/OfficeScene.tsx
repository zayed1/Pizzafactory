import { useRef } from "react";
import * as THREE from "three";
import { OfficeFloor } from "./OfficeFoor";
import { Player } from "./Player";
import { DoughMaker } from "./DoughMaker";
import { Oven } from "./Oven";
import { PrepStation } from "./PrepStation";
import { CustomerTableComp } from "./CustomerTable";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { OfficeFurniture } from "./OfficeFurniture";
import { GameLoop } from "./GameLoop";

export function OfficeScene() {
  const playerRef = useRef<THREE.Group>(null);
  const prepEmployees = useOfficeGame((s) => s.prepEmployees);
  const tables = useOfficeGame((s) => s.tables);

  return (
    <>
      <ambientLight intensity={0.4} color="#fff5e6" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        color="#fff8f0"
      />
      <pointLight position={[1, 2.5, -2]} intensity={0.5} color="#fbbf24" distance={6} />
      <pointLight position={[1, 2.5, 1.5]} intensity={0.6} color="#f97316" distance={5} />
      <pointLight position={[8, 2.5, -4]} intensity={0.3} color="#e8e0d4" distance={5} />
      <pointLight position={[14, 2.5, 0]} intensity={0.4} color="#fef3c7" distance={8} />

      <hemisphereLight intensity={0.3} color="#fef3c7" groundColor="#5c3a1e" />

      <OfficeFloor />
      <OfficeFurniture />

      <Player ref={playerRef} />

      <DoughMaker playerRef={playerRef} />
      <Oven playerRef={playerRef} />

      {prepEmployees.map((emp, i) => (
        <PrepStation key={emp.id} emp={emp} index={i} playerRef={playerRef} />
      ))}

      {tables.map((table) => (
        <CustomerTableComp key={table.id} table={table} playerRef={playerRef} />
      ))}

      <GameLoop />
    </>
  );
}
