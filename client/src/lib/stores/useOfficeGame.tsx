import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "paused";

export interface Employee {
  id: number;
  position: [number, number, number];
  hasPaper: boolean;
  isWorking: boolean;
  workProgress: number;
  cashReady: boolean;
  unlocked: boolean;
}

export interface UpgradeInfo {
  level: number;
  cost: number;
  baseCost: number;
}

interface OfficeGameState {
  phase: GamePhase;
  money: number;
  totalMoneyEarned: number;
  papersCarried: number;
  maxPapers: number;
  playerSpeed: number;
  printerPapers: number;
  maxPrinterPapers: number;
  printerCooldown: number;
  employees: Employee[];

  upgrades: {
    speed: UpgradeInfo;
    capacity: UpgradeInfo;
    printerSpeed: UpgradeInfo;
    newDesk: UpgradeInfo;
  };

  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;

  collectPapers: () => number;
  deliverPaper: (employeeId: number) => boolean;
  collectCash: (employeeId: number) => number;
  employeeFinishWork: (employeeId: number) => void;
  spawnPrinterPaper: () => void;

  buyUpgrade: (type: "speed" | "capacity" | "printerSpeed" | "newDesk") => boolean;
}

const DESK_POSITIONS: [number, number, number][] = [
  [4, 0, -2],
  [4, 0, 2],
  [8, 0, -2],
  [8, 0, 2],
  [12, 0, -2],
  [12, 0, 2],
];

const CASH_PER_PAPER = 25;

function createEmployees(): Employee[] {
  return DESK_POSITIONS.map((pos, i) => ({
    id: i,
    position: pos,
    hasPaper: false,
    isWorking: false,
    workProgress: 0,
    cashReady: false,
    unlocked: i < 2,
  }));
}

export const useOfficeGame = create<OfficeGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    money: 0,
    totalMoneyEarned: 0,
    papersCarried: 0,
    maxPapers: 3,
    playerSpeed: 4,
    printerPapers: 5,
    maxPrinterPapers: 10,
    printerCooldown: 0,
    employees: createEmployees(),

    upgrades: {
      speed: { level: 0, cost: 50, baseCost: 50 },
      capacity: { level: 0, cost: 75, baseCost: 75 },
      printerSpeed: { level: 0, cost: 100, baseCost: 100 },
      newDesk: { level: 0, cost: 200, baseCost: 200 },
    },

    startGame: () => set({ phase: "playing" }),
    pauseGame: () => set({ phase: "paused" }),
    resumeGame: () => set({ phase: "playing" }),

    collectPapers: () => {
      const state = get();
      const canCarry = state.maxPapers - state.papersCarried;
      const toCollect = Math.min(canCarry, state.printerPapers);
      if (toCollect > 0) {
        set({
          papersCarried: state.papersCarried + toCollect,
          printerPapers: state.printerPapers - toCollect,
        });
      }
      return toCollect;
    },

    deliverPaper: (employeeId: number) => {
      const state = get();
      if (state.papersCarried <= 0) return false;
      const emp = state.employees[employeeId];
      if (!emp || !emp.unlocked || emp.hasPaper || emp.isWorking || emp.cashReady) return false;

      const newEmployees = [...state.employees];
      newEmployees[employeeId] = {
        ...emp,
        hasPaper: true,
        isWorking: true,
        workProgress: 0,
      };
      set({
        papersCarried: state.papersCarried - 1,
        employees: newEmployees,
      });
      return true;
    },

    employeeFinishWork: (employeeId: number) => {
      const state = get();
      const emp = state.employees[employeeId];
      if (!emp) return;
      const newEmployees = [...state.employees];
      newEmployees[employeeId] = {
        ...emp,
        hasPaper: false,
        isWorking: false,
        workProgress: 1,
        cashReady: true,
      };
      set({ employees: newEmployees });
    },

    collectCash: (employeeId: number) => {
      const state = get();
      const emp = state.employees[employeeId];
      if (!emp || !emp.cashReady) return 0;
      const cash = CASH_PER_PAPER;
      const newEmployees = [...state.employees];
      newEmployees[employeeId] = {
        ...emp,
        cashReady: false,
        workProgress: 0,
      };
      set({
        employees: newEmployees,
        money: state.money + cash,
        totalMoneyEarned: state.totalMoneyEarned + cash,
      });
      return cash;
    },

    spawnPrinterPaper: () => {
      const state = get();
      if (state.printerPapers < state.maxPrinterPapers) {
        set({ printerPapers: state.printerPapers + 1 });
      }
    },

    buyUpgrade: (type) => {
      const state = get();
      const upgrade = state.upgrades[type];
      if (state.money < upgrade.cost) return false;

      const newUpgrades = { ...state.upgrades };
      const newCost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level + 1));
      newUpgrades[type] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: newCost,
      };

      const updates: Partial<OfficeGameState> = {
        money: state.money - upgrade.cost,
        upgrades: newUpgrades,
      };

      if (type === "speed") {
        updates.playerSpeed = 4 + (upgrade.level + 1) * 0.8;
      } else if (type === "capacity") {
        updates.maxPapers = 3 + (upgrade.level + 1);
      } else if (type === "printerSpeed") {
        updates.maxPrinterPapers = 10 + (upgrade.level + 1) * 3;
      } else if (type === "newDesk") {
        const nextDeskIndex = state.employees.findIndex((e) => !e.unlocked);
        if (nextDeskIndex >= 0) {
          const newEmployees = [...state.employees];
          newEmployees[nextDeskIndex] = {
            ...newEmployees[nextDeskIndex],
            unlocked: true,
          };
          updates.employees = newEmployees;
        }
      }

      set(updates as any);
      return true;
    },
  }))
);
