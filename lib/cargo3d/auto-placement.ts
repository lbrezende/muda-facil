import type { PlacedItem3D, TruckGridDims } from './cargo-types';
import {
  getItemGridSize,
  createTruckGrid,
  canPlace,
  addToGrid,
  findDropY,
} from './grid-system';

// ─── Shared types ──────────────────────────────────────────────────────────────

export interface CatalogItemForPlacement {
  id: string;
  nome: string;
  categoria: string;
  larguraCm: number;
  alturaCm: number;
  profundidadeCm: number;
  pesoKg: number;
  volumeM3: number;
}

export interface TruckConfigForPlacement {
  id: string;
  nome: string;
  larguraCm: number;
  alturaCm: number;
  comprimentoCm: number;
  capacidadeM3: number;
  capacidadeKg: number;
}

export interface TruckLoad {
  truckIndex: number;
  items: PlacedItem3D[];
  occupancyPercent: number;
}

// ─── Stackability ──────────────────────────────────────────────────────────────

// Only boxes and soft bags may be placed on top of other items.
// Everything else must rest directly on the floor (gy === 0).
const STACKABLE_PATTERNS = [
  'caixa p',
  'caixa m',
  'caixa g',
  'caixa de livros',
  'saco de roupa',
  'mala grande',
  // seed ids
  'caixa-p',
  'caixa-m',
  'caixa-g',
  'caixa-de-livros',
  'mala-grande',
  'saco-de-roupa',
  // CAIXAS categoria shorthand
];

function isStackable(item: CatalogItemForPlacement): boolean {
  const nomeLower = item.nome.toLowerCase();
  const idLower = item.id.toLowerCase();
  if (item.categoria === 'CAIXAS') return true;
  return STACKABLE_PATTERNS.some(
    (p) => nomeLower.includes(p) || idLower.includes(p),
  );
}

// ─── Room → item mapping ───────────────────────────────────────────────────────

// Maps room type keys to the typical items found in that room, using the exact
// names present in prisma/seed.ts and furniture-catalog.ts.
const ROOM_ITEMS: Record<string, Array<{ nome: string; quantidade: number }>> = {
  QUARTO: [
    { nome: 'Cama casal', quantidade: 1 },
    { nome: 'Guarda-roupa 4 portas', quantidade: 1 },
    { nome: 'Criado-mudo', quantidade: 2 },
    { nome: 'Cômoda', quantidade: 1 },
    { nome: 'Caixa M', quantidade: 4 },
  ],
  QUARTO_SOLTEIRO: [
    { nome: 'Cama solteiro', quantidade: 1 },
    { nome: 'Guarda-roupa 2 portas', quantidade: 1 },
    { nome: 'Criado-mudo', quantidade: 1 },
    { nome: 'Caixa M', quantidade: 2 },
  ],
  SALA: [
    { nome: 'Sofá 3 lugares', quantidade: 1 },
    { nome: 'Rack de TV', quantidade: 1 },
    { nome: 'Mesa de centro', quantidade: 1 },
    { nome: 'Poltrona', quantidade: 1 },
    { nome: 'Caixa M', quantidade: 2 },
  ],
  COZINHA: [
    { nome: 'Geladeira', quantidade: 1 },
    { nome: 'Fogão 4 bocas', quantidade: 1 },
    { nome: 'Microondas', quantidade: 1 },
    { nome: 'Mesa 4 lugares', quantidade: 1 },
    { nome: 'Cadeira', quantidade: 4 },
    { nome: 'Caixa M', quantidade: 3 },
  ],
  BANHEIRO: [
    { nome: 'Caixa P', quantidade: 2 },
  ],
  ESCRITORIO: [
    { nome: 'Mesa de escritório', quantidade: 1 },
    { nome: 'Cadeira de escritório', quantidade: 1 },
    { nome: 'Estante de livros', quantidade: 1 },
    { nome: 'Caixa de livros', quantidade: 3 },
  ],
  AREA_SERVICO: [
    { nome: 'Máquina de lavar', quantidade: 1 },
    { nome: 'Caixa P', quantidade: 1 },
  ],
};

