"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Plus,
  Loader2,
  X,
  Trash2,
  Pencil,
  Calendar,
  Navigation,
  AlertTriangle,
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

// ─── Types ────────────────────────────────────────────────

type MudancaStatus = "RASCUNHO" | "COTANDO" | "CONFIRMADA" | "CONCLUIDA";

type MudancaWithExtras = MudancaListItem & {
  distanciaKm?: number | null;
};

const STATUS_STYLES: Record<MudancaStatus, { label: string; className: string }> = {
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

/** Truncate address to street name only */
function truncateAddress(address: string): string {
  // Take just the street part (before the first dash or comma after number)
  const parts = address.split(/\s*[-–]\s*/);
  const street = parts[0].trim();
  if (street.length > 35) return street.slice(0, 32) + "…";
  return street;
}

function getStaticMapUrl(origin: string, destination: string): string {
  const o = encodeURIComponent(origin);
  const d = encodeURIComponent(destination);
  return `https://www.google.com/maps/embed/v1/directions?key=&origin=${o}&destination=${d}&mode=driving&maptype=roadmap`;
}

function getGoogleMapsEmbedUrl(origin: string, destination: string): string {
  const query = encodeURIComponent(`${origin} to ${destination}`);
  return `https://www.google.com/maps?q=${query}&output=embed&z=13&layer=transit&disableDefaultUI=1`;
}

function getGoogleMapsDirectionsUrl(origin: string, destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
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

// ─── Nova Mudanca Modal ──────────────────────────────────

function NovaMudancaModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const createMudanca = useCreateMudanca();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origem.trim() || !destino.trim()) return;

    try {
      await createMudanca.mutateAsync({
        enderecoOrigem: origem.trim(),
        enderecoDestino: destino.trim(),
        dataDesejada: data ? new Date(data).toISOString() : undefined,
      });
      setOrigem("");
      setDestino("");
      setData("");
      onClose();
    } catch {
      // error is handled by mutation state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nova mudança
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Informe de onde e para onde você vai
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quando você quer mudar?
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
            />
          </div>

          {createMudanca.isError && (
            <p className="text-sm text-red-600">
              {createMudanca.error?.message || "Erro ao criar mudança"}
            </p>
          )}

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
              disabled={createMudanca.isPending || !origem.trim() || !destino.trim()}
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
  const mapsUrl = getGoogleMapsDirectionsUrl(
    mudanca.enderecoOrigem,
    mudanca.enderecoDestino
  );
  const embedUrl = getGoogleMapsEmbedUrl(
    mudanca.enderecoOrigem,
    mudanca.enderecoDestino
  );

  const distancia = (mudanca as MudancaWithExtras).distanciaKm;

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

      {/* T2: Minimalist map — reduced height */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-[90px] w-full overflow-hidden bg-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={embedUrl}
          className="pointer-events-none h-[180px] w-full border-0 -mt-[30px] saturate-[0.3] contrast-[0.9]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          title={`Rota: ${mudanca.enderecoOrigem} → ${mudanca.enderecoDestino}`}
        />
        <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors" />
      </a>

      {/* T3: flex-grow body so footer pins to bottom */}
      <Link
        href={`/dashboard/mudanca/${mudanca.id}`}
        className="flex flex-1 flex-col"
      >
        {/* Status badge */}
        <div className="px-4 pt-3 pb-2">
          <Badge
            variant="outline"
            className={`text-[11px] font-medium ${statusStyle.className}`}
          >
            {statusStyle.label}
          </Badge>
        </div>

        {/* T1 + T5: De/Para + distance — main info block */}
        <div className="flex-1 px-4">
          <div className="flex items-stretch gap-3">
            {/* De / Para column */}
            <div className="flex-1 min-w-0">
              {/* De */}
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
              {/* Para */}
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

            {/* T5: Distance badge */}
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
        </div>

        {/* T3: Footer pinned to bottom */}
        <div className="mt-auto border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{formatDate(mudanca.dataDesejada)}</span>
          </div>

          {/* T0.1: Edit button */}
          <span className="inline-flex items-center gap-1 text-xs text-[#E84225] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-3 w-3" />
            Editar
          </span>
        </div>
      </Link>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
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
      // handled by mutation state
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      {/* T6: UX Writing — clearer header */}
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

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            {error?.message || "Não foi possível carregar suas mudanças. Tente novamente."}
          </p>
        </div>
      )}

      {/* T6: Empty state — friendlier, action-oriented */}
      {!isError && mudancaCount === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E84225]/10 mb-4">
            <Truck className="h-8 w-8 text-[#E84225]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pronto para mudar?
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">
            Comece informando de onde você sai e para onde vai. A gente cuida do resto —
            calculamos a distância e encontramos as melhores opções para você.
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

      {/* T3: Grid with equal-height cards */}
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
      <NovaMudancaModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMudanca.isPending}
      />
    </div>
  );
}
