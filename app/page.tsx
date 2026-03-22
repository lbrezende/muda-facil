import Link from "next/link";
import {
  Truck,
  Package,
  BarChart3,
  Search,
  ArrowRight,
  Check,
  Zap,
  Shield,
  MousePointerClick,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import { GridScan } from "@/components/ui/grid-scan";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-[#E84225]" />
          <span className="text-xl font-bold">MudaFácil</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Recursos
          </a>
          <a
            href="#pricing"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Preços
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="sm"
              className="bg-[#E84225] hover:bg-[#C73820] text-white"
            >
              Começar grátis
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <GridScan className="py-24 sm:py-32 bg-[#1A1A1A]" lineColor="rgba(243, 112, 33, 0.12)" scanColor="rgba(243, 112, 33, 0.2)">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/80 shadow-sm">
          <Zap className="h-4 w-4 text-[#E84225]" />
          14 dias grátis no Pro — sem cartão de crédito
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Arraste seus móveis, escolha o caminhão e{" "}
          <span className="text-[#E84225]">mude sem estresse</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Monte visualmente a carga da sua mudança com drag & drop, compare
          tamanhos de caminhão em tempo real e receba cotações instantâneas de
          transportadoras avaliadas.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button
              size="lg"
              className="px-8 text-base bg-[#E84225] hover:bg-[#C73820] text-white"
            >
              Planejar minha mudança
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="outline" size="lg" className="px-8 text-base border-white/30 text-white hover:bg-white/10">
              Ver preços
            </Button>
          </a>
        </div>

        {/* Drag & Drop Canvas Mockup */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="rounded-xl border bg-white p-2 shadow-2xl shadow-[#E84225]/10">
            <div className="rounded-lg border bg-gray-50 p-6 sm:p-8">
              {/* Browser chrome */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">
                  mudafacil.com.br/planejar
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Item catalog panel */}
                <div className="rounded-lg border bg-white p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Itens da mudança
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "Sofá 3 lugares", vol: "1,2 m³", dragging: false },
                      { label: "Cama queen", vol: "0,8 m³", dragging: true },
                      { label: "Geladeira", vol: "0,5 m³", dragging: false },
                      { label: "Guarda-roupa", vol: "1,0 m³", dragging: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs cursor-grab ${
                          item.dragging
                            ? "border-[#E84225] bg-[#E84225]/5 shadow-sm"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Package
                            className={`h-3.5 w-3.5 ${item.dragging ? "text-[#E84225]" : "text-gray-400"}`}
                          />
                          <span
                            className={
                              item.dragging
                                ? "font-medium text-[#E84225]"
                                : "text-gray-600"
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                        <span className="text-gray-400">{item.vol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Canvas area */}
                <div className="rounded-lg border-2 border-dashed border-[#E84225]/30 bg-[#E84225]/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#E84225]">
                      Container — Caminhão 3/4
                    </p>
                    <Truck className="h-4 w-4 text-[#E84225]" />
                  </div>
                  <div className="relative h-36 rounded-md bg-white border border-[#E84225]/20">
                    {/* Furniture items placed inside container */}
                    <div className="absolute left-2 top-2 rounded bg-[#1A1A1A]/20 border border-[#1A1A1A]/40 px-2 py-1 text-[10px] font-medium text-[#8B2E18]">
                      Sofá
                    </div>
                    <div className="absolute left-16 top-2 rounded bg-[#E84225]/20 border border-[#E84225]/40 px-2 py-1 text-[10px] font-medium text-[#1A1A1A]">
                      Geladeira
                    </div>
                    <div className="absolute left-2 top-12 rounded bg-[#1A1A1A]/20 border border-[#1A1A1A]/40 px-2 py-1 text-[10px] font-medium text-[#8B2E18]">
                      Guarda-roupa
                    </div>
                    {/* Dragging item indicator */}
                    <div className="absolute right-3 top-8 rounded border-2 border-dashed border-[#E84225] bg-[#E84225]/10 px-2 py-1 text-[10px] font-medium text-[#E84225] animate-pulse">
                      Cama queen
                    </div>
                  </div>
                  {/* Occupation bar */}
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10px] text-gray-500">
                      <span>Ocupação</span>
                      <span className="font-semibold text-[#E84225]">68%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full bg-[#E84225]"
                        style={{ width: "68%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Truck selector + summary panel */}
                <div className="space-y-3">
                  <div className="rounded-lg border bg-white p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Tamanho do veículo
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { name: "Fiorino", cap: "1,5 m³", active: false },
                        { name: "HR", cap: "5 m³", active: false },
                        { name: "3/4", cap: "12 m³", active: true },
                        { name: "Baú", cap: "30 m³", active: false },
                      ].map((truck) => (
                        <div
                          key={truck.name}
                          className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                            truck.active
                              ? "bg-[#E84225] text-white"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          <span className="font-medium">{truck.name}</span>
                          <span className={truck.active ? "text-orange-200" : "text-gray-400"}>
                            {truck.cap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-white p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Resumo
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Volume total</span>
                        <span className="font-semibold">3,5 m³</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Peso estimado</span>
                        <span className="font-semibold">820 kg</span>
                      </div>
                      <div className="flex justify-between text-[#E84225]">
                        <span>Cotações</span>
                        <span className="font-semibold">3 disponíveis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridScan>
  );
}

function Features() {
  const features = [
    {
      icon: MousePointerClick,
      title: "Canvas de carga interativo",
      description:
        "Arraste ícones de móveis para dentro de um container virtual com dimensão proporcional real. Visualize a carga antes de contratar.",
    },
    {
      icon: Truck,
      title: "Seletor de caminhão",
      description:
        "Compare 4 tamanhos — Fiorino, HR, 3/4 e Baú — com barra de ocupação em tempo real enquanto você organiza os itens.",
    },
    {
      icon: Search,
      title: "Filtros de cotação",
      description:
        "Filtre transportadoras por preço, nota, data disponível, seguro incluso e tipo de veículo. Escolha com confiança.",
    },
    {
      icon: Boxes,
      title: "Catálogo visual de itens",
      description:
        "Mais de 40 ícones categorizados com peso e volume pré-estimados. Do sofá à caixa de livros, tudo calculado automaticamente.",
    },
    {
      icon: BarChart3,
      title: "Resumo inteligente da carga",
      description:
        "Volume total em m³, peso estimado e percentual de ocupação do veículo calculados em tempo real conforme você monta a carga.",
    },
    {
      icon: Shield,
      title: "Transportadoras avaliadas",
      description:
        "Todas as transportadoras passam por verificação. Receba cotações apenas de empresas com avaliações reais de outros clientes.",
    },
  ];

  return (
    <section id="features" className="border-t py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Planeje sua mudança do jeito certo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Ferramentas visuais que eliminam a incerteza e ajudam você a chegar
            no novo lar sem surpresas.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-[#F8FAFC] p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E84225]/10">
                <feature.icon className="h-5 w-5 text-[#E84225]" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Preços simples e transparentes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Comece grátis. Faça upgrade quando precisar de mais poder.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-2xl border bg-white p-8">
            <h3 className="text-lg font-semibold text-gray-900">Grátis</h3>
            <p className="mt-1 text-sm text-gray-500">Para experimentar</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">R$ 0</span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "1 mudança ativa",
                "Até 15 itens por mudança",
                "3 cotações por mudança",
                "Canvas drag & drop",
                "Catálogo de 40+ itens",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                <span className="text-gray-400 line-through">
                  Filtros avançados de cotação
                </span>
              </li>
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button variant="outline" className="w-full">
                Começar grátis
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-[#E84225] bg-white p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1A1A1A] px-3 py-0.5 text-xs font-semibold text-white">
              Popular
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            <p className="mt-1 text-sm text-gray-500">Para quem leva a sério</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">
                R$ 29,90
              </span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Mudanças ilimitadas",
                "Itens ilimitados",
                "Cotações ilimitadas",
                "Filtros avançados de cotação",
                "Comparativo detalhado de veículos",
                "Suporte prioritário",
                "14 dias grátis para testar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#E84225]" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button className="w-full bg-[#E84225] hover:bg-[#C73820] text-white">
                Testar 14 dias grátis
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#E84225]" />
            <span className="font-semibold">MudaFácil</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MudaFácil. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <Hero />
      <Features />
      <ShuffleHero />
      <Pricing />
      <Footer />
    </div>
  );
}
