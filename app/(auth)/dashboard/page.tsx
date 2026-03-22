"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Plus,
  Loader2,
  X,
  Trash2,
  Calendar,
  Navigation,
  AlertTriangle,
  ChevronRight,
  Box,
  Weight,
  MapPin,
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
import { QuotePreview } from "@/components/dashboard/quote-preview";
import { TruckRecommendationPanel } from "@/components/dashboard/truck-recommendation";
import { calculateRoomSummary } from "@/lib/room-estimation";
import { useDistance } from "@/hooks/use-distance";
import { useEstimateQuotes } from "@/hooks/use-quotes";

// ─── Types ────────────────────────────────────────────────

type MudancaStatus = "RASCUNHO" | "COTANDO" | "CONFIRMADA" | "CONCLUIDA";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const STATUS_STYLES: Record<
  MudancaStatus,
  { label: string; className: string }
> = {
  RASCUNHO: {
    label: "Rascunho",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  COTANDO: {
    label: "Cotando",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CONFIRMADA: {
    label: "Confirmada",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CONCLUIDA: {
    label: "Concluída",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

// ─── Helpers ──────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "Sem data";
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
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

function getGoogleMapsEmbedUrl(origin: string, destination: string): string {
  const query = encodeURIComponent(`${origin} to ${destination}`);
  return `https://www.google.com/maps?q=${query}&output=embed&z=13&layer=transit&disableDefaultUI=1`;
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
          <h3 className="text-base font-semibold text-gray-900">
            Excluir mudança?
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Todas as informações desta mudança serão perdidas, incluindo
            configurações de cômodos, cotações e dados do mapa.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sim, excluir"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Nova Mudanca Modal (with Room Selector + Live Quotes) ─

function NovaMudancaModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [rooms, setRooms] = useState<Record<string, number>>({});
  const dateRef = useRef<HTMLInputElement>(null);
  const createMudanca = useCreateMudanca();

  // Live calculations
  const summary = calculateRoomSummary(rooms);
  const { data: distanciaKm, isLoading: distLoading } = useDistance(
    origem,
    destino
  );
  const { data: quotes, isLoading: quotesLoading } = useEstimateQuotes(
    distanciaKm ?? null,
    summary.numComodos
  );

  // Mock truck data for recommendation (matches seed)
  const caminhoes = [
    { id: "1", nome: "Fiorino", tipo: "FIORINO", capacidadeM3: 1.5, capacidadeKg: 600 },
    { id: "2", nome: "HR / VUC", tipo: "HR", capacidadeM3: 6, capacidadeKg: 1500 },
    { id: "3", nome: "3/4", tipo: "TRES_QUARTOS", capacidadeM3: 12, capacidadeKg: 3000 },
    { id: "4", nome: "Baú", tipo: "BAU", capacidadeM3: 20, capacidadeKg: 5000 },
  ];

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origem.trim() || !destino.trim()) return;

    try {
      const result = await createMudanca.mutateAsync({
        enderecoOrigem: origem.trim(),
        enderecoDestino: destino.trim(),
        dataDesejada: data ? new Date(data).toISOString() : undefined,
        numComodos: summary.numComodos || undefined,
        distanciaKm: distanciaKm ?? undefined,
      });
      setOrigem("");
      setDestino("");
      setData("");
      setRooms({});
      onClose();
      // Redirect to detail page
      if (result?.id && onCreated) {
        onCreated(result.id);
      }
    } catch {
      // error handled by mutation state
    }
  };

  const hasAddresses = origem.length >= 5 && destino.length >= 5;
  const hasRooms = summary.numComodos > 0;
  const showEstimates = hasAddresses && hasRooms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nova mudança
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Informe os dados e receba estimativas instantâneas
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              De onde você está saindo?
            </label>
            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Ex: Rua Augusta, 500 - São Paulo, SP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              required
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Para onde você vai?
            </label>
            <input
              type="text"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ex: Av. Paulista, 1578 - São Paulo, SP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              required
            />
          </div>

          {/* Distance indicator */}
          {hasAddresses && (
            <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
              <Navigation className="h-3.5 w-3.5 text-[#E84225]" />
              {distLoading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Calculando distância...
                </span>
              ) : distanciaKm ? (
                <span>
                  Distância estimada:{" "}
                  <strong className="text-gray-700">{distanciaKm} km</strong>
                </span>
              ) : (
                <span className="text-amber-600">
                  Não foi possível calcular a distância
                </span>
              )}
            </div>
          )}

          {/* Room Selector */}
          <RoomSelector rooms={rooms} onChange={setRooms} />

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quando você quer mudar?
            </label>
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
            <p className="text-[10px] text-gray-400 mt-1 px-1">
              Escolha uma data aproximada — você pode alterar depois
            </p>
          </div>

          {/* Live Estimates */}
          {showEstimates && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              {/* Truck recommendation */}
              <TruckRecommendationPanel
                volumeM3={summary.volumeM3}
                pesoKg={summary.pesoKg}
                caminhoes={caminhoes}
                compact
              />

              {/* Quote preview */}
              {quotesLoading ? (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Buscando melhores preços...
                </div>
              ) : quotes && quotes.length > 0 ? (
                <QuotePreview quotes={quotes} />
              ) : null}
            </div>
          )}

          {/* Error */}
          {createMudanca.isError && (
            <p className="text-sm text-red-600">
              {createMudanca.error?.message || "Erro ao criar mudança"}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#E84225] text-white hover:bg-[#C73820]"
              disabled={
                createMudanca.isPending || !origem.trim() || !destino.trim()
              }
            >
              {createMudanca.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar mudança"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MudancaCard ──────────────────────────────────────────

function MudancaCard({
  mudanca,
  onDelete,
}: {
  mudanca: MudancaWithExtras;
  onDelete: (id: string) => void;
}) {
  const statusStyle = STATUS_STYLES[mudanca.status] || STATUS_STYLES.RASCUNHO;
  const embedUrl = getGoogleMapsEmbedUrl(
    mudanca.enderecoOrigem,
    mudanca.enderecoDestino
  );
  const distancia = mudanca.distanciaKm;
  const cotacoes = mudanca.cotacoes;

  return (
    <Card className="group relative flex flex-col border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden !py-0 !gap-0">
      {/* T0: Delete button on hover */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(mudanca.id);
        }}
        className="absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-gray-400 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        title="Excluir mudança"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* T5: Map — illustrative only, no click */}
      <Link href={`/dashboard/mudanca/${mudanca.id}`} className="flex flex-1 flex-col">
        <div className="relative block h-[80px] w-full overflow-hidden bg-gray-100">
          <iframe
            src={embedUrl}
            className="pointer-events-none h-[180px] w-full border-0 -mt-[35px] saturate-[0.25] contrast-[0.85] brightness-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            title={`Rota: ${mudanca.enderecoOrigem} → ${mudanca.enderecoDestino}`}
          />
          <div className="absolute bottom-1.5 left-2 flex items-center gap-1 rounded bg-white/80 px-1.5 py-0.5 text-[9px] text-gray-500 backdrop-blur-sm">
            <MapPin className="h-2.5 w-2.5" />
            Prévia da rota
          </div>
        </div>

        {/* Status badge */}
        <div className="px-4 pt-3 pb-2">
          <Badge
            variant="outline"
            className={`text-[11px] font-medium ${statusStyle.className}`}
          >
            {statusStyle.label}
          </Badge>
        </div>

        {/* De/Para + distance */}
        <div className="flex-1 px-4">
          <div className="flex items-stretch gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-6">
                  De
                </span>
                <span
                  className="text-sm font-medium text-gray-800 truncate"
                  title={mudanca.enderecoOrigem}
                >
                  {truncateAddress(mudanca.enderecoOrigem)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-6">
                  Para
                </span>
                <span
                  className="text-sm font-medium text-gray-800 truncate"
                  title={mudanca.enderecoDestino}
                >
                  {truncateAddress(mudanca.enderecoDestino)}
                </span>
              </div>
            </div>

            {distancia && (
              <div className="flex flex-col items-center justify-center shrink-0 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
                <Navigation className="h-3.5 w-3.5 text-[#E84225] mb-0.5" />
                <span className="text-sm font-bold text-gray-800">
                  {distancia}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400">
                  km
                </span>
              </div>
            )}
          </div>

          {/* T9: Cargo summary */}
          {mudanca.numComodos && mudanca.numComodos > 0 && (
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Box className="h-3 w-3 text-blue-400" />
                {mudanca.numComodos} côm.
              </span>
            </div>
          )}
        </div>

        {/* T7: Top 3 quotes preview */}
        {cotacoes && cotacoes.length > 0 && (
          <div className="px-4 pt-2 pb-1 border-t border-gray-50 mt-2">
            <div className="space-y-1">
              {cotacoes.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600 truncate">
                    {c.transportadora.nome}
                  </span>
                  <span className="font-semibold text-gray-800 shrink-0 ml-2">
                    R${" "}
                    {(c.precoCentavos / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
              <p className="text-[9px] text-gray-400 italic">
                * Estimativa
              </p>
            </div>
          </div>
        )}

        {/* Footer: date + "Ver detalhes" always visible */}
        <div className="mt-auto border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{formatDate(mudanca.dataDesejada)}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-[#E84225] font-medium">
            Ver detalhes
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const { data: mudancas, isLoading, isError, error } = useMudancas();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const deleteMudanca = useDeleteMudanca();

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#E84225]" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const userPlan = session.user.plan || "FREE";
  const mudancaCount = mudancas?.length ?? 0;
  const freeLimit = PLAN_LIMITS.FREE.mudancasAtivas;
  const isAtLimit = userPlan === "FREE" && mudancaCount >= freeLimit;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMudanca.mutateAsync(deleteTarget);
    } catch {
      // handled
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Suas mudanças
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Aqui você acompanha cada mudança do início ao fim.
          </p>
        </div>
        <PaywallGate
          featureName="mudança ativa"
          currentUsage={mudancaCount}
          limit={freeLimit}
          isBlocked={isAtLimit}
        >
          <Button
            className="gap-2 bg-[#E84225] text-white hover:bg-[#C73820]"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Nova mudança
          </Button>
        </PaywallGate>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            {error?.message ||
              "Não foi possível carregar suas mudanças. Tente novamente."}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isError && mudancaCount === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E84225]/10 mb-4">
            <Truck className="h-8 w-8 text-[#E84225]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pronto para mudar?
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">
            Comece informando de onde você sai e para onde vai. Selecione os
            cômodos da sua casa e receba estimativas de preço na hora.
          </p>
          <Button
            className="mt-6 gap-2 bg-[#E84225] text-white hover:bg-[#C73820]"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Começar minha mudança
          </Button>
        </div>
      )}

      {/* Cards grid */}
      {!isError && mudancaCount > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {(mudancas as MudancaWithExtras[])!.map((mudanca) => (
            <MudancaCard
              key={mudanca.id}
              mudanca={mudanca}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NovaMudancaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(id) => router.push(`/dashboard/mudanca/${id}`)}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMudanca.isPending}
      />
    </div>
  );
}
