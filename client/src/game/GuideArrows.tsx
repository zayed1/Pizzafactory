import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeGame, OVEN_POSITIONS } from "../lib/stores/useOfficeGame";
import { Text } from "@react-three/drei";

function PulsingArrow({ from, to, color, label }: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const arrowRef = useRef<THREE.Mesh>(null);

  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const angle = Math.atan2(to[0] - from[0], to[2] - from[2]);

  useFrame((state) => {
    if (arrowRef.current) {
      arrowRef.current.material = arrowRef.current.material as THREE.MeshStandardMaterial;
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      (arrowRef.current.material as THREE.MeshStandardMaterial).opacity = pulse;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={arrowRef}
        position={[midX, 0.02, midZ]}
        rotation={[-Math.PI / 2, 0, -angle]}
      >
        <planeGeometry args={[0.4, 0.6]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh
        position={[to[0] - Math.sin(angle) * 0.3, 0.03, to[2] - Math.cos(angle) * 0.3]}
        rotation={[-Math.PI / 2, 0, -angle]}
      >
        <coneGeometry args={[0.2, 0.3, 3]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.5}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      <Text
        position={[midX, 0.08, midZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}

function FlowDots({ from, to, color }: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const dotsRef = useRef<THREE.Group>(null);

  const dots = useMemo(() => {
    const result: [number, number, number][] = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      result.push([
        from[0] + (to[0] - from[0]) * t,
        0.03,
        from[2] + (to[2] - from[2]) * t,
      ]);
    }
    return result;
  }, [from, to]);

  useFrame((state) => {
    if (!dotsRef.current) return;
    const time = state.clock.elapsedTime;
    dotsRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const phase = (time * 2 + i * 0.4) % (dots.length * 0.4);
      const brightness = Math.max(0.1, 1 - Math.abs(phase - i * 0.4) * 2);
      (mesh.material as THREE.MeshStandardMaterial).opacity = brightness * 0.5;
    });
  });

  return (
    <group ref={dotsRef}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function GuideArrows() {
  const carrying = useOfficeGame((s) => s.carrying);
  const ovens = useOfficeGame((s) => s.ovens);
  const prepEmployees = useOfficeGame((s) => s.prepEmployees);
  const tables = useOfficeGame((s) => s.tables);
  const doughReady = useOfficeGame((s) => s.doughReady);

  const doughPos: [number, number, number] = [1, 0, -1.5];
  const freeOvenIdx = ovens.findIndex(o => !o.hasDough && !o.isCooking && !o.pizzaReady);
  const readyOvenIdx = ovens.findIndex(o => o.pizzaReady);
  const ovenPos = OVEN_POSITIONS[freeOvenIdx >= 0 ? freeOvenIdx : 0];
  const readyOvenPos = OVEN_POSITIONS[readyOvenIdx >= 0 ? readyOvenIdx : 0];
  const PREP_POS: [number, number, number][] = [[9, 0, -3], [9, 0, 0], [9, 0, 3]];
  const freePrepIdx = prepEmployees.findIndex(e => !e.hasPizza && !e.isWorking && !e.pizzaReady);
  const prepPos: [number, number, number] = freePrepIdx >= 0 ? PREP_POS[freePrepIdx] : PREP_POS[0];
  const readyPrepIdx = prepEmployees.findIndex(e => e.pizzaReady);
  const readyPrepPos: [number, number, number] = readyPrepIdx >= 0 ? PREP_POS[readyPrepIdx] : PREP_POS[0];
  const activeTable = tables.find(t => t.unlocked && t.hasCustomer && !t.served);
  const tablePos: [number, number, number] = activeTable
    ? activeTable.position
    : [13, 0, -1.5];

  const anyOvenReady = readyOvenIdx >= 0;
  const anyPrepReady = readyPrepIdx >= 0;
  const anyOvenFree = freeOvenIdx >= 0;
  const anyPrepFree = freePrepIdx >= 0;

  const showDoughToOven = carrying === "none" && doughReady > 0 && anyOvenFree;
  const showOvenToPrep = carrying === "none" && anyOvenReady && anyPrepFree;
  const showPrepToTable = carrying === "none" && anyPrepReady && activeTable;

  const showCarryDough = carrying === "dough" && anyOvenFree;
  const showCarryRaw = carrying === "pizza_raw" && anyPrepFree;
  const showCarryReady = carrying === "pizza_ready" && activeTable;

  return (
    <group>
      {showDoughToOven && (
        <FlowDots from={doughPos} to={ovenPos} color="#f5deb3" />
      )}
      {showCarryDough && (
        <FlowDots from={doughPos} to={ovenPos} color="#f97316" />
      )}
      {showOvenToPrep && (
        <FlowDots from={readyOvenPos} to={prepPos} color="#a855f7" />
      )}
      {showCarryRaw && (
        <FlowDots from={readyOvenPos} to={prepPos} color="#a855f7" />
      )}
      {showPrepToTable && (
        <FlowDots from={readyPrepPos} to={tablePos} color="#22c55e" />
      )}
      {showCarryReady && (
        <FlowDots from={readyPrepPos} to={tablePos} color="#22c55e" />
      )}
    </group>
  );
}