// Default dimensions used when an item cannot be found in the catalog, keyed by
// lowercase item name. These come from the seed data so they are consistent.
const DEFAULT_DIMS: Record<string, Pick<CatalogItemForPlacement, 'larguraCm' | 'alturaCm' | 'profundidadeCm' | 'pesoKg' | 'volumeM3'>> = {
  'cama casal':          { larguraCm: 140, alturaCm: 45,  profundidadeCm: 190, pesoKg: 35,  volumeM3: 1.20 },
  'cama solteiro':       { larguraCm: 90,  alturaCm: 45,  profundidadeCm: 190, pesoKg: 25,  volumeM3: 0.77 },
  'guarda-roupa 4 portas':{ larguraCm: 200, alturaCm: 200, profundidadeCm: 55, pesoKg: 90, volumeM3: 2.20 },
  'guarda-roupa 2 portas':{ larguraCm: 120, alturaCm: 200, profundidadeCm: 50, pesoKg: 60, volumeM3: 1.20 },
  'criado-mudo':         { larguraCm: 45,  alturaCm: 55,  profundidadeCm: 35,  pesoKg: 8,   volumeM3: 0.09 },
  'cômoda':              { larguraCm: 80,  alturaCm: 85,  profundidadeCm: 45,  pesoKg: 25,  volumeM3: 0.31 },
  'sofá 3 lugares':      { larguraCm: 200, alturaCm: 80,  profundidadeCm: 85,  pesoKg: 45,  volumeM3: 1.36 },
  'rack de tv':          { larguraCm: 180, alturaCm: 55,  profundidadeCm: 40,  pesoKg: 30,  volumeM3: 0.40 },
  'mesa de centro':      { larguraCm: 100, alturaCm: 45,  profundidadeCm: 60,  pesoKg: 12,  volumeM3: 0.27 },
  'poltrona':            { larguraCm: 75,  alturaCm: 85,  profundidadeCm: 75,  pesoKg: 18,  volumeM3: 0.48 },
  'geladeira':           { larguraCm: 70,  alturaCm: 170, profundidadeCm: 65,  pesoKg: 70,  volumeM3: 0.77 },
  'fogão 4 bocas':       { larguraCm: 55,  alturaCm: 85,  profundidadeCm: 60,  pesoKg: 35,  volumeM3: 0.28 },
  'microondas':          { larguraCm: 45,  alturaCm: 28,  profundidadeCm: 35,  pesoKg: 12,  volumeM3: 0.04 },
  'mesa 4 lugares':      { larguraCm: 120, alturaCm: 75,  profundidadeCm: 80,  pesoKg: 20,  volumeM3: 0.72 },
  'cadeira':             { larguraCm: 45,  alturaCm: 90,  profundidadeCm: 45,  pesoKg: 5,   volumeM3: 0.18 },
  'mesa de escritório':  { larguraCm: 120, alturaCm: 75,  profundidadeCm: 60,  pesoKg: 20,  volumeM3: 0.54 },
  'cadeira de escritório':{ larguraCm: 60, alturaCm: 110, profundidadeCm: 60,  pesoKg: 12,  volumeM3: 0.40 },
  'estante de livros':   { larguraCm: 80,  alturaCm: 200, profundidadeCm: 30,  pesoKg: 30,  volumeM3: 0.48 },
  'máquina de lavar':    { larguraCm: 60,  alturaCm: 85,  profundidadeCm: 55,  pesoKg: 50,  volumeM3: 0.28 },
  'caixa p':             { larguraCm: 35,  alturaCm: 30,  profundidadeCm: 30,  pesoKg: 5,   volumeM3: 0.03 },
  'caixa m':             { larguraCm: 50,  alturaCm: 40,  profundidadeCm: 40,  pesoKg: 10,  volumeM3: 0.08 },
  'caixa g':             { larguraCm: 60,  alturaCm: 50,  profundidadeCm: 50,  pesoKg: 15,  volumeM3: 0.15 },
  'caixa de livros':     { larguraCm: 35,  alturaCm: 25,  profundidadeCm: 30,  pesoKg: 20,  volumeM3: 0.03 },
  'mala grande':         { larguraCm: 75,  alturaCm: 50,  profundidadeCm: 30,  pesoKg: 8,   volumeM3: 0.11 },
  'saco de roupa':       { larguraCm: 50,  alturaCm: 80,  profundidadeCm: 40,  pesoKg: 5,   volumeM3: 0.16 },
};

