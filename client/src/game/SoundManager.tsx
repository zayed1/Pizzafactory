import { useEffect, useRef } from "react";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

class GameAudio {
  private sounds: Map<string, HTMLAudioElement[]> = new Map();
  private bgMusic: HTMLAudioElement | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.preload("pickup", "/sounds/hit.mp3", 3);
    this.preload("deliver", "/sounds/success.mp3", 3);
    this.preload("cash", "/sounds/success.mp3", 3);

    this.bgMusic = new Audio("/sounds/background.mp3");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.15;
    this.bgMusic.play().catch(() => {});
  }

  private preload(name: string, src: string, poolSize: number) {
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(src);
      audio.preload = "auto";
      pool.push(audio);
    }
    this.sounds.set(name, pool);
  }

  play(name: string, volume = 0.3, rate = 1.0) {
    const pool = this.sounds.get(name);
    if (!pool) return;
    const audio = pool.find(a => a.paused || a.ended) || pool[0];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.playbackRate = rate;
      audio.play().catch(() => {});
    }
  }

  setMusicSpeed(rate: number) {
    if (this.bgMusic) {
      this.bgMusic.playbackRate = Math.min(1.5, Math.max(0.8, rate));
    }
  }

  setMusicVolume(vol: number) {
    if (this.bgMusic) {
      this.bgMusic.volume = Math.min(0.3, Math.max(0.1, vol));
    }
  }
}

export const gameAudio = new GameAudio();

export function SoundManager() {
  const carrying = useOfficeGame((s) => s.carrying);
  const money = useOfficeGame((s) => s.money);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const missedCustomers = useOfficeGame((s) => s.missedCustomers);
  const streak = useOfficeGame((s) => s.streak);
  const activeEvent = useOfficeGame((s) => s.activeEvent);
  const tables = useOfficeGame((s) => s.tables);
  const showLevelUp = useOfficeGame((s) => s.showLevelUp);
  const comboCount = useOfficeGame((s) => s.comboCount);
  const prevCarrying = useRef(carrying);
  const prevMoney = useRef(money);
  const prevServed = useRef(totalPizzasServed);
  const prevMissed = useRef(missedCustomers);
  const prevStreak = useRef(streak);
  const hasInit = useRef(false);

  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      gameAudio.init();
    }
  }, []);

  // Dynamic music speed based on streak and events
  useEffect(() => {
    let speed = 1.0;
    if (streak >= 8) speed = 1.3;
    else if (streak >= 5) speed = 1.15;
    else if (streak >= 3) speed = 1.08;

    if (activeEvent?.type === "rush_hour") speed += 0.15;
    gameAudio.setMusicSpeed(speed);

    let vol = 0.15;
    if (activeEvent) vol = 0.2;
    if (streak >= 5) vol = 0.22;
    gameAudio.setMusicVolume(vol);
  }, [streak, activeEvent]);

  useEffect(() => {
    if (prevCarrying.current === "none" && carrying !== "none") {
      gameAudio.play("pickup", 0.25, 1.2);
    }
    if (prevCarrying.current !== "none" && carrying === "none") {
      gameAudio.play("deliver", 0.2, 1.0);
    }
    prevCarrying.current = carrying;
  }, [carrying]);

  useEffect(() => {
    if (money > prevMoney.current) {
      const diff = money - prevMoney.current;
      // Higher pitch for bigger earnings
      const rate = diff >= 80 ? 1.6 : diff >= 50 ? 1.4 : 1.3;
      gameAudio.play("cash", 0.35, rate);
    }
    prevMoney.current = money;
  }, [money]);

  useEffect(() => {
    if (missedCustomers > prevMissed.current) {
      gameAudio.play("pickup", 0.25, 0.5);
    }
    prevMissed.current = missedCustomers;
  }, [missedCustomers]);

  // Streak milestone sounds
  useEffect(() => {
    if (streak > prevStreak.current && (streak === 5 || streak === 10)) {
      gameAudio.play("cash", 0.4, 1.8);
    }
    prevStreak.current = streak;
  }, [streak]);

  // Level up fanfare
  useEffect(() => {
    if (showLevelUp) {
      gameAudio.play("cash", 0.4, 0.8);
      setTimeout(() => gameAudio.play("cash", 0.35, 1.2), 200);
      setTimeout(() => gameAudio.play("cash", 0.3, 1.6), 400);
    }
  }, [showLevelUp]);

  // Combo sound
  useEffect(() => {
    if (comboCount >= 3) {
      gameAudio.play("deliver", 0.3, 1.5 + comboCount * 0.1);
    }
  }, [comboCount]);

  // Low patience warning
  useEffect(() => {
    const critical = tables.find(t => t.hasCustomer && t.customerTimer / t.customerMaxTime > 0.8);
    if (critical) {
      gameAudio.play("pickup", 0.1, 2.0);
    }
  }, [tables]);

  // Ambient oven sound: play subtle sizzle when ovens are cooking
  const ovens = useOfficeGame((s) => s.ovens);
  const prevCookingCount = useRef(0);
  useEffect(() => {
    const cooking = ovens.filter(o => o.isCooking).length;
    if (cooking > prevCookingCount.current) {
      gameAudio.play("pickup", 0.04, 0.3); // Low rumble
    }
    prevCookingCount.current = cooking;
  }, [ovens]);

  // Power-up collect sound
  const activePowerUp = useOfficeGame((s) => s.activePowerUp);
  const prevPowerUp = useRef(activePowerUp);
  useEffect(() => {
    if (activePowerUp && !prevPowerUp.current) {
      gameAudio.play("cash", 0.4, 2.0); // High sparkle sound
    }
    prevPowerUp.current = activePowerUp;
  }, [activePowerUp]);

  // Music pitch changes per level tier
  const gameLevel = useOfficeGame((s) => s.gameLevel);
  useEffect(() => {
    // Subtle pitch increase as levels go up
    const basePitch = 1.0 + Math.min(0.15, (gameLevel - 1) * 0.02);
    gameAudio.setMusicSpeed(basePitch);
  }, [gameLevel]);

  // Night shift ambient - lower volume during night
  const isNightShift = useOfficeGame((s) => s.isNightShift);
  useEffect(() => {
    gameAudio.setMusicVolume(isNightShift ? 0.1 : 0.15);
  }, [isNightShift]);

  // Hidden treasure collect sound
  const hiddenTreasures = useOfficeGame((s) => s.hiddenTreasures);
  const prevTreasureCount = useRef(hiddenTreasures.length);
  useEffect(() => {
    if (hiddenTreasures.length < prevTreasureCount.current) {
      // A treasure was collected
      gameAudio.play("cash", 0.5, 1.8);
    }
    prevTreasureCount.current = hiddenTreasures.length;
  }, [hiddenTreasures]);

  return null;
}
