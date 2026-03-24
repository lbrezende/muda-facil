// Types for the 3D cargo visualization system

export interface TruckGridDims {
  /** Grid cells along X (width) */
  gw: number;
  /** Grid cells along Y (height/vertical) */
  gh: number;
  /** Grid cells along Z (depth/length) */
  gd: number;
  /** Original truck dimensions in cm */
  larguraCm: number;
  alturaCm: number;
  comprimentoCm: number;
}

export interface ItemGridSize {
  gw: number;
  gh: number;
  gd: number;
}

export interface PlacedItem3D {
  instanceId: string;    // unique per placement (cuid or uuid)
  itemId: string;        // catalog item ID
  nome: string;
  categoria: string;
  larguraCm: number;
  alturaCm: number;
  profundidadeCm: number;
  pesoKg: number;
  volumeM3: number;
  // Grid position (in grid cells, 1 cell = 10cm)
  gx: number;
  gy: number;
  gz: number;
  // Grid size
  gw: number;
  gh: number;
  gd: number;
  rotated: boolean;
}

export interface DragPreview {
  itemId: string;
  nome: string;
  categoria: string;
  gw: number;
  gh: number;
  gd: number;
  gx: number;
  gy: number;
  gz: number;
  valid: boolean;  // green if can place, red if collision
}

export interface Cargo3DStats {
  totalVolumeM3: number;
  totalPesoKg: number;
  occupancyPercent: number;
  itemCount: number;
  truckCapacidadeM3: number;
  truckCapacidadeKg: number;
}