// ─── estimateItemsFromRooms ────────────────────────────────────────────────────

/**
 * Converts a room count map (e.g. { QUARTO: 2, SALA: 1, COZINHA: 1 }) to a
 * flat array of catalog items using real dimensions from catalogItems when
 * available, falling back to DEFAULT_DIMS otherwise.
 */
export function estimateItemsFromRooms(
  rooms: Record<string, number>,
  catalogItems: CatalogItemForPlacement[],
): CatalogItemForPlacement[] {
  const result: CatalogItemForPlacement[] = [];

  // Build a quick lookup by normalized name (lowercase, accents kept)
  const byName = new Map<string, CatalogItemForPlacement>();
  for (const item of catalogItems) {
    byName.set(item.nome.toLowerCase(), item);
  }

  for (const [roomKey, count] of Object.entries(rooms)) {
    if (count <= 0) continue;
    const template = ROOM_ITEMS[roomKey];
    if (!template) continue;

    for (let i = 0; i < count; i++) {
      for (const entry of template) {
        const found = byName.get(entry.nome.toLowerCase());
        const dims = found ?? DEFAULT_DIMS[entry.nome.toLowerCase()];

        if (!dims) continue; // unknown item — skip

        for (let q = 0; q < entry.quantidade; q++) {
          result.push({
            id: found?.id ?? `default-${entry.nome.toLowerCase().replace(/\s+/g, '-')}`,
            nome: entry.nome,
            categoria: found?.categoria ?? roomKey,
            larguraCm: dims.larguraCm,
            alturaCm: dims.alturaCm,
            profundidadeCm: dims.profundidadeCm,
            pesoKg: dims.pesoKg,
            volumeM3: dims.volumeM3,
          });
        }
      }
    }
  }

  return result;
}

// ─── Auto-placement helpers ────────────────────────────────────────────────────

function makeInstanceId(itemId: string, index: number): string {
  return `auto-${itemId}-${index}`;
}

/**
 * Try to place one item inside a truck, returning the PlacedItem3D on success
 * or null if it doesn't fit.
 *
 * Strategy: scan from the back of the truck (high Z) to the front (low Z),
 * left to right (low X to high X), trying both orientations. This fills the
 * back wall first, maximising use of depth.
 */
function tryPlaceItem(
  item: CatalogItemForPlacement,
  truck: TruckGridDims,
  grid: Set<string>,
  instanceId: string,
  floorOnly: boolean,
): PlacedItem3D | null {
  const orientations: Array<{ rotated: boolean }> = [{ rotated: false }, { rotated: true }];

  // Determine which Z range to scan. Scan from back (high Z) to front (low Z).
  for (let gz = truck.gd - 1; gz >= 0; gz--) {
    for (let gx = 0; gx < truck.gw; gx++) {
      for (const { rotated } of orientations) {
        const { gw, gh, gd } = getItemGridSize(
          item.larguraCm,
          item.alturaCm,
          item.profundidadeCm,
          rotated,
        );

        // Verify it still fits within truck footprint at this position
        if (gx + gw > truck.gw) continue;
        if (gz + gd > truck.gd) continue;

        const gy = floorOnly ? 0 : findDropY(grid, gx, gz, gw, gh, gd, truck);

        if (gy === -1) continue;
        if (floorOnly && gy !== 0) continue;
        if (!canPlace(grid, gx, gy, gz, gw, gh, gd, truck)) continue;

        return {
          instanceId,
          itemId: item.id,
          nome: item.nome,
          categoria: item.categoria,
          larguraCm: item.larguraCm,
          alturaCm: item.alturaCm,
          profundidadeCm: item.profundidadeCm,
          pesoKg: item.pesoKg,
          volumeM3: item.volumeM3,
          gx,
          gy,
          gz,
          gw,
          gh,
          gd,
          rotated,
        };
      }
    }
  }

  return null;
}

