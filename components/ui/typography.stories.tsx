import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sistema tipografico do MudaFacil. Usa a fonte Inter (via Google Fonts) com Tailwind CSS. Todas as classes abaixo vem direto do Tailwind — nao ha componentes wrapper. Altere o globals.css ou tailwind.config para impactar todo o produto.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ============================================
// ESCALA TIPOGRAFICA COMPLETA
// ============================================
export const TypeScale: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-6xl / 60px / font-bold</p>
        <p className="text-6xl font-bold text-foreground tracking-tight">Mude sem estresse</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-5xl / 48px / font-bold</p>
        <p className="text-5xl font-bold text-foreground tracking-tight">Cada caixa no lugar certo</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-4xl / 36px / font-bold</p>
        <p className="text-4xl font-bold text-foreground tracking-tight">Planeje sua mudanca</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-3xl / 30px / font-bold</p>
        <p className="text-3xl font-bold text-foreground">Precos simples e transparentes</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-2xl / 24px / font-semibold</p>
        <p className="text-2xl font-semibold text-foreground">Minhas Mudancas</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-xl / 20px / font-semibold</p>
        <p className="text-xl font-semibold text-foreground">Detalhes da Mudanca</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-lg / 18px / font-medium</p>
        <p className="text-lg font-medium text-foreground">Resumo da carga</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-base / 16px / font-normal</p>
        <p className="text-base text-foreground">Monte visualmente a carga da sua mudanca com drag & drop.</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-sm / 14px / font-normal</p>
        <p className="text-sm text-foreground">Compare tamanhos de caminhao em tempo real.</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">text-xs / 12px / font-normal</p>
        <p className="text-xs text-foreground">Volume total: 3,5 m3</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Escala completa de tamanhos tipograficos usados no MudaFacil, de text-6xl a text-xs.',
      },
    },
  },
};

// ============================================
// PESOS TIPOGRAFICOS
// ============================================
export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      {[
        { weight: 'font-normal', label: 'Normal (400)', sample: 'Receba cotacoes instantaneas' },
        { weight: 'font-medium', label: 'Medium (500)', sample: 'Receba cotacoes instantaneas' },
        { weight: 'font-semibold', label: 'Semibold (600)', sample: 'Receba cotacoes instantaneas' },
        { weight: 'font-bold', label: 'Bold (700)', sample: 'Receba cotacoes instantaneas' },
        { weight: 'font-extrabold', label: 'Extrabold (800)', sample: 'Receba cotacoes instantaneas' },
      ].map(({ weight, label, sample }) => (
        <div key={weight} className="flex items-baseline gap-6">
          <span className="text-xs font-mono text-muted-foreground w-40 shrink-0">{label}</span>
          <p className={`text-xl text-foreground ${weight}`}>{sample}</p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pesos tipograficos disponiveis com a fonte Inter.',
      },
    },
  },
};

// ============================================
// CORES DE TEXTO
// ============================================
export const TextColors: Story = {
  render: () => (
    <div className="space-y-4">
      {[
        { className: 'text-foreground', label: 'foreground', desc: 'Texto principal' },
        { className: 'text-muted-foreground', label: 'muted-foreground', desc: 'Texto secundario / descricoes' },
        { className: 'text-primary', label: 'primary (#E84225)', desc: 'Links, destaques, brand' },
        { className: 'text-destructive', label: 'destructive', desc: 'Erros, alertas, remocao' },
        { className: 'text-accent-foreground', label: 'accent-foreground', desc: 'Texto sobre fundo accent' },
      ].map(({ className, label, desc }) => (
        <div key={className} className="flex items-center gap-6">
          <span className="text-xs font-mono text-muted-foreground w-52 shrink-0">{label}</span>
          <p className={`text-lg font-medium ${className}`}>Mudanca confirmada</p>
          <span className="text-xs text-muted-foreground">{desc}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cores semanticas de texto do design system, definidas como CSS custom properties no globals.css.',
      },
    },
  },
};

// ============================================
// HEADINGS SEMANTICOS
// ============================================
export const SemanticHeadings: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <p className="text-xs font-mono text-muted-foreground mb-2">Landing Page — Hero</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
          Arraste seus moveis, escolha o caminhao e <span className="text-primary">mude sem estresse</span>
        </h1>
      </div>
      <div className="border-b pb-6">
        <p className="text-xs font-mono text-muted-foreground mb-2">Landing Page — Section Title</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Planeje sua mudanca do jeito certo
        </h2>
      </div>
      <div className="border-b pb-6">
        <p className="text-xs font-mono text-muted-foreground mb-2">Dashboard — Page Title</p>
        <h2 className="text-2xl font-bold text-foreground">
          Minhas Mudancas
        </h2>
      </div>
      <div className="border-b pb-6">
        <p className="text-xs font-mono text-muted-foreground mb-2">Card — Title</p>
        <h3 className="text-lg font-semibold text-foreground">
          Sao Paulo → Rio de Janeiro
        </h3>
      </div>
      <div className="border-b pb-6">
        <p className="text-xs font-mono text-muted-foreground mb-2">Section — Subtitle / Kicker</p>
        <span className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
          +2.000 mudancas realizadas
        </span>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">Panel — Label</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Resumo da carga
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Hierarquia de headings usados nas paginas do MudaFacil, de Hero a labels de painel.',
      },
    },
  },
};

