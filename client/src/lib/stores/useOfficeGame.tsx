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

  oven: OvenState;
  ovenCookTime: number;
  ovenCoolTime: number;

  prepEmployees: PrepEmployee[];
  prepWorkTime: number;

  tables: CustomerTable[];
  customerSpawnInterval: number;
  customerPatience: number;
  cashPerPizza: number;

  upgrades: {
    speed: UpgradeInfo;
    capacity: UpgradeInfo;
    ovenSpeed: UpgradeInfo;
    prepEmployee: UpgradeInfo;
    newTable: UpgradeInfo;
    doughSpeed: UpgradeInfo;
  };

  startGame: () => void;

  pickupDough: () => boolean;
  placeDoughInOven: () => boolean;
  pickupFromOven: () => boolean;
  deliverToPrep: (empId: number) => boolean;
  pickupFromPrep: (empId: number) => boolean;
  deliverToTable: (tableId: number) => boolean;

  updateOven: (delta: number) => void;
  updatePrepEmployee: (empId: number, delta: number) => void;
  spawnDough: () => void;
  spawnCustomer: () => void;
  updateCustomerTimers: (delta: number) => void;

  buyUpgrade: (type: keyof PizzaGameState["upgrades"]) => boolean;
}

const TABLE_POSITIONS: [number, number, number][] = [
  [12, 0, -4],
  [12, 0, -1.5],
  [12, 0, 1],
  [15, 0, -4],
  [15, 0, -1.5],
  [15, 0, 1],
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

    oven: {
      hasDough: false,
      isCooking: false,
      cookProgress: 0,
      pizzaReady: false,
      pizzaCooling: 0,
    },
    ovenCookTime: 4,
    ovenCoolTime: 8,

    prepEmployees: createPrepEmployees(),
    prepWorkTime: 6,

    tables: createTables(),
    customerSpawnInterval: 5,
    customerPatience: 15,
    cashPerPizza: 30,

    upgrades: {
      speed: { level: 0, cost: 40, baseCost: 40, maxLevel: 10 },
      capacity: { level: 0, cost: 200, baseCost: 200, maxLevel: 3 },
      ovenSpeed: { level: 0, cost: 60, baseCost: 60, maxLevel: 8 },
      prepEmployee: { level: 0, cost: 150, baseCost: 150, maxLevel: 2 },
      newTable: { level: 0, cost: 100, baseCost: 100, maxLevel: 5 },
      doughSpeed: { level: 0, cost: 50, baseCost: 50, maxLevel: 8 },
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

    placeDoughInOven: () => {
      const s = get();
      if (s.carrying !== "dough" || s.carryCount <= 0) return false;
      if (s.oven.hasDough || s.oven.isCooking || s.oven.pizzaReady) return false;
      set({
        carrying: s.carryCount > 1 ? "dough" : "none",
        carryCount: s.carryCount - 1,
        oven: { hasDough: true, isCooking: true, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 },
      });
      return true;
    },

    pickupFromOven: () => {
      const s = get();
      if (s.carrying !== "none") return false;
      if (!s.oven.pizzaReady) return false;
      set({
        carrying: "pizza_raw",
        carryCount: 1,
        oven: { hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 },
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
      const cash = s.cashPerPizza;
      set({
        carrying: s.carryCount > 1 ? "pizza_ready" : "none",
        carryCount: s.carryCount - 1,
        tables: newTables,
        money: s.money + cash,
        totalMoneyEarned: s.totalMoneyEarned + cash,
        totalPizzasServed: s.totalPizzasServed + 1,
      });
      return true;
    },

    updateOven: (delta: number) => {
      const s = get();
      if (!s.oven.isCooking) {
        if (s.oven.pizzaReady) {
          const newCooling = s.oven.pizzaCooling + delta;
          if (newCooling >= s.ovenCoolTime) {
            set({ oven: { hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: false, pizzaCooling: 0 } });
          } else {
            set({ oven: { ...s.oven, pizzaCooling: newCooling } });
          }
        }
        return;
      }
      const newProgress = s.oven.cookProgress + delta;
      if (newProgress >= s.ovenCookTime) {
        set({
          oven: { hasDough: false, isCooking: false, cookProgress: 0, pizzaReady: true, pizzaCooling: 0 },
        });
      } else {
        set({ oven: { ...s.oven, cookProgress: newProgress } });
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
      newTables[emptyTable.id] = {
        ...emptyTable,
        hasCustomer: true,
        customerTimer: 0,
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
        if (newTimer >= s.customerPatience) {
          changed = true;
          missed++;
          return { ...t, hasCustomer: false, customerTimer: 0, served: false };
        }
        changed = true;
        return { ...t, customerTimer: newTimer };
      });
      if (changed) {
        set({ tables: newTables, missedCustomers: s.missedCustomers + missed });
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
      }

      set(updates);
      return true;
    },
  }))
);