// ─── autoPlaceItems ────────────────────────────────────────────────────────────

/**
 * Automatically places a list of catalog items into one or more trucks.
 *
 * Placement rules:
 * 1. Sort: largest items (by volume) first; stackable items (boxes/bags) last.
 * 2. Non-stackable furniture is placed on the floor only (gy = 0).
 * 3. Stackable items (boxes, bags) are placed after floor items and may stack
 *    on top of whatever is already in the truck (findDropY finds the lowest
 *    available Y automatically).
 * 4. Same-category items are kept together — they are naturally adjacent because
 *    the algorithm scans Z from back to front and the sort keeps them grouped.
 * 5. When the current truck is full (item doesn't fit), a new truck is created.
 *
 * Returns an array of TruckLoad objects (one per truck used).
 */
export function autoPlaceItems(
  items: CatalogItemForPlacement[],
  truck: TruckConfigForPlacement,
): TruckLoad[] {
  if (items.length === 0) return [];

  const truckGrid = createTruckGrid(truck.larguraCm, truck.alturaCm, truck.comprimentoCm);

  // Sort: largest volume first, stackable items last
  const sorted = [...items].sort((a, b) => {
    const aStack = isStackable(a) ? 1 : 0;
    const bStack = isStackable(b) ? 1 : 0;
    if (aStack !== bStack) return aStack - bStack; // non-stackable first
    return b.volumeM3 - a.volumeM3; // largest volume first within each group
  });

  const loads: TruckLoad[] = [];
  let currentTruckIndex = 0;
  let currentGrid: Set<string> = new Set();
  let currentItems: PlacedItem3D[] = [];
  let instanceCounter = 0;

  function finalizeCurrentTruck() {
    const totalVolume = currentItems.reduce((s, i) => s + i.volumeM3, 0);
    const occupancy = truck.capacidadeM3 > 0
      ? Math.min(100, Math.round((totalVolume / truck.capacidadeM3) * 100))
      : 0;
    loads.push({
      truckIndex: currentTruckIndex,
      items: currentItems,
      occupancyPercent: occupancy,
    });
  }

  function startNewTruck() {
    finalizeCurrentTruck();
    currentTruckIndex++;
    currentGrid = new Set();
    currentItems = [];
  }

  for (const item of sorted) {
    const floorOnly = !isStackable(item);
    const instanceId = makeInstanceId(item.id, instanceCounter++);

    let placed = tryPlaceItem(item, truckGrid, currentGrid, instanceId, floorOnly);

    if (!placed) {
      // Current truck is full — start a new one and try again
      startNewTruck();
      placed = tryPlaceItem(item, truckGrid, currentGrid, instanceId, floorOnly);
    }

    if (placed) {
      currentGrid = addToGrid(
        currentGrid,
        placed.gx, placed.gy, placed.gz,
        placed.gw, placed.gh, placed.gd,
      );
      currentItems.push(placed);
    }
    // If item still doesn't fit in a completely empty truck, skip it (oversized)
  }

  // Finalize the last truck
  finalizeCurrentTruck();

  // Remove empty trucks (can happen if the very first item didn't fit)
  return loads.filter((l) => l.items.length > 0);
}
