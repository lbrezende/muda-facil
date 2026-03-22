"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  ArrowRight,
  BarChart3,
  Weight,
  Loader2,
  ChevronLeft,
  Tag,
  Plus,
  X,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────

type MudancaStatus = "Rascunho" | "Cotando" | "Confirmada" | "Concluída";

interface TruckOption {
  id: string;
  nome: string;
  capacidadeVolume: number;
  capacidadePeso: number;
  descricao: string;
}

interface Cotacao {
  id: string;
  empresa: string;
  valor: number;
  prazoEntrega: string;
  avaliacao: number;
}

interface CatalogItem {
  id: string;
  nome: string;
  categoria: string;
  largura: number;
  altura: number;
  profundidade: number;
  peso: number;
  volume: number;
  cor: string;
}

interface CargaItem {
  id: string;
  item: CatalogItem;
  quantidade: number;
}

// ─── Mock Data ────────────────────────────────────────────

const MOCK_MUDANCA = {
  id: "mud_001",
  status: "Cotando" as MudancaStatus,
  enderecoOrigem: "Rua das Flores, 123 – São Paulo, SP",
  enderecoDestino: "Av. Paulista, 1500 – São Paulo, SP",
  dataDesejada: "2026-04-05",
};

const MOCK_TRUCKS: TruckOption[] = [
  { id: "fiorino", nome: "Fiorino", capacidadeVolume: 2.5, capacidadePeso: 500, descricao: "Estúdios e pequenos aptos" },
  { id: "hr", nome: "HR (Pickup)", capacidadeVolume: 5, capacidadePeso: 1000, descricao: "Aptos de 1-2 quartos" },
  { id: "tres_quartos", nome: "Caminhão 3/4", capacidadeVolume: 14, capacidadePeso: 2500, descricao: "Aptos de 2-3 quartos" },
  { id: "bau", nome: "Caminhão Baú", capacidadeVolume: 35, capacidadePeso: 8000, descricao: "Casas grandes" },
];

const MOCK_COTACOES: Cotacao[] = [
  { id: "cot_001", empresa: "MudaTrans Logística", valor: 1250, prazoEntrega: "1 dia", avaliacao: 4.8 },
  { id: "cot_002", empresa: "Fretes Rápidos SP", valor: 980, prazoEntrega: "2 dias", avaliacao: 4.5 },
];

const CATALOG_ITEMS: CatalogItem[] = [
  { id: "cat_01", nome: "Cama Casal", categoria: "Quarto", largura: 188, altura: 45, profundidade: 138, peso: 40, volume: 1.17, cor: "bg-purple-400" },
  { id: "cat_02", nome: "Cama Solteiro", categoria: "Quarto", largura: 90, altura: 45, profundidade: 190, peso: 25, volume: 0.77, cor: "bg-purple-300" },
  { id: "cat_03", nome: "Guarda-Roupa 4 Portas", categoria: "Quarto", largura: 200, altura: 200, profundidade: 55, peso: 90, volume: 2.20, cor: "bg-purple-500" },
  { id: "cat_04", nome: "Cômoda", categoria: "Quarto", largura: 80, altura: 85, profundidade: 45, peso: 25, volume: 0.31, cor: "bg-purple-400" },
  { id: "cat_05", nome: "Geladeira Duplex", categoria: "Cozinha", largura: 70, altura: 175, profundidade: 75, peso: 90, volume: 0.92, cor: "bg-sky-400" },
  { id: "cat_06", nome: "Fogão 4 Bocas", categoria: "Cozinha", largura: 60, altura: 85, profundidade: 60, peso: 30, volume: 0.31, cor: "bg-sky-500" },
  { id: "cat_07", nome: "Microondas", categoria: "Cozinha", largura: 45, altura: 28, profundidade: 35, peso: 12, volume: 0.04, cor: "bg-sky-300" },
  { id: "cat_08", nome: "Sofá 3 Lugares", categoria: "Sala", largura: 210, altura: 85, profundidade: 90, peso: 60, volume: 1.60, cor: "bg-emerald-400" },
  { id: "cat_09", nome: "Rack de TV", categoria: "Sala", largura: 180, altura: 55, profundidade: 40, peso: 30, volume: 0.40, cor: "bg-emerald-500" },
  { id: "cat_10", nome: "Mesa de Escritório", categoria: "Escritório", largura: 150, altura: 75, profundidade: 70, peso: 25, volume: 0.79, cor: "bg-orange-400" },
  { id: "cat_11", nome: "Máquina de Lavar", categoria: "Área de Serviço", largura: 60, altura: 85, profundidade: 60, peso: 65, volume: 0.31, cor: "bg-indigo-400" },
  { id: "cat_12", nome: "Caixa M", categoria: "Caixas", largura: 50, altura: 40, profundidade: 40, peso: 10, volume: 0.08, cor: "bg-amber-400" },
  { id: "cat_13", nome: "Caixa G", categoria: "Caixas", largura: 60, altura: 50, profundidade: 50, peso: 15, volume: 0.15, cor: "bg-amber-500" },
];

