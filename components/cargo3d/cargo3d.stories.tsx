import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { DragPanelItem } from '@/components/cargo3d/sidebar/DragPanelItem';
import { DragPanel } from '@/components/cargo3d/sidebar/DragPanel';
import { OccupancyStats } from '@/components/cargo3d/OccupancyStats';
import type { Cargo3DStats } from '@/lib/cargo3d/cargo-types';

const meta: Meta = {
  title: 'Components/Cargo 3D',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Componentes do canvas de visualizacao 3D de carga do MudaFacil. O TruckCanvas3D usa Three.js via @react-three/fiber e requer carregamento dinamico com ssr:false. Os demais componentes (DragPanel, OccupancyStats) sao HTML puro e renderizam normalmente.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ============================================================
// Shared mock data
// ============================================================

const MOCK_ITEM_QUARTO = {
  id: 'item-1',
  nome: 'Cama casal',
  categoria: 'QUARTO',
  larguraCm: 160,
  alturaCm: 40,
  profundidadeCm: 200,
  pesoKg: 60,
  volumeM3: 1.28,
};

const MOCK_ITEM_SALA = {
  id: 'item-2',
  nome: 'Sofá 3 lugares',
  categoria: 'SALA',
  larguraCm: 210,
  alturaCm: 85,
  profundidadeCm: 90,
  pesoKg: 45,
  volumeM3: 1.6,
};

const MOCK_ITEM_COZINHA = {
  id: 'item-3',
  nome: 'Geladeira',
  categoria: 'COZINHA',
  larguraCm: 70,
  alturaCm: 180,
  profundidadeCm: 70,
  pesoKg: 80,
  volumeM3: 0.88,
};

const MOCK_ITEM_ESCRITORIO = {
  id: 'item-4',
  nome: 'Mesa de escritório',
  categoria: 'ESCRITORIO',
  larguraCm: 140,
  alturaCm: 75,
  profundidadeCm: 70,
  pesoKg: 30,
  volumeM3: 0.74,
};

const MOCK_ITEM_CAIXA = {
  id: 'item-5',
  nome: 'Caixa M',
  categoria: 'CAIXAS',
  larguraCm: 50,
  alturaCm: 40,
  profundidadeCm: 40,
  pesoKg: 15,
  volumeM3: 0.08,
};

const MOCK_ITEM_AREA_SERVICO = {
  id: 'item-6',
  nome: 'Máquina de lavar',
  categoria: 'AREA_SERVICO',
  larguraCm: 60,
  alturaCm: 85,
  profundidadeCm: 60,
  pesoKg: 70,
  volumeM3: 0.31,
};

const ALL_MOCK_ITEMS = [
  MOCK_ITEM_QUARTO,
  MOCK_ITEM_SALA,
  MOCK_ITEM_COZINHA,
  MOCK_ITEM_ESCRITORIO,
  MOCK_ITEM_CAIXA,
  MOCK_ITEM_AREA_SERVICO,
];

function makeStats(overrides: Partial<Cargo3DStats> = {}): Cargo3DStats {
  return {
    totalVolumeM3: 2.4,
    totalPesoKg: 185,
    occupancyPercent: 30,
    itemCount: 3,
    truckCapacidadeM3: 8,
    truckCapacidadeKg: 1500,
    ...overrides,
  };
}

// ============================================================
// A) DragPanelItem — individual sidebar item cards
// ============================================================
export const DragPanelItemDefault: Story = {
  name: 'DragPanelItem — Default',
  render: () => (
    <div className="space-y-6 p-4 max-w-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Estado padrao (nao selecionado)
        </p>
        <div className="space-y-1.5">
          {ALL_MOCK_ITEMS.map((item) => (
            <DragPanelItem
              key={item.id}
              item={item}
              isSelected={false}
              onSelect={() => {}}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Estado selecionado
        </p>
        <div className="space-y-1.5">
          {ALL_MOCK_ITEMS.slice(0, 2).map((item) => (
            <DragPanelItem
              key={item.id}
              item={item}
              isSelected={true}
              onSelect={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Item individual do sidebar do canvas 3D. Componente HTML puro (sem Three.js). Mostra estados padrao e selecionado para diferentes categorias.',
      },
    },
  },
};

export const DragPanelItemCompact: Story = {
  name: 'DragPanelItem — Compact (mobile)',
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Modo compacto — tira horizontal (mobile)
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_MOCK_ITEMS.map((item, i) => (
            <DragPanelItem
              key={item.id}
              item={item}
              isSelected={i === 1}
              onSelect={() => {}}
              compact
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Comparativo: compacto vs padrao para o mesmo item
        </p>
        <div className="flex items-start gap-6 flex-wrap">
          <div>
            <p className="text-[10px] text-muted-foreground mb-2">Compacto</p>
            <DragPanelItem
              item={MOCK_ITEM_QUARTO}
              isSelected={false}
              onSelect={() => {}}
              compact
            />
          </div>
          <div className="w-56">
            <p className="text-[10px] text-muted-foreground mb-2">Padrao</p>
            <DragPanelItem
              item={MOCK_ITEM_QUARTO}
              isSelected={false}
              onSelect={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Variante compacta usada na tira horizontal de mobile. Exibe icone menor e nome truncado.',
      },
    },
  },
};

// ============================================================
// B) DragPanel — full sidebar
// ============================================================
function DragPanelInteractive({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<typeof MOCK_ITEM_QUARTO | null>(null);
  const stats = makeStats({ itemCount: 2, totalVolumeM3: 2.0, occupancyPercent: 25 });
  return (
    <DragPanel
      items={ALL_MOCK_ITEMS}
      selectedItem={selected}
      onSelectItem={setSelected}
      onDeselectItem={() => setSelected(null)}
      onClearAll={() => {}}
      stats={stats}
      compact={compact}
    />
  );
}

export const DragPanelDesktop: Story = {
  name: 'DragPanel — Desktop sidebar',
  render: () => (
    <div style={{ height: 600 }} className="flex border border-border rounded-xl overflow-hidden">
      <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Canvas 3D aqui</p>
      </div>
      <DragPanelInteractive />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar completo de desktop. Clique em um item para seleciona-lo (interativo). Itens agrupados por categoria com cor de categoria.',
      },
    },
  },
};

export const DragPanelMobile: Story = {
  name: 'DragPanel — Mobile strip',
  render: () => (
    <div style={{ height: 500 }} className="flex flex-col border border-border rounded-xl overflow-hidden">
      <DragPanelInteractive compact />
      <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Canvas 3D aqui</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Variante mobile: tira horizontal scrollavel no topo. Clique em um item para seleciona-lo.',
      },
    },
  },
};

// ============================================================
// C) OccupancyStats — stats overlay panel
// ============================================================
export const OccupancyStatsLow: Story = {
  name: 'OccupancyStats — 30% (normal)',
  render: () => (
    <div className="relative w-72 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-border overflow-hidden">
      <OccupancyStats stats={makeStats({ occupancyPercent: 30, itemCount: 3, totalVolumeM3: 2.4 })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Painel de ocupacao com nivel baixo (verde). Indica carga confortavel.',
      },
    },
  },
};

export const OccupancyStatsMedium: Story = {
  name: 'OccupancyStats — 75% (atencao)',
  render: () => (
    <div className="relative w-72 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-border overflow-hidden">
      <OccupancyStats stats={makeStats({ occupancyPercent: 75, itemCount: 9, totalVolumeM3: 6.0, totalPesoKg: 620 })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Painel de ocupacao com nivel medio (ambar). Indica carga proxima do limite.',
      },
    },
  },
};

export const OccupancyStatsHigh: Story = {
  name: 'OccupancyStats — 95% (critico)',
  render: () => (
    <div className="relative w-72 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-border overflow-hidden">
      <OccupancyStats stats={makeStats({ occupancyPercent: 95, itemCount: 15, totalVolumeM3: 7.6, totalPesoKg: 1420 })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Painel de ocupacao com nivel critico (vermelho). Indica carga quase no limite.',
      },
    },
  },
};

