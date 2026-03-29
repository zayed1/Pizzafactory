import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OfficeFloor } from "./OfficeFoor";
import { Player } from "./Player";
import { DoughMaker } from "./DoughMaker";
import { OvenSystem } from "./Oven";
import { PrepStation } from "./PrepStation";
import { CustomerTableComp } from "./CustomerTable";
import { useOfficeGame } from "../lib/stores/useOfficeGame";
import { OfficeFurniture } from "./OfficeFurniture";
import { GameLoop } from "./GameLoop";
import { FloatingTextManager } from "./FloatingText";
import { GuideArrows } from "./GuideArrows";
import { SoundManager } from "./SoundManager";
import { ParticleSystem } from "./Particles";
import { CameraEffects } from "./CameraEffects";
import { EventLighting } from "./EventLighting";
import { useRestaurantTheme } from "./RestaurantTheme";
import { PowerUpSystem } from "./PowerUps";
import { WallClock } from "./WallClock";
import { WeatherEffects } from "./WeatherEffects";
import { HiddenTreasureSystem } from "./HiddenTreasure";
import { TrophyShelf } from "./TrophyShelf";
import { SkillEffects } from "./SkillEffects";

function SwingingLight({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.08;
      groupRef.current.rotation.x = Math.cos(Date.now() * 0.0008) * 0.04;
    }
  });
  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <coneGeometry args={[0.15, 0.12, 8]} />
          <meshStandardMaterial color="#d97706" metalness={0.4} roughness={0.3} />
        </mesh>
        <pointLight position={[0, -0.4, 0]} intensity={0.8} color="#fbbf24" distance={4} />
      </group>
    </group>
  );
}

export function OfficeScene() {
  const playerRef = useRef<THREE.Group>(null);
  const prepEmployees = useOfficeGame((s) => s.prepEmployees);
  const tables = useOfficeGame((s) => s.tables);
  const theme = useRestaurantTheme();

  return (
    <>
      <ambientLight intensity={theme.ambientIntensity} color="#fff5e6" />
      <directionalLight
        position={[8, 15, 8]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={18}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#fff8f0"
      />
      <pointLight position={[1.5, 2.5, 0]} intensity={0.5} color={theme.lightEmissive} distance={6} />
      <pointLight position={[4, 2.5, 0]} intensity={0.6} color="#f97316" distance={6} />
      <pointLight position={[7, 2.5, 0]} intensity={0.3} color="#a855f7" distance={6} />
      <pointLight position={[11, 2.5, 0]} intensity={theme.lightIntensity * 0.7} color={theme.lightEmissive} distance={8} />

      <hemisphereLight intensity={0.3} color="#fef3c7" groundColor="#5c3a1e" />

      <OfficeFloor />
      <OfficeFurniture />

      <Player ref={playerRef} />

      <DoughMaker playerRef={playerRef} />
      <OvenSystem playerRef={playerRef} />

      {prepEmployees.map((emp, i) => (
        <PrepStation key={emp.id} emp={emp} index={i} playerRef={playerRef} />
      ))}

      {tables.map((table) => (
        <CustomerTableComp key={table.id} table={table} playerRef={playerRef} />
      ))}

      <GuideArrows />
      <FloatingTextManager />
      <SoundManager />
      <ParticleSystem />
      <GameLoop />
      <CameraEffects />
      <EventLighting />
      <PowerUpSystem playerRef={playerRef} />
      <HiddenTreasureSystem playerRef={playerRef} />
      <SkillEffects playerRef={playerRef} />
      <TrophyShelf />
      <SwingingLight position={[5, 2.8, 0]} />
      <WallClock />
      <WeatherEffects />
    </>
  );
}