// ─── Helpers ──────────────────────────────────────────────

const STATUS_STYLES: Record<MudancaStatus, { label: string; className: string }> = {
  Rascunho: { label: "Rascunho", className: "bg-gray-100 text-gray-600 border-gray-200" },
  Cotando: { label: "Cotando", className: "bg-amber-100 text-amber-700 border-amber-200" },
  Confirmada: { label: "Confirmada", className: "bg-blue-100 text-blue-700 border-blue-200" },
  Concluída: { label: "Concluída", className: "bg-green-100 text-green-700 border-green-200" },
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

// ─── Canvas with items ───────────────────────────────────

function CargoCanvas({
  itens,
  onRemove,
  onAddMore,
}: {
  itens: CargaItem[];
  onRemove: (id: string) => void;
  onAddMore: () => void;
}) {
  if (itens.length === 0) {
    return (
      <div className="py-6">
        <Button
          onClick={onAddMore}
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar item
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Package className="h-4 w-4 text-[#E84225]" />
          Itens da mudança ({itens.reduce((acc, i) => acc + i.quantidade, 0)} itens)
        </div>
        <Button
          onClick={onAddMore}
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs gap-1 border-gray-200 text-gray-600 hover:border-[#E84225] hover:text-[#E84225]"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </Button>
      </div>

      {/* Items grid */}
      <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((cargaItem) => (
          <div
            key={cargaItem.id}
            className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 group"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${cargaItem.item.cor} text-white text-sm font-bold`}
            >
              {cargaItem.item.nome.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">
                {cargaItem.item.nome}
              </div>
              <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
                <span>{cargaItem.item.volume} m³</span>
                <span>{cargaItem.item.peso} kg</span>
                {cargaItem.quantidade > 1 && (
                  <span className="text-[#E84225] font-medium">×{cargaItem.quantidade}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onRemove(cargaItem.id)}
              className="shrink-0 rounded-md p-1 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Add Item Dialog ──────────────────────────────────────

function AddItemDialog({
  open,
  onOpenChange,
  onAdd,
  existingIds,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: CatalogItem) => void;
  existingIds: Set<string>;
}) {
  const [search, setSearch] = useState("");

  const filtered = CATALOG_ITEMS.filter(
    (item) =>
      search.trim() === "" ||
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar item à mudança</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-1.5 min-h-0 max-h-[400px]">
          {filtered.map((item) => {
            const alreadyAdded = existingIds.has(item.id);
            return (
              <button
                key={item.id}
                disabled={alreadyAdded}
                onClick={() => onAdd(item)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  alreadyAdded
                    ? "border-green-200 bg-green-50 cursor-default"
                    : "border-gray-200 hover:border-[#E84225] hover:bg-red-50/50"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${item.cor} text-white text-sm font-bold`}
                >
                  {item.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">
                    {item.nome}
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{item.categoria}</span>
                    <span>{item.volume} m³</span>
                    <span>{item.peso} kg</span>
                  </div>
                </div>
                {alreadyAdded ? (
                  <span className="text-xs text-green-600 font-medium shrink-0">Adicionado ✓</span>
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              Nenhum item encontrado.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sub-components ───────────────────────────────────────

function CargoSummaryPanel({
  volumeTotal,
  pesoTotal,
  capacidadeCaminhao,
}: {
  volumeTotal: number;
  pesoTotal: number;
  capacidadeCaminhao: number;
}) {
  const ocupacao = capacidadeCaminhao > 0
    ? Math.round((volumeTotal / capacidadeCaminhao) * 100)
    : 0;
  const isOver = ocupacao > 100;

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <BarChart3 className="h-4 w-4 text-[#E84225]" />
          Resumo da Carga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Volume</div>
            <div className="text-lg font-semibold text-[#E84225]">
              {volumeTotal.toFixed(1)} m³
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Peso</div>
            <div className="text-lg font-semibold text-[#1A1A1A]">
              {pesoTotal} kg
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function TruckSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Truck className="h-4 w-4 text-[#E84225]" />
          Selecionar Veículo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {MOCK_TRUCKS.map((truck) => {
          const isSelected = selected === truck.id;
          return (
            <div
              key={truck.id}
              className={`rounded-lg border-2 p-3 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#E84225] bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => onSelect(truck.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className={`text-sm font-medium ${isSelected ? "text-[#E84225]" : "text-gray-800"}`}>
                    {truck.nome}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {truck.descricao}
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-400">{truck.capacidadeVolume} m³</span>
                    <span className="text-xs text-gray-400">{truck.capacidadePeso} kg</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={`shrink-0 h-7 px-3 text-xs ${
                    isSelected
                      ? "bg-[#E84225] text-white hover:bg-[#C73820]"
                      : "border-gray-200 text-gray-600 hover:border-[#E84225] hover:text-[#E84225]"
                  }`}
                  onClick={(e) => { e.stopPropagation(); onSelect(truck.id); }}
                >
                  {isSelected ? "Selecionado" : "Selecionar"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function CotacoesPanel() {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Tag className="h-4 w-4 text-[#1A1A1A]" />
          Cotações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {MOCK_COTACOES.length > 0 ? (
          <div className="space-y-3">
            {MOCK_COTACOES.map((cotacao) => (
              <div key={cotacao.id} className="rounded-lg border border-gray-200 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{cotacao.empresa}</span>
                  <span className="text-sm font-semibold text-[#E84225]">{formatCurrency(cotacao.valor)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Prazo: {cotacao.prazoEntrega}</span>
                  <span>Avaliação: {cotacao.avaliacao} / 5</span>
                </div>
                <Button size="sm" className="w-full h-7 text-xs bg-[#E84225] text-white hover:bg-[#C73820] mt-1">
                  Aceitar cotação
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 text-center gap-3">
            <p className="text-sm text-gray-500">Nenhuma cotação recebida ainda.</p>
            <Button size="sm" className="bg-[#1A1A1A] text-white hover:bg-[#333333] h-8 px-4 text-xs">
              Solicitar cotações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function MudancaDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();

  const [selectedTruck, setSelectedTruck] = useState("tres_quartos");
  const [cargaItens, setCargaItens] = useState<CargaItem[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#E84225]" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const mudanca = MOCK_MUDANCA;
  const statusStyle = STATUS_STYLES[mudanca.status];
  const selectedTruckData = MOCK_TRUCKS.find((t) => t.id === selectedTruck)!;

  const volumeTotal = cargaItens.reduce((acc, i) => acc + i.item.volume * i.quantidade, 0);
  const pesoTotal = cargaItens.reduce((acc, i) => acc + i.item.peso * i.quantidade, 0);
  const existingItemIds = new Set(cargaItens.map((i) => i.item.id));

  function handleAddItem(item: CatalogItem) {
    const existing = cargaItens.find((i) => i.item.id === item.id);
    if (existing) {
      setCargaItens((prev) =>
        prev.map((i) =>
          i.item.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      );
    } else {
      setCargaItens((prev) => [
        ...prev,
        { id: `carga_${Date.now()}`, item, quantidade: 1 },
      ]);
    }
    toast.success(`${item.nome} adicionado`);
  }

  function handleRemoveItem(id: string) {
    setCargaItens((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#E84225] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Minhas Mudanças
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`text-xs font-medium ${statusStyle.className}`}>
              {statusStyle.label}
            </Badge>
            <span className="text-xs text-gray-400">{formatDate(mudanca.dataDesejada)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <MapPin className="h-4 w-4 shrink-0 text-[#E84225]" />
              {mudanca.enderecoOrigem}
            </div>
            <div className="flex items-center gap-2 ml-1 text-sm text-gray-600">
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
              {mudanca.enderecoDestino}
            </div>
          </div>
        </div>

        <Button
          onClick={() => setAddDialogOpen(true)}
          className="gap-2 bg-[#E84225] text-white hover:bg-[#C73820] shrink-0"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Adicionar item
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Canvas area (2/3) */}
        <div className="lg:col-span-2">
          <CargoCanvas
            itens={cargaItens}
            onRemove={handleRemoveItem}
            onAddMore={() => setAddDialogOpen(true)}
          />
        </div>

        {/* Right: Panels (1/3) */}
        <div className="flex flex-col gap-4">
          <CargoSummaryPanel
            volumeTotal={volumeTotal}
            pesoTotal={pesoTotal}
            capacidadeCaminhao={selectedTruckData.capacidadeVolume}
          />
          <TruckSelector selected={selectedTruck} onSelect={setSelectedTruck} />
          <CotacoesPanel />
        </div>
      </div>

      {/* Add item dialog */}
      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddItem}
        existingIds={existingItemIds}
      />
    </div>
  );
}
