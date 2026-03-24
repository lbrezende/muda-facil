"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Item, Caminhao } from "./use-catalogo";

// ─── Types ────────────────────────────────────────────────

export type CargaItemPositioned = {
  id: string;
  cargaLayoutId: string;
  itemId: string;
  x: number;
  y: number;
  z: number;
  rotacao: number;
  item: Item;
};

export type CargaLayout = {
  id: string;
  mudancaId: string;
  caminhaoId: string;
  ocupacaoPercentual: number;
  createdAt: string;
  updatedAt: string;
  caminhao: Caminhao;
  itens: CargaItemPositioned[];
};

export type SaveCargaInput = {
  caminhaoId: string;
  ocupacaoPercentual?: number;
  itens: {
    itemId: string;
    x: number;
    y: number;
    z: number;
    rotacao: number;
  }[];
};

export type Transportadora = {
  id: string;
  nome: string;
  logoUrl: string | null;
  notaMedia: number;
  totalAvaliacoes: number;
  cidade: string;
  tiposCaminhao: string[];
  createdAt: string;
};

export type Cotacao = {
  id: string;
  mudancaId: string;
  transportadoraId: string;
  precoCentavos: number;
  dataDisponivel: string;
  seguroIncluso: boolean;
  validade: string;
  createdAt: string;
  transportadora: Transportadora;
};

// ─── Query Keys ───────────────────────────────────────────

export const cargaKeys = {
  layout: (mudancaId: string) => ["carga", "layout", mudancaId] as const,
  cotacoes: (mudancaId: string) => ["cotacoes", mudancaId] as const,
};

// ─── Hooks ────────────────────────────────────────────────

export function useCargaLayout(
  mudancaId: string,
  options?: Omit<UseQueryOptions<CargaLayout | null>, "queryKey" | "queryFn">
) {
  return useQuery<CargaLayout | null>({
    queryKey: cargaKeys.layout(mudancaId),
    queryFn: async () => {
      const res = await fetch(`/api/mudancas/${mudancaId}/carga`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao carregar layout da carga");
      }
      return res.json();
    },
    enabled: !!mudancaId,
    ...options,
  });
}

export function useSaveCargaLayout(mudancaId: string) {
  const queryClient = useQueryClient();

  return useMutation<CargaLayout, Error, SaveCargaInput>({
    mutationFn: async (input) => {
      const res = await fetch(`/api/mudancas/${mudancaId}/carga`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao salvar layout da carga");
      }
      return data;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(cargaKeys.layout(mudancaId), saved);
    },
  });
}

export function useCotacoes(
  mudancaId: string,
  options?: Omit<UseQueryOptions<Cotacao[]>, "queryKey" | "queryFn">
) {
  return useQuery<Cotacao[]>({
    queryKey: cargaKeys.cotacoes(mudancaId),
    queryFn: async () => {
      const res = await fetch(`/api/mudancas/${mudancaId}/cotacoes`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao carregar cotações");
      }
      return res.json();
    },
    enabled: !!mudancaId,
    ...options,
  });
}
