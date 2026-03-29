import { useMemo } from "react";
import { useOfficeGame } from "../lib/stores/useOfficeGame";

export interface ThemeColors {
  wallLeft: string;
  wallRight: string;
  wallBack: string;
  wallFront: string;
  wallTrim: string;
  kitchenFloorA: string;
  kitchenFloorB: string;
  corridorFloor: string;
  diningFloor: string;
  ceiling: string;
  ceilingOpacity: number;
  tableSurface: string;
  tableLeg: string;
  chairSeat: string;
  chairLeg: string;
  shelfColor: string;
  shelfBracket: string;
  fridgeBody: string;
  lightFixture: string;
  lightBulb: string;
  lightEmissive: string;
  ambientIntensity: number;
  lightIntensity: number;
  wallMetalness: number;
  wallRoughness: number;
  floorMetalness: number;
  floorRoughness: number;
  furnitureMetalness: number;
  furnitureRoughness: number;
  menuBoardBg: string;
  menuBoardInner: string;
  decorFrame: string;
  decorInner: string;
}

const THEMES: ThemeColors[] = [
  // Tier 0: Starter (Lv 1-4) — Simple, warm, rustic
  {
    wallLeft: "#f5e6d0", wallRight: "#8b4513", wallBack: "#c9a87c", wallFront: "#c9a87c",
    wallTrim: "#4a7c59",
    kitchenFloorA: "#e8e0d4", kitchenFloorB: "#d4c8b8",
    corridorFloor: "#c9b896", diningFloor: "#5c3a1e",
    ceiling: "#f5eedc", ceilingOpacity: 0.2,
    tableSurface: "#6d3710", tableLeg: "#5c3d1e", chairSeat: "#8b5a2b", chairLeg: "#5c3d1e",
    shelfColor: "#8b6914", shelfBracket: "#6b5210",
    fridgeBody: "#d4d4d8", lightFixture: "#d97706", lightBulb: "#fef3c7", lightEmissive: "#fbbf24",
    ambientIntensity: 0.4, lightIntensity: 0.6,
    wallMetalness: 0, wallRoughness: 1,
    floorMetalness: 0, floorRoughness: 1,
    furnitureMetalness: 0, furnitureRoughness: 0.8,
    menuBoardBg: "#1a1a2e", menuBoardInner: "#16213e",
    decorFrame: "#3c1a00", decorInner: "#fef3c7",
  },
  // Tier 1: Upgraded (Lv 5-9) — Warmer tones, slight polish
  {
    wallLeft: "#f0dcc0", wallRight: "#6b3410", wallBack: "#d4a87a", wallFront: "#d4a87a",
    wallTrim: "#2d6a4f",
    kitchenFloorA: "#f0e6d6", kitchenFloorB: "#ddd0bc",
    corridorFloor: "#c4ad84", diningFloor: "#4a2e15",
    ceiling: "#faf3e6", ceilingOpacity: 0.25,
    tableSurface: "#5a2d0e", tableLeg: "#4a2810", chairSeat: "#7a4e25", chairLeg: "#4a2810",
    shelfColor: "#7a5c12", shelfBracket: "#5a4410",
    fridgeBody: "#c0c0c8", lightFixture: "#c47a06", lightBulb: "#fff8e1", lightEmissive: "#f59e0b",
    ambientIntensity: 0.45, lightIntensity: 0.7,
    wallMetalness: 0, wallRoughness: 0.9,
    floorMetalness: 0.05, floorRoughness: 0.85,
    furnitureMetalness: 0.1, furnitureRoughness: 0.6,
    menuBoardBg: "#1a1a2e", menuBoardInner: "#1a2744",
    decorFrame: "#2c1400", decorInner: "#fff8e1",
  },
  // Tier 2: Modern (Lv 10-14) — Sleek, clean, more polished
  {
    wallLeft: "#e8ddd0", wallRight: "#4a3020", wallBack: "#bfa882", wallFront: "#bfa882",
    wallTrim: "#1b4332",
    kitchenFloorA: "#f5efe5", kitchenFloorB: "#e5d9c8",
    corridorFloor: "#b8a070", diningFloor: "#3a2210",
    ceiling: "#faf6f0", ceilingOpacity: 0.3,
    tableSurface: "#3a1e08", tableLeg: "#2a1808", chairSeat: "#5a3818", chairLeg: "#2a1808",
    shelfColor: "#5a4810", shelfBracket: "#3a3008",
    fridgeBody: "#a0a0b0", lightFixture: "#b8860b", lightBulb: "#fffde7", lightEmissive: "#ffb300",
    ambientIntensity: 0.5, lightIntensity: 0.8,
    wallMetalness: 0.05, wallRoughness: 0.75,
    floorMetalness: 0.1, floorRoughness: 0.7,
    furnitureMetalness: 0.2, furnitureRoughness: 0.4,
    menuBoardBg: "#0a0a1e", menuBoardInner: "#101830",
    decorFrame: "#1a0a00", decorInner: "#fffde7",
  },
  // Tier 3: Premium (Lv 15-19) — Rich dark wood, gold accents
  {
    wallLeft: "#d4c4a8", wallRight: "#2a1a0a", wallBack: "#a08060", wallFront: "#a08060",
    wallTrim: "#b8860b",
    kitchenFloorA: "#f0e8d8", kitchenFloorB: "#dcd0b8",
    corridorFloor: "#a08858", diningFloor: "#1a1008",
    ceiling: "#f5f0e8", ceilingOpacity: 0.35,
    tableSurface: "#1a0e04", tableLeg: "#0e0804", chairSeat: "#3a2010", chairLeg: "#0e0804",
    shelfColor: "#3a3008", shelfBracket: "#2a2006",
    fridgeBody: "#808090", lightFixture: "#b8860b", lightBulb: "#fff9c4", lightEmissive: "#ffd54f",
    ambientIntensity: 0.5, lightIntensity: 0.9,
    wallMetalness: 0.1, wallRoughness: 0.6,
    floorMetalness: 0.15, floorRoughness: 0.5,
    furnitureMetalness: 0.35, furnitureRoughness: 0.3,
    menuBoardBg: "#050510", menuBoardInner: "#0a1020",
    decorFrame: "#b8860b", decorInner: "#fff9c4",
  },
  // Tier 4: Luxury (Lv 20+) — Marble-like, gold, maximum polish
  {
    wallLeft: "#e8dcd0", wallRight: "#1a1008", wallBack: "#8a7050", wallFront: "#8a7050",
    wallTrim: "#d4a017",
    kitchenFloorA: "#f8f4ee", kitchenFloorB: "#ece4d4",
    corridorFloor: "#908048", diningFloor: "#0e0806",
    ceiling: "#faf8f4", ceilingOpacity: 0.4,
    tableSurface: "#0e0604", tableLeg: "#060302", chairSeat: "#2a1508", chairLeg: "#060302",
    shelfColor: "#2a2006", shelfBracket: "#1a1404",
    fridgeBody: "#606070", lightFixture: "#d4a017", lightBulb: "#fffde7", lightEmissive: "#ffe082",
    ambientIntensity: 0.55, lightIntensity: 1.0,
    wallMetalness: 0.15, wallRoughness: 0.45,
    floorMetalness: 0.25, floorRoughness: 0.35,
    furnitureMetalness: 0.5, furnitureRoughness: 0.2,
    menuBoardBg: "#020208", menuBoardInner: "#060818",
    decorFrame: "#d4a017", decorInner: "#fffde7",
  },
];

