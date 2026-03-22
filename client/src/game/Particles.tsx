import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, OVEN_POSITIONS } from "../lib/stores/useOfficeGame";

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

function SmokeParticles({ position, active }: { position: [number, number, number]; active: boolean }) {
  const particles = useRef<Particle[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const spawnTimer = useRef(0);
  const MAX_PARTICLES = 12;

  useFrame((_, delta) => {
    if (active) {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.15 && particles.current.length < MAX_PARTICLES) {
        spawnTimer.current = 0;
        particles.current.push({
          position: new THREE.Vector3(
            position[0] + (Math.random() - 0.5) * 0.3,
            position[1] + 1.1,
            position[2] + (Math.random() - 0.5) * 0.3
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            0.5 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.2
          ),
          life: 0,
          maxLife: 1.2 + Math.random() * 0.8,
          size: 0.06 + Math.random() * 0.06,
          opacity: 0.6,
        });
      }
    }

    particles.current = particles.current.filter((p) => {
      p.life += delta;
      p.position.add(p.velocity.clone().multiplyScalar(delta));
      p.velocity.y += delta * 0.1;
      p.size += delta * 0.04;
      p.opacity = Math.max(0, 0.6 * (1 - p.life / p.maxLife));
      return p.life < p.maxLife;
    });

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const p = particles.current[i];
      if (p) {
        mesh.visible = true;
        mesh.position.copy(p.position);
        mesh.scale.setScalar(p.size * 10);
        (mesh.material as THREE.MeshBasicMaterial).opacity = p.opacity;
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: MAX_PARTICLES }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} visible={false}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshBasicMaterial color="#9ca3af" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FireParticles({ position, active }: { position: [number, number, number]; active: boolean }) {
  const particles = useRef<Particle[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const spawnTimer = useRef(0);
  const MAX_PARTICLES = 8;

  useFrame((_, delta) => {
    if (active) {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.1 && particles.current.length < MAX_PARTICLES) {
        spawnTimer.current = 0;
        particles.current.push({
          position: new THREE.Vector3(
            position[0] + (Math.random() - 0.5) * 0.4,
            position[1] + 0.5,
            position[2] + 0.6
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.15,
            0.6 + Math.random() * 0.4,
            (Math.random() - 0.5) * 0.1
          ),
          life: 0,
          maxLife: 0.4 + Math.random() * 0.3,
          size: 0.03 + Math.random() * 0.03,
          opacity: 0.9,
        });
      }
    }

    particles.current = particles.current.filter((p) => {
      p.life += delta;
      p.position.add(p.velocity.clone().multiplyScalar(delta));
      p.opacity = Math.max(0, 0.9 * (1 - p.life / p.maxLife));
      return p.life < p.maxLife;
    });

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const p = particles.current[i];
      if (p) {
        mesh.visible = true;
        mesh.position.copy(p.position);
        mesh.scale.setScalar(p.size * 10);
        const t = p.life / p.maxLife;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = p.opacity;
        if (t < 0.3) {
          mat.color.setHex(0xfbbf24);
        } else if (t < 0.6) {
          mat.color.setHex(0xf97316);
        } else {
          mat.color.setHex(0xef4444);
        }
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: MAX_PARTICLES }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} visible={false}>
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

interface SparkleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

function MoneySparkles() {
  const sparkles = useRef<SparkleData[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const prevMoney = useRef(0);
  const money = useOfficeGame((s) => s.money);
  const MAX_SPARKLES = 20;

  useFrame((_, delta) => {
    if (money > prevMoney.current && prevMoney.current > 0) {
      const count = Math.min(8, MAX_SPARKLES - sparkles.current.length);
      for (let i = 0; i < count; i++) {
        sparkles.current.push({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            2.5 + Math.random() * 0.5,
            0
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            1 + Math.random() * 2,
            (Math.random() - 0.5) * 3
          ),
          life: 0,
          maxLife: 0.6 + Math.random() * 0.4,
          size: 0.02 + Math.random() * 0.03,
        });
      }
    }
    prevMoney.current = money;

    sparkles.current = sparkles.current.filter((s) => {
      s.life += delta;
      s.position.add(s.velocity.clone().multiplyScalar(delta));
      s.velocity.y -= delta * 4;
      return s.life < s.maxLife;
    });

    for (let i = 0; i < MAX_SPARKLES; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const s = sparkles.current[i];
      if (s) {
        mesh.visible = true;
        mesh.position.copy(s.position);
        mesh.scale.setScalar(s.size * 10);
        const t = 1 - s.life / s.maxLife;
        (mesh.material as THREE.MeshBasicMaterial).opacity = t;
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: MAX_SPARKLES }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function DeliveryStars() {
  const particles = useRef<(SparkleData & { color: number })[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const tables = useOfficeGame((s) => s.tables);
  const prevServed = useRef(totalPizzasServed);
  const MAX = 24;
  const STAR_COLORS = [0xfbbf24, 0x22c55e, 0xf97316, 0xa855f7, 0x3b82f6, 0xec4899];

  useFrame((_, delta) => {
    if (totalPizzasServed > prevServed.current) {
      const servedTable = tables.find(t => t.served);
      const basePos = servedTable
        ? [servedTable.position[0], 1.5, servedTable.position[2] + 0.45]
        : [8, 1.5, 0];

      const count = Math.min(12, MAX - particles.current.length);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        particles.current.push({
          position: new THREE.Vector3(basePos[0], basePos[1], basePos[2]),
          velocity: new THREE.Vector3(
            Math.cos(angle) * (1.5 + Math.random()),
            2 + Math.random() * 2,
            Math.sin(angle) * (1.5 + Math.random())
          ),
          life: 0,
          maxLife: 0.8 + Math.random() * 0.6,
          size: 0.03 + Math.random() * 0.04,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }
    prevServed.current = totalPizzasServed;

    particles.current = particles.current.filter((p) => {
      p.life += delta;
      p.position.add(p.velocity.clone().multiplyScalar(delta));
      p.velocity.y -= delta * 5;
      return p.life < p.maxLife;
    });

    for (let i = 0; i < MAX; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const p = particles.current[i];
      if (p) {
        mesh.visible = true;
        mesh.position.copy(p.position);
        const scale = p.size * (1 - p.life / p.maxLife) * 10;
        mesh.scale.setScalar(scale);
        mesh.rotation.z += delta * 8;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(p.color);
        mat.opacity = 1 - p.life / p.maxLife;
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} visible={false}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function StreakGlow() {
  const streak = useOfficeGame((s) => s.streak);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!glowRef.current) return;
    if (streak >= 3) {
      const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
      glowRef.current.intensity = Math.min(streak * 0.3, 3) * pulse;
      glowRef.current.visible = true;
    } else {
      glowRef.current.visible = false;
    }
  });

  const color = streak >= 8 ? "#ef4444" : streak >= 5 ? "#f97316" : "#fbbf24";

  return (
    <pointLight
      ref={glowRef}
      position={[6.5, 3, 0]}
      color={color}
      intensity={0}
      distance={15}
    />
  );
}

export function ParticleSystem() {
  const ovens = useOfficeGame((s) => s.ovens);
  const phase = useOfficeGame((s) => s.phase);

  if (phase !== "playing") return null;

  return (
    <group>
      {ovens.map((oven, i) => (
        <group key={i}>
          <SmokeParticles position={OVEN_POSITIONS[i]} active={oven.isCooking} />
          <FireParticles position={OVEN_POSITIONS[i]} active={oven.isCooking} />
        </group>
      ))}
      <MoneySparkles />
      <DeliveryStars />
      <StreakGlow />
    </group>
  );
}
