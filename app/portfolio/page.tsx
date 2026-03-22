import { ArrowRight, ArrowUpRight, Sun, Lightbulb, LayoutGrid, Palette, IterationCw } from "lucide-react";
import Link from "next/link";

function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#1a1a1a]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
        <span className="text-lg font-semibold text-white">Gilberto Prado</span>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#projetos" className="text-sm text-[#D4FF00] underline underline-offset-4">Projetos</a>
          <a href="#sobre" className="text-sm text-gray-400 hover:text-white transition">Sobre</a>
          <a href="#processo" className="text-sm text-gray-400 hover:text-white transition">Processo</a>
          <a href="#insights" className="text-sm text-gray-400 hover:text-white transition">Insights</a>
          <a href="#contato" className="text-sm text-gray-400 hover:text-white transition">Contato</a>
        </div>
        <Sun className="h-5 w-5 text-[#D4FF00]" />
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#1a1a1a] px-8 pt-16 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-8 bg-[#D4FF00]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4FF00]">
            UX/UI Designer &bull; Estratégia, Interface e Execução
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white/90 leading-[1.05] tracking-tight">
            Crio produtos digitais com clareza, qualidade visual e direção estratégica.
          </h1>
          <div className="flex items-start justify-end">
            <div className="w-72 h-72 rounded-lg bg-[#2a2a2a] border border-[#333] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#D4FF00]" />
            </div>
          </div>
        </div>

        <p className="mt-10 max-w-xl text-lg text-gray-400 leading-relaxed">
          Atuo na interseção entre UX, UI e execução, ajudando empresas a transformar ideias em experiências digitais mais consistentes, intuitivas e bem construídas.
        </p>

        <div className="mt-8 flex items-center gap-6">
          <a href="#projetos" className="inline-flex items-center px-6 py-3 rounded-full bg-[#D4FF00] text-[#1a1a1a] text-sm font-semibold hover:bg-[#c5ee00] transition">
            Ver projetos
          </a>
          <a href="#contato" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            Entrar em contato <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-16 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Mais de 16 anos trabalhando com interfaces, produtos e experiências digitais.
        </p>
      </div>
    </section>
  );
}

