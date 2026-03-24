"use client";

import { useReducer, useCallback, useMemo } from 'react';
import type { PlacedItem3D, DragPreview, Cargo3DStats, TruckGridDims } from '@/lib/cargo3d/cargo-types';
import {
  createTruckGrid,
  getItemGridSize,
  buildOccupancyGrid,
  canPlace,
  findDropY,
  addToGrid,
  removeFromGrid,
  snapToGrid,
} from '@/lib/cargo3d/grid-system';

// --- State ---
interface Cargo3DState {
  placedItems: PlacedItem3D[];
  occupancyGrid: Set<string>;
  selectedItemId: string | null;   // instanceId of selected placed item
  dragPreview: DragPreview | null;
  truckGrid: TruckGridDims;
  truckCapacidadeM3: number;
  truckCapacidadeKg: number;
}

// --- Actions ---
type Cargo3DAction =
  | { type: 'PLACE_ITEM'; item: PlacedItem3D }
  | { type: 'REMOVE_ITEM'; instanceId: string }
  | { type: 'SELECT_ITEM'; instanceId: string | null }
  | { type: 'SET_DRAG_PREVIEW'; preview: DragPreview | null }
  | { type: 'CLEAR_ALL' }
  | { type: 'LOAD_ITEMS'; items: PlacedItem3D[] }
  | { type: 'SET_TRUCK'; larguraCm: number; alturaCm: number; comprimentoCm: number; capacidadeM3: number; capacidadeKg: number };

function reducer(state: Cargo3DState, action: Cargo3DAction): Cargo3DState {
  switch (action.type) {
    case 'PLACE_ITEM': {
      const newItems = [...state.placedItems, action.item];
      return {
        ...state,
        placedItems: newItems,
        occupancyGrid: addToGrid(
          state.occupancyGrid,
          action.item.gx, action.item.gy, action.item.gz,
          action.item.gw, action.item.gh, action.item.gd
        ),
        dragPreview: null,
      };
    }
    case 'REMOVE_ITEM': {
      const item = state.placedItems.find(i => i.instanceId === action.instanceId);
      if (!item) return state;
      const newItems = state.placedItems.filter(i => i.instanceId !== action.instanceId);
      return {
        ...state,
        placedItems: newItems,
        occupancyGrid: removeFromGrid(
          state.occupancyGrid,
          item.gx, item.gy, item.gz,
          item.gw, item.gh, item.gd
        ),
        selectedItemId: state.selectedItemId === action.instanceId ? null : state.selectedItemId,
      };
    }
    case 'SELECT_ITEM':
      return { ...state, selectedItemId: action.instanceId };
    case 'SET_DRAG_PREVIEW':
      return { ...state, dragPreview: action.preview };
    case 'CLEAR_ALL':
      return {
        ...state,
        placedItems: [],
        occupancyGrid: new Set(),
        selectedItemId: null,
        dragPreview: null,
      };
    case 'LOAD_ITEMS': {
      return {
        ...state,
        placedItems: action.items,
        occupancyGrid: buildOccupancyGrid(action.items),
      };
    }
    case 'SET_TRUCK':
      return {
        ...state,
        truckGrid: createTruckGrid(action.larguraCm, action.alturaCm, action.comprimentoCm),
        truckCapacidadeM3: action.capacidadeM3,
        truckCapacidadeKg: action.capacidadeKg,
        placedItems: [],
        occupancyGrid: new Set(),
      };
    default:
      return state;
  }
}

// --- Hook ---
interface UseCargo3DOptions {
  larguraCm: number;
  alturaCm: number;
  comprimentoCm: number;
  capacidadeM3: number;
  capacidadeKg: number;
}

