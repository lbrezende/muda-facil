"use client";

import { getCategoryColor } from "@/lib/cargo3d/cargo-colors";
import { ItemIcon } from "@/components/icons/item-icons";

interface DragPanelItemData {
  id: string;
  nome: string;
  categoria: string;
  larguraCm: number;
  alturaCm: number;
  profundidadeCm: number;
  pesoKg: number;
  volumeM3: number;
}

interface DragPanelItemProps {
  item: DragPanelItemData;
  isSelected: boolean;
  onSelect: (item: DragPanelItemData) => void;
  /** When true, renders a compact horizontal pill (mobile strip) */
  compact?: boolean;
}

export function DragPanelItem({
  item,
  isSelected,
  onSelect,
  compact = false,
}: DragPanelItemProps) {
  const color = getCategoryColor(item.categoria);

  if (compact) {
    return (
      <button
        onClick={() => onSelect(item)}
        className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg border transition-all ${
          isSelected
            ? "border-primary bg-primary/10 ring-2 ring-primary"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <ItemIcon nome={item.nome} className="w-4 h-4" />
        </div>
        <span className="text-[9px] font-medium text-slate-600 max-w-[52px] truncate leading-tight">
          {item.nome}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onSelect(item)}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${
        isSelected
          ? "border-primary bg-primary/10 ring-2 ring-primary"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {/* Category dot + icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        <ItemIcon nome={item.nome} className="w-4 h-4" />
      </div>

      {/* Name + volume */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.nome}</p>
        <p className="text-[11px] text-slate-400">
          {item.volumeM3} m³ · {item.pesoKg} kg
        </p>
      </div>

      {/* Category dot */}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}
