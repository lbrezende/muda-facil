"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Plus,
  Loader2,
  Trash2,
  Calendar,
  Navigation,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Star,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaywallGate } from "@/components/paywall/paywall-gate";
import { PLAN_LIMITS } from "@/lib/subscription";
import {
  useMudancas,
  useCreateMudanca,
  useDeleteMudanca,
  type MudancaListItem,
} from "@/hooks/use-mudancas";
import { RoomSelector } from "@/components/dashboard/room-selector";
import { calculateRoomSummary } from "@/lib/room-estimation";

// ─── Types ────────────────────────────────────────────────

type MudancaStatus = "RASCUNHO" | "COTANDO" | "CONFIRMADA" | "CONCLUIDA";

type MudancaWithExtras = MudancaListItem & {
  distanciaKm?: number | null;
  numComodos?: number | null;
  cotacoes?: Array<{
    id: string;
    precoCentavos: number;
    transportadora: {
      nome: string;
      notaMedia: number;
    };
  }>;
};

const STATUS_STYLES: Record<MudancaStatus, { label: string; className: string }> = {
  RASCUNHO: { label: "Rascunho", className: "bg-gray-100 text-gray-600 border-gray-200" },
  COTANDO: { label: "Cotando", className: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMADA: { label: "Confirmada", className: "bg-blue-50 text-blue-700 border-blue-200" },
  CONCLUIDA: { label: "Concluída", className: "bg-green-50 text-green-700 border-green-200" },
};

// ─── Helpers ──────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "Sem data";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function truncateAddress(address: string): string {
  const parts = address.split(/\s*[-–]\s*/);
  const street = parts[0].trim();
  if (street.length > 30) return street.slice(0, 27) + "…";
  return street;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Delete Confirmation Modal ───────────────────────────

function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Excluir mudança?</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Todas as informações desta mudança serão perdidas.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="button" className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={onConfirm} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, excluir"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline "Nova Mudança" Form (no popup) ───────────────

function InlineNewMudancaForm({
  onCreated,
  mudancaCount,
  freeLimit,
  isAtLimit,
}: {
  onCreated: (id: string) => void;
  mudancaCount: number;
  freeLimit: number;
  isAtLimit: boolean;
}) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [distancia, setDistancia] = useState("");
  const [rooms, setRooms] = useState<Record<string, number>>({});
  const dateRef = useRef<HTMLInputElement>(null);
  const createMudanca = useCreateMudanca();

  const summary = calculateRoomSummary(rooms);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origem.trim() || !destino.trim()) return;

    const distKm = distancia ? parseInt(distancia, 10) : undefined;

    try {
      const result = await createMudanca.mutateAsync({
        enderecoOrigem: origem.trim(),
        enderecoDestino: destino.trim(),
        dataDesejada: data ? new Date(data).toISOString() : undefined,
        numComodos: summary.numComodos || undefined,
        distanciaKm: distKm && distKm > 0 ? distKm : undefined,
      });
      // Reset form
      setOrigem("");
      setDestino("");
      setData("");
      setDistancia("");
      setRooms({});
      if (result?.id) onCreated(result.id);
    } catch {
      // handled by mutation state
    }
  };

  if (isAtLimit) {
    return (
      <Card className="bg-amber-50 border-amber-200 p-4">
        <p className="text-sm text-amber-700 text-center">
          Você atingiu o limite de {freeLimit} mudança(s) no plano gratuito.{" "}
          <Link href="/settings/billing" className="font-semibold underline">
            Fazer upgrade
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E84225] to-[#C73820] px-5 py-4">
          <h2 className="text-white text-lg font-semibold">Para onde você quer se mudar?</h2>
          <p className="text-white/70 text-xs mt-0.5">
            Preencha os dados e receba estimativas de preço na hora
          </p>
        </div>

        {/* Address row */}
        <div className="px-5 pt-4 pb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">De onde?</label>
            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Rua Augusta, 500 - SP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Para onde?</label>
            <input
              type="text"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Av. Paulista, 1578 - SP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quando?</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                ref={dateRef}
                type="date"
                value={data}
                min={todayISO()}
                onChange={(e) => setData(e.target.value)}
                onClick={() => dateRef.current?.showPicker?.()}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Distância estimada (km)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                value={distancia}
                onChange={(e) => setDistancia(e.target.value)}
                placeholder="Ex: 15"
                min={1}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              />
            </div>
          </div>
        </div>

        {/* Room selector row */}
        <div className="px-5 pb-4">
          <RoomSelector rooms={rooms} onChange={setRooms} />
        </div>

        {/* Submit row */}
        <div className="px-5 pb-4 flex items-center justify-between">
          {createMudanca.isError && (
            <p className="text-sm text-red-600 flex-1">
              {createMudanca.error?.message || "Erro ao criar mudança"}
            </p>
          )}
          <div className="flex-1" />
          <Button
            type="submit"
            className="gap-2 bg-[#E84225] text-white hover:bg-[#C73820] px-6"
            disabled={createMudanca.isPending || !origem.trim() || !destino.trim()}
          >
            {createMudanca.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Criar mudança
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// ─── MudancaCard (single column, wider, with quotes) ─────

function MudancaCard({
  mudanca,
  onDelete,
}: {
  mudanca: MudancaWithExtras;
  onDelete: (id: string) => void;
}) {
  const statusStyle = STATUS_STYLES[mudanca.status] || STATUS_STYLES.RASCUNHO;
  const distancia = mudanca.distanciaKm;
  const cotacoes = mudanca.cotacoes;

  return (
    <Card className="group relative border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden !py-0 !gap-0">
      {/* Delete button on hover */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(mudanca.id);
        }}
        className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-gray-400 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        title="Excluir mudança"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <Link href={`/dashboard/mudanca/${mudanca.id}`} className="flex flex-col sm:flex-row">
        {/* Left: Route info */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={`text-[11px] font-medium ${statusStyle.className}`}>
              {statusStyle.label}
            </Badge>
            {mudanca.dataDesejada && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDate(mudanca.dataDesejada)}
              </span>
            )}
          </div>

          {/* De / Para */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 shrink-0">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-800 truncate" title={mudanca.enderecoOrigem}>
                  {truncateAddress(mudanca.enderecoOrigem)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 shrink-0">
                  <MapPin className="h-2.5 w-2.5 text-red-500" />
                </div>
                <span className="text-sm font-medium text-gray-800 truncate" title={mudanca.enderecoDestino}>
                  {truncateAddress(mudanca.enderecoDestino)}
                </span>
              </div>
            </div>

            {/* Distance */}
            {distancia && distancia > 0 && (
              <div className="flex flex-col items-center shrink-0 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                <Navigation className="h-3.5 w-3.5 text-[#E84225] mb-0.5" />
                <span className="text-sm font-bold text-gray-800">{distancia}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400">km</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center">
            <span className="inline-flex items-center gap-1 text-xs text-[#E84225] font-medium">
              Ver detalhes
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Right: Top 3 quotes (if available) */}
        {cotacoes && cotacoes.length > 0 && (
          <div className="sm:w-64 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/50 p-4 space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Melhores preços
            </p>
            {cotacoes.slice(0, 3).map((c, i) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  {i === 0 && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                  <span className={`text-xs truncate ${i === 0 ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                    {c.transportadora.nome}
                  </span>
                </div>
                <span className={`text-xs shrink-0 ml-2 ${i === 0 ? "font-bold text-green-700" : "font-medium text-gray-700"}`}>
                  R$ {(c.precoCentavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            <p className="text-[9px] text-gray-400 italic pt-1">* Estimativa</p>
          </div>
        )}
      </Link>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const { data: mudancas, isLoading, isError, error } = useMudancas();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const deleteMudanca = useDeleteMudanca();

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#E84225]" />
      </div>
    );
  }

  if (!session) redirect("/login");

  const userPlan = session.user.plan || "FREE";
  const mudancaCount = mudancas?.length ?? 0;
  const freeLimit = PLAN_LIMITS.FREE.mudancasAtivas;
  const isAtLimit = userPlan === "FREE" && mudancaCount >= freeLimit;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteMudanca.mutateAsync(deleteTarget); } catch {}
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-8 md:py-6 max-w-4xl mx-auto w-full">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Suas mudanças
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Aqui você acompanha cada mudança do início ao fim.
        </p>
      </div>

      {/* Inline form — always visible */}
      <InlineNewMudancaForm
        onCreated={(id) => router.push(`/dashboard/mudanca/${id}`)}
        mudancaCount={mudancaCount}
        freeLimit={freeLimit}
        isAtLimit={isAtLimit}
      />

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            {error?.message || "Não foi possível carregar suas mudanças. Tente novamente."}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && mudancaCount === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Truck className="h-10 w-10 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">
            Nenhuma mudança criada ainda. Use o formulário acima para começar.
          </p>
        </div>
      )}

      {/* Cards: 1 per line */}
      {!isError && mudancaCount > 0 && (
        <div className="flex flex-col gap-3">
          {(mudancas as MudancaWithExtras[])!.map((mudanca) => (
            <MudancaCard
              key={mudanca.id}
              mudanca={mudanca}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      )}

      {/* Delete modal */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMudanca.isPending}
      />
    </div>
  );
}
