"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Truck,
  Package,
  MapPin,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Box,
  Weight,
  Calendar,
  Navigation,
  Star,
  Clock,
  Shield,
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Monitor,
  WashingMachine,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMudanca } from "@/hooks/use-mudancas";
import { ROOM_TYPES, calculateRoomSummary, recommendTrucks, type TruckInfo } from "@/lib/room-estimation";
import { TruckRecommendationPanel } from "@/components/dashboard/truck-recommendation";

// ─── Types ────────────────────────────────────────────────

type RoomKey = string;

interface RoomItem {
  id: string;
  name: string;
  volumeM3: number;
  pesoKg: number;
}

interface RoomBlock {
  key: RoomKey;
  label: string;
  icon: string;
  count: number;
  items: RoomItem[];
  expanded: boolean;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  RASCUNHO: { label: "Rascunho", className: "bg-gray-100 text-gray-600 border-gray-200" },
  COTANDO: { label: "Cotando", className: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMADA: { label: "Confirmada", className: "bg-blue-50 text-blue-700 border-blue-200" },
  CONCLUIDA: { label: "Concluída", className: "bg-green-50 text-green-700 border-green-200" },
};

const ROOM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bed, Sofa, UtensilsCrossed, Bath, Monitor, WashingMachine,
};

// Default items per room type
const ROOM_DEFAULT_ITEMS: Record<string, RoomItem[]> = {
  QUARTO: [
    { id: "q-cama", name: "Cama", volumeM3: 1.2, pesoKg: 40 },
    { id: "q-guardaroupa", name: "Guarda-roupa", volumeM3: 1.0, pesoKg: 35 },
    { id: "q-criadomudo", name: "Criado-mudo", volumeM3: 0.3, pesoKg: 5 },
  ],
  SALA: [
    { id: "s-sofa", name: "Sofá", volumeM3: 1.0, pesoKg: 35 },
    { id: "s-mesacentro", name: "Mesa de centro", volumeM3: 0.5, pesoKg: 15 },
    { id: "s-rack", name: "Rack / Estante", volumeM3: 0.5, pesoKg: 15 },
  ],
  COZINHA: [
    { id: "c-geladeira", name: "Geladeira", volumeM3: 0.6, pesoKg: 30 },
    { id: "c-fogao", name: "Fogão", volumeM3: 0.5, pesoKg: 25 },
    { id: "c-mesa", name: "Mesa com cadeiras", volumeM3: 0.4, pesoKg: 5 },
  ],
  BANHEIRO: [
    { id: "b-armario", name: "Armário de banheiro", volumeM3: 0.3, pesoKg: 10 },
  ],
  ESCRITORIO: [
    { id: "e-mesa", name: "Mesa de escritório", volumeM3: 0.6, pesoKg: 25 },
    { id: "e-cadeira", name: "Cadeira", volumeM3: 0.4, pesoKg: 15 },
    { id: "e-estante", name: "Estante", volumeM3: 0.4, pesoKg: 10 },
  ],
  AREA_SERVICO: [
    { id: "as-maquina", name: "Máquina de lavar", volumeM3: 0.3, pesoKg: 50 },
  ],
};

const CAMINHOES: TruckInfo[] = [
  { id: "1", nome: "Fiorino", tipo: "FIORINO", capacidadeM3: 1.5, capacidadeKg: 600 },
  { id: "2", nome: "HR / VUC", tipo: "HR", capacidadeM3: 6, capacidadeKg: 1500 },
  { id: "3", nome: "3/4", tipo: "TRES_QUARTOS", capacidadeM3: 12, capacidadeKg: 3000 },
  { id: "4", nome: "Baú", tipo: "BAU", capacidadeM3: 20, capacidadeKg: 5000 },
];

