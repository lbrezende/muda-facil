"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
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
  mudancasKeys,
  type MudancaListItem,
} from "@/hooks/use-mudancas";
import { RoomSelector } from "@/components/dashboard/room-selector";
import { calculateRoomSummary } from "@/lib/room-estimation";
import { TruckAnimation } from "@/components/dashboard/truck-animation";

// ─── Types ────────────────────────────────────────────────

type MudancaStatus = "RASCUNHO" | "COTANDO" | "CONFIRMADA" | "CONCLUIDA";

type AnimationPhase = "idle" | "submitting" | "truck-moving" | "card-appearing" | "redirecting";

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

// ─── Inline "Nova Mudança" Form ──────────────────────────

function InlineNewMudancaForm({
  onCreated,
  mudancaCount,
  freeLimit,
  isAtLimit,
  disabled,
}: {
  onCreated: (result: MudancaListItem, buttonRect: DOMRect) => void;
  mudancaCount: number;
  freeLimit: number;
  isAtLimit: boolean;
  disabled?: boolean;
}) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [distancia, setDistancia] = useState("");
  const [rooms, setRooms] = useState<Record<string, number>>({});
  const dateRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const createMudanca = useCreateMudanca();

  const summary = calculateRoomSummary(rooms);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origem.trim() || !destino.trim() || disabled) return;

    const distKm = distancia ? parseInt(distancia, 10) : undefined;

    try {
      const result = await createMudanca.mutateAsync({
        enderecoOrigem: origem.trim(),
        enderecoDestino: destino.trim(),
        dataDesejada: data ? new Date(data).toISOString() : undefined,
        numComodos: summary.numComodos || undefined,
        distanciaKm: distKm && distKm > 0 ? distKm : undefined,
      });
      setOrigem("");
      setDestino("");
      setData("");
      setDistancia("");
      setRooms({});
      if (result?.id) {
        const rect = buttonRef.current?.getBoundingClientRect();
        onCreated(result, rect || new DOMRect(window.innerWidth / 2, 200, 0, 0));
      }
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

  const isSubmitDisabled = disabled || createMudanca.isPending || !origem.trim() || !destino.trim();

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit}>
        {/* Headline */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Uma nova fase está chegando
          </h1>
          <p className="text-base text-gray-700 mt-0.5">
            Vamos cuidar de tudo pra você
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados e receba as estimativas para sua mudança com preço claro e sem surpresas
          </p>
        </div>

        {/* Airbnb-style unified search pill */}
        <div className="relative flex flex-col sm:flex-row items-stretch rounded-2xl sm:rounded-full border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow">
          {/* De onde */}
          <div className="flex-1 relative group">
            <div className="pl-5 sm:pl-9 pr-5 py-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800">
                De onde
              </label>
              <input
                type="text"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Endereço de origem"
                className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                required
                disabled={disabled}
              />
            </div>
            <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-gray-200" />
          </div>

          {/* Para onde */}
          <div className="flex-1 relative group border-t sm:border-t-0">
            <div className="px-5 py-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800">
                Para onde
              </label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Endereço de destino"
                className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                required
                disabled={disabled}
              />
            </div>
            <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-gray-200" />
          </div>

          {/* Quando */}
          <div className="relative group border-t sm:border-t-0 sm:w-40">
            <div className="px-5 py-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800">
                Quando
              </label>
              <input
                ref={dateRef}
                type="date"
                value={data}
                min={todayISO()}
                onChange={(e) => setData(e.target.value)}
                onClick={() => dateRef.current?.showPicker?.()}
                className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none cursor-pointer"
                disabled={disabled}
              />
            </div>
            <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-gray-200" />
          </div>

          {/* Distância + Search button */}
          <div className="flex items-center gap-2 border-t sm:border-t-0 sm:w-48 pr-2">
            <div className="flex-1 px-5 py-3 sm:pl-5 sm:pr-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800">
                Distância
              </label>
              <input
                type="number"
                value={distancia}
                onChange={(e) => setDistancia(e.target.value)}
                placeholder="km"
                min={1}
                className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                disabled={disabled}
              />
            </div>
            <button
              ref={buttonRef}
              type="submit"
              disabled={isSubmitDisabled}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {createMudanca.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {createMudanca.isError && (
          <p className="text-sm text-red-600 text-center mt-3">
            {createMudanca.error?.message || "Erro ao criar mudança"}
          </p>
        )}

        {/* Room categories — Airbnb-style horizontal tabs */}
        <div className="mt-6">
          <RoomSelector rooms={rooms} onChange={setRooms} variant="tabs" />
        </div>
      </form>
    </div>
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
                <Navigation className="h-3.5 w-3.5 text-primary mb-0.5" />
                <span className="text-sm font-bold text-gray-800">{distancia}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400">km</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center">
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
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
  const queryClient = useQueryClient();
  const { data: session, status: authStatus } = useSession();
  const { data: mudancas, isLoading, isError, error } = useMudancas();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const deleteMudanca = useDeleteMudanca();

  // ── Animation state machine ──
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [newMudancaId, setNewMudancaId] = useState<string | null>(null);
  const [newMudancaData, setNewMudancaData] = useState<MudancaListItem | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const cardListRef = useRef<HTMLDivElement>(null);

  const handleCreated = useCallback(
    (result: MudancaListItem, rect: DOMRect) => {
      setNewMudancaId(result.id);
      setNewMudancaData(result);
      setButtonRect(rect);
      setAnimationPhase("truck-moving");
    },
    []
  );

  const handleTruckComplete = useCallback(() => {
    // Optimistically prepend — but skip if refetch already added it
    if (newMudancaData) {
      queryClient.setQueryData<MudancaListItem[]>(
        mudancasKeys.lists(),
        (old) => {
          if (old?.some((m) => m.id === newMudancaData.id)) return old;
          return [newMudancaData, ...(old ?? [])];
        }
      );
    }
    setAnimationPhase("card-appearing");
  }, [newMudancaData, queryClient]);

  const handleCardAppeared = useCallback(() => {
    setAnimationPhase("redirecting");
    // Small delay so user sees the card before redirect
    setTimeout(() => {
      if (newMudancaId) {
        router.push(`/dashboard/mudanca/${newMudancaId}`);
      }
    }, 500);
  }, [newMudancaId, router]);

  // ── Loading / Auth ──
  if (authStatus === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  // Compute truck target position
  const getTargetPosition = () => {
    if (cardListRef.current) {
      const rect = cardListRef.current.getBoundingClientRect();
      return { x: rect.left + 40, y: rect.top + 10 };
    }
    // Fallback: below the form area
    return { x: window.innerWidth / 2, y: 400 };
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-8 md:py-6 max-w-4xl mx-auto w-full">
      {/* Inline form — always visible */}
      <InlineNewMudancaForm
        onCreated={handleCreated}
        mudancaCount={mudancaCount}
        freeLimit={freeLimit}
        isAtLimit={isAtLimit}
        disabled={animationPhase !== "idle"}
      />

      {/* Truck animation overlay */}
      {animationPhase === "truck-moving" && buttonRect && (
        <TruckAnimation
          startPosition={{
            x: buttonRect.x + buttonRect.width / 2,
            y: buttonRect.y + buttonRect.height / 2,
          }}
          targetPosition={getTargetPosition()}
          onComplete={handleTruckComplete}
        />
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            {error?.message || "Não foi possível carregar suas mudanças. Tente novamente."}
          </p>
        </div>
      )}

      {/* Empty state — skeleton cards */}
      {!isError && mudancaCount === 0 && animationPhase === "idle" && (
        <div className="flex flex-col gap-3">
          {/* Message */}
          <div className="flex flex-col items-center gap-2 py-4">
            <Truck className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-400 text-center max-w-sm">
              Suas mudanças aparecerão aqui, com os melhores preços e melhores profissionais do mercado
            </p>
          </div>

          {/* Skeleton cards */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-100 bg-white shadow-sm overflow-hidden !py-0 !gap-0 opacity-60">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 p-4 sm:p-5">
                  {/* Status badge skeleton */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
                  </div>
                  {/* Address lines skeleton */}
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: `${50 + i * 8}%` }} />
                      </div>
                    </div>
                    {/* Distance skeleton */}
                    {i <= 2 && (
                      <div className="shrink-0 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                        <div className="h-3.5 w-3.5 mx-auto rounded bg-gray-100 animate-pulse mb-1" />
                        <div className="h-4 w-6 mx-auto rounded bg-gray-100 animate-pulse" />
                        <div className="h-2 w-4 mx-auto rounded bg-gray-100 animate-pulse mt-0.5" />
                      </div>
                    )}
                  </div>
                  {/* Footer skeleton */}
                  <div className="mt-3">
                    <div className="h-3.5 w-20 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cards: 1 per line with AnimatePresence */}
      {!isError && mudancaCount > 0 && (
        <div ref={cardListRef} className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {(mudancas as MudancaWithExtras[])!.map((mudanca) => {
              const isNewCard = mudanca.id === newMudancaId;
              const shouldAnimate = isNewCard && (animationPhase === "card-appearing" || animationPhase === "redirecting");

              return (
                <motion.div
                  key={mudanca.id}
                  initial={shouldAnimate ? { scale: 0.8, opacity: 0, y: -20 } : false}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    if (isNewCard && animationPhase === "card-appearing") {
                      handleCardAppeared();
                    }
                  }}
                >
                  <MudancaCard
                    mudanca={mudanca}
                    onDelete={(id) => setDeleteTarget(id)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
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