export function useCargo3D(options: UseCargo3DOptions) {
  const initialState: Cargo3DState = {
    placedItems: [],
    occupancyGrid: new Set(),
    selectedItemId: null,
    dragPreview: null,
    truckGrid: createTruckGrid(options.larguraCm, options.alturaCm, options.comprimentoCm),
    truckCapacidadeM3: options.capacidadeM3,
    truckCapacidadeKg: options.capacidadeKg,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const placeItem = useCallback((
    itemId: string,
    nome: string,
    categoria: string,
    larguraCm: number,
    alturaCm: number,
    profundidadeCm: number,
    pesoKg: number,
    volumeM3: number,
    gx: number,
    gz: number,
    rotated: boolean = false,
  ) => {
    const { gw, gh, gd } = getItemGridSize(larguraCm, alturaCm, profundidadeCm, rotated);
    const gy = findDropY(state.occupancyGrid, gx, gz, gw, gh, gd, state.truckGrid);
    if (gy === -1) return false; // doesn't fit
    if (!canPlace(state.occupancyGrid, gx, gy, gz, gw, gh, gd, state.truckGrid)) return false;

    const instanceId = `${itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    dispatch({
      type: 'PLACE_ITEM',
      item: {
        instanceId,
        itemId,
        nome,
        categoria,
        larguraCm,
        alturaCm,
        profundidadeCm,
        pesoKg,
        volumeM3,
        gx, gy, gz,
        gw, gh, gd,
        rotated,
      },
    });
    return true;
  }, [state.occupancyGrid, state.truckGrid]);

  const removeItem = useCallback((instanceId: string) => {
    dispatch({ type: 'REMOVE_ITEM', instanceId });
  }, []);

  const selectItem = useCallback((instanceId: string | null) => {
    dispatch({ type: 'SELECT_ITEM', instanceId });
  }, []);

  const updateDragPreview = useCallback((
    itemId: string | null,
    nome: string,
    categoria: string,
    larguraCm: number,
    alturaCm: number,
    profundidadeCm: number,
    worldX: number,
    worldZ: number,
    rotated: boolean = false,
  ) => {
    if (!itemId) {
      dispatch({ type: 'SET_DRAG_PREVIEW', preview: null });
      return;
    }
    const { gw, gh, gd } = getItemGridSize(larguraCm, alturaCm, profundidadeCm, rotated);
    const { gx, gz } = snapToGrid(worldX, worldZ, gw, gd, state.truckGrid);
    const gy = findDropY(state.occupancyGrid, gx, gz, gw, gh, gd, state.truckGrid);
    const valid = gy !== -1 && canPlace(state.occupancyGrid, gx, gy, gz, gw, gh, gd, state.truckGrid);

    dispatch({
      type: 'SET_DRAG_PREVIEW',
      preview: { itemId, nome, categoria, gw, gh, gd, gx, gy: gy === -1 ? 0 : gy, gz, valid },
    });
  }, [state.occupancyGrid, state.truckGrid]);

  const clearDragPreview = useCallback(() => {
    dispatch({ type: 'SET_DRAG_PREVIEW', preview: null });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const loadItems = useCallback((items: PlacedItem3D[]) => {
    dispatch({ type: 'LOAD_ITEMS', items });
  }, []);

  // Computed stats
  const stats: Cargo3DStats = useMemo(() => {
    const totalVolumeM3 = state.placedItems.reduce((sum, i) => sum + i.volumeM3, 0);
    const totalPesoKg = state.placedItems.reduce((sum, i) => sum + i.pesoKg, 0);
    return {
      totalVolumeM3: Math.round(totalVolumeM3 * 100) / 100,
      totalPesoKg: Math.round(totalPesoKg),
      occupancyPercent: state.truckCapacidadeM3 > 0
        ? Math.round((totalVolumeM3 / state.truckCapacidadeM3) * 100)
        : 0,
      itemCount: state.placedItems.length,
      truckCapacidadeM3: state.truckCapacidadeM3,
      truckCapacidadeKg: state.truckCapacidadeKg,
    };
  }, [state.placedItems, state.truckCapacidadeM3, state.truckCapacidadeKg]);

  return {
    placedItems: state.placedItems,
    occupancyGrid: state.occupancyGrid,
    selectedItemId: state.selectedItemId,
    dragPreview: state.dragPreview,
    truckGrid: state.truckGrid,
    stats,
    placeItem,
    removeItem,
    selectItem,
    updateDragPreview,
    clearDragPreview,
    clearAll,
    loadItems,
  };
}
