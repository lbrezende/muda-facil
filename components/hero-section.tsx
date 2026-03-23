"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  Truck,
  Package,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicHeroCanvas } from "@/components/ui/dynamic-hero";

export function HeroSection() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#F8FAFC] relative">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
          <Zap className="h-4 w-4 text-[#009B3A]" />
          14 dias grátis no Pro — sem cartão de crédito
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Arraste seus móveis, escolha o caminhão e{" "}
          <span className="text-[#009B3A]">mude sem estresse</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
          Monte visualmente a carga da sua mudança com drag & drop, compare
          tamanhos de caminhão em tempo real e receba cotações instantâneas de
          transportadoras avaliadas.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login" ref={ctaRef}>
            <Button
              size="lg"
              className="px-8 text-base bg-[#009B3A] hover:bg-[#007A2E] text-white"
            >
              Planejar minha mudança
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button
              variant="outline"
              size="lg"
              className="px-8 text-base"
            >
              Ver preços
            </Button>
          </a>
        </div>

        {/* Drag & Drop Canvas Mockup — z-index above arrow canvas */}
        <div className="relative z-[6] mx-auto mt-16 max-w-4xl">
          <div className="rounded-xl border bg-white p-2 shadow-2xl shadow-[#009B3A]/10">
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
                            ? "border-[#009B3A] bg-[#009B3A]/5 shadow-sm"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Package
                            className={`h-3.5 w-3.5 ${item.dragging ? "text-[#009B3A]" : "text-gray-400"}`}
                          />
                          <span
                            className={
                              item.dragging
                                ? "font-medium text-[#009B3A]"
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
                <div className="rounded-lg border-2 border-dashed border-[#009B3A]/30 bg-[#009B3A]/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#009B3A]">
                      Container — Caminhão 3/4
                    </p>
                    <Truck className="h-4 w-4 text-[#009B3A]" />
                  </div>
                  <div className="relative h-36 rounded-md bg-white border border-[#009B3A]/20">
                    <div className="absolute left-2 top-2 rounded bg-[#1A1A1A]/20 border border-[#1A1A1A]/40 px-2 py-1 text-[10px] font-medium text-[#005C22]">
                      Sofá
                    </div>
                    <div className="absolute left-16 top-2 rounded bg-[#009B3A]/20 border border-[#009B3A]/40 px-2 py-1 text-[10px] font-medium text-[#1A1A1A]">
                      Geladeira
                    </div>
                    <div className="absolute left-2 top-12 rounded bg-[#1A1A1A]/20 border border-[#1A1A1A]/40 px-2 py-1 text-[10px] font-medium text-[#005C22]">
                      Guarda-roupa
                    </div>
                    <div className="absolute right-3 top-8 rounded border-2 border-dashed border-[#009B3A] bg-[#009B3A]/10 px-2 py-1 text-[10px] font-medium text-[#009B3A] animate-pulse">
                      Cama queen
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10px] text-gray-500">
                      <span>Ocupação</span>
                      <span className="font-semibold text-[#009B3A]">68%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full bg-[#009B3A]"
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
                              ? "bg-[#009B3A] text-white"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          <span className="font-medium">{truck.name}</span>
                          <span
                            className={
                              truck.active ? "text-orange-200" : "text-gray-400"
                            }
                          >
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
                      <div className="flex justify-between text-[#009B3A]">
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

      {/* Arrow canvas — z-index below sticky header and interactive elements */}
      <DynamicHeroCanvas
        targetRef={ctaRef}
        boundaryRef={sectionRef}
        arrowLabels={{
          left: "Entrega segura",
          right: "Entrega rápida",
          bottom: "Entrega garantida",
        }}
      />
    </section>
  );
}
