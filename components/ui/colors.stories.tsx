import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tokens de cor do MudaFacil — paleta Trekon. Todos definidos como CSS custom properties em `globals.css`. Alterar os valores la atualiza automaticamente o site, o dashboard e o Storybook.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ColorSwatch({ name, cssVar, hex, desc }: { name: string; cssVar: string; hex: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg border shadow-sm shrink-0" style={{ backgroundColor: `var(${cssVar})` }} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs font-mono text-muted-foreground">{cssVar}</p>
        <p className="text-xs font-mono text-muted-foreground">{hex}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function ColorPair({ name, bgVar, fgVar, bgHex, fgHex, desc }: { name: string; bgVar: string; fgVar: string; bgHex: string; fgHex: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg border shadow-sm shrink-0 flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: `var(${bgVar})`, color: `var(${fgVar})` }}>Aa</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs font-mono text-muted-foreground">bg: {bgVar} ({bgHex})</p>
        <p className="text-xs font-mono text-muted-foreground">fg: {fgVar} ({fgHex})</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export const BrandColors: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Cores da Marca — Trekon</h3>
        <p className="text-sm text-muted-foreground mb-6">Paleta inspirada na identidade Trekon: vermelho container industrial, fundo neutro e preto tipografico.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="w-full h-24 rounded-xl shadow-md" style={{ backgroundColor: '#E84225' }} />
            <div><p className="text-sm font-semibold">Primary — Vermelho Container</p><p className="text-xs font-mono text-muted-foreground">#E84225</p><p className="text-xs text-muted-foreground mt-1">CTAs, links, destaques, botoes principais</p></div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-24 rounded-xl border shadow-md" style={{ backgroundColor: '#F8FAFC' }} />
            <div><p className="text-sm font-semibold">Background — Cinza Neutro</p><p className="text-xs font-mono text-muted-foreground">#F8FAFC</p><p className="text-xs text-muted-foreground mt-1">Fundo de paginas, secoes alternadas</p></div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-24 rounded-xl shadow-md" style={{ backgroundColor: '#1A1A1A' }} />
            <div><p className="text-sm font-semibold">Dark — Preto Industrial</p><p className="text-xs font-mono text-muted-foreground">#1A1A1A</p><p className="text-xs text-muted-foreground mt-1">Tipografia, headings, badges, elementos de destaque escuros</p></div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const PrimaryPalette: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Escala Primary (Vermelho Container)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'Primary / 5%', bg: '#E842250D', hex: '#E84225/5%', usage: 'Hover backgrounds' },
          { name: 'Primary / 10%', bg: '#E842251A', hex: '#E84225/10%', usage: 'Icone backgrounds' },
          { name: 'Primary / 20%', bg: '#E8422533', hex: '#E84225/20%', usage: 'Canvas items' },
          { name: 'Primary / 30%', bg: '#E842254D', hex: '#E84225/30%', usage: 'Borders dashed' },
          { name: 'Primary', bg: '#E84225', hex: '#E84225', usage: 'Botoes, links' },
          { name: 'Primary Hover', bg: '#C73820', hex: '#C73820', usage: 'Hover de CTAs' },
          { name: 'Red Dark Text', bg: '#8B2E18', hex: '#8B2E18', usage: 'Texto sobre bg vermelho claro' },
          { name: 'Primary Foreground', bg: '#FFFFFF', hex: '#FFFFFF', usage: 'Texto sobre primary' },
        ].map((c) => (
          <div key={c.name} className="space-y-2">
            <div className="w-full h-16 rounded-lg border shadow-sm" style={{ backgroundColor: c.bg }} />
            <p className="text-xs font-semibold text-foreground">{c.name}</p>
            <p className="text-xs font-mono text-muted-foreground">{c.hex}</p>
            <p className="text-xs text-muted-foreground">{c.usage}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SemanticTokens: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Tokens Semanticos</h3>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Backgrounds</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorSwatch name="Background" cssVar="--background" hex="#F8FAFC" desc="Fundo principal de paginas" />
          <ColorSwatch name="Card" cssVar="--card" hex="#FFFFFF" desc="Fundo de cards e paineis" />
          <ColorSwatch name="Popover" cssVar="--popover" hex="#FFFFFF" desc="Fundo de dropdowns e tooltips" />
          <ColorSwatch name="Muted" cssVar="--muted" hex="#F5F5F5" desc="Fundo de areas secundarias" />
          <ColorSwatch name="Accent" cssVar="--accent" hex="oklch(0.96 0.01 25)" desc="Hover sutil" />
        </div>
      </div>
      <div className="space-y-3 mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Textos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorSwatch name="Foreground" cssVar="--foreground" hex="#1A1A1A" desc="Texto principal" />
          <ColorSwatch name="Muted Foreground" cssVar="--muted-foreground" hex="#737373" desc="Texto secundario" />
        </div>
      </div>
      <div className="space-y-3 mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bordas & Inputs</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorSwatch name="Border" cssVar="--border" hex="#E5E5E5" desc="Bordas de cards, divisores" />
          <ColorSwatch name="Input" cssVar="--input" hex="#E5E5E5" desc="Bordas de inputs" />
          <ColorSwatch name="Ring" cssVar="--ring" hex="#A3A3A3" desc="Focus ring" />
        </div>
      </div>
    </div>
  ),
};

export const CTAColors: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Cores de CTA & Interacao</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ColorPair name="CTA Primary" bgVar="--primary" fgVar="--primary-foreground" bgHex="#E84225" fgHex="#FFFFFF" desc="Botao principal" />
        <ColorPair name="CTA Secondary" bgVar="--secondary" fgVar="--secondary-foreground" bgHex="#F5F5F5" fgHex="#333333" desc="Botao secundario" />
        <ColorPair name="CTA Destructive" bgVar="--destructive" fgVar="--primary-foreground" bgHex="#DC2626" fgHex="#FFFFFF" desc="Botao destrutivo" />
      </div>
      <div className="mt-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Em contexto</p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md text-sm">Planejar Mudanca</button>
          <button className="bg-secondary text-secondary-foreground font-medium py-2 px-4 rounded-md text-sm">Adicionar Item</button>
          <button className="bg-destructive text-white font-medium py-2 px-4 rounded-md text-sm">Remover</button>
          <button className="border border-border bg-background text-foreground font-medium py-2 px-4 rounded-md text-sm">Ver Precos</button>
          <button className="text-primary font-medium py-2 px-4 text-sm underline underline-offset-4">Saiba mais</button>
        </div>
      </div>
    </div>
  ),
};

