import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "paused";
export type CustomerMood = "happy" | "neutral" | "worried" | "angry";
export type ItemType = "none" | "dough" | "pizza_raw" | "pizza_ready";
export type CustomerType = "normal" | "vip" | "patient" | "rush" | "tipper" | "boss";
export type SpecialOrder = "none" | "double" | "express" | "group";
export type HatType = "chef" | "tall_chef" | "beret" | "crown" | "none";
export type PowerUpType = "speed_boost" | "freeze_patience" | "double_money";
export type PizzaRecipe = "classic" | "spicy" | "special";
export type SkillId = "magnetic_pickup" | "tip_charm" | "iron_patience" | "speed_burst" | "bulk_cook" | "quick_prep";

export interface PowerUpSpawn {
  id: number;
  type: PowerUpType;
  position: [number, number, number];
  spawnTime: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remaining: number;
  duration: number;
}

// Quick Orders
export interface QuickOrder {
  id: number;
  description: string;
  icon: string;
  target: number;
  progress: number;
  reward: number;
  timeLimit: number;
  timeRemaining: number;
  type: "serve" | "earn" | "streak";
}

// Weekly Challenge
export interface WeeklyChallenge {
  id: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  type: "serve" | "earn" | "streak" | "no_miss" | "speed_serve";
  cosmeticReward?: string;
}

// Personal Best
export interface PersonalBests {
  bestSessionEarnings: number;
  bestSessionPizzas: number;
  longestNoMiss: number;
  fastestTenDeliveries: number;
  highestSingleEarning: number;
  bestCombo: number;
}

// Hidden Treasure
export interface HiddenTreasure {
  id: number;
  position: [number, number, number];
  spawnTime: number;
  reward: number;
}

// Customer Rating
export interface CustomerRating {
  tableId: number;
  rating: number; // 1-3 stars
  emoji: string;
  time: number;
}

// Session History
export interface SessionRecord {
  date: string;
  earnings: number;
  pizzas: number;
  bestStreak: number;
  duration: number;
}

// Custom Goal
export interface CustomGoal {
  type: "level" | "money" | "pizzas";
  target: number;
  active: boolean;
}

export type RestaurantThemeId = "default" | "ocean" | "forest" | "sunset" | "royal";

export const RESTAURANT_THEMES: { id: RestaurantThemeId; name: string; icon: string; cost: number }[] = [
  { id: "default", name: "Classic", icon: "\u{1F3ED}", cost: 0 },
  { id: "ocean", name: "Ocean", icon: "\u{1F30A}", cost: 300 },
  { id: "forest", name: "Forest", icon: "\u{1F332}", cost: 300 },
  { id: "sunset", name: "Sunset", icon: "\u{1F305}", cost: 500 },
  { id: "royal", name: "Royal", icon: "\u{1F451}", cost: 800 },
];

export const SKILL_DEFS: { id: SkillId; name: string; description: string; icon: string; maxLevel: number }[] = [
  { id: "magnetic_pickup", name: "Magnetic Hands", description: "Increase pickup range by 0.5m per level", icon: "\u{1F9F2}", maxLevel: 3 },
  { id: "tip_charm", name: "Tip Charm", description: "+$5 tip per delivery per level", icon: "\u{1F4B5}", maxLevel: 5 },
  { id: "iron_patience", name: "Iron Patience", description: "Customers wait 1s longer per level", icon: "\u{1F9D8}", maxLevel: 5 },
  { id: "speed_burst", name: "Speed Burst", description: "2% speed boost per delivery streak per level", icon: "\u{1F3C3}", maxLevel: 3 },
  { id: "bulk_cook", name: "Bulk Cook", description: "10% chance to cook 2 pizzas at once per level", icon: "\u{1F525}", maxLevel: 3 },
  { id: "quick_prep", name: "Quick Prep", description: "5% faster prep per level", icon: "\u2702\uFE0F", maxLevel: 4 },
];

export const TITLE_DEFS: { minLevel: number; minPizzas: number; title: string; icon: string }[] = [
  { minLevel: 1, minPizzas: 0, title: "Beginner", icon: "\u{1F476}" },
  { minLevel: 3, minPizzas: 15, title: "Cook", icon: "\u{1F373}" },
  { minLevel: 5, minPizzas: 40, title: "Chef", icon: "\u{1F468}\u200D\u{1F373}" },
  { minLevel: 8, minPizzas: 80, title: "Master Chef", icon: "\u{1F451}" },
  { minLevel: 10, minPizzas: 120, title: "Pizza Legend", icon: "\u{1F31F}" },
  { minLevel: 15, minPizzas: 200, title: "Pizza God", icon: "\u{1F525}" },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
  check: (state: PizzaGameState) => boolean;
}

export interface GameEvent {
  type: "rush_hour" | "double_pay" | "tips_rain";
  name: string;
  icon: string;
  duration: number;
  remaining: number;
}

export interface Notification {
  id: number;
  text: string;
  icon: string;
  color: string;
  time: number;
}

export interface DailyChallenge {
  id: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  type: "serve" | "earn" | "streak" | "no_miss" | "speed_serve";
}

export interface PrepEmployee {
  id: number;
  hasPizza: boolean;
  isWorking: boolean;
  workProgress: number;
  pizzaReady: boolean;
}

export interface CustomerTable {
  id: number;
  position: [number, number, number];
  unlocked: boolean;
  hasCustomer: boolean;
  customerTimer: number;
  customerMaxTime: number;
  served: boolean;
  customerColor: string;
  customerHairColor: string;
  customerType: CustomerType;
  specialOrder: SpecialOrder;
  servingsNeeded: number;
  servingsReceived: number;
  requestedRecipe: PizzaRecipe;
  walkProgress: number; // 0-1 for queue walking animation
}

export interface OvenState {
  id: number;
  hasDough: boolean;
  isCooking: boolean;
  cookProgress: number;
  pizzaReady: boolean;
  pizzaCooling: number;
}

export interface UpgradeInfo {
  level: number;
  cost: number;
  baseCost: number;
  maxLevel: number;
}

interface PizzaGameState {
  phase: GamePhase;
  money: number;
  totalMoneyEarned: number;
  totalPizzasServed: number;
  missedCustomers: number;
  gameStartTime: number;

  carrying: ItemType;
  carryCount: number;
  maxCarry: number;

  playerSpeed: number;

  doughReady: number;
  maxDough: number;
  doughSpawnInterval: number;

  ovens: OvenState[];
  ovenCookTime: number;
  ovenCoolTime: number;

  prepEmployees: PrepEmployee[];
  prepWorkTime: number;

  tables: CustomerTable[];
  customerSpawnInterval: number;
  customerPatience: number;
  cashPerPizza: number;

  streak: number;
  bestStreak: number;
  lastServeTime: number;
  streakTimeout: number;

  gameLevel: number;
  levelProgress: number;
  pizzasForNextLevel: number;

  // Fun systems
  showLevelUp: boolean;
  levelUpLevel: number;
  activeEvent: GameEvent | null;
  notifications: Notification[];
  achievements: Record<string, boolean>;
  comboTimer: number;
  comboCount: number;
  dailyChallenges: DailyChallenge[];
  dailyDate: string;
  dailyStreak: number;
  speedServes: number;

  // Tutorial
  tutorialStep: number;
  tutorialDone: boolean;

  // Prestige
  prestigeLevel: number;
  prestigeMultiplier: number;

  // Session stats
  sessionStartMoney: number;
  fastestDelivery: number;
  sessionPizzas: number;

  // Player customization
  playerColor: string;
  playerHat: HatType;
  unlockedHats: HatType[];
  unlockedColors: string[];

  // Power-ups
  activePowerUp: ActivePowerUp | null;
  powerUpSpawns: PowerUpSpawn[];

  // Level stars
  levelStars: Record<number, number>;
  currentLevelMisses: number;
  currentLevelSpeedServes: number;
  currentLevelMaxCombo: number;

  // Skill tree
  skillPoints: number;
  skills: Record<string, number>;

  // Heatmap zone visits
  zoneVisits: Record<string, number>;

  // Smart hints
  lastActivityTime: number;
  currentHint: string | null;
  playerPos: [number, number]; // [x, z] for mini map

  // Adaptive difficulty
  difficultyMultiplier: number;
  consecutiveSessionServes: number;
  consecutiveSessionMisses: number;

  // Session enhanced stats
  sessionBestCombo: number;
  sessionMaxSingleEarning: number;

  // Reputation
  reputation: number;

  // Quick Orders
  quickOrders: QuickOrder[];

  // Night shift
  isNightShift: boolean;
  nightShiftTimer: number;

  // Weekly challenges
  weeklyChallenges: WeeklyChallenge[];
  weeklyDate: string;

