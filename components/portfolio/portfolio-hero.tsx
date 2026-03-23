"use client";
import { useEffect } from "react";
import { renderCanvas, TypeWriter, ShineBorder } from "@/components/ui/hero-designali";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PortfolioHero() {
  const talkAbout = [
    "Design de Produto",
    "IA aplicada a UX",
    "Prototipacao rapida",
    "Design Systems",
    "Pesquisa com usuarios",
    "Estrategia de produto",
  ];

  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 mt-10 sm:justify-center md:mb-4 md:mt-32">
          <div className="relative flex items-center rounded-full border bg-popover px-3 py-1 text-xs text-primary/60">
            Design Engineer + IA
            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="relative mx-auto border border-border/40 bg-background py-12 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]">
            <Plus strokeWidth={4} className="text-primary/20 absolute -left-5 -top-5 h-10 w-10" />
            <Plus strokeWidth={4} className="text-primary/20 absolute -bottom-5 -left-5 h-10 w-10" />
            <Plus strokeWidth={4} className="text-primary/20 absolute -right-5 -top-5 h-10 w-10" />
            <Plus strokeWidth={4} className="text-primary/20 absolute -bottom-5 -right-5 h-10 w-10" />
            <h1 className="flex flex-col text-center text-4xl font-semibold leading-tight tracking-tight md:text-7xl lg:text-8xl">
              <span>
                Plataformas que levavam meses.{" "}
                <span className="text-[#E84225]">Entregues em dias.</span>
              </span>
            </h1>
            <div className="flex items-center mt-4 justify-center gap-1">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <p className="text-xs text-green-500">Disponivel para projetos</p>
            </div>
          </div>
          <p className="mt-8 text-xl md:text-2xl text-foreground/80">
            Sou <span className="text-[#E84225] font-bold">Leandro Rezende</span>,{" "}
            Design Engineer Senior.
          </p>
          <p className="text-muted-foreground py-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Aplico IA em todas as etapas do processo de design para transformar
            pesquisa em interfaces que movem metricas de negocio.
          </p>
          <p className="text-base md:text-lg text-muted-foreground whitespace-nowrap">
            Especialista em{" "}
            <span className="text-[#E84225] font-semibold">
              <TypeWriter strings={talkAbout} />
            </span>
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <a href="#projetos">
              <ShineBorder
                borderWidth={2}
                className="border cursor-pointer h-auto w-auto p-1.5 bg-white/5 backdrop-blur-md dark:bg-black/5"
                color={["#E84225", "#FF6B4A", "#FF9A7B"]}
              >
                <Button className="rounded-xl">Ver projetos</Button>
              </ShineBorder>
            </a>
            <a href="#contato">
              <Button className="rounded-xl" variant="outline">
                Vamos conversar
              </Button>
            </a>
          </div>
        </div>
      </div>
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      />
    </section>
  );
}
