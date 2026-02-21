import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "paused";
export type ItemType = "none" | "dough" | "pizza_raw" | "pizza_ready";

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

  upgrades: {
    speed: UpgradeInfo;
    capacity: UpgradeInfo;
    ovenSpeed: UpgradeInfo;
    prepEmployee: UpgradeInfo;
    newTable: UpgradeInfo;
    doughSpeed: UpgradeInfo;
    newOven: UpgradeInfo;
  };

  startGame: () => void;

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
}

const TABLE_POSITIONS: [number, number, number][] = [
  [12, 0, -4.5],
  [12, 0, -1.5],
  [12, 0, 1.5],
  [15.5, 0, -4.5],
  [15.5, 0, -1.5],
  [15.5, 0, 1.5],
];

export const OVEN_POSITIONS: [number, number, number][] = [
  [1, 0, 0],
  [1, 0, 2.8],
  [1, 0, 5.2],
];

function createTables(): CustomerTable[] {
  return TABLE_POSITIONS.map((pos, i) => ({
    id: i,
    position: pos,
    unlocked: i < 1,
    hasCustomer: false,
    customerTimer: 0,
    customerMaxTime: 15,
    served: false,
  }));
}

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
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    money: 0,
    totalMoneyEarned: 0,
    totalPizzasServed: 0,
    missedCustomers: 0,

    carrying: "none",
    carryCount: 0,
    maxCarry: 1,

    playerSpeed: 4,

    doughReady: 3,
    maxDough: 8,
    doughSpawnInterval: 3,

    ovens: createOvens(),
    ovenCookTime: 4,
    ovenCoolTime: 8,

    prepEmployees: createPrepEmployees(),
    prepWorkTime: 6,

    tables: createTables(),
    customerSpawnInterval: 5,
    customerPatience: 15,
    cashPerPizza: 30,

    streak: 0,
    bestStreak: 0,
    lastServeTime: 0,
    streakTimeout: 8,

    gameLevel: 1,
    levelProgress: 0,
    pizzasForNextLevel: 5,

    upgrades: {
      speed: { level: 0, cost: 40, baseCost: 40, maxLevel: 10 },
      capacity: { level: 0, cost: 200, baseCost: 200, maxLevel: 3 },
      ovenSpeed: { level: 0, cost: 60, baseCost: 60, maxLevel: 8 },
      prepEmployee: { level: 0, cost: 150, baseCost: 150, maxLevel: 2 },
      newTable: { level: 0, cost: 100, baseCost: 100, maxLevel: 5 },
      doughSpeed: { level: 0, cost: 50, baseCost: 50, maxLevel: 8 },
      newOven: { level: 0, cost: 250, baseCost: 250, maxLevel: 2 },
    },

    startGame: () => set({ phase: "playing" }),

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
      const cash = s.cashPerPizza + streakBonus * 5;

      const newServed = s.totalPizzasServed + 1;
      const newProgress = s.levelProgress + 1;
      let newLevel = s.gameLevel;
      let newPizzasForNext = s.pizzasForNextLevel;
      let progress = newProgress;

      if (newProgress >= s.pizzasForNextLevel) {
        newLevel = s.gameLevel + 1;
        progress = 0;
        newPizzasForNext = Math.floor(s.pizzasForNextLevel * 1.4);
      }

      set({
        carrying: s.carryCount > 1 ? "pizza_ready" : "none",
        carryCount: s.carryCount - 1,
        tables: newTables,
        money: s.money + cash,
        totalMoneyEarned: s.totalMoneyEarned + cash,
        totalPizzasServed: newServed,
        streak: s.streak + 1,
        bestStreak: Math.max(s.bestStreak, s.streak + 1),
        lastServeTime: Date.now(),
        gameLevel: newLevel,
        levelProgress: progress,
        pizzasForNextLevel: newPizzasForNext,
        cashPerPizza: 30 + (newLevel - 1) * 5,
        customerSpawnInterval: Math.max(2, 5 - (newLevel - 1) * 0.3),
      });
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
      const patience = Math.max(8, s.customerPatience - (s.gameLevel - 1) * 0.5);
      newTables[emptyTable.id] = {
        ...emptyTable,
        hasCustomer: true,
        customerTimer: 0,
        customerMaxTime: patience,
        served: false,
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
        updates.playerSpeed = 4 + newLevel * 0.7;
      } else if (type === "capacity") {
        updates.maxCarry = 1 + newLevel;
      } else if (type === "ovenSpeed") {
        updates.ovenCookTime = Math.max(1, 4 - newLevel * 0.3);
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
        updates.doughSpawnInterval = Math.max(1, 3 - newLevel * 0.25);
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
      }

      set(updates);
      return true;
    },
  }))
);
