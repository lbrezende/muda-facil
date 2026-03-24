"use client";

import { useRef, useState } from "react";
import { Html, Edges } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import type { Mesh } from "three";
import type { PlacedItem3D } from "@/lib/cargo3d/cargo-types";
import { getCategoryColor } from "@/lib/cargo3d/cargo-colors";
import { ItemTooltip3D } from "./ItemTooltip3D";

interface CargoBlockProps {
  item: PlacedItem3D;
  isSelected: boolean;
  onSelect: (instanceId: string) => void;
  onRemove: (instanceId: string) => void;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 100, g: 100, b: 200 };
}

function brightenHex(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v: number) => Math.min(255, Math.round(v + amount));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

export function CargoBlock({
  item,
  isSelected,
  onSelect,
  onRemove,
}: CargoBlockProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseColor = getCategoryColor(item.categoria);
  const displayColor = hovered ? brightenHex(baseColor, 40) : baseColor;
  const edgeColor = isSelected ? "#ffffff" : "#1e293b";
  const edgeWidth = isSelected ? 3 : 1;

  const posX = item.gx + item.gw / 2;
  const posY = item.gy + item.gh / 2;
  const posZ = item.gz + item.gd / 2;

  const label = item.nome.length > 8 ? item.nome.slice(0, 8) + "…" : item.nome;

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    onSelect(item.instanceId);
  }

  function handlePointerOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut() {
    setHovered(false);
    document.body.style.cursor = "auto";
  }

  return (
    <group position={[posX, posY, posZ]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[item.gw * 0.97, item.gh * 0.97, item.gd * 0.97]} />
        <meshStandardMaterial color={displayColor} />
        <Edges color={edgeColor} lineWidth={edgeWidth} />
      </mesh>

      {/* Item name label */}
      {(hovered || isSelected) && (
        <Html
          distanceFactor={20}
          position={[0, item.gh / 2 + 0.15, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="bg-slate-900/90 text-white text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap"
            style={{ transform: "translateX(-50%)" }}
          >
            {label}
          </div>
        </Html>
      )}

      {/* Tooltip on hover */}
      {hovered && !isSelected && (
        <group position={[-item.gw / 2, -item.gh / 2, -item.gd / 2]}>
          <ItemTooltip3D item={item} />
        </group>
      )}

      {/* Delete button when selected */}
      {isSelected && (
        <Html
          distanceFactor={20}
          position={[0, item.gh / 2 + 0.6, 0]}
          style={{ pointerEvents: "auto" }}
        >
          <div style={{ transform: "translateX(-50%)" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.instanceId);
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg transition-colors whitespace-nowrap"
            >
              Remover
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
