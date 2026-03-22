import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type WeatherType = "rain" | "sun" | "snow";

function getSessionWeather(): WeatherType {
  const seed = Math.floor(Date.now() / 3600000); // Changes every hour
  const types: WeatherType[] = ["rain", "sun", "snow"];
  return types[seed % types.length];
}

function RainEffect() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 60;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: -1 + Math.random() * 15,
      y: Math.random() * 4,
      z: -5.8 - Math.random() * 0.3,
      speed: 3 + Math.random() * 2,
    })),
    []
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    drops.forEach((drop, i) => {
      drop.y -= drop.speed * delta;
      if (drop.y < 0) {
        drop.y = 3 + Math.random() * 2;
        drop.x = -1 + Math.random() * 15;
      }
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.scale.set(0.02, 0.15, 0.02);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshStandardMaterial color="#93c5fd" transparent opacity={0.4} />
    </instancedMesh>
  );
}

function SunRaysEffect() {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(Date.now() * 0.0003) * 0.05;
    }
  });

  return (
    <group ref={ref} position={[7, 3.5, -5.5]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[(i - 1.5) * 2, -0.5, 0]}
          rotation={[0, 0, (i - 1.5) * 0.15]}
        >
          <planeGeometry args={[0.15, 3]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.3}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function SnowEffect() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const flakes = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: -1 + Math.random() * 15,
      y: Math.random() * 4,
      z: -5.8 - Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
    })),
    []
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    flakes.forEach((f, i) => {
      f.y -= f.speed * delta;
      f.wobble += delta * 2;
      if (f.y < 0) {
        f.y = 3 + Math.random() * 2;
        f.x = -1 + Math.random() * 15;
      }
      dummy.position.set(f.x + Math.sin(f.wobble) * 0.3, f.y, f.z);
      dummy.scale.setScalar(0.03 + Math.sin(f.wobble) * 0.01);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#e2e8f0" transparent opacity={0.7} />
    </instancedMesh>
  );
}

export function WeatherEffects() {
  const weather = useMemo(() => getSessionWeather(), []);

  return (
    <>
      {weather === "rain" && <RainEffect />}
      {weather === "sun" && <SunRaysEffect />}
      {weather === "snow" && <SnowEffect />}
    </>
  );
}
