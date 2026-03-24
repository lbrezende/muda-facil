"use client";

import { useRef } from "react";
import { Edges } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import type { TruckGridDims } from "@/lib/cargo3d/cargo-types";

interface TruckContainerProps {
  truck: TruckGridDims;
  onFloorPointerMove?: (worldX: number, worldZ: number) => void;
  onFloorClick?: (worldX: number, worldZ: number) => void;
}

export function TruckContainer({
  truck,
  onFloorPointerMove,
  onFloorClick,
}: TruckContainerProps) {
  const { gw, gh, gd } = truck;
  const cx = gw / 2;
  const cy = gh / 2;
  const cz = gd / 2;
  const wallThickness = 0.05;

  function handleFloorPointerMove(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (onFloorPointerMove) {
      onFloorPointerMove(e.point.x, e.point.z);
    }
  }

  function handleFloorClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    if (onFloorClick) {
      onFloorClick(e.point.x, e.point.z);
    }
  }

  return (
    <group>
      {/* Outer wireframe shell — semi-transparent walls */}
      {/* Left wall */}
      <mesh position={[0, cy, cz]}>
        <boxGeometry args={[wallThickness, gh, gd]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.08} depthWrite={false} />
        <Edges color="#334155" lineWidth={1} />
      </mesh>

      {/* Right wall */}
      <mesh position={[gw, cy, cz]}>
        <boxGeometry args={[wallThickness, gh, gd]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.08} depthWrite={false} />
        <Edges color="#334155" lineWidth={1} />
      </mesh>

      {/* Front wall (z=0) */}
      <mesh position={[cx, cy, 0]}>
        <boxGeometry args={[gw, gh, wallThickness]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.08} depthWrite={false} />
        <Edges color="#334155" lineWidth={1} />
      </mesh>

      {/* Back wall (z=gd) — more transparent (open back) */}
      <mesh position={[cx, cy, gd]}>
        <boxGeometry args={[gw, gh, wallThickness]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.04} depthWrite={false} />
        <Edges color="#64748b" lineWidth={1} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[cx, gh, cz]}>
        <boxGeometry args={[gw, wallThickness, gd]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.06} depthWrite={false} />
        <Edges color="#334155" lineWidth={1} />
      </mesh>

      {/* Floor — visible + clickable */}
      <mesh
        position={[cx, 0, cz]}
        onPointerMove={handleFloorPointerMove}
        onClick={handleFloorClick}
        receiveShadow
      >
        <boxGeometry args={[gw, wallThickness * 2, gd]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.25} />
      </mesh>

      {/* Invisible floor plane for raycasting (ensures hits even with items on top) */}
      <mesh
        position={[cx, 0.001, cz]}
        onPointerMove={handleFloorPointerMove}
        onClick={handleFloorClick}
        visible={false}
      >
        <planeGeometry args={[gw, gd]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