export function getThemeTier(level: number): number {
  if (level < 5) return 0;
  if (level < 10) return 1;
  if (level < 15) return 2;
  if (level < 20) return 3;
  return 4;
}

// Custom theme color overrides for player-selected themes
const CUSTOM_THEME_OVERRIDES: Record<string, Partial<ThemeColors>> = {
  ocean: {
    wallLeft: "#d4e8f0", wallRight: "#1a4a6b", wallBack: "#7cb8d4", wallFront: "#7cb8d4",
    wallTrim: "#2980b9", diningFloor: "#1a3a5c", lightEmissive: "#5dade2",
  },
  forest: {
    wallLeft: "#d4e8d0", wallRight: "#2d5a1e", wallBack: "#7cac6a", wallFront: "#7cac6a",
    wallTrim: "#27ae60", diningFloor: "#1a3a1e", lightEmissive: "#82e0aa",
  },
  sunset: {
    wallLeft: "#f0d4c4", wallRight: "#6b2a1a", wallBack: "#d48a5c", wallFront: "#d48a5c",
    wallTrim: "#e67e22", diningFloor: "#3a1a0a", lightEmissive: "#f5b041",
  },
  royal: {
    wallLeft: "#d4c4e8", wallRight: "#2a1a5a", wallBack: "#8a6cb4", wallFront: "#8a6cb4",
    wallTrim: "#8e44ad", diningFloor: "#1a0a3a", lightEmissive: "#bb8fce",
  },
};

export function useRestaurantTheme(): ThemeColors {
  const gameLevel = useOfficeGame((s) => s.gameLevel);
  const restaurantThemeId = useOfficeGame((s) => s.restaurantThemeId);
  return useMemo(() => {
    const base = THEMES[getThemeTier(gameLevel)];
    if (restaurantThemeId === "default") return base;
    const overrides = CUSTOM_THEME_OVERRIDES[restaurantThemeId];
    if (!overrides) return base;
    return { ...base, ...overrides };
  }, [gameLevel, restaurantThemeId]);
}

export { THEMES };
