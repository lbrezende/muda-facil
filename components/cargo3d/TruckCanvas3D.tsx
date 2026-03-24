"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useCargo3D } from "@/hooks/use-cargo3d";
import { snapToGrid, getItemGridSize } from "@/lib/cargo3d/grid-system";
import { TruckContainer } from "./TruckContainer";
import { CargoGrid } from "./CargoGrid";
import { CargoBlock } from "./CargoBlock";
import { DragPreviewGhost } from "./DragPreviewGhost";
import { CameraControls } from "./CameraControls";
import { OccupancyStats } from "./OccupancyStats";
import { DragPanel } from "./sidebar/DragPanel";
import type { CatalogItemForPlacement, TruckConfigForPlacement } from "@/lib/cargo3d/auto-placement";

export interface TruckCanvas3DProps {
  larguraCm: number;
  alturaCm: number;
  comprimentoCm: number;
  capacidadeM3: number;
  capacidadeKg: number;
  mudancaId: string;
  items: Array<{
    id: string;
    nome: string;
    categoria: string;
    larguraCm: number;
    alturaCm: number;
    profundidadeCm: number;
    pesoKg: number;
    volumeM3: number;
  }>;
  /**
   * When provided, the component runs auto-placement on mount and shows the
   * result. The user can still manually drag-and-drop items afterwards.
   */
  autoPlaceOnMount?: CatalogItemForPlacement[];
  /**
   * Truck id/nome used to build the TruckConfigForPlacement passed to autoPlace.
   */
  truckId?: string;
  truckNome?: string;
}

interface CatalogItem {
  id: string;
  nome: string;
  categoria: string;
  larguraCm: number;
  alturaCm: number;
  profundidadeCm: number;
  pesoKg: number;
  volumeM3: number;
}