export const OccupancyStatsAll: Story = {
  name: 'OccupancyStats — Todos os niveis',
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      {[
        { pct: 30, label: '30% — Normal', items: 3, vol: 2.4, peso: 185 },
        { pct: 75, label: '75% — Atencao', items: 9, vol: 6.0, peso: 620 },
        { pct: 95, label: '95% — Critico', items: 15, vol: 7.6, peso: 1420 },
      ].map(({ pct, label, items, vol, peso }) => (
        <div key={pct} className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground">{label}</p>
          <div className="relative w-52 h-44 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-border overflow-hidden">
            <OccupancyStats
              stats={makeStats({
                occupancyPercent: pct,
                itemCount: items,
                totalVolumeM3: vol,
                totalPesoKg: peso,
              })}
            />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Os tres estados de ocupacao lado a lado: verde (normal), ambar (atencao) e vermelho (critico).',
      },
    },
  },
};

// ============================================================
// D) Full 3D Canvas — dynamic import with ssr:false
// ============================================================

const TruckCanvas3DDynamic = dynamic(
  () => import('@/components/cargo3d/TruckCanvas3D').then((m) => ({ default: m.TruckCanvas3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-sm text-muted-foreground">
        Carregando canvas 3D...
      </div>
    ),
  },
);

const BAU_TRUCK = {
  larguraCm: 240,
  alturaCm: 240,
  comprimentoCm: 600,
  capacidadeM3: 28,
  capacidadeKg: 3000,
  mudancaId: 'story-mudanca-001',
};

export const FullCanvas3D: Story = {
  name: 'TruckCanvas3D — Caminhao Bau',
  render: () => (
    <div className="space-y-3">
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
        Interaja com o mouse: clique em um item do sidebar e depois clique no caminhao para posicionar.
        Arraste para orbitar, scroll para zoom.
      </div>
      <div style={{ height: 600 }} className="border border-border rounded-xl overflow-hidden">
        <TruckCanvas3DDynamic
          {...BAU_TRUCK}
          items={ALL_MOCK_ITEMS}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Canvas 3D completo com caminhao Bau (600x240x240cm). Carregado via dynamic import com ssr:false para evitar conflitos com o ambiente SSR do Storybook. Three.js renderiza apenas no browser.',
      },
    },
  },
};

export const FullCanvas3DSmallTruck: Story = {
  name: 'TruckCanvas3D — Fiorino (pequeno)',
  render: () => (
    <div className="space-y-3">
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
        Interaja com o mouse: clique em um item do sidebar e depois clique no caminhao para posicionar.
        Arraste para orbitar, scroll para zoom.
      </div>
      <div style={{ height: 600 }} className="border border-border rounded-xl overflow-hidden">
        <TruckCanvas3DDynamic
          larguraCm={140}
          alturaCm={130}
          comprimentoCm={200}
          capacidadeM3={3.6}
          capacidadeKg={600}
          mudancaId="story-fiorino-001"
          items={[MOCK_ITEM_CAIXA, MOCK_ITEM_ESCRITORIO]}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Canvas 3D com Fiorino (140x130x200cm) — caminhao menor para mudancas leves. Util para testar o comportamento quando o espaco e limitado.',
      },
    },
  },
};
