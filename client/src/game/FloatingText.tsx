import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

interface FloatingItem {
  id: number;
  text: string;
  color: string;
  position: [number, number, number];
  startTime: number;
}

let nextId = 0;

const floatingItems: FloatingItem[] = [];

export function addFloatingText(text: string, color: string, position: [number, number, number]) {
  floatingItems.push({
    id: nextId++,
    text,
    color,
    position: [...position],
    startTime: Date.now(),
  });
}

function FloatingTextItem({ item, onDone }: { item: FloatingItem; onDone: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(1);

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = (Date.now() - item.startTime) / 1000;
    groupRef.current.position.y = item.position[1] + elapsed * 1.5;
    const newOpacity = Math.max(0, 1 - elapsed / 1.5);
    setOpacity(newOpacity);
    if (elapsed > 1.5) {
      onDone();
    }
  });

  return (
    <group ref={groupRef} position={item.position}>
      <Text
        fontSize={0.3}
        color={item.color}
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000000"
        fillOpacity={opacity}
        outlineOpacity={opacity}
        fontWeight="bold"
      >
        {item.text}
      </Text>
    </group>
  );
}

export function FloatingTextManager() {
  const [activeItems, setActiveItems] = useState<FloatingItem[]>([]);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const money = useOfficeGame((s) => s.money);
  const tables = useOfficeGame((s) => s.tables);
  const prevServed = useRef(totalPizzasServed);
  const prevMoney = useRef(money);

  useFrame(() => {
    if (floatingItems.length > 0) {
      setActiveItems(prev => [...prev, ...floatingItems.splice(0)]);
    }
  });

  useEffect(() => {
    if (totalPizzasServed > prevServed.current) {
      const earned = money - prevMoney.current;
      if (earned > 0) {
        const servedTable = tables.find(t => t.served);
        const pos: [number, number, number] = servedTable
          ? [servedTable.position[0], 2.5, servedTable.position[2] + 0.45]
          : [8, 2.5, 0];
        addFloatingText(`+$${earned}`, "#22c55e", pos);
      }
    }
    prevServed.current = totalPizzasServed;
    prevMoney.current = money;
  }, [totalPizzasServed, money]);

  const removeItem = (id: number) => {
    setActiveItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      {activeItems.map(item => (
        <FloatingTextItem key={item.id} item={item} onDone={() => removeItem(item.id)} />
      ))}
    </>
  );
}
