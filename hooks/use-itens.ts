"use client";

import { useQuery } from "@tanstack/react-query";

export type ItemCatalogo = {
  id: string;
  nome: string;
  categoria: string;
  larguraCm: number;
  alturaCm: number;
  profundidadeCm: number;
  pesoKg: number;
  volumeM3: number;
  cor: string | null;
  iconeUrl: string | null;
  userId: string | null;
  createdAt: string;
};

export const itensKeys = {
  all: ["itens"] as const,
  list: () => [...itensKeys.all, "list"] as const,
};

export function useItens() {
  return useQuery<ItemCatalogo[]>({
    queryKey: itensKeys.list(),
    queryFn: async () => {
      const res = await fetch("/api/itens");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao carregar itens");
      }
      return res.json();
    },
  });
}