// ============================================
// BODY TEXT
// ============================================
export const BodyText: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">Paragrafo principal — text-lg</p>
        <p className="text-lg leading-8 text-muted-foreground">
          Monte visualmente a carga da sua mudanca com drag & drop, compare
          tamanhos de caminhao em tempo real e receba cotacoes instantaneas de
          transportadoras avaliadas.
        </p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">Paragrafo padrao — text-base</p>
        <p className="text-base leading-7 text-muted-foreground">
          Mudar de casa e mais do que transportar moveis — e comecar um novo capitulo.
          Por isso, cada mudanca que planejamos chega intacta, no horario combinado
          e sem surpresas no orcamento.
        </p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">Texto de apoio — text-sm</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Arraste icones de moveis para dentro de um container virtual com dimensao
          proporcional real. Visualize a carga antes de contratar.
        </p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">Caption — text-xs</p>
        <p className="text-xs text-muted-foreground">
          Volume total: 3,5 m3 | Peso estimado: 820 kg | Ocupacao: 68%
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estilos de texto para paragrafos e descricoes, do maior ao menor.',
      },
    },
  },
};

// ============================================
// MONOSPACE / CODIGO
// ============================================
export const Monospace: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">font-mono — Dados tecnicos / IDs</p>
        <p className="font-mono text-sm text-foreground">mud_002 | carga_layout_001</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">font-mono — Valores numericos</p>
        <p className="font-mono text-2xl font-bold text-foreground">R$ 29,90<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">font-mono — Inline code</p>
        <p className="text-sm text-foreground">
          Use a classe <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs text-primary">text-primary</code> para destaques em vermelho.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fonte monospace (Geist Mono) para IDs, valores e trechos de codigo.',
      },
    },
  },
};

// ============================================
// TRACKING & LEADING
// ============================================
export const TrackingAndLeading: Story = {
  render: () => (
    <div className="max-w-xl space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">tracking-tight — Headlines</p>
        <p className="text-3xl font-bold tracking-tight text-foreground">Planeje sua mudanca do jeito certo</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">tracking-wide + uppercase — Kickers / Labels</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Itens da mudanca</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">leading-relaxed — Body copy longo</p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Ferramentas visuais que eliminam a incerteza e ajudam voce a chegar
          no novo lar sem surpresas. Compare transportadoras, organize seus itens
          e tenha controle total do orcamento.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Letter-spacing (tracking) e line-height (leading) usados no design system.',
      },
    },
  },
};

// ============================================
// REFERENCIA COMPLETA
// ============================================
export const FullReference: Story = {
  render: () => (
    <div className="max-w-3xl space-y-12">
      {/* Simula uma pagina real */}
      <div className="space-y-2">
        <span className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
          +2.000 mudancas realizadas
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Cada caixa no lugar certo. <span className="text-primary">Cada cliente satisfeito.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mt-4">
          Mudar de casa e mais do que transportar moveis — e comecar um novo capitulo.
          Por isso, cada mudanca que planejamos chega intacta, no horario combinado
          e sem surpresas no orcamento.
        </p>
      </div>

      <hr className="border-border" />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Minhas Mudancas</h2>
        <div className="rounded-xl border bg-card p-6 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Sao Paulo → Rio de Janeiro</h3>
          <p className="text-sm text-muted-foreground">Mudanca residencial com 24 itens</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Volume: <strong className="text-foreground">8,2 m3</strong></span>
            <span>Peso: <strong className="text-foreground">1.420 kg</strong></span>
            <span>Ocupacao: <strong className="text-primary">68%</strong></span>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resumo da carga</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border bg-card p-4">
            <p className="font-mono text-2xl font-bold text-foreground">3,5</p>
            <p className="text-xs text-muted-foreground mt-1">Volume (m3)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-mono text-2xl font-bold text-foreground">820</p>
            <p className="text-xs text-muted-foreground mt-1">Peso (kg)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-mono text-2xl font-bold text-primary">68%</p>
            <p className="text-xs text-muted-foreground mt-1">Ocupacao</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Referencia completa mostrando como a tipografia funciona em contexto real — landing page, dashboard e paineis de dados.',
      },
    },
  },
};