  // Personal bests
  personalBests: PersonalBests;
  currentNoMissStreak: number;

  // Hidden treasures
  hiddenTreasures: HiddenTreasure[];

  // Customer ratings
  recentRatings: CustomerRating[];
  totalRatings: number;
  totalRatingScore: number;

  // Session history
  sessionHistory: SessionRecord[];

  // Custom goal
  customGoal: CustomGoal | null;

  // Daily XP
  dailyXP: number;
  dailyXPTarget: number;
  dailyRewardsClaimed: number;

  // Restaurant theme
  restaurantThemeId: RestaurantThemeId;
  unlockedThemes: RestaurantThemeId[];

  upgrades: {
    speed: UpgradeInfo;
    capacity: UpgradeInfo;
    ovenSpeed: UpgradeInfo;
    ovenCool: UpgradeInfo;
    prepEmployee: UpgradeInfo;
    newTable: UpgradeInfo;
    doughSpeed: UpgradeInfo;
    newOven: UpgradeInfo;
    prepSpeed: UpgradeInfo;
  };

  startGame: () => void;
  togglePause: () => void;
  dropItem: () => void;
  addMoney: (amount: number) => void;

  pickupDough: () => boolean;
  placeDoughInOven: (ovenId: number) => boolean;
  pickupFromOven: (ovenId: number) => boolean;
  deliverToPrep: (empId: number) => boolean;
  pickupFromPrep: (empId: number) => boolean;
  deliverToTable: (tableId: number) => boolean;

  updateOven: (ovenId: number, delta: number) => void;
  updatePrepEmployee: (empId: number, delta: number) => void;
  spawnDough: () => void;
  spawnCustomer: () => void;
  updateCustomerTimers: (delta: number) => void;
  updateStreak: (delta: number) => void;

  buyUpgrade: (type: keyof PizzaGameState["upgrades"]) => boolean;
  dismissLevelUp: () => void;
  addNotification: (text: string, icon: string, color: string) => void;
  updateEvent: (delta: number) => void;
  triggerRandomEvent: () => void;
  checkAchievements: () => void;
  initDailyChallenges: () => void;
  updateDailyProgress: (type: DailyChallenge["type"], amount: number) => void;
  advanceTutorial: () => void;
  skipTutorial: () => void;
  doPrestige: () => void;
  setPlayerColor: (color: string) => void;
  setPlayerHat: (hat: HatType) => void;
  unlockCosmetic: (type: "hat" | "color", item: string) => boolean;

  // New actions
  spawnPowerUp: () => void;
  collectPowerUp: (id: number) => void;
  updatePowerUp: (delta: number) => void;
  unlockSkill: (id: SkillId) => boolean;
  recordZoneVisit: (zone: string) => void;
  updateWalkProgress: (delta: number) => void;
  getTitle: () => { title: string; icon: string };

  // New batch 2 actions
  updateReputation: (success: boolean) => void;
  spawnQuickOrders: () => void;
  updateQuickOrders: (delta: number) => void;
  completeQuickOrder: (id: number) => void;
  updateNightShift: (delta: number) => void;
  initWeeklyChallenges: () => void;
  updateWeeklyProgress: (type: WeeklyChallenge["type"], amount: number) => void;
  checkPersonalBests: () => void;
  spawnTreasure: () => void;
  collectTreasure: (id: number) => void;
  updateTreasures: (delta: number) => void;
  addCustomerRating: (tableId: number, patienceRatio: number) => void;
  saveSessionRecord: () => void;
  setCustomGoal: (goal: CustomGoal | null) => void;
  addDailyXP: (amount: number) => void;
  claimDailyReward: () => void;
  setRestaurantTheme: (id: RestaurantThemeId) => void;
  unlockTheme: (id: RestaurantThemeId) => boolean;
}

const TABLE_POSITIONS: [number, number, number][] = [
  [10, 0, -2.5],
  [10, 0, 0],
  [10, 0, 2.5],
  [12.5, 0, -2.5],
  [12.5, 0, 0],
  [12.5, 0, 2.5],
];

export const OVEN_POSITIONS: [number, number, number][] = [
  [4, 0, -2.5],
  [4, 0, 0],
  [4, 0, 2.5],
];

const CUSTOMER_COLORS = ["#6b7280", "#4a5568", "#7c3aed", "#2563eb", "#dc2626", "#059669", "#d97706", "#ec4899"];
const HAIR_COLORS = ["#4a3728", "#1a1a1a", "#8b4513", "#d4a373", "#ef4444", "#fbbf24"];

function createTables(): CustomerTable[] {
  return TABLE_POSITIONS.map((pos, i) => ({
    id: i,
    position: pos,
    unlocked: i < 2,
    hasCustomer: false,
    customerTimer: 0,
    customerMaxTime: 20,
    served: false,
    customerColor: CUSTOMER_COLORS[0],
    customerHairColor: HAIR_COLORS[0],
    customerType: "normal" as CustomerType,
    specialOrder: "none" as SpecialOrder,
    servingsNeeded: 1,
    servingsReceived: 0,
    requestedRecipe: "classic" as PizzaRecipe,
    walkProgress: 1,
  }));
}

const ACHIEVEMENT_DEFS: { id: string; name: string; description: string; icon: string; reward: number; check: (s: PizzaGameState) => boolean }[] = [
  { id: "first_pizza", name: "First Pizza!", description: "Serve your first pizza", icon: "\u{1F355}", reward: 10, check: (s) => s.totalPizzasServed >= 1 },
  { id: "pizza_10", name: "Pizza Pro", description: "Serve 10 pizzas", icon: "\u{1F3C6}", reward: 50, check: (s) => s.totalPizzasServed >= 10 },
  { id: "pizza_50", name: "Master Chef", description: "Serve 50 pizzas", icon: "\u{1F468}\u200D\u{1F373}", reward: 200, check: (s) => s.totalPizzasServed >= 50 },
  { id: "pizza_100", name: "Pizza Legend", description: "Serve 100 pizzas", icon: "\u{1F451}", reward: 500, check: (s) => s.totalPizzasServed >= 100 },
  { id: "streak_5", name: "On Fire!", description: "Get a 5x streak", icon: "\u{1F525}", reward: 30, check: (s) => s.bestStreak >= 5 },
  { id: "streak_10", name: "Unstoppable", description: "Get a 10x streak", icon: "\u{1F4A5}", reward: 100, check: (s) => s.bestStreak >= 10 },
  { id: "rich_500", name: "Getting Rich", description: "Earn $500 total", icon: "\u{1F4B0}", reward: 50, check: (s) => s.totalMoneyEarned >= 500 },
  { id: "rich_2000", name: "Pizza Tycoon", description: "Earn $2000 total", icon: "\u{1F911}", reward: 200, check: (s) => s.totalMoneyEarned >= 2000 },
  { id: "level_5", name: "Rising Star", description: "Reach Level 5", icon: "\u{2B50}", reward: 100, check: (s) => s.gameLevel >= 5 },
  { id: "level_10", name: "Pizza Empire", description: "Reach Level 10", icon: "\u{1F3F0}", reward: 300, check: (s) => s.gameLevel >= 10 },
  { id: "no_miss_10", name: "Perfect Service", description: "Serve 10 in a row without missing", icon: "\u{2705}", reward: 75, check: (s) => s.streak >= 10 && s.missedCustomers === 0 },
  { id: "prestige_1", name: "Reborn", description: "Prestige for the first time", icon: "\u{1F31F}", reward: 0, check: (s) => s.prestigeLevel >= 1 },
];

const PLAYER_COLORS = ["#ffffff", "#dc2626", "#2563eb", "#16a34a", "#f97316", "#a855f7", "#ec4899", "#fbbf24", "#06b6d4", "#1e293b"];
const HAT_DEFS: { hat: HatType; name: string; cost: number }[] = [
  { hat: "chef", name: "Chef Hat", cost: 0 },
  { hat: "tall_chef", name: "Tall Chef", cost: 200 },
  { hat: "beret", name: "Beret", cost: 300 },
  { hat: "crown", name: "Crown", cost: 1000 },
];
export { PLAYER_COLORS, HAT_DEFS };

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateDailyChallenges(): DailyChallenge[] {
  const today = getTodayStr();
  // Use date as seed for deterministic daily challenges
  const seed = today.split("-").reduce((a, b) => a + parseInt(b), 0);
  const allChallenges: Omit<DailyChallenge, "id" | "progress" | "completed">[] = [
    { description: "Serve 15 pizzas", icon: "\u{1F355}", target: 15, reward: 100, type: "serve" },
    { description: "Serve 30 pizzas", icon: "\u{1F355}", target: 30, reward: 250, type: "serve" },
    { description: "Earn $300", icon: "\u{1F4B0}", target: 300, reward: 80, type: "earn" },
    { description: "Earn $800", icon: "\u{1F4B0}", target: 800, reward: 200, type: "earn" },
    { description: "Get a 5x streak", icon: "\u{1F525}", target: 5, reward: 60, type: "streak" },
    { description: "Get a 8x streak", icon: "\u{1F525}", target: 8, reward: 150, type: "streak" },
    { description: "Serve 10 without missing", icon: "\u{2705}", target: 10, reward: 120, type: "no_miss" },
    { description: "Speed serve 5 customers", icon: "\u26A1", target: 5, reward: 90, type: "speed_serve" },
  ];

  const picked: DailyChallenge[] = [];
  const shuffled = [...allChallenges].sort((_, __) => ((seed + picked.length * 7) % 3) - 1);
  for (let i = 0; i < 3 && i < shuffled.length; i++) {
    picked.push({ ...shuffled[i], id: `daily_${i}`, progress: 0, completed: false });
  }
  return picked;
}

