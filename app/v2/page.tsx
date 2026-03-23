import Link from "next/link";
import {
  Truck,
  Package,
  BarChart3,
  Search,
  ArrowRight,
  Check,
  Shield,
  MousePointerClick,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import { HeroSection } from "@/components/hero-section";
import TestimonialsSection from "@/components/testimonials-section";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-primary" />
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
              className="bg-primary hover:bg-primary/90 text-white"
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
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
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
          <div className="relative rounded-2xl border-2 border-primary bg-white p-8">
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
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
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
            <Truck className="h-5 w-5 text-primary" />
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
      <HeroSection />
      <Features />
      <ShuffleHero />
      <TestimonialsSection />
      <Pricing />
      <Footer />
    </div>
  );
}
