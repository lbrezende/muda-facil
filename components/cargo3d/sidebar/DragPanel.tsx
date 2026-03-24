"use client";

import type { Cargo3DStats } from "@/lib/cargo3d/cargo-types";
import { DragPanelItem } from "./DragPanelItem";
import { Button } from "@/components/ui/button";
import { getCategoryColor } from "@/lib/cargo3d/cargo-colors";

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

interface DragPanelProps {
  items: CatalogItem[];
  selectedItem: CatalogItem | null;
  onSelectItem: (item: CatalogItem) => void;
  onDeselectItem: () => void;
  onClearAll: () => void;
  stats: Cargo3DStats;
  /** When true, renders horizontal scrollable strip (mobile) */
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  QUARTO: "Quarto",
  COZINHA: "Cozinha",
  SALA: "Sala",
  ESCRITORIO: "Escritório",
  BANHEIRO: "Banheiro",
  AREA_SERVICO: "Área de Serviço",
  CAIXAS: "Caixas",
};

export function DragPanel({
  items,
  selectedItem,
  onSelectItem,
  onDeselectItem,
  onClearAll,
  stats,
  compact = false,
}: DragPanelProps) {
  function handleSelect(item: CatalogItem) {
    if (selectedItem?.id === item.id) {
      onDeselectItem();
    } else {
      onSelectItem(item);
    }
  }

  if (compact) {
    return (
      <div className="w-full h-20 bg-white border-b border-slate-200 flex items-center gap-0 px-2 overflow-x-auto scrollbar-hide flex-shrink-0">
        {/* Instruction */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center px-2 mr-1 text-center min-w-[72px]">
          <span className="text-[9px] text-slate-400 leading-tight">
            Selecione e clique no caminhão
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-slate-200 mr-2 flex-shrink-0" />

        {/* Items */}
        <div className="flex items-center gap-1.5">
          {items.map((item) => (
            <DragPanelItem
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onSelect={handleSelect}
              compact
            />
          ))}
        </div>
      </div>
    );
  }

  // Group items by category
  const byCategory: Record<string, CatalogItem[]> = {};
  for (const item of items) {
    if (!byCategory[item.categoria]) byCategory[item.categoria] = [];
    byCategory[item.categoria].push(item);
  }

  return (
    <div className="w-72 h-full flex flex-col bg-white border-l border-slate-200 overflow-hidden flex-shrink-0">
      {/* Stats header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Resumo
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-slate-800">{stats.itemCount}</p>
            <p className="text-[10px] text-slate-400">itens</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">
              {stats.totalVolumeM3.toFixed(1)}
            </p>
            <p className="text-[10px] text-slate-400">m³</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{stats.occupancyPercent}%</p>
            <p className="text-[10px] text-slate-400">cheio</p>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100">
        <p className="text-[11px] text-blue-600 leading-snug">
          Selecione um item e clique no caminhão para posicionar
        </p>
      </div>

      {/* Items list by category */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {Object.entries(byCategory).map(([cat, catItems]) => (
          <div key={cat}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {CATEGORY_LABELS[cat] || cat}
              </p>
            </div>
            <div className="space-y-1">
              {catItems.map((item) => (
                <DragPanelItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 text-xs"
          onClick={onClearAll}
          disabled={stats.itemCount === 0}
        >
          Limpar tudo
        </Button>
      </div>
    </div>
  );
}
