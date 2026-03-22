"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Package,
  MapPin,
  Calendar,
  Plus,
  Loader2,
  ArrowRight,
  X,
  Home,
  Star,
  Shield,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaywallGate } from "@/components/paywall/paywall-gate";
import { PLAN_LIMITS } from "@/lib/subscription";
import {
  useMudancas,
  useCreateMudanca,
  type MudancaListItem,
} from "@/hooks/use-mudancas";

// ─── Types ────────────────────────────────────────────────

type MudancaStatus = "RASCUNHO" | "COTANDO" | "CONFIRMADA" | "CONCLUIDA";

interface CotacaoWithTransportadora {
  id: string;
  precoCentavos: number;
  seguroIncluso: boolean;
  dataDisponivel: string;
  transportadora: {
    id: string;
    nome: string;
    logoUrl: string | null;
    notaMedia: number;
    totalAvaliacoes: number;
  };
}

type MudancaWithCotacoes = MudancaListItem & {
  cotacoes?: CotacaoWithTransportadora[];
  numComodos?: number;
  distanciaKm?: number | null;
};

const STATUS_STYLES: Record<MudancaStatus, { label: string; className: string }> = {
  RASCUNHO: {
    label: "Rascunho",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  COTANDO: {
    label: "Cotando",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  CONFIRMADA: {
    label: "Confirmada",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  CONCLUIDA: {
    label: "Concluída",
    className: "bg-green-100 text-green-700 border-green-200",
  },
};

const COMODOS_OPTIONS = [
  { value: 1, label: "Kitnet / Studio", estimate: "~10 itens" },
  { value: 2, label: "1 quarto", estimate: "~20 itens" },
  { value: 3, label: "2 quartos", estimate: "~30 itens" },
  { value: 4, label: "3 quartos", estimate: "~40 itens" },
  { value: 5, label: "3 quartos + escritório", estimate: "~50 itens" },
  { value: 6, label: "4+ quartos (casa grande)", estimate: "~60 itens" },
];

// ─── Helpers ──────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR");
}

function formatPrice(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getGoogleMapsEmbedUrl(origin: string, destination: string): string {
  const query = encodeURIComponent(`${origin} to ${destination}`);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

function getGoogleMapsDirectionsUrl(origin: string, destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
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
  const [numComodos, setNumComodos] = useState(2);
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
        numComodos,
      });
      setOrigem("");
      setDestino("");
      setData("");
      setNumComodos(2);
      onClose();
    } catch {
      // error is handled by mutation state
    }
  };

  const selectedComodo = COMODOS_OPTIONS.find(o => o.value === numComodos);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nova Mudança</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Preencha os dados e receba cotações automaticamente
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
              Endereço de origem
            </label>
            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Rua das Flores, 123 - São Paulo, SP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de destino
            </label>
            <input
              type="text"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Av. Paulista, 1500 - São Paulo, SP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E84225] focus:outline-none focus:ring-2 focus:ring-[#E84225]/20"
              required
            />
          </div>

          {/* House size selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="inline h-4 w-4 mr-1 -mt-0.5" />
              Tamanho da casa
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COMODOS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNumComodos(option.value)}
                  className={`rounded-lg border px-3 py-2 text-left transition-all ${
                    numComodos === option.value
                      ? "border-[#E84225] bg-[#E84225]/5 ring-1 ring-[#E84225]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`text-xs font-medium ${numComodos === option.value ? "text-[#E84225]" : "text-gray-700"}`}>
                    {option.label}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {option.estimate}
                  </div>
                </button>
              ))}
            </div>
            {selectedComodo && (
              <p className="mt-2 text-xs text-gray-500">
                Estimativa: <strong>{selectedComodo.estimate}</strong> para mudança
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data desejada
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
                  Calculando cotações...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Criar e cotar automaticamente
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MudancaCard ──────────────────────────────────────────

function MudancaCard({ mudanca }: { mudanca: MudancaWithCotacoes }) {
  const statusStyle = STATUS_STYLES[mudanca.status] || STATUS_STYLES.RASCUNHO;
  const mapsUrl = getGoogleMapsDirectionsUrl(mudanca.enderecoOrigem, mudanca.enderecoDestino);
  const embedUrl = getGoogleMapsEmbedUrl(mudanca.enderecoOrigem, mudanca.enderecoDestino);
  const totalCotacoes = mudanca._count?.cotacoes ?? 0;
  const topCotacoes = mudanca.cotacoes ?? [];

  return (
    <Card className="group cursor-pointer border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden !py-0 !gap-0">
      {/* Map preview */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-[140px] w-full overflow-hidden bg-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={embedUrl}
          className="pointer-events-none h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          title={`Rota: ${mudanca.enderecoOrigem} → ${mudanca.enderecoDestino}`}
        />
        <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors" />
        {mudanca.distanciaKm && (
          <div className="absolute top-2 left-2 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-medium text-gray-700 shadow-sm">
            📍 {mudanca.distanciaKm} km
          </div>
        )}
        <div className="absolute bottom-2 right-2 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-medium text-gray-600 shadow-sm">
          Ver rota ↗
        </div>
      </a>

      <Link href={`/dashboard/mudanca/${mudanca.id}`}>
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2 pt-3 mt-2">
          <Badge
            variant="outline"
            className={`text-xs font-medium ${statusStyle.className}`}
          >
            {statusStyle.label}
          </Badge>
          <span className="inline-flex items-center h-7 px-2 text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
            Detalhes
            <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* Origin → Destination */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E84225]" />
              <span className="leading-snug line-clamp-1">{mudanca.enderecoOrigem}</span>
            </div>
            <div className="ml-6 flex items-center gap-1.5 text-xs text-gray-400">
              <ArrowRight className="h-3 w-3" />
              <span className="leading-snug text-gray-600 line-clamp-1">
                {mudanca.enderecoDestino}
              </span>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(mudanca.dataDesejada)}</span>
            </div>
            {mudanca.numComodos && (
              <div className="flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                <span>{mudanca.numComodos} cômodos</span>
              </div>
            )}
            {totalCotacoes > 0 && (
              <div className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-[#E84225]" />
                <span>{totalCotacoes} cotações</span>
              </div>
            )}
          </div>

          {/* Top 3 cheapest quotes */}
          {topCotacoes.length > 0 && (
            <div className="space-y-1.5 border-t border-gray-100 pt-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Melhores preços
              </p>
              {topCotacoes.map((cotacao, index) => (
                <div
                  key={cotacao.id}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${
                    index === 0
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {cotacao.transportadora.logoUrl || "🚛"}
                    </span>
                    <div>
                      <span className={`text-xs font-medium ${index === 0 ? "text-green-800" : "text-gray-700"}`}>
                        {cotacao.transportadora.nome}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        {cotacao.transportadora.notaMedia}
                        {cotacao.seguroIncluso && (
                          <>
                            <span className="mx-0.5">·</span>
                            <Shield className="h-2.5 w-2.5 text-blue-400" />
                            <span className="text-blue-500">Seguro</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${index === 0 ? "text-green-700" : "text-gray-700"}`}>
                    {formatPrice(cotacao.precoCentavos)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const { data: mudancas, isLoading, isError, error } = useMudancas();
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Minhas Mudanças
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie e acompanhe todas as suas mudanças em um só lugar.
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
            Nova Mudança
          </Button>
        </PaywallGate>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            {error?.message || "Erro ao carregar mudanças"}
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
            Nenhuma mudança ainda
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Crie sua primeira mudança para receber cotações automáticas de 12 transportadoras.
          </p>
          <Button
            className="mt-6 gap-2 bg-[#E84225] text-white hover:bg-[#C73820]"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Criar minha primeira mudança
          </Button>
        </div>
      )}

      {/* Mudancas grid */}
      {!isError && mudancaCount > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(mudancas as MudancaWithCotacoes[])!.map((mudanca) => (
            <MudancaCard key={mudanca.id} mudanca={mudanca} />
          ))}
        </div>
      )}

      {/* Modal */}
      <NovaMudancaModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