function formatDate(iso: string | null): string {
  if (!iso) return "Sem data";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Build room blocks from numComodos ───────────────────

function buildInitialRooms(numComodos: number): RoomBlock[] {
  // Simple heuristic: distribute rooms
  const blocks: RoomBlock[] = [];

  if (numComodos <= 0) return blocks;

  // Always 1 kitchen, 1 bathroom, rest as bedrooms + 1 sala
  const kitchens = 1;
  const bathrooms = Math.min(numComodos, Math.max(1, Math.floor(numComodos / 3)));
  const salas = 1;
  const remaining = Math.max(0, numComodos - kitchens - bathrooms - salas);
  const quartos = remaining;

  const distribution: Record<string, number> = {
    QUARTO: quartos,
    SALA: salas,
    COZINHA: kitchens,
    BANHEIRO: bathrooms,
  };

  for (const room of ROOM_TYPES) {
    const count = distribution[room.key] || 0;
    if (count > 0) {
      // Generate items for each instance of this room
      const items: RoomItem[] = [];
      for (let i = 0; i < count; i++) {
        const defaults = ROOM_DEFAULT_ITEMS[room.key] || [];
        items.push(
          ...defaults.map((d) => ({
            ...d,
            id: `${d.id}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          }))
        );
      }

      blocks.push({
        key: room.key,
        label: room.label,
        icon: room.icon,
        count,
        items,
        expanded: true,
      });
    }
  }

  return blocks;
}

// ─── Page ─────────────────────────────────────────────────

export default function MudancaDetailPage() {
  const { data: session, status: authStatus } = useSession();
  const params = useParams();
  const id = params.id as string;
  const { data: mudanca, isLoading, isError } = useMudanca(id);

  // Room-based item state
  const [roomBlocks, setRoomBlocks] = useState<RoomBlock[] | null>(null);

  // Initialize room blocks from mudança data once loaded
  if (mudanca && roomBlocks === null) {
    const numComodos = (mudanca as Record<string, unknown>).numComodos as number || 3;
    // Use setTimeout to avoid setState during render
    setTimeout(() => setRoomBlocks(buildInitialRooms(numComodos)), 0);
  }

  // Calculate totals from room blocks
  const totals = useMemo(() => {
    if (!roomBlocks) return { items: 0, volumeM3: 0, pesoKg: 0 };
    let items = 0;
    let volumeM3 = 0;
    let pesoKg = 0;
    for (const block of roomBlocks) {
      items += block.items.length;
      for (const item of block.items) {
        volumeM3 += item.volumeM3;
        pesoKg += item.pesoKg;
      }
    }
    return {
      items,
      volumeM3: Math.round(volumeM3 * 10) / 10,
      pesoKg: Math.round(pesoKg),
    };
  }, [roomBlocks]);

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#E84225]" />
      </div>
    );
  }

  if (!session) redirect("/login");

  if (isError || !mudanca) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Mudança não encontrada</h2>
        <Link href="/dashboard" className="mt-4 text-sm text-[#E84225] hover:underline">
          ← Voltar para mudanças
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[mudanca.status] || STATUS_STYLES.RASCUNHO;
  const distanciaKm = (mudanca as Record<string, unknown>).distanciaKm as number | null;
  const cotacoes = (mudanca as Record<string, unknown>).cotacoes as Array<{
    id: string;
    precoCentavos: number;
    transportadora: { nome: string; notaMedia: number };
  }> | undefined;

  const removeItem = (roomKey: string, itemId: string) => {
    if (!roomBlocks) return;
    setRoomBlocks(
      roomBlocks.map((b) =>
        b.key === roomKey
          ? { ...b, items: b.items.filter((i) => i.id !== itemId) }
          : b
      )
    );
  };

  const addItem = (roomKey: string) => {
    if (!roomBlocks) return;
    const defaults = ROOM_DEFAULT_ITEMS[roomKey];
    if (!defaults || defaults.length === 0) return;
    // Add the first default item type
    const newItem = {
      ...defaults[0],
      id: `${defaults[0].id}-new-${Math.random().toString(36).slice(2, 6)}`,
    };
    setRoomBlocks(
      roomBlocks.map((b) =>
        b.key === roomKey ? { ...b, items: [...b.items, newItem] } : b
      )
    );
  };

  const toggleExpand = (roomKey: string) => {
    if (!roomBlocks) return;
    setRoomBlocks(
      roomBlocks.map((b) =>
        b.key === roomKey ? { ...b, expanded: !b.expanded } : b
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">
                  Detalhes da mudança
                </h1>
                <Badge variant="outline" className={`text-[11px] ${statusStyle.className}`}>
                  {statusStyle.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#E84225]" />
                  {mudanca.enderecoOrigem}
                </span>
                <ArrowRight className="h-3 w-3" />
                <span>{mudanca.enderecoDestino}</span>
                {distanciaKm && (
                  <span className="flex items-center gap-1 font-medium">
                    <Navigation className="h-3 w-3 text-[#E84225]" />
                    {distanciaKm} km
                  </span>
                )}
                {mudanca.dataDesejada && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(mudanca.dataDesejada)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body: left (items by room) + right (summary panel) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Items organized by room */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-900">
              Itens por cômodo
            </h2>
            <span className="text-xs text-gray-500">
              Ajuste os itens para uma estimativa mais precisa
            </span>
          </div>

          {roomBlocks && roomBlocks.length > 0 ? (
            roomBlocks.map((block) => {
              const Icon = ROOM_ICONS[block.icon];
              return (
                <Card key={block.key} className="overflow-hidden">
                  {/* Room header — clickable to expand */}
                  <button
                    onClick={() => toggleExpand(block.key)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-[#E84225]" />}
                      <span className="text-sm font-medium text-gray-900">
                        {block.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({block.count}× | {block.items.length} itens)
                      </span>
                    </div>
                    {block.expanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Items list */}
                  {block.expanded && (
                    <CardContent className="py-2 px-4">
                      <div className="space-y-1">
                        {block.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50 group"
                          >
                            <div className="flex items-center gap-3">
                              <Package className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm text-gray-800">
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">
                                {item.volumeM3} m³ · {item.pesoKg} kg
                              </span>
                              <button
                                onClick={() => removeItem(block.key, item.id)}
                                className="flex h-5 w-5 items-center justify-center rounded text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => addItem(block.key)}
                        className="flex items-center gap-1.5 mt-2 px-2 py-1.5 text-xs text-[#E84225] font-medium hover:bg-[#E84225]/5 rounded-md transition-colors w-full"
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar item em {block.label}
                      </button>
                    </CardContent>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Nenhum cômodo configurado</p>
            </div>
          )}
        </div>

        {/* Right: Summary panel */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto p-4 space-y-4">
          {/* Cargo summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Resumo da carga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-blue-50">
                  <Package className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                  <p className="text-lg font-bold text-gray-900">{totals.items}</p>
                  <p className="text-[10px] text-gray-500">itens</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-green-50">
                  <Box className="h-4 w-4 mx-auto text-green-500 mb-1" />
                  <p className="text-lg font-bold text-gray-900">{totals.volumeM3}</p>
                  <p className="text-[10px] text-gray-500">m³</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-50">
                  <Weight className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                  <p className="text-lg font-bold text-gray-900">{totals.pesoKg}</p>
                  <p className="text-[10px] text-gray-500">kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Truck recommendation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Caminhão</CardTitle>
            </CardHeader>
            <CardContent>
              <TruckRecommendationPanel
                volumeM3={totals.volumeM3}
                pesoKg={totals.pesoKg}
                caminhoes={CAMINHOES}
                compact
              />
            </CardContent>
          </Card>

          {/* Quotes */}
          {cotacoes && cotacoes.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cotações estimadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cotacoes.slice(0, 5).map((c, i) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      i === 0 ? "bg-green-50 border border-green-200" : "bg-white border border-gray-100"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {c.transportadora.nome}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-500">
                          {c.transportadora.notaMedia?.toFixed(1)}
                        </span>
                        {i === 0 && (
                          <span className="text-[10px] font-medium text-green-600 ml-1">
                            Melhor preço
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      R${" "}
                      {(c.precoCentavos / 100).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400 italic text-center mt-2">
                  Preços estimados. Detalhe seus itens para maior precisão.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Distance info */}
          {distanciaKm && (
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Distância</span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5 text-[#E84225]" />
                    {distanciaKm} km
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
