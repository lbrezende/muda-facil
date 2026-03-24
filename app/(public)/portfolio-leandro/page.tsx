"use client";

import React, { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { MagicText, MagicArticle } from "@/components/ui/magic-text";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/ui/image-comparison";
import { ContactSection } from "@/components/portfolio/contact-section";
import {
  ArrowUpRight,
  TrendingUp,
  Clock,
  Target,
  Users,
  BarChart3,
  Lightbulb,
  Search,
  MessageSquare,
  Layers,
  Rocket,
  CheckCircle2,
  ArrowLeftRight,
} from "lucide-react";

/* ── smooth scroll ── */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

/* ── project gallery images (all MudaFácil device mocks) ── */
const projectImages = [
  {
    src: "/videos/demo.mp4",
    alt: "MudaFácil — demo do produto",
    videoId: "local",
  },
  {
    src: "/images/mocks/tablet.webp",
    alt: "MudaFácil — experiência no tablet",
  },
  {
    src: "/images/mocks/phone.webp",
    alt: "MudaFácil — portfólio no iPhone",
  },
  {
    src: "/images/mocks/handphone.webp",
    alt: "MudaFácil — app na mão do usuário",
  },
  {
    src: "/images/mocks/projector.webp",
    alt: "MudaFácil — apresentação no projetor",
  },
  {
    src: "/images/mocks/twoguysonemock.webp",
    alt: "MudaFácil — desktop e mobile lado a lado",
  },
  {
    src: "/images/mocks/wow.webp",
    alt: "MudaFácil — equipe celebrando o resultado",
  },
];

/* ── V1/V2 comparison pairs ── */
const comparisons = [
  {
    v1: "/images/comparison/comparativo/Site-Landing-Hero-V1.png",
    v2: "/images/comparison/comparativo/Site-Landing-Hero-V2.png",
    label: "Landing Page — Hero",
  },
  {
    v1: "/images/comparison/comparativo/Produto-Minhas-Mudancas-V1.png",
    v2: "/images/comparison/comparativo/Produto-Minhas-Mudancas-V2.png",
    label: "Minhas Mudanças",
  },
  {
    v1: "/images/comparison/comparativo/Produto-Catalogo-de-Itens-V1.png",
    v2: "/images/comparison/comparativo/Produto-Catalogo-de-Itens-V2.png",
    label: "Catálogo de Itens",
  },
  {
    v1: "/images/comparison/comparativo/Produto-Nova-Mudanca-Variante-V1.png",
    v2: "/images/comparison/comparativo/Produto-Nova-Mudanca-Variante-V2.png",
    label: "Nova Mudança",
  },
  {
    v1: "/images/comparison/comparativo/Produto-Detalhe-Mudanca-Cotacoes-V1.png",
    v2: "/images/comparison/comparativo/Produto-Detalhe-Mudanca-Cotacoes-V2.png",
    label: "Cotações da Mudança",
  },
  {
    v1: "/images/comparison/comparativo/Site-Landing-Recursos-V1.png",
    v2: "/images/comparison/comparativo/Site-Landing-Recursos-V2.png",
    label: "Landing Page — Recursos",
  },
  {
    v1: "/images/comparison/comparativo/Site-Landing-Preview-App-V1.png",
    v2: "/images/comparison/comparativo/Site-Landing-Preview-App-V2.png",
    label: "Landing Page — Preview do App",
  },
];

/* ── before/after slider ── */
function BeforeAfterSlider({
  v1,
  v2,
  label,
}: {
  v1: string;
  v2: string;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-700 font-medium">V1</span>
          <ArrowLeftRight className="h-3 w-3" />
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">V2</span>
        </div>
      </div>
      <ImageComparison className="aspect-[16/10] w-full rounded-xl border border-border overflow-hidden">
        <ImageComparisonImage
          src={v1}
          alt={`${label} — antes (V1)`}
          position="left"
        />
        <ImageComparisonImage
          src={v2}
          alt={`${label} — depois (V2)`}
          position="right"
        />
        <ImageComparisonSlider className="w-1 bg-primary">
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <ArrowLeftRight className="h-4 w-4 text-white" />
          </div>
        </ImageComparisonSlider>
      </ImageComparison>
    </div>
  );
}

/* ── metric card ── */
function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-6 text-center">
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-3xl font-bold tracking-tight">{value}</span>
      <span className="text-sm text-muted-foreground leading-snug">{label}</span>
    </div>
  );
}