function getWeekStr() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function generateWeeklyChallenges(): WeeklyChallenge[] {
  const week = getWeekStr();
  const seed = week.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const all: Omit<WeeklyChallenge, "id" | "progress" | "completed">[] = [
    { description: "Serve 200 pizzas", icon: "\u{1F355}", target: 200, reward: 500, type: "serve" },
    { description: "Earn $5,000", icon: "\u{1F4B0}", target: 5000, reward: 800, type: "earn" },
    { description: "Get a 15x streak", icon: "\u{1F525}", target: 15, reward: 400, type: "streak" },
    { description: "Serve 50 without missing", icon: "\u{2705}", target: 50, reward: 600, type: "no_miss" },
    { description: "Speed serve 30 customers", icon: "\u26A1", target: 30, reward: 350, type: "speed_serve", cosmeticReward: "#ff6b6b" },
    { description: "Earn $10,000", icon: "\u{1F4B0}", target: 10000, reward: 1200, type: "earn", cosmeticReward: "#c084fc" },
  ];
  const shuffled = [...all].sort((_, __) => ((seed + _.target) % 3) - 1);
  return shuffled.slice(0, 2).map((c, i) => ({ ...c, id: `weekly_${i}`, progress: 0, completed: false }));
}

function createPrepEmployees(): PrepEmployee[] {
  return [
    { id: 0, hasPizza: false, isWorking: false, workProgress: 0, pizzaReady: false },
  ];
}

function calculateStars(misses: number, speedServes: number, maxCombo: number): number {
  let stars = 1; // Always get at least 1 star
  if (misses === 0) stars++; // No missed customers = 2nd star
  if (speedServes >= 3 || maxCombo >= 3) stars++; // Speed or combo = 3rd star
  return stars;
}

function createOvens(): OvenState[] {
  return [
    { id: 0, hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 },
  ];
}