export const FeedbackColors: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Cores de Feedback & Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: 'Sucesso', bg: '#22c55e', bgLight: '#22c55e1A', text: '#15803d', sample: 'Carga salva com sucesso' },
          { name: 'Alerta', bg: '#1A1A1A', bgLight: '#1A1A1A1A', text: '#1A1A1A', sample: 'Ocupacao acima de 80%' },
          { name: 'Erro', bg: '#DC2626', bgLight: '#DC26261A', text: '#991b1b', sample: 'Capacidade excedida' },
          { name: 'Info', bg: '#E84225', bgLight: '#E842251A', text: '#8B2E18', sample: '3 cotacoes disponiveis' },
        ].map((c) => (
          <div key={c.name} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: c.bg }} />
              <div><p className="text-sm font-semibold text-foreground">{c.name}</p><p className="text-xs font-mono text-muted-foreground">{c.bg}</p></div>
            </div>
            <div className="rounded-lg px-4 py-3 text-sm font-medium" style={{ backgroundColor: c.bgLight, borderLeft: `3px solid ${c.bg}`, color: c.text }}>{c.sample}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ChartColors: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Cores de Graficos</h3>
      <div className="grid grid-cols-5 gap-4">
        {['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'].map((v, i) => (
          <div key={v} className="space-y-2 text-center">
            <div className="w-full h-20 rounded-lg shadow-sm" style={{ backgroundColor: `var(${v})` }} />
            <p className="text-xs font-semibold text-foreground">Chart {i + 1}</p>
            <p className="text-xs font-mono text-muted-foreground">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 max-w-md space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Barra de ocupacao</p>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Caminhao 3/4 — 68%</span><span className="font-semibold text-primary">Normal</span></div>
          <div className="h-3 w-full rounded-full bg-muted"><div className="h-3 rounded-full bg-primary" style={{ width: '68%' }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>HR — 85%</span><span className="font-semibold" style={{ color: '#1A1A1A' }}>Atencao</span></div>
          <div className="h-3 w-full rounded-full bg-muted"><div className="h-3 rounded-full" style={{ width: '85%', backgroundColor: '#1A1A1A' }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Fiorino — 112%</span><span className="font-semibold text-destructive">Excedido</span></div>
          <div className="h-3 w-full rounded-full bg-muted"><div className="h-3 rounded-full bg-destructive" style={{ width: '100%' }} /></div>
        </div>
      </div>
    </div>
  ),
};

export const FullTokenMap: Story = {
  render: () => {
    const tokens = [
      { section: 'Backgrounds', items: [
        { token: '--background', role: 'Fundo de pagina' }, { token: '--card', role: 'Fundo de cards' },
        { token: '--popover', role: 'Fundo de popovers' }, { token: '--muted', role: 'Fundo muted' },
        { token: '--secondary', role: 'Fundo secondary' }, { token: '--accent', role: 'Fundo accent' },
        { token: '--destructive', role: 'Fundo destructive' }, { token: '--primary', role: 'Fundo primary' },
      ]},
      { section: 'Foregrounds', items: [
        { token: '--foreground', role: 'Texto principal' }, { token: '--card-foreground', role: 'Texto em cards' },
        { token: '--muted-foreground', role: 'Texto secundario' }, { token: '--primary-foreground', role: 'Texto sobre primary' },
      ]},
      { section: 'Bordas & UI', items: [
        { token: '--border', role: 'Bordas' }, { token: '--input', role: 'Inputs' }, { token: '--ring', role: 'Focus ring' },
      ]},
    ];
    return (
      <div className="space-y-8">
        <h3 className="text-lg font-semibold text-foreground">Mapa Completo de Tokens</h3>
        {tokens.map((section) => (
          <div key={section.section}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{section.section}</p>
            <div className="border rounded-lg overflow-hidden">
              {section.items.map((item, i) => (
                <div key={item.token} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t' : ''}`}>
                  <div className="w-10 h-10 rounded-md border shadow-sm shrink-0" style={{ backgroundColor: `var(${item.token})` }} />
                  <p className="text-sm font-mono text-foreground flex-1">{item.token}</p>
                  <p className="text-xs text-muted-foreground text-right">{item.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