export function TruckCanvas3D({
  larguraCm,
  alturaCm,
  comprimentoCm,
  capacidadeM3,
  capacidadeKg,
  items,
  autoPlaceOnMount,
  truckId = "auto",
  truckNome = "Caminhão",
}: TruckCanvas3DProps) {
  const cargo = useCargo3D({
    larguraCm,
    alturaCm,
    comprimentoCm,
    capacidadeM3,
    capacidadeKg,
    truckId,
    truckNome,
  });

  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);
  const selectedCatalogItemRef = useRef<CatalogItem | null>(null);
  selectedCatalogItemRef.current = selectedCatalogItem;

  // Run auto-placement on mount when items are provided
  const autoPlaceRanRef = useRef(false);
  useEffect(() => {
    if (autoPlaceOnMount && autoPlaceOnMount.length > 0 && !autoPlaceRanRef.current) {
      autoPlaceRanRef.current = true;
      const truckConfig: TruckConfigForPlacement = {
        id: truckId,
        nome: truckNome,
        larguraCm,
        alturaCm,
        comprimentoCm,
        capacidadeM3,
        capacidadeKg,
      };
      cargo.autoPlace(autoPlaceOnMount, truckConfig);
    }
  // We intentionally run this only once on mount — deps are stable refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const truck = cargo.truckGrid;
  const truckCenterX = truck.gw / 2;
  const truckCenterY = truck.gh / 2;
  const truckCenterZ = truck.gd / 2;

  // Initial camera position: isometric-ish angle from front-right-top
  const cameraDistance = Math.max(truck.gw, truck.gd) * 1.5 + 8;
  const cameraPosition: [number, number, number] = [
    truckCenterX + cameraDistance * 0.6,
    truckCenterY + cameraDistance * 0.7,
    truckCenterZ + cameraDistance * 0.8,
  ];

  const handleFloorPointerMove = useCallback(
    (worldX: number, worldZ: number) => {
      const item = selectedCatalogItemRef.current;
      if (!item) {
        cargo.clearDragPreview();
        return;
      }
      cargo.updateDragPreview(
        item.id,
        item.nome,
        item.categoria,
        item.larguraCm,
        item.alturaCm,
        item.profundidadeCm,
        worldX,
        worldZ,
        false,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cargo.updateDragPreview, cargo.clearDragPreview],
  );

  const handleFloorClick = useCallback(
    (worldX: number, worldZ: number) => {
      const item = selectedCatalogItemRef.current;
      if (!item) return;

      const { gw, gh, gd } = getItemGridSize(
        item.larguraCm,
        item.alturaCm,
        item.profundidadeCm,
        false,
      );
      const { gx, gz } = snapToGrid(worldX, worldZ, gw, gd, truck);

      const placed = cargo.placeItem(
        item.id,
        item.nome,
        item.categoria,
        item.larguraCm,
        item.alturaCm,
        item.profundidadeCm,
        item.pesoKg,
        item.volumeM3,
        gx,
        gz,
        false,
      );

      if (placed) {
        // Keep item selected for repeated placement
        cargo.clearDragPreview();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cargo.placeItem, cargo.clearDragPreview, truck],
  );

  function handleSelectCatalogItem(item: CatalogItem) {
    setSelectedCatalogItem(item);
    // Deselect any placed item
    cargo.selectItem(null);
  }

  function handleDeselectCatalogItem() {
    setSelectedCatalogItem(null);
    cargo.clearDragPreview();
  }

  function handleCanvasBackgroundClick() {
    // Click on empty space deselects placed items but keeps catalog selection
    if (cargo.selectedItemId) {
      cargo.selectItem(null);
    }
  }

  const hasMultipleTrucks = cargo.autoPlacedLoads.length > 1;
  const totalTrucks = cargo.autoPlacedLoads.length;
  const activeTruckLoad = cargo.autoPlacedLoads[cargo.activeTruckIndex];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Multi-truck navigation — shown only when auto-placed across 2+ trucks */}
      {hasMultipleTrucks && (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-slate-200 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">
            Caminhões:
          </span>
          {cargo.autoPlacedLoads.map((load, i) => (
            <button
              key={i}
              onClick={() => cargo.setActiveTruck(i)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                cargo.activeTruckIndex === i
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:text-primary"
              }`}
            >
              Caminhão {i + 1} ({load.occupancyPercent}%)
            </button>
          ))}
        </div>
      )}

      {/* Active truck label (always visible when there are auto-placed loads) */}
      {cargo.autoPlacedLoads.length > 0 && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
          <span className="font-medium">
            {hasMultipleTrucks
              ? `Caminhão ${cargo.activeTruckIndex + 1} de ${totalTrucks}`
              : "Caminhão 1 de 1"}
          </span>
          {activeTruckLoad && (
            <span className="text-slate-400">
              {activeTruckLoad.items.length} itens &middot; {activeTruckLoad.occupancyPercent}% ocupado
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full flex-1 min-h-[500px]">
        {/* Mobile: sidebar at top as horizontal strip */}
        <div className="block md:hidden">
          <DragPanel
            items={items}
            selectedItem={selectedCatalogItem}
            onSelectItem={handleSelectCatalogItem}
            onDeselectItem={handleDeselectCatalogItem}
            onClearAll={cargo.clearAll}
            stats={cargo.stats}
            compact
          />
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative min-h-[400px] md:min-h-0 bg-gradient-to-br from-slate-100 to-slate-200">
          {/* Occupancy stats overlay */}
          <OccupancyStats stats={cargo.stats} />

          {/* Instruction hint when item is selected */}
          {selectedCatalogItem && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-1.5 text-xs text-slate-600 shadow-md pointer-events-none">
              Clique no caminhão para posicionar{" "}
              <span className="font-semibold">{selectedCatalogItem.nome}</span>
            </div>
          )}

          <Canvas
            className="w-full h-full min-h-[500px]"
            camera={{
              position: cameraPosition,
              fov: 45,
              near: 0.1,
              far: 500,
            }}
            shadows
            onPointerMissed={handleCanvasBackgroundClick}
          >
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[truckCenterX + 10, truckCenterY + 15, truckCenterZ + 10]}
              intensity={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[truckCenterX - 5, truckCenterY + 8, truckCenterZ - 5]}
              intensity={0.3}
            />

            {/* Camera controls */}
            <CameraControls
              truckCenterX={truckCenterX}
              truckCenterY={truckCenterY}
              truckCenterZ={truckCenterZ}
            />

            {/* Truck container (walls + floor) */}
            <TruckContainer
              truck={truck}
              onFloorPointerMove={handleFloorPointerMove}
              onFloorClick={handleFloorClick}
            />

            {/* Floor grid */}
            <CargoGrid truck={truck} />

            {/* Placed items */}
            {cargo.placedItems.map((item) => (
              <CargoBlock
                key={item.instanceId}
                item={item}
                isSelected={cargo.selectedItemId === item.instanceId}
                onSelect={cargo.selectItem}
                onRemove={cargo.removeItem}
              />
            ))}

            {/* Drag preview ghost */}
            <DragPreviewGhost preview={cargo.dragPreview} />
          </Canvas>
        </div>

        {/* Desktop: sidebar on the right */}
        <div className="hidden md:block">
          <DragPanel
            items={items}
            selectedItem={selectedCatalogItem}
            onSelectItem={handleSelectCatalogItem}
            onDeselectItem={handleDeselectCatalogItem}
            onClearAll={cargo.clearAll}
            stats={cargo.stats}
          />
        </div>
      </div>
    </div>
  );
}
