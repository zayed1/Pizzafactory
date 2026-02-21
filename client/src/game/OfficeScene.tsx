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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#fbbf24" />
      <pointLight position={[8, 3, 0]} intensity={0.4} color="#f97316" />
      <pointLight position={[14, 3, 0]} intensity={0.3} color="#60a5fa" />

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
