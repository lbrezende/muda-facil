import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ItemIcon } from '@/components/icons/item-icons';
import {
  CamaCasalIcon,
  CamaSolteiroIcon,
  ColchaoIcon,
  GuardaRoupaIcon,
  ComodaIcon,
  CriadoMudoIcon,
  PenteadeiraIcon,
  BercoIcon,
  SapateiraIcon,
  SofaIcon,
  RackTVIcon,
  MesaCentroIcon,
  EstanteIcon,
  PoltronaIcon,
  AparadorIcon,
  TapeteIcon,
  MesaJantarIcon,
  CadeiraIcon,
  GeladeiraIcon,
  FogaoIcon,
  MicroondasIcon,
  MaquinaLavarIcon,
  SecadoraIcon,
  TabuaPassarIcon,
  TanqueIcon,
  MesaEscritorioIcon,
  GaveteiroIcon,
  ImpressoraIcon,
  CaixaMIcon,
  CaixaGIcon,
  CaixaPIcon,
  CaixaLivrosIcon,
  MalaGrandeIcon,
  SacoRoupaIcon,
  TVIcon,
  ArCondicionadoIcon,
  VentiladorIcon,
  QuadroIcon,
  PianoIcon,
  ChurrasqueiraIcon,
  EspelhoIcon,
  ArmarioBanheiroIcon,
  FornoParedIcon,
  BicicletaIcon,
} from '@/components/icons/item-icons';

