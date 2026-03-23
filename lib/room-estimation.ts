/**
 * Room-to-item estimation engine
 * Maps room types to estimated items, volume, and weight
 */

export type RoomType =
  | "QUARTO"
  | "SALA"
  | "COZINHA"
  | "BANHEIRO"
  | "ESCRITORIO"
  | "AREA_SERVICO";

export interface RoomConfig {
  key: RoomType;
  label: string;
  icon: string; // lucide icon name
  items: string[];
  estimatedItems: number;
  volumeM3: number;
  pesoKg: number;
}

export const ROOM_TYPES: RoomConfig[] = [
  {
    key: "QUARTO",
    label: "Quarto",
    icon: "Bed",
    items: ["Cama", "Guarda-roupa", "Criado-mudo"],
    estimatedItems: 3,
    volumeM3: 2.5,
    pesoKg: 80,
  },
  {
    key: "SALA",
    label: "Sala",
    icon: "Sofa",
    items: ["Sofá", "Mesa de centro", "Rack / Estante"],
    estimatedItems: 3,
    volumeM3: 2.0,
    pesoKg: 65,
  },
  {
    key: "COZINHA",
    label: "Cozinha",
    icon: "UtensilsCrossed",
    items: ["Geladeira", "Fogão", "Mesa com cadeiras"],
    estimatedItems: 3,
    volumeM3: 1.5,
    pesoKg: 60,
  },
  {
    key: "BANHEIRO",
    label: "Banheiro",
    icon: "Bath",
    items: ["Armário de banheiro"],
    estimatedItems: 1,
    volumeM3: 0.3,
    pesoKg: 10,
  },
  {
    key: "ESCRITORIO",
    label: "Escritório",
    icon: "Monitor",
    items: ["Mesa", "Cadeira", "Estante"],
    estimatedItems: 3,
    volumeM3: 1.4,
    pesoKg: 50,
  },
  {
    key: "AREA_SERVICO",
    label: "Área de serviço",
    icon: "WashingMachine",
    items: ["Máquina de lavar"],
    estimatedItems: 1,
    volumeM3: 0.3,
    pesoKg: 50,
  },
];

export interface RoomSummary {
  numComodos: number;
  estimatedItems: number;
  volumeM3: number;
  pesoKg: number;
  itemList: string[];
}

/**
 * Calculate total estimates from room selection
 */
export function calculateRoomSummary(
  rooms: Record<string, number>
): RoomSummary {
  let numComodos = 0;
  let estimatedItems = 0;
  let volumeM3 = 0;
  let pesoKg = 0;
  const itemList: string[] = [];

  for (const room of ROOM_TYPES) {
    const count = rooms[room.key] || 0;
    if (count > 0) {
      numComodos += count;
      estimatedItems += room.estimatedItems * count;
      volumeM3 += room.volumeM3 * count;
      pesoKg += room.pesoKg * count;

      for (let i = 0; i < count; i++) {
        itemList.push(...room.items);
      }
    }
  }

  return {
    numComodos,
    estimatedItems,
    volumeM3: Math.round(volumeM3 * 10) / 10,
    pesoKg: Math.round(pesoKg),
    itemList,
  };
}

export interface TruckInfo {
  id: string;
  nome: string;
  tipo: string;
  capacidadeM3: number;
  capacidadeKg: number;
}

/** Default truck types for quick estimation */
export const DEFAULT_TRUCKS: TruckInfo[] = [
  { id: "fiorino", nome: "Fiorino", tipo: "FIORINO", capacidadeM3: 2, capacidadeKg: 500 },
  { id: "hr", nome: "HR", tipo: "HR", capacidadeM3: 6, capacidadeKg: 1500 },
  { id: "34", nome: "3/4", tipo: "TRES_QUARTOS", capacidadeM3: 15, capacidadeKg: 3000 },
  { id: "bau", nome: "Baú", tipo: "BAU", capacidadeM3: 25, capacidadeKg: 6000 },
];

export interface TruckRecommendation {
  truck: TruckInfo;
  quantity: number;
  occupancyPercent: number;
  isRecommended: boolean;
  fits: boolean;
}

/**
 * Recommend the best truck for a given volume and weight
 * Returns all trucks with their fitness info
 */
export function recommendTrucks(
  volumeM3: number,
  pesoKg: number,
  caminhoes: TruckInfo[]
): TruckRecommendation[] {
  // Sort by capacity (smallest first)
  const sorted = [...caminhoes].sort(
    (a, b) => a.capacidadeM3 - b.capacidadeM3
  );

  let recommendedFound = false;

  return sorted.map((truck) => {
    const volumeOccupancy = volumeM3 / truck.capacidadeM3;
    const weightOccupancy = pesoKg / truck.capacidadeKg;
    const maxOccupancy = Math.max(volumeOccupancy, weightOccupancy);

    const fits = maxOccupancy <= 1;
    const quantity = fits ? 1 : Math.ceil(maxOccupancy);
    const occupancyPercent = fits
      ? Math.round(maxOccupancy * 100)
      : Math.round((maxOccupancy / quantity) * 100);

    // First truck that fits is the recommended one (smallest that works)
    const isRecommended = fits && !recommendedFound;
    if (isRecommended) recommendedFound = true;

    return {
      truck,
      quantity,
      occupancyPercent,
      isRecommended,
      fits,
    };
  });
}

/**
 * Get the single best truck recommendation
 */
export function getBestTruck(
  volumeM3: number,
  pesoKg: number,
  caminhoes: TruckInfo[]
): TruckRecommendation | null {
  const all = recommendTrucks(volumeM3, pesoKg, caminhoes);
  return all.find((t) => t.isRecommended) || all[all.length - 1] || null;
}
