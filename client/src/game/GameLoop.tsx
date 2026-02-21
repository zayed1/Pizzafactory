import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function GameLoop() {
  const spawnCustomer = useOfficeGame((s) => s.spawnCustomer);
  const updateCustomerTimers = useOfficeGame((s) => s.updateCustomerTimers);
  const updateStreak = useOfficeGame((s) => s.updateStreak);
  const customerSpawnInterval = useOfficeGame((s) => s.customerSpawnInterval);
  const customerTimer = useRef(0);

  useFrame((_, delta) => {
    updateCustomerTimers(delta);
    updateStreak(delta);

    customerTimer.current += delta;
    if (customerTimer.current >= customerSpawnInterval) {
      customerTimer.current = 0;
      spawnCustomer();
    }
  });

  return null;
}
