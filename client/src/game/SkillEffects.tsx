import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

const PARTICLE_COUNT = 8;

function SpeedTrail({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const positions = useRef<[number, number, number][]>(
    Array.from({ length: PARTICLE_COUNT }, () => [0, 0, 0])
  );

  useFrame(() => {
    if (!meshRef.current || !playerRef.current) return;
    const px = playerRef.current.position.x;
    const pz = playerRef.current.position.z;

    // Shift trail positions
    for (let i = PARTICLE_COUNT - 1; i > 0; i--) {
      positions.current[i] = [...positions.current[i - 1]];
    }
    positions.current[0] = [px, 0.1, pz];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = positions.current[i];
      dummy.current.position.set(p[0], p[1], p[2]);
      const s = 1 - i / PARTICLE_COUNT;
      dummy.current.scale.setScalar(s * 0.15);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} transparent opacity={0.5} />
    </instancedMesh>
  );
}

function MagneticParticles({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const offsets = useRef(Array.from({ length: 6 }, () => Math.random() * Math.PI * 2));

  useFrame((_, delta) => {
    if (!meshRef.current || !playerRef.current) return;
    const px = playerRef.current.position.x;
    const pz = playerRef.current.position.z;
    const t = Date.now() * 0.003;

    for (let i = 0; i < 6; i++) {
      const angle = t + offsets.current[i];
      const radius = 0.4 + Math.sin(t * 2 + i) * 0.15;
      dummy.current.position.set(
        px + Math.cos(angle) * radius,
        0.5 + Math.sin(t * 3 + i) * 0.2,
        pz + Math.sin(angle) * radius
      );
      dummy.current.scale.setScalar(0.05);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 6]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.0} transparent opacity={0.7} />
    </instancedMesh>
  );
}

function TipCharmSparkle({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame(() => {
    if (!meshRef.current || !playerRef.current) return;
    const px = playerRef.current.position.x;
    const pz = playerRef.current.position.z;
    const t = Date.now() * 0.004;

    for (let i = 0; i < 4; i++) {
      const yOff = (t + i * 0.8) % 2;
      dummy.current.position.set(
        px + Math.sin(t + i * 1.5) * 0.3,
        0.3 + yOff * 0.5,
        pz + Math.cos(t + i * 1.5) * 0.3
      );
      const s = yOff < 1 ? 0.06 : 0.06 * (2 - yOff);
      dummy.current.scale.setScalar(s);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 4]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} transparent opacity={0.6} />
    </instancedMesh>
  );
}

export function SkillEffects({ playerRef }: { playerRef: React.RefObject<THREE.Group | null> }) {
  const skills = useOfficeGame((s) => s.skills);
  const activePowerUp = useOfficeGame((s) => s.activePowerUp);

  const hasSpeedSkill = (skills.speed_burst || 0) > 0;
  const hasMagnetic = (skills.magnetic_hands || 0) > 0;
  const hasTipCharm = (skills.tip_charm || 0) > 0;
  const hasSpeedPowerUp = activePowerUp?.type === "speed_boost";

  return (
    <>
      {(hasSpeedSkill || hasSpeedPowerUp) && <SpeedTrail playerRef={playerRef} />}
      {hasMagnetic && <MagneticParticles playerRef={playerRef} />}
      {hasTipCharm && <TipCharmSparkle playerRef={playerRef} />}
    </>
  );
}
