"use client";

import { Html } from "@react-three/drei";
import { getCategoryColor } from "@/lib/cargo3d/cargo-colors";
import type { PlacedItem3D } from "@/lib/cargo3d/cargo-types";

interface ItemTooltip3DProps {
  item: PlacedItem3D;
}

const CATEGORY_LABELS: Record<string, string> = {
  QUARTO: "Quarto",
  COZINHA: "Cozinha",
  SALA: "Sala",
  ESCRITORIO: "Escritório",
  BANHEIRO: "Banheiro",
  AREA_SERVICO: "Área Serviço",
  CAIXAS: "Caixas",
};

export function ItemTooltip3D({ item }: ItemTooltip3DProps) {
  const categoryColor = getCategoryColor(item.categoria);
  const categoryLabel = CATEGORY_LABELS[item.categoria] || item.categoria;

  return (
    <Html
      distanceFactor={20}
      style={{ pointerEvents: "none" }}
      position={[item.gw / 2, item.gh + 0.3, item.gd / 2]}
    >
      <div
        className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg px-2.5 py-2 text-xs whitespace-nowrap"
        style={{ transform: "translateX(-50%)" }}
      >
        <p className="font-semibold text-slate-800 mb-1">{item.nome}</p>
        <div
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 mb-1"
          style={{ backgroundColor: categoryColor + "25" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="text-[10px] font-medium" style={{ color: categoryColor }}>
            {categoryLabel}
          </span>
        </div>
        <div className="text-slate-500 space-y-0.5">
          <p>
            {item.larguraCm}×{item.alturaCm}×{item.profundidadeCm} cm
          </p>
          <p>
            {item.pesoKg} kg · {item.volumeM3} m³
          </p>
        </div>
      </div>
    </Html>
  );
}
