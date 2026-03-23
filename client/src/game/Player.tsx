import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useOfficeGame, ItemType } from "../lib/stores/useOfficeGame";
import { resolveCollision } from "./collisions";
import { useTouchInput } from "./TouchControls";

const ITEM_LABELS: Record<ItemType, string> = {
  none: "",
  dough: "Dough",
  pizza_raw: "Pizza",
  pizza_ready: "Ready!",
};

export const Player = forwardRef<THREE.Group>(function Player(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const [subscribe, getKeys] = useKeyboardControls();
  const playerSpeed = useOfficeGame((s) => s.playerSpeed);
  const carrying = useOfficeGame((s) => s.carrying);
  const carryCount = useOfficeGame((s) => s.carryCount);
  const tables = useOfficeGame((s) => s.tables);
  const ovens = useOfficeGame((s) => s.ovens);
  const phase = useOfficeGame((s) => s.phase);
  const dropItem = useOfficeGame((s) => s.dropItem);
  const playerColor = useOfficeGame((s) => s.playerColor);
  const playerHat = useOfficeGame((s) => s.playerHat);
  const prestigeLevel = useOfficeGame((s) => s.prestigeLevel);
  const bobTimer = useRef(0);
  const targetRotation = useRef(0);
  const footstepTimer = useRef(0);
  const zoneTrackTimer = useRef(0);
  const recordZoneVisit = useOfficeGame((s) => s.recordZoneVisit);
  const activePowerUp = useOfficeGame((s) => s.activePowerUp);
  const skills = useOfficeGame((s) => s.skills);

  useImperativeHandle(ref, () => groupRef.current!, []);

  useEffect(() => {
    return subscribe(
      (state: any) => state.drop,
      (pressed: boolean) => {
        if (pressed && useOfficeGame.getState().phase === "playing") {
          useOfficeGame.getState().dropItem();
        }
      }
    );
  }, [subscribe]);

  useFrame((_, delta) => {
    if (!groupRef.current || phase !== "playing") return;
    const keys = getKeys() as any;
    const touch = useTouchInput.getState();
    const direction = new THREE.Vector3();

    if (keys.forward) direction.z -= 1;
    if (keys.back) direction.z += 1;
    if (keys.left) direction.x -= 1;
    if (keys.right) direction.x += 1;

    if (touch.active) {
      direction.x += touch.dx;
      direction.z += touch.dy;
    }

    const isMoving = direction.length() > 0.1;

    if (isMoving) {
      direction.normalize();
      const currentX = groupRef.current.position.x;
      const currentZ = groupRef.current.position.z;

      // Speed boost from power-up
      let effectiveSpeed = playerSpeed;
      if (activePowerUp?.type === "speed_boost") effectiveSpeed *= 1.5;
      // Speed burst skill: streak bonus
      const speedBurstLevel = skills["speed_burst"] || 0;
      const streak = useOfficeGame.getState().streak;
      if (speedBurstLevel > 0 && streak > 0) {
        effectiveSpeed *= 1 + (Math.min(streak, 10) * speedBurstLevel * 0.02);
      }

      let newX = currentX + direction.x * effectiveSpeed * delta;
      let newZ = currentZ + direction.z * effectiveSpeed * delta;

      newX = Math.max(-0.5, Math.min(13.5, newX));
      newZ = Math.max(-5.5, Math.min(5.5, newZ));

      const [resolvedX, resolvedZ] = resolveCollision(currentX, currentZ, newX, newZ, tables, ovens.length);
      groupRef.current.position.x = Math.max(-0.5, Math.min(13.5, resolvedX));
      groupRef.current.position.z = Math.max(-5.5, Math.min(5.5, resolvedZ));

      targetRotation.current = Math.atan2(direction.x, direction.z);

      bobTimer.current += delta * playerSpeed * 1.5;

      // Footstep sounds
      footstepTimer.current += delta;
      if (footstepTimer.current >= 0.35) {
        footstepTimer.current = 0;
        const { gameAudio } = require("./SoundManager");
        gameAudio.play("pickup", 0.06, 0.4 + Math.random() * 0.2);
      }

      // Update lastActivityTime
      useOfficeGame.setState({ lastActivityTime: Date.now() });
    }

    // Zone tracking for heatmap
    zoneTrackTimer.current += delta;
    if (zoneTrackTimer.current >= 1.0 && groupRef.current) {
      zoneTrackTimer.current = 0;
      const px = groupRef.current.position.x;
      let zone = "other";
      if (px < 3) zone = "dough";
      else if (px < 5.5) zone = "oven";
      else if (px < 8.5) zone = "prep";
      else zone = "dining";
      recordZoneVisit(zone);
      useOfficeGame.setState({ playerPos: [groupRef.current.position.x, groupRef.current.position.z] });
    }

    const currentRot = groupRef.current.rotation.y;
    let diff = targetRotation.current - currentRot;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    groupRef.current.rotation.y += diff * Math.min(1, delta * 12);

    if (bodyRef.current) {
      if (isMoving) {
        bodyRef.current.position.y = Math.sin(bobTimer.current * 2) * 0.04;
        bodyRef.current.rotation.z = Math.sin(bobTimer.current) * 0.05;
      } else {
        bodyRef.current.position.y *= 0.9;
        bodyRef.current.rotation.z *= 0.9;
      }
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, 0]}>
      <group ref={bodyRef}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.15, 0.25, 8]} />
        <meshStandardMaterial color={playerColor} />
      </mesh>

      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.2, 8]} />
        <meshStandardMaterial color={playerColor} />
      </mesh>

      <mesh position={[0, 0.42, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.48, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.54, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <mesh position={[0, 0.55, 0.16]}>
        <boxGeometry args={[0.15, 0.04, 0.02]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>

      {/* Hat based on playerHat */}
      {playerHat === "chef" && (
        <>
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.18, 0.06, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.2, 0.06, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}
      {playerHat === "tall_chef" && (
        <>
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.17, 0.28, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 1.26, 0]} castShadow>
            <sphereGeometry args={[0.15, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}
      {playerHat === "beret" && (
        <>
          <mesh position={[0, 0.93, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.17, 0.04, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 0.97, 0]} castShadow>
            <sphereGeometry args={[0.17, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 1.04, 0]} castShadow>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </>
      )}
      {playerHat === "crown" && (
        <>
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.19, 0.06, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 1.02, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.17, 0.1, 5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 1.08, 0]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {/* Prestige glow aura */}
      {prestigeLevel > 0 && (
        <pointLight position={[0, 0.5, 0]} intensity={prestigeLevel * 0.3} color="#fbbf24" distance={2} />
      )}

      <mesh position={[0.06, 0.82, 0.13]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.06, 0.82, 0.13]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <mesh position={[0, 0.73, 0.13]}>
        <boxGeometry args={[0.06, 0.02, 0.02]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>

      {carrying !== "none" && (
        <group>
          {Array.from({ length: carryCount }).map((_, i) => (
            <group key={i} position={[0, 1.15 + i * 0.12, -0.2]}>
              {carrying === "dough" && (
                <mesh castShadow>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial color="#f5deb3" />
                </mesh>
              )}
              {carrying === "pizza_raw" && (
                <group>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.04, 8]} />
                    <meshStandardMaterial color="#e8a849" />
                  </mesh>
                  <mesh position={[0, 0.03, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.02, 8]} />
                    <meshStandardMaterial color="#dc2626" opacity={0.7} transparent />
                  </mesh>
                </group>
              )}
              {carrying === "pizza_ready" && (
                <group>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.04, 8]} />
                    <meshStandardMaterial color="#d4740a" />
                  </mesh>
                  <mesh position={[0.04, 0.03, 0.02]}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                    <meshStandardMaterial color="#ef4444" />
                  </mesh>
                  <mesh position={[-0.05, 0.03, -0.03]}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                    <meshStandardMaterial color="#22c55e" />
                  </mesh>
                  <mesh position={[0.01, 0.03, -0.05]}>
                    <sphereGeometry args={[0.02, 6, 6]} />
                    <meshStandardMaterial color="#fbbf24" />
                  </mesh>
                </group>
              )}
            </group>
          ))}
          <Text
            position={[0, 1.35 + (carryCount - 1) * 0.12, 0]}
            fontSize={0.16}
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
    </group>
  );
});
