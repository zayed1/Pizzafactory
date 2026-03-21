import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "paused";
export type CustomerMood = "happy" | "neutral" | "worried" | "angry";
export type ItemType = "none" | "dough" | "pizza_raw" | "pizza_ready";
export type CustomerType = "normal" | "vip" | "patient" | "rush" | "tipper";

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
];

function createPrepEmployees(): PrepEmployee[] {
  return [
    { id: 0, hasPizza: false, isWorking: false, workProgress: 0, pizzaReady: false },
  ];
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

    startGame: () => set({ phase: "playing", gameStartTime: Date.now() }),

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
      newTables[tableId] = { ...table, served: true, hasCustomer: false, customerTimer: 0 };

      const streakBonus = Math.min(s.streak, 10);
      let cash = s.cashPerPizza + streakBonus * 5;

      // Customer type bonuses
      if (table.customerType === "vip") cash = Math.floor(cash * 2.5);
      else if (table.customerType === "rush") cash = Math.floor(cash * 1.5);
      else if (table.customerType === "tipper") cash += Math.floor(Math.random() * 20) + 10;

      // Active event bonuses
      if (s.activeEvent?.type === "double_pay") cash *= 2;
      if (s.activeEvent?.type === "tips_rain") cash += 15;

      // Combo bonus (deliver multiple within 3s)
      const now = Date.now();
      const comboActive = now - s.comboTimer < 3000;
      const newCombo = comboActive ? s.comboCount + 1 : 1;
      if (newCombo >= 3) cash += newCombo * 8;

      // Speed bonus - deliver before half patience
      const patienceRatio = 1 - table.customerTimer / table.customerMaxTime;
      if (patienceRatio > 0.75) cash += 10;

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
      };

      if (leveledUp) {
        updates.showLevelUp = true;
        updates.levelUpLevel = newLevel;
      }

      set(updates);

      // Check achievements after delivery
      setTimeout(() => get().checkAchievements(), 100);

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
      const newProgress = emp.workProgress + delta;
      if (newProgress >= s.prepWorkTime) {
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
      const patience = Math.max(14, s.customerPatience - (s.gameLevel - 1) * 0.4);
      const custColor = CUSTOMER_COLORS[Math.floor(Math.random() * CUSTOMER_COLORS.length)];
      const hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];

      // Determine customer type based on level and randomness
      let custType: CustomerType = "normal";
      const roll = Math.random();
      if (s.gameLevel >= 2) {
        if (roll < 0.08) custType = "vip";        // 8% VIP (pays 2.5x)
        else if (roll < 0.18) custType = "tipper"; // 10% tipper (random bonus)
        else if (roll < 0.28) custType = "patient";// 10% patient (1.5x patience)
        else if (roll < 0.38) custType = "rush";   // 10% rush (0.6x patience, 1.5x pay)
      }

      // Rush hour event doubles spawn rate effect
      let adjustedPatience = patience;
      if (custType === "patient") adjustedPatience *= 1.5;
      else if (custType === "rush") adjustedPatience *= 0.6;

      newTables[emptyTable.id] = {
        ...emptyTable,
        hasCustomer: true,
        customerTimer: 0,
        customerMaxTime: adjustedPatience,
        served: false,
        customerColor: custType === "vip" ? "#fbbf24" : custColor,
        customerHairColor: hairColor,
        customerType: custType,
      };
      set({ tables: newTables });
    },

    updateCustomerTimers: (delta: number) => {
      const s = get();
      let changed = false;
      let missed = 0;
      const newTables = s.tables.map((t) => {
        if (!t.hasCustomer) {
          if (t.served) {
            changed = true;
            return { ...t, served: false };
          }
          return t;
        }
        const newTimer = t.customerTimer + delta;
        if (newTimer >= t.customerMaxTime) {
          changed = true;
          missed++;
          return { ...t, hasCustomer: false, customerTimer: 0, served: false };
        }
        changed = true;
        return { ...t, customerTimer: newTimer };
      });
      if (changed) {
        const updates: any = { tables: newTables, missedCustomers: s.missedCustomers + missed };
        if (missed > 0) {
          updates.streak = 0;
        }
        set(updates);
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
