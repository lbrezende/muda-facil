import { useQuery } from "@tanstack/react-query";

export interface AutoQuote {
  transportadoraId: string;
  transportadoraNome: string;
  notaMedia: number;
  totalAvaliacoes: number;
  tempoEstimadoDias: number;
  seguroIncluso: boolean;
  taxaBase: number;
  custoDistancia: number;
  custoComodos: number;
  precoCentavos: number;
  precoReais: string;
}

async function fetchEstimateQuotes(
  distanciaKm: number,
  numComodos: number
): Promise<AutoQuote[]> {
  const params = new URLSearchParams({
    distanciaKm: String(distanciaKm),
    numComodos: String(numComodos),
  });
  const res = await fetch(`/api/quotes/estimate?${params}`);
  if (!res.ok) throw new Error("Failed to fetch quotes");
  const data = await res.json();
  return data.quotes ?? [];
}

export function useEstimateQuotes(
  distanciaKm: number | null,
  numComodos: number
) {
  return useQuery({
    queryKey: ["estimate-quotes", distanciaKm, numComodos],
    queryFn: () => fetchEstimateQuotes(distanciaKm!, numComodos),
    enabled: distanciaKm != null && distanciaKm > 0 && numComodos >= 1,
    staleTime: 60 * 1000, // 1 min — same inputs = same quotes
  });
}
