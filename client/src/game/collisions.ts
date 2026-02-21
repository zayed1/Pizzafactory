import { OVEN_POSITIONS } from "../lib/stores/useOfficeGame";

export interface CollisionBox {
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
}

const PLAYER_RADIUS = 0.25;

const STATIC_COLLISIONS: CollisionBox[] = [
  { xMin: 1 - 0.8, xMax: 1 + 1.4, zMin: -5 - 0.5, zMax: -5 + 0.5 },

  { xMin: 5 - 0.9, xMax: 5 + 0.9, zMin: -6 - 0.6, zMax: -6 + 0.6 },
  { xMin: 7.5 - 0.9, xMax: 7.5 + 0.9, zMin: -6 - 0.6, zMax: -6 + 0.6 },
  { xMin: 10 - 0.9, xMax: 10 + 0.9, zMin: -6 - 0.6, zMax: -6 + 0.6 },

  { xMin: -2.3 - 0.4, xMax: -2.3 + 0.4, zMin: -7.5 - 0.4, zMax: -7.5 + 0.4 },
  { xMin: -2.3 - 0.4, xMax: -2.3 + 0.4, zMin: 5 - 0.4, zMax: 5 + 0.4 },

  { xMin: 3.5 - 0.15, xMax: 3.5 + 0.15, zMin: -3 - 0.5, zMax: -3 + 0.5 },
  { xMin: 3.5 - 0.15, xMax: 3.5 + 0.15, zMin: -1 - 0.5, zMax: -1 + 0.5 },
  { xMin: 3.5 - 0.15, xMax: 3.5 + 0.15, zMin: 1 - 0.5, zMax: 1 + 0.5 },
];

export function getOvenCollisions(ovenCount: number): CollisionBox[] {
  const boxes: CollisionBox[] = [];
  for (let i = 0; i < ovenCount; i++) {
    const pos = OVEN_POSITIONS[i];
    if (pos) {
      boxes.push({
        xMin: pos[0] - 0.8,
        xMax: pos[0] + 0.8,
        zMin: pos[2] - 0.7,
        zMax: pos[2] + 0.7,
      });
    }
  }
  return boxes;
}

export function getTableCollisions(tables: { position: [number, number, number]; unlocked: boolean }[]): CollisionBox[] {
  return tables.filter(t => t.unlocked).map(t => ({
    xMin: t.position[0] - 0.6,
    xMax: t.position[0] + 0.6,
    zMin: t.position[2] - 0.1,
    zMax: t.position[2] + 1.2,
  }));
}

export function resolveCollision(
  currentX: number,
  currentZ: number,
  newX: number,
  newZ: number,
  tables: { position: [number, number, number]; unlocked: boolean }[],
  ovenCount: number
): [number, number] {
  const allBoxes = [...STATIC_COLLISIONS, ...getOvenCollisions(ovenCount), ...getTableCollisions(tables)];

  let resolvedX = newX;
  let resolvedZ = newZ;

  for (const box of allBoxes) {
    const bxMin = box.xMin - PLAYER_RADIUS;
    const bxMax = box.xMax + PLAYER_RADIUS;
    const bzMin = box.zMin - PLAYER_RADIUS;
    const bzMax = box.zMax + PLAYER_RADIUS;

    if (resolvedX > bxMin && resolvedX < bxMax && resolvedZ > bzMin && resolvedZ < bzMax) {
      const overlapLeft = resolvedX - bxMin;
      const overlapRight = bxMax - resolvedX;
      const overlapTop = resolvedZ - bzMin;
      const overlapBottom = bzMax - resolvedZ;

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapLeft) {
        resolvedX = bxMin;
      } else if (minOverlap === overlapRight) {
        resolvedX = bxMax;
      } else if (minOverlap === overlapTop) {
        resolvedZ = bzMin;
      } else {
        resolvedZ = bzMax;
      }
    }
  }

  return [resolvedX, resolvedZ];
}
