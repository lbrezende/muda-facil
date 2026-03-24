import type { TruckGridDims, ItemGridSize, PlacedItem3D } from './cargo-types';

export const CELL_SIZE_CM = 10; // 1 grid cell = 10cm

/** Convert cm to grid units */
export function cmToGrid(cm: number): number {
  return Math.ceil(cm / CELL_SIZE_CM);
}

/** Convert grid units to Three.js units (1 unit = 10cm = 0.1m) */
export function gridToWorld(gridUnits: number): number {
  return gridUnits; // 1 grid unit = 1 Three.js unit (we scale the scene)
}

/** Create truck grid dimensions from Caminhao model */
export function createTruckGrid(larguraCm: number, alturaCm: number, comprimentoCm: number): TruckGridDims {
  return {
    gw: cmToGrid(larguraCm),
    gh: cmToGrid(alturaCm),
    gd: cmToGrid(comprimentoCm),
    larguraCm,
    alturaCm,
    comprimentoCm,
  };
}

/** Get item size in grid cells */
export function getItemGridSize(larguraCm: number, alturaCm: number, profundidadeCm: number, rotated: boolean = false): ItemGridSize {
  const w = rotated ? profundidadeCm : larguraCm;
  const d = rotated ? larguraCm : profundidadeCm;
  return {
    gw: cmToGrid(w),
    gh: cmToGrid(alturaCm), // height never changes with rotation
    gd: cmToGrid(d),
  };
}

/** Generate occupancy grid cell key */
function cellKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

/** Build occupancy set from placed items */
export function buildOccupancyGrid(items: PlacedItem3D[]): Set<string> {
  const grid = new Set<string>();
  for (const item of items) {
    for (let x = item.gx; x < item.gx + item.gw; x++) {
      for (let y = item.gy; y < item.gy + item.gh; y++) {
        for (let z = item.gz; z < item.gz + item.gd; z++) {
          grid.add(cellKey(x, y, z));
        }
      }
    }
  }
  return grid;
}

/** Check if an item can be placed at the given position */
export function canPlace(
  grid: Set<string>,
  gx: number, gy: number, gz: number,
  gw: number, gh: number, gd: number,
  truck: TruckGridDims
): boolean {
  // Check bounds
  if (gx < 0 || gy < 0 || gz < 0) return false;
  if (gx + gw > truck.gw) return false;
  if (gy + gh > truck.gh) return false;
  if (gz + gd > truck.gd) return false;

  // Check collisions
  for (let x = gx; x < gx + gw; x++) {
    for (let y = gy; y < gy + gh; y++) {
      for (let z = gz; z < gz + gd; z++) {
        if (grid.has(cellKey(x, y, z))) return false;
      }
    }
  }
  return true;
}

/** Find the lowest Y where item can rest (gravity) */
export function findDropY(
  grid: Set<string>,
  gx: number, gz: number,
  gw: number, gh: number, gd: number,
  truck: TruckGridDims
): number {
  // Start from floor (y=0) and go up until we find a valid position
  for (let y = 0; y <= truck.gh - gh; y++) {
    if (canPlace(grid, gx, y, gz, gw, gh, gd, truck)) {
      return y;
    }
  }
  return -1; // doesn't fit
}

/** Add an item's cells to the occupancy grid (returns new Set) */
export function addToGrid(
  grid: Set<string>,
  gx: number, gy: number, gz: number,
  gw: number, gh: number, gd: number
): Set<string> {
  const newGrid = new Set(grid);
  for (let x = gx; x < gx + gw; x++) {
    for (let y = gy; y < gy + gh; y++) {
      for (let z = gz; z < gz + gd; z++) {
        newGrid.add(cellKey(x, y, z));
      }
    }
  }
  return newGrid;
}

/** Remove an item's cells from the occupancy grid (returns new Set) */
export function removeFromGrid(
  grid: Set<string>,
  gx: number, gy: number, gz: number,
  gw: number, gh: number, gd: number
): Set<string> {
  const newGrid = new Set(grid);
  for (let x = gx; x < gx + gw; x++) {
    for (let y = gy; y < gy + gh; y++) {
      for (let z = gz; z < gz + gd; z++) {
        newGrid.delete(cellKey(x, y, z));
      }
    }
  }
  return newGrid;
}

/** Snap a world position to grid coordinates */
export function snapToGrid(worldX: number, worldZ: number, gw: number, gd: number, truck: TruckGridDims): { gx: number; gz: number } {
  let gx = Math.round(worldX);
  let gz = Math.round(worldZ);
  // Clamp to truck bounds
  gx = Math.max(0, Math.min(gx, truck.gw - gw));
  gz = Math.max(0, Math.min(gz, truck.gd - gd));
  return { gx, gz };
}
