import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CATEGORY_COLORS, CATEGORY_COLORS_LIGHT } from '@/lib/cargo3d/cargo-colors';

const meta: Meta = {
  title: 'Foundations/Cargo Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mapeamento de categorias de items para cores no canvas 3D. As cores sao usadas para colorir os blocos 3D no TruckCanvas3D, os icones de categoria no DragPanel e os dots de categoria em toda a UI. Cada categoria tem uma cor cheia (CATEGORY_COLORS) e uma versao clara (CATEGORY_COLORS_LIGHT).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const CATEGORY_LABELS: Record<string, string> = {
  QUARTO: 'Quarto',
  COZINHA: 'Cozinha',
  SALA: 'Sala',
  ESCRITORIO: 'Escritorio',
  BANHEIRO: 'Banheiro',
  AREA_SERVICO: 'Area de Servico',
  CAIXAS: 'Caixas',
};

const CATEGORY_ITEMS: Record<string, string[]> = {
  QUARTO: ['Cama casal', 'Guarda-roupa', 'Comoda', 'Criado-mudo'],
  COZINHA: ['Geladeira', 'Fogao', 'Microondas', 'Forno'],
  SALA: ['Sofa', 'Rack TV', 'Mesa centro', 'Poltrona'],
  ESCRITORIO: ['Mesa escritorio', 'Gaveteiro', 'Impressora'],
  BANHEIRO: ['Armario banheiro', 'Espelho grande'],
  AREA_SERVICO: ['Maquina lavar', 'Secadora', 'Tanque', 'Tabua passar'],
  CAIXAS: ['Caixa P', 'Caixa M', 'Caixa G', 'Caixa livros', 'Mala grande'],
};

// ============================================================
// STORY: Side-by-side swatches
// ============================================================
export const CategoryColorSwatches: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <p className="text-sm text-muted-foreground max-w-xl">
        Cada categoria usa uma cor cheia para o bloco 3D e o icone do sidebar, e uma versao clara como fundo de badge
        ou highlight sutil.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(CATEGORY_COLORS).map((cat) => {
          const full = CATEGORY_COLORS[cat];
          const light = CATEGORY_COLORS_LIGHT[cat];
          const label = CATEGORY_LABELS[cat] || cat;
          return (
            <div key={cat} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              {/* Color pair preview */}
              <div className="flex gap-2 flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-lg shadow-sm border"
                  style={{ backgroundColor: full }}
                  title={`${label} — full`}
                />
                <div
                  className="w-12 h-12 rounded-lg shadow-sm border"
                  style={{ backgroundColor: light }}
                  title={`${label} — light`}
                />
              </div>
              {/* Info */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs font-mono text-muted-foreground">Cheia: {full}</p>
                <p className="text-xs font-mono text-muted-foreground">Clara: {light}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {cat}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Swatches lado a lado de cor cheia e cor clara para cada categoria.',
      },
    },
  },
};

// ============================================================
// STORY: Full palette grid
// ============================================================
export const FullPaletteGrid: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          CATEGORY_COLORS — Cores cheias (blocos 3D, icones de sidebar)
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="space-y-2 text-center">
              <div
                className="w-full h-20 rounded-xl shadow-sm border"
                style={{ backgroundColor: color }}
              />
              <p className="text-xs font-semibold text-foreground">{CATEGORY_LABELS[cat] || cat}</p>
              <p className="text-xs font-mono text-muted-foreground">{color}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          CATEGORY_COLORS_LIGHT — Versoes claras (badges, highlights, backgrounds)
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_COLORS_LIGHT).map(([cat, color]) => (
            <div key={cat} className="space-y-2 text-center">
              <div
                className="w-full h-20 rounded-xl shadow-sm border"
                style={{ backgroundColor: color }}
              />
              <p className="text-xs font-semibold text-foreground">{CATEGORY_LABELS[cat] || cat}</p>
              <p className="text-xs font-mono text-muted-foreground">{color}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grade completa com todas as cores de categoria em suas duas variantes: cheia e clara.',
      },
    },
  },
};

// ============================================================
// STORY: Colors in context (category badges)
// ============================================================
export const ColorsInContext: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Badges de categoria
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CATEGORY_COLORS).map((cat) => {
            const full = CATEGORY_COLORS[cat];
            const light = CATEGORY_COLORS_LIGHT[cat];
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: light, color: full }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: full }} />
                {CATEGORY_LABELS[cat] || cat}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Blocos simulando canvas 3D (cor cheia)
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div
              key={cat}
              className="rounded-lg flex items-center justify-center text-white text-[10px] font-semibold shadow-md"
              style={{ backgroundColor: color, width: 72, height: 48, opacity: 0.9 }}
            >
              {CATEGORY_LABELS[cat] || cat}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Listas agrupadas por categoria
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(CATEGORY_ITEMS).map(([cat, items]) => {
            const color = CATEGORY_COLORS[cat];
            const light = CATEGORY_COLORS_LIGHT[cat];
            return (
              <div key={cat} className="rounded-xl border border-border overflow-hidden">
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ backgroundColor: light }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-semibold" style={{ color }}>
                    {CATEGORY_LABELS[cat] || cat}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Cores aplicadas em contexto real: badges de categoria, blocos simulando o canvas 3D, e listas agrupadas por categoria.',
      },
    },
  },
};

// ============================================================
// STORY: Color contrast check
// ============================================================
export const ContrastCheck: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <p className="text-sm text-muted-foreground max-w-xl">
        Verificacao visual de contraste: texto branco sobre cor cheia, texto de cor sobre fundo claro.
        Use para validar legibilidade em badges e labels.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(CATEGORY_COLORS).map((cat) => {
          const full = CATEGORY_COLORS[cat];
          const light = CATEGORY_COLORS_LIGHT[cat];
          const label = CATEGORY_LABELS[cat] || cat;
          return (
            <div key={cat} className="flex overflow-hidden rounded-xl border border-border shadow-sm">
              <div
                className="flex-1 flex flex-col items-center justify-center py-4 text-white text-sm font-semibold"
                style={{ backgroundColor: full }}
              >
                <span>{label}</span>
                <span className="text-xs font-normal opacity-80 mt-0.5">{full}</span>
              </div>
              <div
                className="flex-1 flex flex-col items-center justify-center py-4 text-sm font-semibold"
                style={{ backgroundColor: light, color: full }}
              >
                <span>{label}</span>
                <span className="text-xs font-normal opacity-70 mt-0.5">{light}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Checagem visual de contraste: esquerda = texto branco sobre cor cheia, direita = texto de cor sobre fundo claro.',
      },
    },
  },
};
