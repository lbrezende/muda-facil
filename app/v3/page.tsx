import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  ArrowRight,
  Check,
  Zap,
  Play,
  MousePointerClick,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-[110px]">
        {/* Logo */}
        <Link href="/v3" className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-[#E84225]" />
          <span className="text-xl font-bold tracking-tight">MudaFácil</span>
        </Link>

        {/* Right side: nav links + buttons */}
        <div className="flex items-center gap-10">
          {/* Nav links */}
          <nav className="hidden items-center gap-6 lg:flex">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Recursos
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Precos
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sobre nos
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Faq
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-300 text-sm font-medium"
              >
                Acessar minha conta
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="rounded-full bg-[#E84225] hover:bg-[#C73820] text-white text-sm font-medium px-5"
              >
                Comecar gratis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-white px-3">
      <div className="relative mx-auto max-w-[1416px] overflow-hidden rounded-2xl bg-[#FAF9F7]">
        {/* Background image - right side */}
        <div className="absolute inset-0">
          <Image
            src="/images/v3/hero-bg.png"
            alt="Caminhao de mudanca 3D"
            fill
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 px-[100px] py-[83px]">
          <div className="max-w-[567px]">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-700 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-[#E84225]" />
              14 dias gratis no Pro — sem cartao de credito
            </div>

            {/* Title */}
            <h1 className="text-[52px] font-bold leading-[1.1] tracking-tight text-[#1A1A1A]">
              Organize sua mudanca de forma{" "}
              <span className="italic">inteligente</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-[487px] text-base leading-[1.7] text-gray-600">
              Monte a carga da sua mudanca com drag & drop, compare tamanhos de
              caminhao e receba cotacoes instantaneas de transportadoras.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex items-center gap-3">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full bg-[#E84225] hover:bg-[#C73820] text-white px-7 h-12 text-base font-semibold"
                >
                  Planejar minha mudanca
                </Button>
              </Link>
              <a href="#pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-gray-300 px-7 h-12 text-base font-medium"
                >
                  Ver precos
                </Button>
              </a>
            </div>

            {/* Video thumbnail */}
            <div className="mt-12">
              <div className="relative w-[283px] overflow-hidden rounded-xl">
                <Image
                  src="/images/v3/hero-video-thumb.png"
                  alt="Preview do produto"
                  width={283}
                  height={190}
                  className="rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <Play className="h-4 w-4 fill-[#1A1A1A] text-[#1A1A1A] ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#E84225]" />
                Veja como funciona
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiddleText() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[820px] px-6">
        <h2 className="text-[40px] font-bold leading-[1.2] tracking-tight text-[#1A1A1A]">
          Planeje sua mudanca com ferramentas visuais que eliminam incertezas e
          ajudam voce a chegar no novo lar{" "}
          <span className="italic text-[#E84225]">sem surpresas</span>
        </h2>
      </div>
    </section>
  );
}

function FeatureCards() {
  const cards = [
    {
      image: "/images/v3/card-canvas.png",
      icon: MousePointerClick,
      title: "Canvas de carga interativo",
      description:
        "Arraste moveis e visualize sua carga antes de contratar.",
    },
    {
      image: "/images/v3/card-truck.png",
      icon: Truck,
      title: "Seletor de caminhao",
      description: "Compare tamanhos e acompanhe a ocupacao.",
    },
    {
      image: "/images/v3/card-filters.png",
      icon: SlidersHorizontal,
      title: "Filtros de cotacao",
      description: "Filtre por preco, nota, prazo, seguro e veiculo.",
    },
  ];

  return (
    <section id="features" className="bg-white pb-24">
      <div className="mx-auto max-w-[1220px] px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="flex flex-col items-center gap-6">
              {/* Image container */}
              <div className="relative w-full overflow-hidden rounded-2xl bg-[#FAF9F7]">
                <div className="relative aspect-[384/353]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Icon badge */}
                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <card.icon className="h-5 w-5 text-[#E84225]" />
                </div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {card.description}
                </p>
              </div>
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
            Precos simples e transparentes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Comece gratis. Faca upgrade quando precisar de mais poder.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-2xl border bg-white p-8">
            <h3 className="text-lg font-semibold text-gray-900">Gratis</h3>
            <p className="mt-1 text-sm text-gray-500">Para experimentar</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">R$ 0</span>
              <span className="text-sm text-gray-500">/mes</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "1 mudanca ativa",
                "Ate 15 itens por mudanca",
                "3 cotacoes por mudanca",
                "Canvas drag & drop",
                "Catalogo de 40+ itens",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                <span className="text-gray-400 line-through">
                  Filtros avancados de cotacao
                </span>
              </li>
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button variant="outline" className="w-full">
                Comecar gratis
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-[#E84225] bg-white p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1A1A1A] px-3 py-0.5 text-xs font-semibold text-white">
              Popular
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            <p className="mt-1 text-sm text-gray-500">Para quem leva a serio</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">
                R$ 29,90
              </span>
              <span className="text-sm text-gray-500">/mes</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Mudancas ilimitadas",
                "Itens ilimitados",
                "Cotacoes ilimitadas",
                "Filtros avancados de cotacao",
                "Comparativo detalhado de veiculos",
                "Suporte prioritario",
                "14 dias gratis para testar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#E84225]" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button className="w-full bg-[#E84225] hover:bg-[#C73820] text-white">
                Testar 14 dias gratis
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
            <span className="font-semibold">MudaFacil</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MudaFacil. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function V3Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <MiddleText />
      <FeatureCards />
      <Pricing />
      <Footer />
    </div>
  );
}