/* ── process step ── */
function ProcessStep({
  number,
  icon: Icon,
  title,
  children,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-12 pb-12 border-l-2 border-border/40 last:border-l-0 last:pb-0">
      <div className="absolute -left-5 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
        {number}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

/* ── solution card ── */
function SolutionCard({
  title,
  problem,
  impact,
}: {
  title: string;
  problem: string;
  impact: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
      <h4 className="font-bold text-lg flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        {title}
      </h4>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Problema:</span> {problem}
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-primary">Impacto:</span> {impact}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════ PAGE ═══════════════════════════════════════════ */

export default function PortfolioPage() {
  useLenis();

  return (
    <div className="w-full bg-background text-foreground">
      <PortfolioHeader />

      {/* ── SECTION 1 — HERO ── */}
      <PortfolioHero />

      <div className="h-24" />

      {/* ── SECTION 2 — PROJECTS (zoom parallax) ── */}
      <section id="projetos">
        <div className="text-center px-6 mb-8">
          <p className="text-sm uppercase tracking-widest text-primary mb-2 font-medium">
            Projetos
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Resultados que falam por si
          </h2>
        </div>
        <ZoomParallax images={projectImages} />
      </section>

      {/* ── SECTION 3 — CASE STUDY (wrap everything in MagicArticle) ── */}
      <MagicArticle className="mx-auto max-w-[680px] px-6 pb-24">
        {/* ── Case Title ── */}
        <header className="pt-16 pb-12 border-b border-border/30 mb-12">
          <MagicText
            text="+70% de sucesso nas tarefas e decisão 3,5x mais rápida. Como transformei a experiência de cotação de mudanças em um motor de crescimento B2C."
            className="text-3xl md:text-4xl font-bold leading-tight tracking-tight"
          />
          <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                LR
              </div>
              <span>Leandro Rezende</span>
            </div>
            <span>&middot;</span>
            <span>12 min de leitura</span>
          </div>
        </header>

        {/* ── 1. BUSINESS RESULTS ── */}
        <section className="mb-16">
          <MagicText
            text="O resultado de negócio. Antes de falar sobre processo, veja o que mudou nos números."
            className="text-2xl font-bold mb-8"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <MetricCard icon={TrendingUp} value="+70%" label="sucesso na conclusão de tarefas" />
            <MetricCard icon={Clock} value="3.5x" label="decisão mais rápida (7min para 2min)" />
            <MetricCard icon={Target} value="-65%" label="fricção no fluxo de cotação" />
            <MetricCard icon={Users} value="B2C" label="pivotamos o modelo de negócio" />
          </div>

          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-8">
            <p className="text-sm font-medium text-primary mb-1">Insight-chave</p>
            <MagicText
              text="O problema nunca foi a interface. Era a falta de compreensão sobre o valor e a lógica de precificação. Usuários não conseguiam conectar seus móveis a um preço justo."
              className="text-base leading-relaxed"
            />
          </div>

          <MagicText
            text="O impacto estratégico foi ainda maior: mudamos o modelo de negócio. Saímos de um SaaS B2B onde transportadoras pagavam assinatura para um marketplace B2C monetizado via anúncios. A consequência direta: barreira de entrada zerada, volume de usuários multiplicado e mais dados gerando mais valor para anunciantes."
            className="text-lg leading-[1.8] text-muted-foreground"
          />
        </section>

        {/* ── 2. BEFORE vs AFTER ── */}
        <section className="mb-16">
          <MagicText
            text="Antes vs Depois. O contraste que conta a história."
            className="text-2xl font-bold mb-8"
          />

          <div className="space-y-8">
            {/* Before */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Antes
                </span>
              </div>
              <MagicText
                text="Usuários travavam no preenchimento de endereço. Não entendiam como o preço era calculado. Tinham que digitar tudo manualmente. Resultado: tempo alto de decisão e baixa confiança no resultado final."
                className="text-base leading-[1.8] text-muted-foreground mb-4"
              />
            </div>

            {/* Landing Hero comparison */}
            <BeforeAfterSlider {...comparisons[0]} />

            {/* Minhas Mudancas comparison */}
            <BeforeAfterSlider {...comparisons[1]} />

            {/* After */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Depois
                </span>
              </div>
              <MagicText
                text="Autocomplete de endereço. Date picker visível e intuitivo. Interface visual de carga: móveis entram no caminhão, o preço atualiza em tempo real. Feedback imediato. Decisão rápida e com confiança."
                className="text-base leading-[1.8] text-muted-foreground"
              />
            </div>
          </div>
        </section>

        {/* ── 3. THE COMPLETE PROCESS ── */}
        <section className="mb-16">
          <MagicText
            text="O processo completo. Cada etapa foi desenhada para reduzir risco e maximizar aprendizado."
            className="text-2xl font-bold mb-10"
          />

          <div className="space-y-0">
            <ProcessStep number="1" icon={Search} title="Análise heurística + Quick Wins">
              <MagicText
                text="Comecei com uma auditoria heurística completa da plataforma existente. Em dois dias, identifiquei fricções óbvias que poderiam ser resolvidas imediatamente: falta de autocomplete de endereço, input manual de data, ausência de feedback de cálculo e baixa previsibilidade do sistema."
                className="text-base leading-[1.8]"
              />
              <MagicText
                text="Os quick wins geraram resultado rápido e construíram confiança com stakeholders para as mudanças maiores que viriam."
                className="text-base leading-[1.8]"
              />
            </ProcessStep>

            <ProcessStep number="2" icon={Users} title="Teste de usabilidade">
              <MagicText
                text="Objetivo: validar onde usuários realmente travavam no fluxo. A tarefa testada foi simples — simule uma mudança com seus móveis e encontre o preço."
                className="text-base leading-[1.8]"
              />
              <MagicText
                text="Principais achados: usuários não conseguiam completar tarefas com fluidez. Dificuldade em entender como o preço era calculado. Tempo médio de decisão de 7 minutos. Insegurança sobre o resultado."
                className="text-base leading-[1.8]"
              />

              {/* Cotacoes comparison */}
              <div className="my-6">
                <BeforeAfterSlider {...comparisons[4]} />
              </div>
            </ProcessStep>

            <ProcessStep number="3" icon={MessageSquare} title="Pesquisa com usuários">
              <MagicText
                text="Apliquei questionário estruturado com usuários reais para mapear o público prioritário e entender motivações, dores e expectativas."
                className="text-base leading-[1.8]"
              />
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 my-4">
                <p className="text-sm font-medium text-primary">Insight decisivo</p>
                <MagicText
                  text="O principal público não é a transportadora. É o usuário final tentando cotar sua mudança. Isso mudou toda a estratégia de produto."
                  className="text-sm leading-relaxed"
                />
              </div>
            </ProcessStep>

            <ProcessStep number="4" icon={Lightbulb} title="Redefinição de estratégia">
              <MagicText
                text="Com os dados em mãos, propus uma mudança crítica de posicionamento. De: produto focado em transportadoras, modelo SaaS B2B. Para: produto focado em usuários finais, modelo marketplace B2C."
                className="text-base leading-[1.8]"
              />
              <MagicText
                text="Essa mudança não foi apenas de interface. Foi uma decisão de negócio fundamentada em evidências de pesquisa."
                className="text-base leading-[1.8]"
              />
            </ProcessStep>

            <ProcessStep number="5" icon={BarChart3} title="Modelo de negócio (Business Thinking)">
              <MagicText
                text="Nova hipótese: se o produto for gratuito para usuários e monetizado via anúncios, o crescimento será mais rápido. A lógica é simples — redução de barreira de entrada gera aumento de volume, que gera mais dados, que gera mais valor para anunciantes."
                className="text-base leading-[1.8]"
              />

              {/* Catalogo de Itens comparison */}
              <div className="my-6">
                <BeforeAfterSlider {...comparisons[2]} />
              </div>
            </ProcessStep>

            <ProcessStep number="6" icon={Layers} title="Soluções implementadas">
              <div className="grid gap-4 my-4">
                <SolutionCard
                  title="Autocomplete de endereço"
                  problem="Usuário não conseguia preencher corretamente"
                  impact="Aumento de 40% na conclusão do formulário"
                />
                <SolutionCard
                  title="Date Picker visível"
                  problem="Usuários digitavam data manualmente e erravam"
                  impact="Redução de 90% nos erros de data"
                />
                <SolutionCard
                  title="Visualização do preço baseada em carga"
                  problem="Preço era uma caixa preta para o usuário"
                  impact="Relação direta entre móveis, caminhão e preço"
                />
                <SolutionCard
                  title="Feedback instantâneo de preço"
                  problem="Demora para entender o custo"
                  impact="Decisão 3.5x mais rápida"
                />
              </div>

              {/* Nova Mudanca comparison */}
              <div className="my-6">
                <BeforeAfterSlider {...comparisons[3]} />
              </div>
            </ProcessStep>

            <ProcessStep number="7" icon={Target} title="Validação com hipóteses">
              <div className="rounded-xl bg-muted/50 border p-5 my-4">
                <p className="font-semibold text-foreground mb-2">Hipótese principal</p>
                <MagicText
                  text="Eu acredito que, ao tornar o preço visual e baseado nos móveis, os usuários vão tomar decisões mais rápidas e com mais confiança."
                  className="text-base leading-relaxed italic"
                />
              </div>
              <MagicText
                text="Indicadores definidos: tempo de decisão e taxa de sucesso na tarefa. Ambos foram validados nos testes pós-implementação."
                className="text-base leading-[1.8]"
              />

              {/* Landing Recursos comparison */}
              <div className="my-6">
                <BeforeAfterSlider {...comparisons[5]} />
              </div>
            </ProcessStep>

            <ProcessStep number="8" icon={Rocket} title="Resultados finais">
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-5 text-center">
                  <p className="text-3xl font-bold text-primary dark:text-primary">+70%</p>
                  <p className="text-sm text-primary/80 dark:text-primary/70 mt-1">sucesso nas tarefas</p>
                </div>
                <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-5 text-center">
                  <p className="text-3xl font-bold text-primary dark:text-primary">7 &rarr; 2 min</p>
                  <p className="text-sm text-primary/80 dark:text-primary/70 mt-1">tempo de decisão</p>
                </div>
              </div>

              {/* Preview App comparison */}
              <div className="my-6">
                <BeforeAfterSlider {...comparisons[6]} />
              </div>
            </ProcessStep>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="mb-16 border-t border-border/30 pt-12">
          <MagicText
            text="O que eu aprendi."
            className="text-2xl font-bold mb-6"
          />
          <div className="space-y-4">
            <MagicText
              text="UX não é sobre tela. É sobre modelo mental do usuário. O problema de negócio quase sempre é um problema de entendimento. E design sem estratégia não move métrica."
              className="text-lg leading-[1.8] text-muted-foreground"
            />
          </div>

          <div className="mt-10">
            <MagicText
              text="Próximos passos"
              className="text-xl font-bold mb-4"
            />
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Testar monetização com anúncios e validar unit economics",
                "Otimizar aquisição de usuários via growth loops",
                "Melhorar recomendação de transportadoras com IA",
                "Criar histórico de mudanças e mecanismo de recorrência",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowUpRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </MagicArticle>

      {/* ── SECTION 4 — CONTACT (sticky footer) ── */}
      <ContactSection />
    </div>
  );
}