export const useOfficeGame = create<PizzaGameState>()(
  persist(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    money: 0,
    totalMoneyEarned: 0,
    totalPizzasServed: 0,
    missedCustomers: 0,
    gameStartTime: 0,

    carrying: "none",
    carryCount: 0,
    maxCarry: 1,

    playerSpeed: 4.5,

    doughReady: 5,
    maxDough: 8,
    doughSpawnInterval: 2,

    ovens: createOvens(),
    ovenCookTime: 2,
    ovenCoolTime: 8,

    prepEmployees: createPrepEmployees(),
    prepWorkTime: 2.5,

    tables: createTables(),
    customerSpawnInterval: 3,
    customerPatience: 20,
    cashPerPizza: 25,

    streak: 0,
    bestStreak: 0,
    lastServeTime: 0,
    streakTimeout: 15,

    gameLevel: 1,
    levelProgress: 0,
    pizzasForNextLevel: 5,

    showLevelUp: false,
    levelUpLevel: 0,
    activeEvent: null,
    notifications: [],
    achievements: {},
    comboTimer: 0,
    comboCount: 0,
    dailyChallenges: generateDailyChallenges(),
    dailyDate: getTodayStr(),
    dailyStreak: 0,
    speedServes: 0,

    tutorialStep: 0,
    tutorialDone: false,

    prestigeLevel: 0,
    prestigeMultiplier: 1,

    sessionStartMoney: 0,
    fastestDelivery: 999,
    sessionPizzas: 0,

    playerColor: "#ffffff",
    playerHat: "chef" as HatType,
    unlockedHats: ["chef" as HatType, "none" as HatType],
    unlockedColors: ["#ffffff", "#dc2626", "#2563eb"],

    // Power-ups
    activePowerUp: null,
    powerUpSpawns: [],

    // Level stars
    levelStars: {},
    currentLevelMisses: 0,
    currentLevelSpeedServes: 0,
    currentLevelMaxCombo: 0,

    // Skill tree
    skillPoints: 0,
    skills: {},

    // Heatmap
    zoneVisits: {},

    // Smart hints
    lastActivityTime: Date.now(),
    currentHint: null,
    playerPos: [1, 0] as [number, number],

    // Adaptive difficulty
    difficultyMultiplier: 1.0,
    consecutiveSessionServes: 0,
    consecutiveSessionMisses: 0,

    // Session enhanced stats
    sessionBestCombo: 0,
    sessionMaxSingleEarning: 0,

    // Reputation
    reputation: 50,

    // Quick Orders
    quickOrders: [],

    // Night shift
    isNightShift: false,
    nightShiftTimer: 0,

    // Weekly challenges
    weeklyChallenges: generateWeeklyChallenges(),
    weeklyDate: getWeekStr(),

    // Personal bests
    personalBests: { bestSessionEarnings: 0, bestSessionPizzas: 0, longestNoMiss: 0, fastestTenDeliveries: 999, highestSingleEarning: 0, bestCombo: 0 },
    currentNoMissStreak: 0,

    // Hidden treasures
    hiddenTreasures: [],

    // Customer ratings
    recentRatings: [],
    totalRatings: 0,
    totalRatingScore: 0,

    // Session history
    sessionHistory: [],

    // Custom goal
    customGoal: null,

    // Daily XP
    dailyXP: 0,
    dailyXPTarget: 100,
    dailyRewardsClaimed: 0,

    // Restaurant theme
    restaurantThemeId: "default" as RestaurantThemeId,
    unlockedThemes: ["default" as RestaurantThemeId],

    upgrades: {
      speed: { level: 0, cost: 30, baseCost: 30, maxLevel: 10 },
      capacity: { level: 0, cost: 150, baseCost: 150, maxLevel: 3 },
      ovenSpeed: { level: 0, cost: 50, baseCost: 50, maxLevel: 8 },
      ovenCool: { level: 0, cost: 60, baseCost: 60, maxLevel: 6 },
      prepEmployee: { level: 0, cost: 120, baseCost: 120, maxLevel: 2 },
      newTable: { level: 0, cost: 75, baseCost: 75, maxLevel: 4 },
      doughSpeed: { level: 0, cost: 40, baseCost: 40, maxLevel: 8 },
      newOven: { level: 0, cost: 120, baseCost: 120, maxLevel: 2 },
      prepSpeed: { level: 0, cost: 60, baseCost: 60, maxLevel: 8 },
    },

    startGame: () => {
      const s = get();
      set({
        phase: "playing",
        gameStartTime: Date.now(),
        sessionStartMoney: s.money,
        sessionPizzas: 0,
        fastestDelivery: 999,
        tutorialStep: s.tutorialDone ? -1 : 0,
        sessionBestCombo: 0,
        sessionMaxSingleEarning: 0,
        consecutiveSessionServes: 0,
        consecutiveSessionMisses: 0,
        difficultyMultiplier: 1.0,
        powerUpSpawns: [],
        activePowerUp: null,
        currentLevelMisses: 0,
        currentLevelSpeedServes: 0,
        currentLevelMaxCombo: 0,
        lastActivityTime: Date.now(),
        currentHint: null,
        quickOrders: [],
        isNightShift: false,
        nightShiftTimer: 0,
        hiddenTreasures: [],
        recentRatings: [],
        currentNoMissStreak: 0,
      });
    },

    togglePause: () => {
      const s = get();
      if (s.phase === "playing") set({ phase: "paused" });
      else if (s.phase === "paused") set({ phase: "playing" });
    },

    addMoney: (amount: number) => {
      const s = get();
      set({ money: s.money + amount, totalMoneyEarned: s.totalMoneyEarned + amount });
    },

    dropItem: () => {
      const s = get();
      if (s.carrying === "none") return;
      if (s.carrying === "dough") {
        set({ carrying: "none", carryCount: 0, doughReady: Math.min(s.maxDough, s.doughReady + s.carryCount) });
      } else {
        set({ carrying: "none", carryCount: 0 });
      }
    },

    pickupDough: () => {
      const s = get();
      if (s.carrying !== "none") return false;
      if (s.doughReady <= 0) return false;
      const toPickup = Math.min(s.maxCarry, s.doughReady);
      set({ carrying: "dough", carryCount: toPickup, doughReady: s.doughReady - toPickup });
      return true;
    },

    placeDoughInOven: (ovenId: number) => {
      const s = get();
      if (s.carrying !== "dough" || s.carryCount <= 0) return false;
      const oven = s.ovens[ovenId];
      if (!oven || oven.hasDough || oven.isCooking || oven.pizzaReady) return false;
      const newOvens = [...s.ovens];
      newOvens[ovenId] = { ...oven, hasDough: true, isCooking: true, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 };
      set({
        carrying: s.carryCount > 1 ? "dough" : "none",
        carryCount: s.carryCount - 1,
        ovens: newOvens,
      });
      return true;
    },

    pickupFromOven: (ovenId: number) => {
      const s = get();
      if (s.carrying !== "none") return false;
      const oven = s.ovens[ovenId];
      if (!oven || !oven.pizzaReady) return false;
      const newOvens = [...s.ovens];
      newOvens[ovenId] = { ...oven, hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 };
      set({
        carrying: "pizza_raw",
        carryCount: 1,
        ovens: newOvens,
      });
      return true;
    },

    deliverToPrep: (empId: number) => {
      const s = get();
      if (s.carrying !== "pizza_raw") return false;
      const emp = s.prepEmployees[empId];
      if (!emp || emp.hasPizza || emp.isWorking || emp.pizzaReady) return false;
      const newEmps = [...s.prepEmployees];
      newEmps[empId] = { ...emp, hasPizza: true, isWorking: true, workProgress: 0 };
      set({
        carrying: s.carryCount > 1 ? "pizza_raw" : "none",
        carryCount: s.carryCount - 1,
        prepEmployees: newEmps,
      });
      return true;
    },

    pickupFromPrep: (empId: number) => {
      const s = get();
      if (s.carrying !== "none") return false;
      const emp = s.prepEmployees[empId];
      if (!emp || !emp.pizzaReady) return false;
      const newEmps = [...s.prepEmployees];
      newEmps[empId] = { ...emp, hasPizza: false, isWorking: false, workProgress: 0, pizzaReady: false };
      set({ carrying: "pizza_ready", carryCount: 1, prepEmployees: newEmps });
      return true;
    },

    deliverToTable: (tableId: number) => {
      const s = get();
      if (s.carrying !== "pizza_ready") return false;
      const table = s.tables[tableId];
      if (!table || !table.unlocked || !table.hasCustomer || table.served) return false;
      const newTables = [...s.tables];

      // Special orders: some need multiple servings
      const newReceived = table.servingsReceived + 1;
      const orderComplete = newReceived >= table.servingsNeeded;

      if (orderComplete) {
        newTables[tableId] = { ...table, served: true, hasCustomer: false, customerTimer: 0, servingsReceived: newReceived };
      } else {
        newTables[tableId] = { ...table, servingsReceived: newReceived };
        set({ carrying: s.carryCount > 1 ? "pizza_ready" : "none", carryCount: s.carryCount - 1, tables: newTables });
        return true;
      }

      const streakBonus = Math.min(s.streak, 10);
      let cash = s.cashPerPizza + streakBonus * 5;

      // Skill: tip charm bonus
      const tipCharmBonus = (s.skills["tip_charm"] || 0) * 5;
      cash += tipCharmBonus;

      // Customer type bonuses
      if (table.customerType === "vip") cash = Math.floor(cash * 2.5);
      else if (table.customerType === "rush") cash = Math.floor(cash * 1.5);
      else if (table.customerType === "tipper") cash += Math.floor(Math.random() * 20) + 10;
      else if (table.customerType === "boss") cash = Math.floor(cash * 4.0);

      // Active event bonuses
      if (s.activeEvent?.type === "double_pay") cash *= 2;
      if (s.activeEvent?.type === "tips_rain") cash += 15;

      // Power-up: double money
      if (s.activePowerUp?.type === "double_money") cash *= 2;

      // Night shift: 2x pay
      if (s.isNightShift) cash *= 2;

      // Reputation bonus: high reputation = +20% at 90+
      if (s.reputation >= 90) cash = Math.floor(cash * 1.2);
      else if (s.reputation >= 75) cash = Math.floor(cash * 1.1);

      // Combo bonus (deliver multiple within 3s)
      const now = Date.now();
      const comboActive = now - s.comboTimer < 3000;
      const newCombo = comboActive ? s.comboCount + 1 : 1;
      if (newCombo >= 3) cash += newCombo * 8;

      // Speed bonus - deliver before half patience
      const patienceRatio = 1 - table.customerTimer / table.customerMaxTime;
      if (patienceRatio > 0.75) cash += 10;

      // Recipe match bonus
      if (table.requestedRecipe === "spicy") cash += 8;
      else if (table.requestedRecipe === "special") cash += 15;

      // Special order bonus
      if (table.specialOrder === "double") cash = Math.floor(cash * 1.8);
      else if (table.specialOrder === "express") cash = Math.floor(cash * 2.5);
      else if (table.specialOrder === "group") cash = Math.floor(cash * 2.0);

      // Prestige multiplier
      cash = Math.floor(cash * s.prestigeMultiplier);

      // Track fastest delivery
      const deliveryTime = table.customerTimer;
      const newFastest = Math.min(s.fastestDelivery, deliveryTime);

      const newServed = s.totalPizzasServed + 1;
      const newProgress = s.levelProgress + 1;
      let newLevel = s.gameLevel;
      let newPizzasForNext = s.pizzasForNextLevel;
      let progress = newProgress;
      let leveledUp = false;

      if (newProgress >= s.pizzasForNextLevel) {
        newLevel = s.gameLevel + 1;
        progress = 0;
        newPizzasForNext = Math.floor(s.pizzasForNextLevel * 1.25);
        leveledUp = true;
      }

      // Adaptive difficulty: adjust based on consecutive serves/misses
      const newConsecServes = s.consecutiveSessionServes + 1;
      let newDifficulty = s.difficultyMultiplier;
      // Every 3 consecutive serves, slightly decrease patience (harder)
      if (newConsecServes % 3 === 0) {
        newDifficulty = Math.max(0.75, newDifficulty - 0.02);
      }

      const updates: any = {
        carrying: s.carryCount > 1 ? "pizza_ready" : "none",
        carryCount: s.carryCount - 1,
        tables: newTables,
        money: s.money + cash,
        totalMoneyEarned: s.totalMoneyEarned + cash,
        totalPizzasServed: newServed,
        streak: s.streak + 1,
        bestStreak: Math.max(s.bestStreak, s.streak + 1),
        lastServeTime: now,
        gameLevel: newLevel,
        levelProgress: progress,
        pizzasForNextLevel: newPizzasForNext,
        cashPerPizza: 25 + (newLevel - 1) * 5,
        customerSpawnInterval: Math.max(1.5, 3 - (newLevel - 1) * 0.15),
        comboTimer: now,
        comboCount: newCombo,
        fastestDelivery: newFastest,
        sessionPizzas: s.sessionPizzas + 1,
        consecutiveSessionServes: newConsecServes,
        consecutiveSessionMisses: 0,
        difficultyMultiplier: newDifficulty,
        sessionBestCombo: Math.max(s.sessionBestCombo, newCombo),
        sessionMaxSingleEarning: Math.max(s.sessionMaxSingleEarning, cash),
        lastActivityTime: now,
        currentLevelSpeedServes: patienceRatio > 0.75 ? s.currentLevelSpeedServes + 1 : s.currentLevelSpeedServes,
        currentLevelMaxCombo: Math.max(s.currentLevelMaxCombo, newCombo),
      };

      if (leveledUp) {
        updates.showLevelUp = true;
        updates.levelUpLevel = newLevel;
        updates.skillPoints = s.skillPoints + 1;

        // Calculate stars for the completed level
        const stars = calculateStars(s.currentLevelMisses, s.currentLevelSpeedServes, s.currentLevelMaxCombo);
        const prevBest = s.levelStars[s.gameLevel] || 0;
        updates.levelStars = { ...s.levelStars, [s.gameLevel]: Math.max(prevBest, stars) };
        updates.currentLevelMisses = 0;
        updates.currentLevelSpeedServes = 0;
        updates.currentLevelMaxCombo = 0;
      }

      set(updates);

      // Update daily challenges, achievements, and new systems
      setTimeout(() => {
        const st = get();
        st.updateDailyProgress("serve", 1);
        st.updateDailyProgress("earn", cash);
        if (st.streak + 1 >= 1) st.updateDailyProgress("streak", st.streak + 1);
        if (patienceRatio > 0.75) st.updateDailyProgress("speed_serve", 1);
        if (st.missedCustomers === 0) st.updateDailyProgress("no_miss", newServed);
        st.checkAchievements();

        // Reputation, rating, XP, weekly, quick orders, personal bests
        st.updateReputation(true);
        st.addCustomerRating(tableId, patienceRatio);
        st.addDailyXP(10 + Math.floor(cash / 10));
        st.updateWeeklyProgress("serve", 1);
        st.updateWeeklyProgress("earn", cash);
        if (st.streak + 1 >= 1) st.updateWeeklyProgress("streak", st.streak + 1);
        if (patienceRatio > 0.75) st.updateWeeklyProgress("speed_serve", 1);
        if (st.currentNoMissStreak + 1 >= 1) st.updateWeeklyProgress("no_miss", st.currentNoMissStreak + 1);

        // Quick orders progress
        st.quickOrders.forEach(qo => {
          if (qo.type === "serve") st.completeQuickOrder(qo.id);
          else if (qo.type === "earn") {
            const newQOs = st.quickOrders.map(q => q.id === qo.id ? { ...q, progress: q.progress + cash } : q);
            set({ quickOrders: newQOs });
          }
        });

        st.checkPersonalBests();

        // No miss streak
        set({ currentNoMissStreak: st.currentNoMissStreak + 1 });

        // Tutorial
        if (st.tutorialStep >= 0 && !st.tutorialDone) {
          set({ tutorialStep: -1, tutorialDone: true });
          get().addNotification("Tutorial Complete!", "\u{1F389}", "#22c55e");
        }
      }, 100);

      return true;
    },

    updateOven: (ovenId: number, delta: number) => {
      const s = get();
      const oven = s.ovens[ovenId];
      if (!oven) return;

      if (!oven.isCooking) {
        if (oven.pizzaReady) {
          const newCooling = oven.pizzaCooling + delta;
          if (newCooling >= s.ovenCoolTime) {
            const newOvens = [...s.ovens];
            newOvens[ovenId] = { ...oven, hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 };
            set({ ovens: newOvens });
          } else {
            const newOvens = [...s.ovens];
            newOvens[ovenId] = { ...oven, pizzaCooling: newCooling };
            set({ ovens: newOvens });
          }
        }
        return;
      }
      const newProgress = oven.cookProgress + delta;
      if (newProgress >= s.ovenCookTime) {
        const newOvens = [...s.ovens];
        newOvens[ovenId] = { ...oven, hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: true, pizzaCooling: 0 };
        set({ ovens: newOvens });
      } else {
        const newOvens = [...s.ovens];
        newOvens[ovenId] = { ...oven, cookProgress: newProgress };
        set({ ovens: newOvens });
      }
    },

    updatePrepEmployee: (empId: number, delta: number) => {
      const s = get();
      const emp = s.prepEmployees[empId];
      if (!emp || !emp.isWorking) return;
      const quickPrepMult = 1 - (s.skills["quick_prep"] || 0) * 0.05;
      const effectivePrepTime = s.prepWorkTime * quickPrepMult;
      const newProgress = emp.workProgress + delta;
      if (newProgress >= effectivePrepTime) {
        const newEmps = [...s.prepEmployees];
        newEmps[empId] = { ...emp, isWorking: false, workProgress: 0, pizzaReady: true };
        set({ prepEmployees: newEmps });
      } else {
        const newEmps = [...s.prepEmployees];
        newEmps[empId] = { ...emp, workProgress: newProgress };
        set({ prepEmployees: newEmps });
      }
    },

    spawnDough: () => {
      const s = get();
      if (s.doughReady < s.maxDough) {
        set({ doughReady: s.doughReady + 1 });
      }
    },

    spawnCustomer: () => {
      const s = get();
      const emptyTable = s.tables.find((t) => t.unlocked && !t.hasCustomer && !t.served);
      if (!emptyTable) return;
      const newTables = [...s.tables];
      const ironPatienceBonus = (s.skills["iron_patience"] || 0) * 1;
      const patience = Math.max(14, s.customerPatience - (s.gameLevel - 1) * 0.4 + ironPatienceBonus);
      const custColor = CUSTOMER_COLORS[Math.floor(Math.random() * CUSTOMER_COLORS.length)];
      const hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];

      // Determine customer type based on level and randomness
      let custType: CustomerType = "normal";
      const roll = Math.random();
      if (s.gameLevel >= 2) {
        if (roll < 0.08) custType = "vip";
        else if (roll < 0.18) custType = "tipper";
        else if (roll < 0.28) custType = "patient";
        else if (roll < 0.38) custType = "rush";
      }

      // Boss customer: every 5 levels, 15% chance
      if (s.gameLevel >= 5 && s.gameLevel % 5 === 0 && Math.random() < 0.15) {
        custType = "boss";
      }

      // Rush hour event doubles spawn rate effect
      let adjustedPatience = patience;
      if (custType === "patient") adjustedPatience *= 1.5;
      else if (custType === "rush") adjustedPatience *= 0.6;
      else if (custType === "boss") adjustedPatience *= 2.5;

      // Apply adaptive difficulty
      adjustedPatience *= s.difficultyMultiplier;

      // Special orders from level 4
      let specOrder: SpecialOrder = "none";
      let servings = 1;
      if (custType === "boss") {
        specOrder = "group";
        servings = 5;
        adjustedPatience *= 1.2;
      } else if (s.gameLevel >= 4) {
        const specRoll = Math.random();
        if (specRoll < 0.06) { specOrder = "express"; adjustedPatience *= 0.4; servings = 1; }
        else if (specRoll < 0.14) { specOrder = "double"; servings = 2; }
        else if (specRoll < 0.20) { specOrder = "group"; servings = 3; adjustedPatience *= 1.5; }
      }

      // Pizza recipe (from level 3)
      let recipe: PizzaRecipe = "classic";
      if (s.gameLevel >= 3) {
        const recipeRoll = Math.random();
        if (recipeRoll < 0.3) recipe = "spicy";
        else if (recipeRoll < 0.5) recipe = "special";
      }

      newTables[emptyTable.id] = {
        ...emptyTable,
        hasCustomer: true,
        customerTimer: 0,
        customerMaxTime: adjustedPatience,
        served: false,
        customerColor: custType === "vip" ? "#fbbf24" : custType === "boss" ? "#ef4444" : custColor,
        customerHairColor: hairColor,
        customerType: custType,
        specialOrder: specOrder,
        servingsNeeded: servings,
        servingsReceived: 0,
        requestedRecipe: recipe,
        walkProgress: 0,
      };
      set({ tables: newTables });
    },

    updateCustomerTimers: (delta: number) => {
      const s = get();
      let changed = false;
      let missed = 0;
      // Freeze patience if power-up active
      const freezePatience = s.activePowerUp?.type === "freeze_patience";
      const newTables = s.tables.map((t) => {
        if (!t.hasCustomer) {
          if (t.served) {
            changed = true;
            return { ...t, served: false };
          }
          return t;
        }
        // Update walk progress (queue animation)
        let walkProg = t.walkProgress;
        if (walkProg < 1) {
          walkProg = Math.min(1, walkProg + delta * 2);
          changed = true;
        }
        const newTimer = freezePatience ? t.customerTimer : t.customerTimer + delta;
        if (newTimer >= t.customerMaxTime) {
          changed = true;
          missed++;
          return { ...t, hasCustomer: false, customerTimer: 0, served: false, walkProgress: 1 };
        }
        changed = true;
        return { ...t, customerTimer: newTimer, walkProgress: walkProg };
      });
      if (changed) {
        const updates: any = { tables: newTables, missedCustomers: s.missedCustomers + missed };
        if (missed > 0) {
          updates.streak = 0;
          updates.currentLevelMisses = s.currentLevelMisses + missed;
          // Adaptive difficulty: ease up on consecutive misses
          const newConsecMisses = s.consecutiveSessionMisses + missed;
          if (newConsecMisses >= 2) {
            updates.difficultyMultiplier = Math.min(1.3, s.difficultyMultiplier + 0.05);
          }
          updates.consecutiveSessionMisses = newConsecMisses;
          updates.consecutiveSessionServes = 0;
          updates.currentNoMissStreak = 0;
        }
        set(updates);
        if (missed > 0) {
          for (let i = 0; i < missed; i++) get().updateReputation(false);
        }
      }
    },

    updateStreak: (_delta: number) => {
      const s = get();
      if (s.streak > 0 && Date.now() - s.lastServeTime > s.streakTimeout * 1000) {
        set({ streak: 0 });
      }
    },

    buyUpgrade: (type) => {
      const s = get();
      const upgrade = s.upgrades[type];
      if (s.money < upgrade.cost || upgrade.level >= upgrade.maxLevel) return false;

      const newUpgrades = { ...s.upgrades };
      const newLevel = upgrade.level + 1;
      const newCost = Math.floor(upgrade.baseCost * Math.pow(1.6, newLevel));
      newUpgrades[type] = { ...upgrade, level: newLevel, cost: newCost };

      const updates: any = {
        money: s.money - upgrade.cost,
        upgrades: newUpgrades,
      };

      if (type === "speed") {
        updates.playerSpeed = 4.5 + newLevel * 0.6;
      } else if (type === "capacity") {
        updates.maxCarry = 1 + newLevel;
      } else if (type === "ovenSpeed") {
        updates.ovenCookTime = Math.max(0.8, 2 - newLevel * 0.15);
      } else if (type === "ovenCool") {
        updates.ovenCoolTime = Math.max(4, 8 - newLevel * 0.7);
      } else if (type === "prepEmployee") {
        const newEmps = [...s.prepEmployees];
        newEmps.push({
          id: newEmps.length,
          hasPizza: false,
          isWorking: false,
          workProgress: 0,
          pizzaReady: false,
        });
        updates.prepEmployees = newEmps;
      } else if (type === "newTable") {
        const nextTable = s.tables.findIndex((t) => !t.unlocked);
        if (nextTable >= 0) {
          const newTables = [...s.tables];
          newTables[nextTable] = { ...newTables[nextTable], unlocked: true };
          updates.tables = newTables;
        }
      } else if (type === "doughSpeed") {
        updates.doughSpawnInterval = Math.max(0.6, 2 - newLevel * 0.15);
      } else if (type === "newOven") {
        const newOvens = [...s.ovens];
        newOvens.push({
          id: newOvens.length,
          hasDough: false,
          isCooking: false,
          cookProgress: 0,
          pizzaReady: false,
          pizzaCooling: 0,
        });
        updates.ovens = newOvens;
      } else if (type === "prepSpeed") {
        updates.prepWorkTime = Math.max(1, 2.5 - newLevel * 0.2);
      }

      set(updates);
      return true;
    },

    dismissLevelUp: () => set({ showLevelUp: false }),

    addNotification: (text: string, icon: string, color: string) => {
      const s = get();
      const notif: Notification = { id: Date.now(), text, icon, color, time: Date.now() };
      set({ notifications: [...s.notifications.slice(-4), notif] });
      // Auto-remove after 3s
      setTimeout(() => {
        const curr = get();
        set({ notifications: curr.notifications.filter((n) => n.id !== notif.id) });
      }, 3000);
    },

    updateEvent: (delta: number) => {
      const s = get();
      if (!s.activeEvent) return;
      const remaining = s.activeEvent.remaining - delta;
      if (remaining <= 0) {
        set({ activeEvent: null });
      } else {
        set({ activeEvent: { ...s.activeEvent, remaining } });
      }
    },

    triggerRandomEvent: () => {
      const s = get();
      if (s.activeEvent || s.gameLevel < 3) return;
      const events: GameEvent[] = [
        { type: "rush_hour", name: "Rush Hour!", icon: "\u{23F0}", duration: 30, remaining: 30 },
        { type: "double_pay", name: "Double Pay!", icon: "\u{1F4B0}", duration: 20, remaining: 20 },
        { type: "tips_rain", name: "Tips Rain!", icon: "\u{1F4B5}", duration: 25, remaining: 25 },
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      set({ activeEvent: event });
      get().addNotification(event.name, event.icon, event.type === "double_pay" ? "#22c55e" : event.type === "tips_rain" ? "#fbbf24" : "#ef4444");
    },

    checkAchievements: () => {
      const s = get();
      for (const def of ACHIEVEMENT_DEFS) {
        if (!s.achievements[def.id] && def.check(s)) {
          const newAchievements = { ...s.achievements, [def.id]: true };
          set({
            achievements: newAchievements,
            money: s.money + def.reward,
            totalMoneyEarned: s.totalMoneyEarned + def.reward,
          });
          get().addNotification(`${def.name} +$${def.reward}`, def.icon, "#a855f7");
        }
      }
    },

    initDailyChallenges: () => {
      const s = get();
      const today = getTodayStr();
      if (s.dailyDate !== today) {
        const wasYesterday = (() => {
          const d = new Date(s.dailyDate);
          d.setDate(d.getDate() + 1);
          return d.toISOString().slice(0, 10) === today;
        })();
        const allCompleted = s.dailyChallenges.every((c) => c.completed);
        set({
          dailyChallenges: generateDailyChallenges(),
          dailyDate: today,
          dailyStreak: wasYesterday && allCompleted ? s.dailyStreak + 1 : allCompleted ? s.dailyStreak + 1 : 0,
          speedServes: 0,
        });
        if (wasYesterday && allCompleted) {
          get().addNotification(`Daily Streak ${s.dailyStreak + 1}!`, "\u{1F4AA}", "#f97316");
        }
      }
    },

    updateDailyProgress: (type, amount) => {
      const s = get();
      let updated = false;
      const newChallenges = s.dailyChallenges.map((c) => {
        if (c.completed || c.type !== type) return c;
        const newProgress = type === "streak" || type === "no_miss"
          ? Math.max(c.progress, amount)
          : c.progress + amount;
        if (newProgress >= c.target && !c.completed) {
          updated = true;
          setTimeout(() => {
            const st = get();
            set({
              money: st.money + c.reward,
              totalMoneyEarned: st.totalMoneyEarned + c.reward,
            });
            get().addNotification(`Challenge Done! +$${c.reward}`, "\u{1F3AF}", "#f97316");
          }, 200);
          return { ...c, progress: newProgress, completed: true };
        }
        return { ...c, progress: newProgress };
      });
      if (updated || newChallenges.some((c, i) => c.progress !== s.dailyChallenges[i].progress)) {
        set({ dailyChallenges: newChallenges });
      }
    },

    advanceTutorial: () => {
      const s = get();
      if (s.tutorialStep < 0) return;
      set({ tutorialStep: s.tutorialStep + 1 });
    },

    skipTutorial: () => {
      set({ tutorialStep: -1, tutorialDone: true });
    },

    doPrestige: () => {
      const s = get();
      if (s.gameLevel < 10) return;
      const newPrestige = s.prestigeLevel + 1;
      const newMultiplier = 1 + newPrestige * 0.2;
      // Reset progress but keep cosmetics and prestige
      set({
        money: 0,
        totalMoneyEarned: 0,
        totalPizzasServed: 0,
        missedCustomers: 0,
        gameLevel: 1,
        levelProgress: 0,
        pizzasForNextLevel: 5,
        playerSpeed: 4.5,
        maxCarry: 1,
        ovenCookTime: 2,
        ovenCoolTime: 8,
        doughSpawnInterval: 2,
        prepWorkTime: 2.5,
        cashPerPizza: 25,
        customerSpawnInterval: 3,
        streak: 0,
        bestStreak: 0,
        ovens: createOvens(),
        prepEmployees: createPrepEmployees(),
        tables: createTables(),
        upgrades: {
          speed: { level: 0, cost: 30, baseCost: 30, maxLevel: 10 },
          capacity: { level: 0, cost: 150, baseCost: 150, maxLevel: 3 },
          ovenSpeed: { level: 0, cost: 50, baseCost: 50, maxLevel: 8 },
          ovenCool: { level: 0, cost: 60, baseCost: 60, maxLevel: 6 },
          prepEmployee: { level: 0, cost: 120, baseCost: 120, maxLevel: 2 },
          newTable: { level: 0, cost: 75, baseCost: 75, maxLevel: 4 },
          doughSpeed: { level: 0, cost: 40, baseCost: 40, maxLevel: 8 },
          newOven: { level: 0, cost: 120, baseCost: 120, maxLevel: 2 },
          prepSpeed: { level: 0, cost: 60, baseCost: 60, maxLevel: 8 },
        },
        prestigeLevel: newPrestige,
        prestigeMultiplier: newMultiplier,
        phase: "menu",
        activePowerUp: null,
        powerUpSpawns: [],
        currentLevelMisses: 0,
        currentLevelSpeedServes: 0,
        currentLevelMaxCombo: 0,
        difficultyMultiplier: 1.0,
        consecutiveSessionServes: 0,
        consecutiveSessionMisses: 0,
      });
      // Unlock cosmetics on prestige
      const st = get();
      if (newPrestige >= 1 && !st.unlockedColors.includes("#fbbf24")) {
        set({ unlockedColors: [...st.unlockedColors, "#fbbf24", "#16a34a"] });
      }
      if (newPrestige >= 2 && !st.unlockedHats.includes("beret")) {
        set({ unlockedHats: [...st.unlockedHats, "beret"] });
      }
      if (newPrestige >= 3 && !st.unlockedHats.includes("crown")) {
        set({ unlockedHats: [...st.unlockedHats, "crown"] });
      }
    },

    setPlayerColor: (color: string) => set({ playerColor: color }),
    setPlayerHat: (hat: HatType) => set({ playerHat: hat }),

    unlockCosmetic: (type, item) => {
      const s = get();
      if (type === "hat") {
        const def = HAT_DEFS.find(h => h.hat === item);
        if (!def || s.money < def.cost || s.unlockedHats.includes(item as HatType)) return false;
        set({ money: s.money - def.cost, unlockedHats: [...s.unlockedHats, item as HatType] });
        return true;
      } else {
        if (s.money < 50 || s.unlockedColors.includes(item)) return false;
        set({ money: s.money - 50, unlockedColors: [...s.unlockedColors, item] });
        return true;
      }
    },

    // Power-up actions
    spawnPowerUp: () => {
      const s = get();
      if (s.powerUpSpawns.length >= 2) return;
      const types: PowerUpType[] = ["speed_boost", "freeze_patience", "double_money"];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = 2 + Math.random() * 10;
      const z = -4 + Math.random() * 8;
      const spawn: PowerUpSpawn = { id: Date.now(), type, position: [x, 0.5, z], spawnTime: Date.now() };
      set({ powerUpSpawns: [...s.powerUpSpawns, spawn] });
    },

    collectPowerUp: (id: number) => {
      const s = get();
      const pu = s.powerUpSpawns.find(p => p.id === id);
      if (!pu) return;
      const durations: Record<PowerUpType, number> = { speed_boost: 10, freeze_patience: 8, double_money: 15 };
      const names: Record<PowerUpType, string> = { speed_boost: "Speed Boost!", freeze_patience: "Patience Freeze!", double_money: "Double Money!" };
      const icons: Record<PowerUpType, string> = { speed_boost: "\u26A1", freeze_patience: "\u2744\uFE0F", double_money: "\u{1F4B0}" };
      set({
        powerUpSpawns: s.powerUpSpawns.filter(p => p.id !== id),
        activePowerUp: { type: pu.type, remaining: durations[pu.type], duration: durations[pu.type] },
      });
      get().addNotification(names[pu.type], icons[pu.type], "#06b6d4");
    },

    updatePowerUp: (delta: number) => {
      const s = get();
      if (!s.activePowerUp) return;
      const remaining = s.activePowerUp.remaining - delta;
      if (remaining <= 0) {
        set({ activePowerUp: null });
      } else {
        set({ activePowerUp: { ...s.activePowerUp, remaining } });
      }
      // Remove old power-up spawns (30s lifetime)
      const now = Date.now();
      const fresh = s.powerUpSpawns.filter(p => now - p.spawnTime < 30000);
      if (fresh.length !== s.powerUpSpawns.length) set({ powerUpSpawns: fresh });
    },

    unlockSkill: (id: SkillId) => {
      const s = get();
      if (s.skillPoints <= 0) return false;
      const def = SKILL_DEFS.find(d => d.id === id);
      if (!def) return false;
      const current = s.skills[id] || 0;
      if (current >= def.maxLevel) return false;
      set({
        skillPoints: s.skillPoints - 1,
        skills: { ...s.skills, [id]: current + 1 },
      });
      get().addNotification(`${def.name} Lv.${current + 1}`, def.icon, "#a855f7");
      return true;
    },

    recordZoneVisit: (zone: string) => {
      const s = get();
      set({ zoneVisits: { ...s.zoneVisits, [zone]: (s.zoneVisits[zone] || 0) + 1 } });
    },

    updateWalkProgress: (delta: number) => {
      const s = get();
      let changed = false;
      const newTables = s.tables.map(t => {
        if (t.hasCustomer && t.walkProgress < 1) {
          changed = true;
          return { ...t, walkProgress: Math.min(1, t.walkProgress + delta * 2) };
        }
        return t;
      });
      if (changed) set({ tables: newTables });
    },

    getTitle: () => {
      const s = get();
      let best = TITLE_DEFS[0];
      for (const def of TITLE_DEFS) {
        if (s.gameLevel >= def.minLevel && s.totalPizzasServed >= def.minPizzas) {
          best = def;
        }
      }
      return { title: best.title, icon: best.icon };
    },

    // === Batch 2 actions ===

    updateReputation: (success: boolean) => {
      const s = get();
      const delta = success ? 1 : -3;
      const newRep = Math.max(0, Math.min(100, s.reputation + delta));
      set({ reputation: newRep });
    },

    spawnQuickOrders: () => {
      const s = get();
      if (s.quickOrders.length >= 3 || s.gameLevel < 6) return;
      const types: { desc: string; icon: string; target: number; reward: number; time: number; type: "serve" | "earn" | "streak" }[] = [
        { desc: "Serve 3 pizzas", icon: "\u{1F355}", target: 3, reward: 80, time: 25, type: "serve" },
        { desc: "Serve 5 pizzas", icon: "\u{1F355}", target: 5, reward: 150, time: 35, type: "serve" },
        { desc: "Earn $150", icon: "\u{1F4B0}", target: 150, reward: 100, time: 30, type: "earn" },
        { desc: "Get 5x streak", icon: "\u{1F525}", target: 5, reward: 120, time: 40, type: "streak" },
      ];
      const t = types[Math.floor(Math.random() * types.length)];
      const order: QuickOrder = { id: Date.now(), description: t.desc, icon: t.icon, target: t.target, progress: 0, reward: t.reward, timeLimit: t.time, timeRemaining: t.time, type: t.type };
      set({ quickOrders: [...s.quickOrders, order] });
    },

    updateQuickOrders: (delta: number) => {
      const s = get();
      if (s.quickOrders.length === 0) return;
      let changed = false;
      const updated = s.quickOrders.filter(qo => {
        const newTime = qo.timeRemaining - delta;
        if (qo.progress >= qo.target) {
          changed = true;
          set({ money: s.money + qo.reward, totalMoneyEarned: s.totalMoneyEarned + qo.reward });
          get().addNotification(`Quick Order! +$${qo.reward}`, "\u{1F3AF}", "#22c55e");
          return false;
        }
        if (newTime <= 0) { changed = true; return false; }
        qo.timeRemaining = newTime;
        changed = true;
        return true;
      });
      if (changed) set({ quickOrders: updated });
    },

    completeQuickOrder: (id: number) => {
      const s = get();
      const updated = s.quickOrders.map(qo => qo.id === id ? { ...qo, progress: qo.progress + 1 } : qo);
      set({ quickOrders: updated });
    },

    updateNightShift: (delta: number) => {
      const s = get();
      const newTimer = s.nightShiftTimer + delta;
      // Night shift every 10 minutes, lasts 3 minutes
      const cycleLength = 600 + 180; // 10min + 3min
      const inCycle = newTimer % cycleLength;
      const shouldBeNight = inCycle >= 600;
      if (shouldBeNight !== s.isNightShift) {
        set({ isNightShift: shouldBeNight });
        if (shouldBeNight) get().addNotification("Night Shift! 2x Pay!", "\u{1F319}", "#6366f1");
        else get().addNotification("Day Shift Returns!", "\u2600\uFE0F", "#fbbf24");
      }
      set({ nightShiftTimer: newTimer });
    },

    initWeeklyChallenges: () => {
      const s = get();
      const week = getWeekStr();
      if (s.weeklyDate !== week) {
        set({ weeklyChallenges: generateWeeklyChallenges(), weeklyDate: week });
      }
    },

    updateWeeklyProgress: (type, amount) => {
      const s = get();
      const newChallenges = s.weeklyChallenges.map((c) => {
        if (c.completed || c.type !== type) return c;
        const newProgress = type === "streak" || type === "no_miss" ? Math.max(c.progress, amount) : c.progress + amount;
        if (newProgress >= c.target && !c.completed) {
          setTimeout(() => {
            const st = get();
            set({ money: st.money + c.reward, totalMoneyEarned: st.totalMoneyEarned + c.reward });
            get().addNotification(`Weekly Done! +$${c.reward}`, "\u{1F3C6}", "#a855f7");
            if (c.cosmeticReward && !st.unlockedColors.includes(c.cosmeticReward)) {
              set({ unlockedColors: [...st.unlockedColors, c.cosmeticReward] });
              get().addNotification("New Color Unlocked!", "\u{1F3A8}", "#ec4899");
            }
          }, 300);
          return { ...c, progress: newProgress, completed: true };
        }
        return { ...c, progress: newProgress };
      });
      set({ weeklyChallenges: newChallenges });
    },

    checkPersonalBests: () => {
      const s = get();
      const bests = { ...s.personalBests };
      let changed = false;
      const sessionEarnings = s.money - s.sessionStartMoney;
      if (sessionEarnings > bests.bestSessionEarnings) { bests.bestSessionEarnings = sessionEarnings; changed = true; }
      if (s.sessionPizzas > bests.bestSessionPizzas) { bests.bestSessionPizzas = s.sessionPizzas; changed = true; }
      if (s.currentNoMissStreak > bests.longestNoMiss) { bests.longestNoMiss = s.currentNoMissStreak; changed = true; }
      if (s.sessionMaxSingleEarning > bests.highestSingleEarning) { bests.highestSingleEarning = s.sessionMaxSingleEarning; changed = true; }
      if (s.sessionBestCombo > bests.bestCombo) { bests.bestCombo = s.sessionBestCombo; changed = true; }
      if (changed) {
        set({ personalBests: bests });
        get().addNotification("New Personal Best!", "\u{1F3C5}", "#fbbf24");
      }
    },

    spawnTreasure: () => {
      const s = get();
      if (s.hiddenTreasures.length >= 1) return;
      const x = 1 + Math.random() * 12;
      const z = -4 + Math.random() * 8;
      const reward = 50 + Math.floor(Math.random() * 150);
      set({ hiddenTreasures: [...s.hiddenTreasures, { id: Date.now(), position: [x, 0.15, z], spawnTime: Date.now(), reward }] });
    },

    collectTreasure: (id: number) => {
      const s = get();
      const t = s.hiddenTreasures.find(h => h.id === id);
      if (!t) return;
      set({
        hiddenTreasures: s.hiddenTreasures.filter(h => h.id !== id),
        money: s.money + t.reward,
        totalMoneyEarned: s.totalMoneyEarned + t.reward,
      });
      get().addNotification(`Treasure! +$${t.reward}`, "\u{1F4B0}", "#fbbf24");
      get().addDailyXP(20);
    },

    updateTreasures: (delta: number) => {
      const s = get();
      const now = Date.now();
      const alive = s.hiddenTreasures.filter(t => now - t.spawnTime < 10000);
      if (alive.length !== s.hiddenTreasures.length) set({ hiddenTreasures: alive });
    },

    addCustomerRating: (tableId: number, patienceRatio: number) => {
      const s = get();
      let rating = 1;
      let emoji = "\u{1F44D}";
      if (patienceRatio > 0.75) { rating = 3; emoji = "\u2B50"; }
      else if (patienceRatio > 0.4) { rating = 2; emoji = "\u2764\uFE0F"; }
      const r: CustomerRating = { tableId, rating, emoji, time: Date.now() };
      set({
        recentRatings: [...s.recentRatings.slice(-9), r],
        totalRatings: s.totalRatings + 1,
        totalRatingScore: s.totalRatingScore + rating,
      });
    },

    saveSessionRecord: () => {
      const s = get();
      const record: SessionRecord = {
        date: new Date().toISOString().slice(0, 16),
        earnings: s.money - s.sessionStartMoney,
        pizzas: s.sessionPizzas,
        bestStreak: s.bestStreak,
        duration: Math.floor((Date.now() - s.gameStartTime) / 1000),
      };
      set({ sessionHistory: [...s.sessionHistory.slice(-4), record] });
    },

    setCustomGoal: (goal) => set({ customGoal: goal }),

    addDailyXP: (amount: number) => {
      const s = get();
      const newXP = s.dailyXP + amount;
      set({ dailyXP: newXP });
    },

    claimDailyReward: () => {
      const s = get();
      if (s.dailyXP < s.dailyXPTarget) return;
      const rewards = [50, 100, 150, 200, 1]; // last is skill point
      const rewardIdx = Math.min(s.dailyRewardsClaimed, rewards.length - 1);
      const reward = rewards[rewardIdx];
      if (rewardIdx < rewards.length - 1) {
        set({ money: s.money + reward, totalMoneyEarned: s.totalMoneyEarned + reward });
        get().addNotification(`Daily Reward! +$${reward}`, "\u{1F381}", "#22c55e");
      } else {
        set({ skillPoints: s.skillPoints + 1 });
        get().addNotification("Daily Reward! +1 Skill Point", "\u{1F381}", "#a855f7");
      }
      set({ dailyXP: s.dailyXP - s.dailyXPTarget, dailyRewardsClaimed: s.dailyRewardsClaimed + 1, dailyXPTarget: Math.floor(s.dailyXPTarget * 1.2) });
    },

    setRestaurantTheme: (id) => {
      set({ restaurantThemeId: id });
    },

    unlockTheme: (id) => {
      const s = get();
      const def = RESTAURANT_THEMES.find(t => t.id === id);
      if (!def || s.money < def.cost || s.unlockedThemes.includes(id)) return false;
      set({ money: s.money - def.cost, unlockedThemes: [...s.unlockedThemes, id] });
      return true;
    },
  })),
  {
    name: "pizza-factory-save",
    partialize: (state) => ({
      money: state.money,
      totalMoneyEarned: state.totalMoneyEarned,
      totalPizzasServed: state.totalPizzasServed,
      missedCustomers: state.missedCustomers,
      bestStreak: state.bestStreak,
      gameLevel: state.gameLevel,
      levelProgress: state.levelProgress,
      pizzasForNextLevel: state.pizzasForNextLevel,
      playerSpeed: state.playerSpeed,
      maxCarry: state.maxCarry,
      ovenCookTime: state.ovenCookTime,
      ovenCoolTime: state.ovenCoolTime,
      doughSpawnInterval: state.doughSpawnInterval,
      prepWorkTime: state.prepWorkTime,
      cashPerPizza: state.cashPerPizza,
      customerSpawnInterval: state.customerSpawnInterval,
      upgrades: state.upgrades,
      achievements: state.achievements,
      dailyChallenges: state.dailyChallenges,
      dailyDate: state.dailyDate,
      dailyStreak: state.dailyStreak,
      tutorialDone: state.tutorialDone,
      prestigeLevel: state.prestigeLevel,
      prestigeMultiplier: state.prestigeMultiplier,
      playerColor: state.playerColor,
      playerHat: state.playerHat,
      unlockedHats: state.unlockedHats,
      unlockedColors: state.unlockedColors,
      levelStars: state.levelStars,
      skillPoints: state.skillPoints,
      skills: state.skills,
      zoneVisits: state.zoneVisits,
      reputation: state.reputation,
      weeklyChallenges: state.weeklyChallenges,
      weeklyDate: state.weeklyDate,
      personalBests: state.personalBests,
      totalRatings: state.totalRatings,
      totalRatingScore: state.totalRatingScore,
      sessionHistory: state.sessionHistory,
      customGoal: state.customGoal,
      dailyXP: state.dailyXP,
      dailyXPTarget: state.dailyXPTarget,
      dailyRewardsClaimed: state.dailyRewardsClaimed,
      restaurantThemeId: state.restaurantThemeId,
      unlockedThemes: state.unlockedThemes,
      // Save counts to reconstruct ovens/employees/tables on load
      _savedOvenCount: state.ovens.length,
      _savedPrepCount: state.prepEmployees.length,
      _savedUnlockedTables: state.tables.filter((t) => t.unlocked).length,
    }),
    onRehydrateStorage: () => (state) => {
      if (!state) return;
      const s = state as any;
      // Reconstruct ovens based on saved count
      if (s._savedOvenCount && s._savedOvenCount > 1) {
        const ovens: OvenState[] = [];
        for (let i = 0; i < s._savedOvenCount; i++) {
          ovens.push({ id: i, hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 });
        }
        state.ovens = ovens;
      }
      // Reconstruct prep employees
      if (s._savedPrepCount && s._savedPrepCount > 1) {
        const emps: PrepEmployee[] = [];
        for (let i = 0; i < s._savedPrepCount; i++) {
          emps.push({ id: i, hasPizza: false, isWorking: false, workProgress: 0, pizzaReady: false });
        }
        state.prepEmployees = emps;
      }
      // Reconstruct unlocked tables
      if (s._savedUnlockedTables && s._savedUnlockedTables > 1) {
        const tables = createTables();
        for (let i = 0; i < Math.min(s._savedUnlockedTables, tables.length); i++) {
          tables[i].unlocked = true;
        }
        state.tables = tables;
      }
    },
  }
  )
);