const meta: Meta = {
  title: 'Components/Item Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Biblioteca de icones SVG para o catalogo de moveis e objetos do MudaFacil. Cada icone e um componente React que aceita todas as props de SVGSVGElement. Use `ItemIcon` para lookup automatico por nome de item, ou importe o componente diretamente.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ============================================================
// Categorized icon data for grid rendering
// ============================================================

const QUARTO_ICONS = [
  { label: 'Cama casal', Icon: CamaCasalIcon },
  { label: 'Cama solteiro', Icon: CamaSolteiroIcon },
  { label: 'Colchao', Icon: ColchaoIcon },
  { label: 'Guarda-roupa', Icon: GuardaRoupaIcon },
  { label: 'Comoda', Icon: ComodaIcon },
  { label: 'Criado-mudo', Icon: CriadoMudoIcon },
  { label: 'Penteadeira', Icon: PenteadeiraIcon },
  { label: 'Berco', Icon: BercoIcon },
  { label: 'Sapateira', Icon: SapateiraIcon },
];

const SALA_ICONS = [
  { label: 'Sofa', Icon: SofaIcon },
  { label: 'Rack TV', Icon: RackTVIcon },
  { label: 'Mesa centro', Icon: MesaCentroIcon },
  { label: 'Estante', Icon: EstanteIcon },
  { label: 'Poltrona', Icon: PoltronaIcon },
  { label: 'Aparador', Icon: AparadorIcon },
  { label: 'Tapete', Icon: TapeteIcon },
  { label: 'Mesa jantar', Icon: MesaJantarIcon },
  { label: 'Cadeira', Icon: CadeiraIcon },
];

const COZINHA_ICONS = [
  { label: 'Geladeira', Icon: GeladeiraIcon },
  { label: 'Fogao', Icon: FogaoIcon },
  { label: 'Microondas', Icon: MicroondasIcon },
  { label: 'Forno parede', Icon: FornoParedIcon },
];

const AREA_SERVICO_ICONS = [
  { label: 'Maquina lavar', Icon: MaquinaLavarIcon },
  { label: 'Secadora', Icon: SecadoraIcon },
  { label: 'Tabua passar', Icon: TabuaPassarIcon },
  { label: 'Tanque', Icon: TanqueIcon },
];

const ESCRITORIO_ICONS = [
  { label: 'Mesa escritorio', Icon: MesaEscritorioIcon },
  { label: 'Gaveteiro', Icon: GaveteiroIcon },
  { label: 'Impressora', Icon: ImpressoraIcon },
];

const BANHEIRO_ICONS = [
  { label: 'Armario banheiro', Icon: ArmarioBanheiroIcon },
  { label: 'Espelho', Icon: EspelhoIcon },
];

const CAIXAS_ICONS = [
  { label: 'Caixa P', Icon: CaixaPIcon },
  { label: 'Caixa M', Icon: CaixaMIcon },
  { label: 'Caixa G', Icon: CaixaGIcon },
  { label: 'Caixa livros', Icon: CaixaLivrosIcon },
  { label: 'Mala grande', Icon: MalaGrandeIcon },
  { label: 'Saco roupa', Icon: SacoRoupaIcon },
];

const OUTROS_ICONS = [
  { label: 'TV', Icon: TVIcon },
  { label: 'Ar-condicionado', Icon: ArCondicionadoIcon },
  { label: 'Ventilador', Icon: VentiladorIcon },
  { label: 'Quadro', Icon: QuadroIcon },
  { label: 'Piano', Icon: PianoIcon },
  { label: 'Churrasqueira', Icon: ChurrasqueiraIcon },
  { label: 'Bicicleta', Icon: BicicletaIcon },
];

function IconCard({ label, Icon }: { label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors">
      <Icon className="h-12 w-12 text-primary" />
      <span className="text-[11px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

function CategorySection({ title, icons, color }: { title: string; icons: typeof QUARTO_ICONS; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {icons.map(({ label, Icon }) => (
          <IconCard key={label} label={label} Icon={Icon} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// STORY: All icons by category (primary color)
// ============================================================
export const AllIconsByCategory: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <CategorySection title="Quarto" icons={QUARTO_ICONS} color="#8B5CF6" />
      <CategorySection title="Sala" icons={SALA_ICONS} color="#3B82F6" />
      <CategorySection title="Cozinha" icons={COZINHA_ICONS} color="#F59E0B" />
      <CategorySection title="Area de Servico" icons={AREA_SERVICO_ICONS} color="#6366F1" />
      <CategorySection title="Escritorio" icons={ESCRITORIO_ICONS} color="#10B981" />
      <CategorySection title="Banheiro" icons={BANHEIRO_ICONS} color="#06B6D4" />
      <CategorySection title="Caixas & Malas" icons={CAIXAS_ICONS} color="#D97706" />
      <CategorySection title="Outros" icons={OUTROS_ICONS} color="#9CA3AF" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos os icones do catalogo agrupados por categoria, exibidos em texto-primary (vermelho Trekon).',
      },
    },
  },
};

// ============================================================
// STORY: Primary vs muted comparison
// ============================================================
export const PrimaryVsMuted: Story = {
  render: () => {
    const allIcons = [
      ...QUARTO_ICONS,
      ...SALA_ICONS,
      ...COZINHA_ICONS,
      ...AREA_SERVICO_ICONS,
      ...ESCRITORIO_ICONS,
      ...BANHEIRO_ICONS,
      ...CAIXAS_ICONS,
      ...OUTROS_ICONS,
    ];
    return (
      <div className="space-y-8 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            text-primary — contexto ativo / selecionado
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {allIcons.map(({ label, Icon }) => (
              <div key={`primary-${label}`} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card">
                <Icon className="h-12 w-12 text-primary" />
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            text-muted-foreground — contexto inativo / secundario
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {allIcons.map(({ label, Icon }) => (
              <div key={`muted-${label}`} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card">
                <Icon className="h-12 w-12 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparativo de todos os icones em text-primary (ativo) vs text-muted-foreground (inativo).',
      },
    },
  },
};

// ============================================================
// STORY: Size scale
// ============================================================
export const SizeScale: Story = {
  render: () => {
    const sizes = [
      { label: 'h-4 w-4', className: 'h-4 w-4', px: '16px' },
      { label: 'h-6 w-6', className: 'h-6 w-6', px: '24px' },
      { label: 'h-8 w-8', className: 'h-8 w-8', px: '32px' },
      { label: 'h-12 w-12', className: 'h-12 w-12', px: '48px' },
      { label: 'h-16 w-16', className: 'h-16 w-16', px: '64px' },
    ];
    const previewIcons = [GeladeiraIcon, SofaIcon, CamaCasalIcon, CaixaMIcon];

    return (
      <div className="space-y-6 p-4">
        <p className="text-sm text-muted-foreground">
          Os icones sao SVG e escalam perfeitamente via classes Tailwind h-* w-*.
        </p>
        {previewIcons.map((Icon, i) => (
          <div key={i} className="flex items-end gap-8 flex-wrap">
            {sizes.map(({ label, className, px }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className={`${className} text-primary`} />
                <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                <span className="text-[9px] text-muted-foreground">{px}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Escala de tamanhos: h-4 (16px) a h-16 (64px). Icones SVG sao nitidos em qualquer tamanho.',
      },
    },
  },
};

// ============================================================
// STORY: ItemIcon component — name-based lookup
// ============================================================
export const ItemIconLookup: Story = {
  render: () => {
    const names = [
      'Cama solteiro',
      'Cama casal',
      'Guarda-roupa 4 portas',
      'Geladeira',
      'Sofa 3 lugares',
      'Maquina de lavar',
      'Caixa M',
      'Mesa de escritorio',
      'TV 50"',
      'Nome inexistente',
    ];
    return (
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          O componente <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-primary">ItemIcon</code> faz
          lookup pelo nome do item no <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-primary">ITEM_ICON_MAP</code>.
          Quando o nome nao e encontrado, exibe a primeira letra como fallback.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {names.map((nome) => (
            <div key={nome} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <ItemIcon nome={nome} className="h-5 w-5" />
              </div>
              <span className="text-sm text-foreground truncate">{nome}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstracao do componente `ItemIcon` que faz lookup por nome. O ultimo item mostra o fallback (primeira letra) para nomes nao mapeados.',
      },
    },
  },
};

// ============================================================
// STORY: Icons in context (sidebar pill)
// ============================================================
export const InContext: Story = {
  render: () => {
    const items = [
      { nome: 'Cama casal', categoria: 'QUARTO', color: '#8B5CF6' },
      { nome: 'Sofa 3 lugares', categoria: 'SALA', color: '#3B82F6' },
      { nome: 'Geladeira', categoria: 'COZINHA', color: '#F59E0B' },
      { nome: 'Maquina de lavar', categoria: 'AREA_SERVICO', color: '#6366F1' },
      { nome: 'Mesa de escritorio', categoria: 'ESCRITORIO', color: '#10B981' },
      { nome: 'Caixa M', categoria: 'CAIXAS', color: '#D97706' },
    ];
    return (
      <div className="space-y-6 p-4 max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Icones em pills de catalogo (sidebar do canvas 3D)
        </p>
        <div className="space-y-1.5">
          {items.map(({ nome, color }) => (
            <div
              key={nome}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                <ItemIcon nome={nome} className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{nome}</span>
              <span className="w-2 h-2 rounded-full ml-auto flex-shrink-0" style={{ backgroundColor: color }} />
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Icones aplicados em pills de catalogo — o mesmo padrao visual usado no sidebar do TruckCanvas3D.',
      },
    },
  },
};
