/**
 * Auto-quoting engine for MudaFácil.
 *
 * Price = taxaBase + (distanciaKm × precoPorKm) + (numComodos × precoPorComodo)
 *
 * Each transportadora has its own rates.
 * Returns sorted by price (cheapest first).
 */

import { db } from "@/lib/db";

export interface AutoQuote {
  transportadoraId: string;
  transportadoraNome: string;
  transportadoraLogo: string | null;
  notaMedia: number;
  totalAvaliacoes: number;
  precoCentavos: number;         // price in centavos
  precoReais: number;            // price in R$
  tempoEstimadoDias: number;
  seguroIncluso: boolean;
  // breakdown
  taxaBase: number;
  custoDistancia: number;
  custoComodos: number;
}

export async function generateAutoQuotes(
  distanciaKm: number,
  numComodos: number
): Promise<AutoQuote[]> {
  const transportadoras = await db.transportadora.findMany({
    orderBy: { notaMedia: "desc" },
  });

  const quotes: AutoQuote[] = transportadoras.map((t) => {
    const custoDistancia = distanciaKm * t.precoPorKm;
    const custoComodos = numComodos * t.precoPorComodo;
    const precoReais = t.taxaBase + custoDistancia + custoComodos;
    const precoCentavos = Math.round(precoReais * 100);

    return {
      transportadoraId: t.id,
      transportadoraNome: t.nome,
      transportadoraLogo: t.logoUrl,
      notaMedia: t.notaMedia,
      totalAvaliacoes: t.totalAvaliacoes,
      precoCentavos,
      precoReais: Math.round(precoReais * 100) / 100,
      tempoEstimadoDias: t.tempoEstimadoDias,
      seguroIncluso: t.seguroIncluso,
      taxaBase: t.taxaBase,
      custoDistancia: Math.round(custoDistancia * 100) / 100,
      custoComodos: Math.round(custoComodos * 100) / 100,
    };
  });

  // Sort by price (cheapest first)
  quotes.sort((a, b) => a.precoCentavos - b.precoCentavos);

  return quotes;
}

/**
 * Estimate items based on house size (num comodos).
 * Returns a human-readable summary.
 */
export function estimateItemsByComodos(numComodos: number): string {
  if (numComodos <= 1) return "~10 itens (kitnet/studio)";
  if (numComodos === 2) return "~20 itens (1 quarto)";
  if (numComodos === 3) return "~30 itens (2 quartos)";
  if (numComodos === 4) return "~40 itens (3 quartos)";
  if (numComodos === 5) return "~50 itens (3 quartos + escritório)";
  return `~${numComodos * 10} itens (casa grande)`;
}