function CredibilitySection() {
  const stats = [
    { value: "Fundador", label: "DA INSANY" },
    { value: "Cofundador", label: "DO BOOST" },
    { value: "+16 anos", label: "EM DESIGN" },
    { value: "+200", label: "PROJETOS ENTREGUES" },
  ];

  return (
    <section className="bg-[#f5f5f0] py-16">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl sm:text-3xl font-light text-gray-300">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PositioningSection() {
  return (
    <section className="bg-[#1a1a1a] py-24">
      <div className="mx-auto max-w-6xl px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4FF00]">
          Onde eu gero mais valor
        </p>
        <h2 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
          Meu ponto forte está em conectar estratégia, interface e execução para transformar complexidade em experiências digitais mais claras, elegantes e funcionais.
        </h2>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const projects = [
    {
      category: "PRODUTO DIGITAL E INTERFACE",
      title: "Unico",
      description: "Design de sistemas complexos para segurança e identidade digital.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=60",
      align: "left" as const,
    },
    {
      category: "REDESIGN DE EXPERIÊNCIA",
      title: "Banco Inter Concept",
      description: "Exploração visual e de UX para o futuro do banking digital no Brasil.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=60",
      align: "right" as const,
    },
    {
      category: "PLATAFORMA EDUCACIONAL",
      title: "Boost",
      description: "Experiência de aprendizado focada em performance para designers.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=60",
      align: "left" as const,
    },
    {
      category: "POSICIONAMENTO E PRESENÇA DIGITAL",
      title: "Insany",
      description: "Criação da identidade digital e ecossistema da agência de design.",
      image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=60",
      align: "right" as const,
    },
  ];

  return (
    <section id="projetos" className="bg-[#f5f5f0] py-24">
      <div className="mx-auto max-w-6xl px-8">
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4FF00]">
              Portfólio
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight">
              Projetos selecionados
            </h2>
          </div>
          <p className="hidden md:block text-right text-xs font-semibold uppercase tracking-wider text-gray-400 max-w-[160px]">
            Foco em impacto e excelência técnica.
          </p>
        </div>

        <div className="space-y-24">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`grid md:grid-cols-2 gap-8 items-start ${
                project.align === "right" ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className={project.align === "right" ? "md:text-left" : ""}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#D4FF00]">
                  {project.category}
                </p>
                <h3 className="text-2xl sm:text-3xl font-light text-gray-300 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const skills = ["DESIGN SYSTEMS", "ESTRATÉGIA DE PRODUTO", "DIREÇÃO DE ARTE", "AI INTEGRATION"];

  return (
    <section id="sobre" className="bg-[#f5f5f0] py-24 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4FF00]">
              Sobre
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] leading-tight">
              Design como ferramenta de negócio.
            </h2>
          </div>
          <div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Acredito que o design de produto não se trata apenas de estética, mas de como as coisas funcionam e de como elas geram valor real para as pessoas e para os negócios.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Com mais de 16 anos de estrada, desenvolvi um olhar crítico que une a <span className="text-[#1a1a1a] font-medium">direção criativa</span> com o rigor técnico da <span className="text-[#1a1a1a] font-medium underline">construção de interfaces</span>. Meu foco está em criar soluções que sejam escaláveis, intuitivas e esteticamente superiores.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Atualmente, exploro como a <span className="text-[#1a1a1a] font-medium underline">Inteligência Artificial</span> pode ser integrada ao processo de design para potencializar a criatividade e otimizar a execução, sem nunca perder a essência do pensamento estratégico humano.
            </p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    {
      icon: Lightbulb,
      title: "Contexto",
      description: "Imersão profunda no negócio, análise de usuários e definição de objetivos claros antes de qualquer pixel.",
    },
    {
      icon: LayoutGrid,
      title: "Estrutura",
      description: "Arquitetura de informação, fluxos lógicos e wireframes que priorizam a usabilidade e a hierarquia.",
    },
    {
      icon: Palette,
      title: "Interface",
      description: "Refinamento visual de alta fidelidade, sistemas de design consistentes e interações que encantam.",
    },
    {
      icon: IterationCw,
      title: "Evolução",
      description: "Testes, iterações contínuas e ajustes baseados em dados reais para garantir que o produto continue crescendo.",
    },
  ];

  return (
    <section id="processo" className="bg-[#f5f5f0] py-24 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-8">
        <div className="text-center mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4FF00]">
            Metodologia
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-300">
            Como eu trabalho
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl bg-[#1a1a1a] p-6 flex flex-col"
            >
              <step.icon className="h-6 w-6 text-[#D4FF00] mb-6" />
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection() {
  const insights = [
    { number: "01. ARTIGO", title: "UI mais forte", description: "Como criar interfaces que resistem ao tempo através de fundamentos sólidos." },
    { number: "02. TENDÊNCIA", title: "IA no processo", description: "Acelerando a prototipagem e a descoberta de caminhos visuais com ferramentas de IA." },
    { number: "03. GUIA", title: "Design systems", description: "Por que a escalabilidade começa com uma documentação de componentes bem feita." },
    { number: "04. VISUAL", title: "Inspiração visual", description: "Minha curadoria pessoal de referências que fogem do óbvio no mundo digital." },
  ];

  return (
    <section id="insights" className="bg-[#f5f5f0] py-24 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-8">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-3xl font-bold text-[#1a1a1a]">Insights & Notas</h2>
          <a href="#" className="text-xs font-semibold uppercase tracking-wider text-[#D4FF00] hover:underline">
            Ver todos
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight) => (
            <div key={insight.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                {insight.number}
              </p>
              <h3 className="text-xl font-light text-gray-300 mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contato" className="bg-[#f5f5f0] py-32">
      <div className="mx-auto max-w-6xl px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-200 italic leading-tight">
          Vamos construir<br />algo bom juntos.
        </h2>
        <div className="mt-10 flex items-center justify-center gap-6">
          <a href="mailto:contato@gilbertoprado.com" className="text-lg font-semibold text-[#D4FF00] underline underline-offset-4 hover:text-[#c5ee00] transition">
            Entrar em contato
          </a>
          <span className="text-gray-400">ou</span>
          <a href="#" className="text-lg text-gray-400 hover:text-gray-600 transition">
            Ver LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-12">
      <div className="mx-auto max-w-6xl px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-white">Gilberto Prado</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-gray-500">
              Design com clareza, intenção e<br />qualidade de execução.
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">Email</a>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              &copy; 2024 Gilberto Prado. Senior Product Designer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <HeroSection />
      <CredibilitySection />
      <PositioningSection />
      <ProjectsSection />
      <AboutSection />
      <ProcessSection />
      <InsightsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
