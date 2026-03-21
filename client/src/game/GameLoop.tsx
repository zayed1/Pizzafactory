import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export function GameLoop() {
  const spawnCustomer = useOfficeGame((s) => s.spawnCustomer);
  const updateCustomerTimers = useOfficeGame((s) => s.updateCustomerTimers);
  const updateStreak = useOfficeGame((s) => s.updateStreak);
  const updateEvent = useOfficeGame((s) => s.updateEvent);
  const triggerRandomEvent = useOfficeGame((s) => s.triggerRandomEvent);
  const customerSpawnInterval = useOfficeGame((s) => s.customerSpawnInterval);
  const activeEvent = useOfficeGame((s) => s.activeEvent);
  const phase = useOfficeGame((s) => s.phase);
  const customerTimer = useRef(0);
  const eventTimer = useRef(0);
  const firstSpawn = useRef(false);

  useFrame((_, delta) => {
    if (phase !== "playing") return;

    // Spawn first customer immediately when game starts
    if (!firstSpawn.current) {
      firstSpawn.current = true;
      spawnCustomer();
    }

    updateCustomerTimers(delta);
    updateStreak(delta);
    updateEvent(delta);

    // Customer spawning - faster during rush hour
    const spawnInterval = activeEvent?.type === "rush_hour"
      ? customerSpawnInterval * 0.5
      : customerSpawnInterval;

    customerTimer.current += delta;
    if (customerTimer.current >= spawnInterval) {
      customerTimer.current = 0;
      spawnCustomer();
    }

    // Random events every 45-90 seconds
    eventTimer.current += delta;
    if (eventTimer.current >= 45 + Math.random() * 45) {
      eventTimer.current = 0;
      if (Math.random() < 0.4) {
        triggerRandomEvent();
      }
    }
  });

  return null;
}
