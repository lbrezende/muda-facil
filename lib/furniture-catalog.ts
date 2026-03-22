/**
 * Comprehensive furniture catalog organized by room type.
 * Used for the item picker and drag-and-drop sidebar.
 */

export interface FurnitureItem {
  id: string;
  name: string;
  icon: string; // lucide icon name
  volumeM3: number;
  pesoKg: number;
  category: string;
}

export const FURNITURE_BY_ROOM: Record<
  string,
  { label: string; items: FurnitureItem[] }
> = {
  QUARTO: {
    label: "Quarto",
    items: [
      { id: "cama-solteiro", name: "Cama solteiro", icon: "Bed", volumeM3: 0.8, pesoKg: 25, category: "QUARTO" },
      { id: "cama-casal", name: "Cama casal", icon: "Bed", volumeM3: 1.2, pesoKg: 40, category: "QUARTO" },
      { id: "cama-queen", name: "Cama queen", icon: "Bed", volumeM3: 1.5, pesoKg: 50, category: "QUARTO" },
      { id: "cama-king", name: "Cama king", icon: "Bed", volumeM3: 1.8, pesoKg: 60, category: "QUARTO" },
      { id: "guarda-roupa", name: "Guarda-roupa", icon: "DoorOpen", volumeM3: 1.0, pesoKg: 35, category: "QUARTO" },
      { id: "comoda", name: "Cômoda", icon: "Archive", volumeM3: 0.4, pesoKg: 20, category: "QUARTO" },
      { id: "criado-mudo", name: "Criado-mudo", icon: "Lamp", volumeM3: 0.15, pesoKg: 5, category: "QUARTO" },
      { id: "sapateira", name: "Sapateira", icon: "Footprints", volumeM3: 0.3, pesoKg: 10, category: "QUARTO" },
      { id: "penteadeira", name: "Penteadeira", icon: "Sparkles", volumeM3: 0.4, pesoKg: 15, category: "QUARTO" },
      { id: "berco", name: "Berço", icon: "Baby", volumeM3: 0.6, pesoKg: 15, category: "QUARTO" },
    ],
  },
  SALA: {
    label: "Sala",
    items: [
      { id: "sofa-2l", name: "Sofá 2 lugares", icon: "Sofa", volumeM3: 0.8, pesoKg: 25, category: "SALA" },
      { id: "sofa-3l", name: "Sofá 3 lugares", icon: "Sofa", volumeM3: 1.0, pesoKg: 35, category: "SALA" },
      { id: "sofa-canto", name: "Sofá de canto", icon: "Sofa", volumeM3: 1.5, pesoKg: 45, category: "SALA" },
      { id: "poltrona", name: "Poltrona", icon: "Armchair", volumeM3: 0.4, pesoKg: 15, category: "SALA" },
      { id: "mesa-centro", name: "Mesa de centro", icon: "Square", volumeM3: 0.3, pesoKg: 10, category: "SALA" },
      { id: "rack-tv", name: "Rack / Painel TV", icon: "Tv", volumeM3: 0.5, pesoKg: 15, category: "SALA" },
      { id: "estante-sala", name: "Estante", icon: "BookOpen", volumeM3: 0.6, pesoKg: 20, category: "SALA" },
      { id: "mesa-jantar", name: "Mesa de jantar", icon: "UtensilsCrossed", volumeM3: 0.8, pesoKg: 30, category: "SALA" },
      { id: "cadeira-jantar", name: "Cadeira de jantar", icon: "Armchair", volumeM3: 0.15, pesoKg: 5, category: "SALA" },
      { id: "aparador", name: "Aparador / Buffet", icon: "RectangleHorizontal", volumeM3: 0.4, pesoKg: 20, category: "SALA" },
      { id: "tapete", name: "Tapete grande", icon: "Layers", volumeM3: 0.1, pesoKg: 8, category: "SALA" },
    ],
  },
  COZINHA: {
    label: "Cozinha",
    items: [
      { id: "geladeira", name: "Geladeira", icon: "Refrigerator", volumeM3: 0.6, pesoKg: 30, category: "COZINHA" },
      { id: "geladeira-duplex", name: "Geladeira duplex", icon: "Refrigerator", volumeM3: 0.9, pesoKg: 50, category: "COZINHA" },
      { id: "fogao", name: "Fogão", icon: "Flame", volumeM3: 0.5, pesoKg: 25, category: "COZINHA" },
      { id: "micro-ondas", name: "Micro-ondas", icon: "Zap", volumeM3: 0.1, pesoKg: 10, category: "COZINHA" },
      { id: "mesa-cozinha", name: "Mesa de cozinha", icon: "UtensilsCrossed", volumeM3: 0.4, pesoKg: 15, category: "COZINHA" },
      { id: "armario-cozinha", name: "Armário de cozinha", icon: "DoorOpen", volumeM3: 0.5, pesoKg: 20, category: "COZINHA" },
      { id: "lava-loucas", name: "Lava-louças", icon: "Droplets", volumeM3: 0.3, pesoKg: 30, category: "COZINHA" },
      { id: "forno", name: "Forno elétrico", icon: "Flame", volumeM3: 0.2, pesoKg: 15, category: "COZINHA" },
    ],
  },
  BANHEIRO: {
    label: "Banheiro",
    items: [
      { id: "armario-banheiro", name: "Armário de banheiro", icon: "Bath", volumeM3: 0.3, pesoKg: 10, category: "BANHEIRO" },
      { id: "espelho-banheiro", name: "Espelho grande", icon: "Frame", volumeM3: 0.05, pesoKg: 5, category: "BANHEIRO" },
    ],
  },
  ESCRITORIO: {
    label: "Escritório",
    items: [
      { id: "mesa-escritorio", name: "Mesa de escritório", icon: "Monitor", volumeM3: 0.6, pesoKg: 25, category: "ESCRITORIO" },
      { id: "cadeira-escritorio", name: "Cadeira de escritório", icon: "Armchair", volumeM3: 0.4, pesoKg: 15, category: "ESCRITORIO" },
      { id: "estante-escritorio", name: "Estante", icon: "BookOpen", volumeM3: 0.4, pesoKg: 10, category: "ESCRITORIO" },
      { id: "gaveteiro", name: "Gaveteiro", icon: "Archive", volumeM3: 0.2, pesoKg: 15, category: "ESCRITORIO" },
      { id: "impressora", name: "Impressora", icon: "Printer", volumeM3: 0.1, pesoKg: 8, category: "ESCRITORIO" },
    ],
  },
  AREA_SERVICO: {
    label: "Área de serviço",
    items: [
      { id: "maquina-lavar", name: "Máquina de lavar", icon: "WashingMachine", volumeM3: 0.3, pesoKg: 50, category: "AREA_SERVICO" },
      { id: "secadora", name: "Secadora", icon: "Wind", volumeM3: 0.3, pesoKg: 40, category: "AREA_SERVICO" },
      { id: "tanque", name: "Tanque", icon: "Droplets", volumeM3: 0.2, pesoKg: 15, category: "AREA_SERVICO" },
      { id: "tabua-passar", name: "Tábua de passar", icon: "Minus", volumeM3: 0.1, pesoKg: 3, category: "AREA_SERVICO" },
    ],
  },
  OUTROS: {
    label: "Outros",
    items: [
      { id: "bicicleta", name: "Bicicleta", icon: "Bike", volumeM3: 0.5, pesoKg: 12, category: "OUTROS" },
      { id: "caixa-grande", name: "Caixa grande", icon: "Package", volumeM3: 0.1, pesoKg: 10, category: "OUTROS" },
      { id: "caixa-media", name: "Caixa média", icon: "Package", volumeM3: 0.05, pesoKg: 5, category: "OUTROS" },
      { id: "tv-50", name: "TV 50\"", icon: "Tv", volumeM3: 0.2, pesoKg: 15, category: "OUTROS" },
      { id: "ar-condicionado", name: "Ar-condicionado", icon: "Wind", volumeM3: 0.2, pesoKg: 20, category: "OUTROS" },
      { id: "ventilador", name: "Ventilador", icon: "Fan", volumeM3: 0.1, pesoKg: 5, category: "OUTROS" },
      { id: "quadro-grande", name: "Quadro grande", icon: "Frame", volumeM3: 0.05, pesoKg: 3, category: "OUTROS" },
      { id: "piano-digital", name: "Piano digital", icon: "Music", volumeM3: 0.4, pesoKg: 30, category: "OUTROS" },
      { id: "churrasqueira", name: "Churrasqueira portátil", icon: "Flame", volumeM3: 0.3, pesoKg: 20, category: "OUTROS" },
    ],
  },
};

export const ALL_FURNITURE: FurnitureItem[] = Object.values(FURNITURE_BY_ROOM).flatMap(
  (room) => room.items
);

/** Get all furniture items that belong to a specific room category */
export function getFurnitureForRoom(roomKey: string): FurnitureItem[] {
  return FURNITURE_BY_ROOM[roomKey]?.items || [];
}

/** Get "Other" items (items not in this room's default list) */
export function getOtherFurniture(roomKey: string): FurnitureItem[] {
  const roomItems = new Set(
    FURNITURE_BY_ROOM[roomKey]?.items.map((i) => i.id) || []
  );
  return ALL_FURNITURE.filter((item) => !roomItems.has(item.id));
}
