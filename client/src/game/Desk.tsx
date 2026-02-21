import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useOfficeGame, Employee } from "../lib/stores/useOfficeGame";

const INTERACT_DISTANCE = 2.0;
const WORK_DURATION = 3.0;

function EmployeeModel({ employee }: { employee: Employee }) {
  const colors = ["#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
  const color = colors[employee.id % colors.length];

  return (
    <group position={[0, 0, -0.8]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
        <meshStandardMaterial color={color} opacity={0.9} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {employee.isWorking && (
        <>
          <mesh position={[0.06, 1.05, 0.12]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.06, 1.05, 0.12]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </>
      )}

      {!employee.isWorking && !employee.cashReady && !employee.hasPaper && (
        <>
          <mesh position={[0.06, 1.03, 0.12]}>
            <boxGeometry args={[0.06, 0.015, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.06, 1.03, 0.12]}>
            <boxGeometry args={[0.06, 0.015, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </>
      )}
    </group>
  );
}

function ProgressBar({ employee }: { employee: Employee }) {
  const barRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (employee.isWorking) {
      progressRef.current = Math.min(progressRef.current + delta / WORK_DURATION, 1);
    } else {
      progressRef.current = 0;
    }

    if (barRef.current) {
      const w = progressRef.current * 0.78;
      barRef.current.scale.x = Math.max(0.01, w);
      barRef.current.position.x = -0.39 + w / 2;
    }
  });

  if (!employee.isWorking) return null;

  return (
    <group position={[0, 1.5, -0.8]}>
      <mesh>
        <boxGeometry args={[0.8, 0.1, 0.05]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh ref={barRef} position={[-0.39, 0, 0.01]}>
        <boxGeometry args={[1, 0.08, 0.02]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

export function Desk({
  employee,
  playerRef,
}: {
  employee: Employee;
  playerRef: React.RefObject<THREE.Group | null>;
}) {
  const [isNear, setIsNear] = useState(false);
  const deliverPaper = useOfficeGame((s) => s.deliverPaper);
  const collectCash = useOfficeGame((s) => s.collectCash);
  const employeeFinishWork = useOfficeGame((s) => s.employeeFinishWork);
  const papersCarried = useOfficeGame((s) => s.papersCarried);
  const workTimerRef = useRef(0);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.position;
    const dist = Math.sqrt(
      Math.pow(playerPos.x - employee.position[0], 2) +
      Math.pow(playerPos.z - employee.position[2], 2)
    );

    const near = dist < INTERACT_DISTANCE;
    if (near !== isNear) setIsNear(near);

    if (near) {
      if (papersCarried > 0 && !employee.hasPaper && !employee.isWorking && !employee.cashReady) {
        deliverPaper(employee.id);
      }
      if (employee.cashReady) {
        collectCash(employee.id);
      }
    }

    if (employee.isWorking) {
      workTimerRef.current += delta;
      if (workTimerRef.current >= WORK_DURATION) {
        workTimerRef.current = 0;
        employeeFinishWork(employee.id);
      }
    } else {
      workTimerRef.current = 0;
    }
  });

  if (!employee.unlocked) {
    return (
      <group position={employee.position}>
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.7, 0.8]} />
          <meshStandardMaterial color="#475569" opacity={0.4} transparent />
        </mesh>
        <Text position={[0, 1.2, 0]} fontSize={0.2} color="#94a3b8" anchorX="center" outlineWidth={0.01} outlineColor="#000000">
          Locked
        </Text>
      </group>
    );
  }

  return (
    <group position={employee.position}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <mesh position={[-0.5, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.5, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[-0.5, 0.15, 0.3]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.5, 0.15, 0.3]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      <mesh position={[0.2, 0.45, 0]}>
        <boxGeometry args={[0.3, 0.22, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.2, 0.58, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.02]} />
        <meshStandardMaterial
          color={employee.isWorking ? "#60a5fa" : "#334155"}
          emissive={employee.isWorking ? "#60a5fa" : "#000000"}
          emissiveIntensity={employee.isWorking ? 0.3 : 0}
        />
      </mesh>

      <EmployeeModel employee={employee} />
      <ProgressBar employee={employee} />

      {employee.cashReady && (
        <group>
          <mesh position={[0, 0.5, 0.5]} castShadow>
            <boxGeometry args={[0.3, 0.08, 0.15]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <Text
            position={[0, 1.3, 0]}
            fontSize={0.25}
            color="#22c55e"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            $25
          </Text>
          <pointLight position={[0, 1, 0]} intensity={1} color="#22c55e" distance={2} />
        </group>
      )}

      {isNear && !employee.cashReady && !employee.isWorking && !employee.hasPaper && papersCarried > 0 && (
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.2}
          color="#60a5fa"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Delivering...
        </Text>
      )}
    </group>
  );
}
