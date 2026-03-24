"use client";

import { useRef, useState, useCallback } from "react";
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
}: TruckCanvas3DProps) {
  const cargo = useCargo3D({
    larguraCm,
    alturaCm,
    comprimentoCm,
    capacidadeM3,
    capacidadeKg,
  });

  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);
  const selectedCatalogItemRef = useRef<CatalogItem | null>(null);
  selectedCatalogItemRef.current = selectedCatalogItem;

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

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[500px]">
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
  );
}
