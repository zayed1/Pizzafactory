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
  const updatePowerUp = useOfficeGame((s) => s.updatePowerUp);
  const spawnPowerUp = useOfficeGame((s) => s.spawnPowerUp);
  const gameLevel = useOfficeGame((s) => s.gameLevel);
  const updateNightShift = useOfficeGame((s) => s.updateNightShift);
  const spawnQuickOrders = useOfficeGame((s) => s.spawnQuickOrders);
  const updateQuickOrders = useOfficeGame((s) => s.updateQuickOrders);
  const spawnTreasure = useOfficeGame((s) => s.spawnTreasure);
  const updateTreasures = useOfficeGame((s) => s.updateTreasures);
  const initWeeklyChallenges = useOfficeGame((s) => s.initWeeklyChallenges);
  const customerTimer = useRef(0);
  const eventTimer = useRef(0);
  const powerUpTimer = useRef(0);
  const firstSpawn = useRef(false);
  const hintTimer = useRef(0);
  const quickOrderTimer = useRef(0);
  const treasureTimer = useRef(0);
  const weeklyInit = useRef(false);

  useFrame((_, delta) => {
    if (phase !== "playing") return;

    // Spawn first customer immediately when game starts
    if (!firstSpawn.current) {
      firstSpawn.current = true;
      spawnCustomer();
    }

    // Initialize weekly challenges once
    if (!weeklyInit.current) {
      weeklyInit.current = true;
      initWeeklyChallenges();
    }

    updateCustomerTimers(delta);
    updateStreak(delta);
    updateEvent(delta);
    updatePowerUp(delta);
    updateNightShift(delta);
    updateQuickOrders(delta);
    updateTreasures(delta);

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

    // Power-up spawning every 25-40 seconds (from level 2+)
    if (gameLevel >= 2) {
      powerUpTimer.current += delta;
      if (powerUpTimer.current >= 25 + Math.random() * 15) {
        powerUpTimer.current = 0;
        if (Math.random() < 0.35) {
          spawnPowerUp();
        }
      }
    }

    // Quick order spawning (every ~60s from level 6+)
    if (gameLevel >= 6) {
      quickOrderTimer.current += delta;
      if (quickOrderTimer.current >= 60) {
        quickOrderTimer.current = 0;
        spawnQuickOrders();
      }
    }

    // Treasure spawning (every 120-180s)
    treasureTimer.current += delta;
    if (treasureTimer.current >= 120 + Math.random() * 60) {
      treasureTimer.current = 0;
      if (Math.random() < 0.5) {
        spawnTreasure();
      }
    }

    // Smart hints: check idle time
    hintTimer.current += delta;
    if (hintTimer.current >= 2) {
      hintTimer.current = 0;
      const s = useOfficeGame.getState();
      const idleTime = (Date.now() - s.lastActivityTime) / 1000;
      if (idleTime > 5) {
        // Generate contextual hint
        let hint: string | null = null;
        const readyOven = s.ovens.find(o => o.pizzaReady);
        const readyPrep = s.prepEmployees.find(e => e.pizzaReady);
        const waitingCustomer = s.tables.find(t => t.hasCustomer && !t.served && t.customerTimer / t.customerMaxTime > 0.6);
        const emptyOven = s.ovens.find(o => !o.hasDough && !o.isCooking && !o.pizzaReady);

        if (waitingCustomer && s.carrying === "pizza_ready") {
          hint = "A customer is getting impatient! Deliver now!";
        } else if (readyPrep && s.carrying === "none") {
          hint = "Pizza is ready at prep! Pick it up!";
        } else if (readyOven && s.carrying === "none") {
          hint = "Pizza is done in the oven!";
        } else if (emptyOven && s.doughReady > 0 && s.carrying === "none") {
          hint = "Grab some dough and fill the oven!";
        } else if (waitingCustomer) {
          hint = "A customer is waiting! Hurry!";
        }

        if (hint !== s.currentHint) {
          useOfficeGame.setState({ currentHint: hint });
        }
      } else if (s.currentHint !== null) {
        useOfficeGame.setState({ currentHint: null });
      }
    }
  });

  return null;
}
