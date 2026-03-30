import { useRef, useCallback, useEffect, useState } from "react";
import { create } from "zustand";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

interface TouchState {
  dx: number;
  dy: number;
  active: boolean;
  setJoystick: (dx: number, dy: number, active: boolean) => void;
}

export const useTouchInput = create<TouchState>((set) => ({
  dx: 0,
  dy: 0,
  active: false,
  setJoystick: (dx, dy, active) => set({ dx, dy, active }),
}));

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 900);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export function TouchControls() {
  const isMobile = useIsMobile();
  const phase = useOfficeGame((s) => s.phase);
  const carrying = useOfficeGame((s) => s.carrying);

  if (!isMobile || phase === "menu") return null;

  return (
    <>
      <Joystick />
      {carrying !== "none" && phase === "playing" && <DropButton />}
      {phase === "playing" && <PauseButton />}
    </>
  );
}

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const setJoystick = useTouchInput((s) => s.setJoystick);
  const phase = useOfficeGame((s) => s.phase);
  const RADIUS = 50;

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (phase !== "playing") return;
    const cx = centerRef.current.x;
    const cy = centerRef.current.y;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    setJoystick(dx / RADIUS, dy / RADIUS, true);
  }, [setJoystick, phase]);

  const handleEnd = useCallback(() => {
    touchIdRef.current = null;
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(0px, 0px)";
    }
    setJoystick(0, 0, false);
  }, [setJoystick]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        handleMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  }, [handleMove]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        handleEnd();
        break;
      }
    }
  }, [handleEnd]);

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      style={{
        position: "absolute",
        bottom: 20,
        left: "max(20px, env(safe-area-inset-left, 0px) + 10px)",
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.12)",
        border: "2px solid rgba(255,255,255,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        zIndex: 100,
        pointerEvents: "auto",
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.45)",
          border: "2px solid rgba(255,255,255,0.6)",
          transition: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function DropButton() {
  const handleDrop = useCallback(() => {
    const state = useOfficeGame.getState();
    if (state.phase === "playing") {
      state.dropItem();
    }
  }, []);

  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDrop();
      }}
      style={{
        position: "absolute",
        bottom: 20,
        right: "max(20px, env(safe-area-inset-right, 0px) + 10px)",
        width: 65,
        height: 65,
        borderRadius: "50%",
        background: "rgba(239,68,68,0.7)",
        border: "2px solid rgba(239,68,68,0.9)",
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        zIndex: 100,
        pointerEvents: "auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      ✕
    </button>
  );
}

function PauseButton() {
  const handlePause = useCallback(() => {
    useOfficeGame.getState().togglePause();
  }, []);

  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePause();
      }}
      style={{
        position: "absolute",
        top: 12,
        right: "50%",
        transform: "translateX(50%)",
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff",
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        zIndex: 100,
        pointerEvents: "auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      ⏸
    </button>
  );
}
