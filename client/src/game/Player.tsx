import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useOfficeGame, ItemType } from "../lib/stores/useOfficeGame";
import { resolveCollision } from "./collisions";
import { useTouchInput } from "./TouchControls";
import { gameAudio } from "./SoundManager";

const ITEM_LABELS: Record<ItemType, string> = {
  none: "",
  dough: "Dough",
  pizza_raw: "Pizza",
  pizza_ready: "Ready!",
};

export const Player = forwardRef<THREE.Group>(function Player(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
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
  const streak = useOfficeGame((s) => s.streak);
  // Footstep trail
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const trailPositions = useRef<{ x: number; z: number; age: number }[]>([]);
  const trailDummy = useRef(new THREE.Object3D());
  const trailTimer = useRef(0);
  // Victory dance
  const danceTimer = useRef(0);
  const prevStreak = useRef(0);
  const isDancing = useRef(false);

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

    // Arm swing animation
    const armSwing = isMoving ? Math.sin(bobTimer.current * 2) * 0.6 : 0;
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = leftArmRef.current.rotation.x + (armSwing - leftArmRef.current.rotation.x) * Math.min(1, delta * 10);
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = rightArmRef.current.rotation.x + (-armSwing - rightArmRef.current.rotation.x) * Math.min(1, delta * 10);
    }

    // Footstep trail
    if (isMoving && groupRef.current) {
      trailTimer.current += delta;
      if (trailTimer.current >= 0.2) {
        trailTimer.current = 0;
        trailPositions.current.push({
          x: groupRef.current.position.x,
          z: groupRef.current.position.z,
          age: 0,
        });
        if (trailPositions.current.length > 16) trailPositions.current.shift();
      }
    }
    // Update trail instances
    if (trailRef.current) {
      trailPositions.current.forEach((t, i) => {
        t.age += delta;
      });
      trailPositions.current = trailPositions.current.filter(t => t.age < 2);
      for (let i = 0; i < 16; i++) {
        const t = trailPositions.current[i];
        if (t) {
          const opacity = Math.max(0, 1 - t.age / 2);
          trailDummy.current.position.set(t.x, 0.01, t.z);
          trailDummy.current.scale.setScalar(0.06 * opacity);
          trailDummy.current.rotation.x = -Math.PI / 2;
        } else {
          trailDummy.current.position.set(0, -10, 0);
          trailDummy.current.scale.setScalar(0);
        }
        trailDummy.current.updateMatrix();
        trailRef.current.setMatrixAt(i, trailDummy.current.matrix);
      }
      trailRef.current.instanceMatrix.needsUpdate = true;
    }

    // Victory dance on streak milestones (5, 10, 15...)
    if (streak > prevStreak.current && streak >= 5 && streak % 5 === 0) {
      isDancing.current = true;
      danceTimer.current = 0;
    }
    prevStreak.current = streak;
    if (isDancing.current) {
      danceTimer.current += delta;
      if (bodyRef.current) {
        bodyRef.current.rotation.y = danceTimer.current * 12;
        bodyRef.current.position.y = Math.abs(Math.sin(danceTimer.current * 8)) * 0.15;
      }
      if (danceTimer.current > 0.8) {
        isDancing.current = false;
        if (bodyRef.current) {
          bodyRef.current.rotation.y = 0;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, 0]}>
      {/* Ground shadow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} depthWrite={false} />
      </mesh>

      {/* Footstep trail instances */}
      <instancedMesh ref={trailRef} args={[undefined, undefined, 16]} frustumCulled={false}>
        <circleGeometry args={[1, 6]} />
        <meshBasicMaterial color="#8b7355" transparent opacity={0.3} depthWrite={false} />
      </instancedMesh>

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

      {/* Left Arm */}
      <group ref={leftArmRef} position={[0.26, 0.55, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.22, 6]} />
          <meshStandardMaterial color={playerColor} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#deb887" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[-0.26, 0.55, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.22, 6]} />
          <meshStandardMaterial color={playerColor} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#deb887" />
        </mesh>
      </group>

      {/* Buttons */}
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
                  {/* Crust */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.04, 12]} />
                    <meshStandardMaterial color="#d4740a" />
                  </mesh>
                  {/* Sauce layer */}
                  <mesh position={[0, 0.025, 0]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.01, 12]} />
                    <meshStandardMaterial color="#dc2626" opacity={0.8} transparent />
                  </mesh>
                  {/* Melted cheese ring */}
                  <mesh position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.08, 0.025, 6, 12]} />
                    <meshStandardMaterial color="#fbbf24" roughness={0.6} />
                  </mesh>
                  {/* Toppings */}
                  <mesh position={[0.04, 0.04, 0.02]}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                    <meshStandardMaterial color="#ef4444" />
                  </mesh>
                  <mesh position={[-0.05, 0.04, -0.03]}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                    <meshStandardMaterial color="#22c55e" />
                  </mesh>
                  <mesh position={[0.01, 0.04, -0.05]}>
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
