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
}

export const gameAudio = new GameAudio();

export function SoundManager() {
  const carrying = useOfficeGame((s) => s.carrying);
  const money = useOfficeGame((s) => s.money);
  const totalPizzasServed = useOfficeGame((s) => s.totalPizzasServed);
  const missedCustomers = useOfficeGame((s) => s.missedCustomers);
  const prevCarrying = useRef(carrying);
  const prevMoney = useRef(money);
  const prevServed = useRef(totalPizzasServed);
  const prevMissed = useRef(missedCustomers);
  const hasInit = useRef(false);

  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      gameAudio.init();
    }
  }, []);

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
      gameAudio.play("cash", 0.35, 1.3);
    }
    prevMoney.current = money;
  }, [money]);

  useEffect(() => {
    if (missedCustomers > prevMissed.current) {
      gameAudio.play("pickup", 0.2, 0.5);
    }
    prevMissed.current = missedCustomers;
  }, [missedCustomers]);

  return null;
}
