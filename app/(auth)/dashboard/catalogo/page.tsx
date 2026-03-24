"use client";

import { useState, useMemo } from "react";
import { Search, Truck, MapPin, ArrowRight, PackageOpen, Loader2, Ruler, Weight, Box, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMudancas } from "@/hooks/use-mudancas";
import { useItens, type ItemCatalogo } from "@/hooks/use-itens";
import { ItemIcon } from "@/components/icons/item-icons";

// ─── Categories ──────────────────────────────────────────

const CATEGORIA_MAP: Record<string, string> = {
  QUARTO: "Quarto",
  COZINHA: "Cozinha",
  SALA: "Sala",
  ESCRITORIO: "Escritório",
  BANHEIRO: "Banheiro",
  AREA_SERVICO: "Área de Serviço",
  CAIXAS: "Caixas",
};

const CATEGORIA_BADGE_COLORS: Record<string, string> = {
  QUARTO: "bg-purple-100 text-purple-700",
  COZINHA: "bg-amber-100 text-amber-700",
  SALA: "bg-blue-100 text-blue-700",
  ESCRITORIO: "bg-emerald-100 text-emerald-700",
  BANHEIRO: "bg-cyan-100 text-cyan-700",
  AREA_SERVICO: "bg-indigo-100 text-indigo-700",
  CAIXAS: "bg-orange-100 text-orange-700",
};

const CATEGORIAS = ["Todos", "Quarto", "Cozinha", "Sala", "Escritório", "Banheiro", "Área de Serviço", "Caixas"];

function categoriaPretty(cat: string): string {
  return CATEGORIA_MAP[cat] || cat;
}

function categoriaBadgeColor(cat: string): string {
  return CATEGORIA_BADGE_COLORS[cat] || "bg-gray-100 text-gray-600";
}

// ─── ItemCard ──────────────────────────────────────────────

function ItemCard({
  item,
  onAdd,
}: {
  item: ItemCatalogo;
  onAdd: (item: ItemCatalogo) => void;
}) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mt-1">
          <ItemIcon nome={item.nome} className="h-8 w-8" />
        </div>

        {/* Name + badge */}
        <div className="space-y-1.5 w-full">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {item.nome}
          </p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${categoriaBadgeColor(item.categoria)}`}
          >
            {categoriaPretty(item.categoria)}
          </span>
        </div>

        {/* Specs */}
        <div className="w-full space-y-1 border-t border-gray-100 pt-2.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Ruler className="h-3 w-3 shrink-0 text-gray-400" />
            <span className="font-medium text-gray-700">
              {item.larguraCm} × {item.profundidadeCm} × {item.alturaCm} cm
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Box className="h-3 w-3 shrink-0 text-gray-400" />
              <span className="font-medium text-primary">{item.volumeM3} m³</span>
            </span>
            <span className="flex items-center gap-1">
              <Weight className="h-3 w-3 shrink-0 text-gray-400" />
              <span className="font-medium text-gray-700">{item.pesoKg} kg</span>
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          size="sm"
          className="w-full h-8 text-xs gap-1.5"
          onClick={() => onAdd(item)}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function CatalogoPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemCatalogo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: itens, isLoading: itensLoading } = useItens();
  const { data: mudancas, isLoading: mudancasLoading } = useMudancas();

  const filteredItems = useMemo(() => {
    if (!itens) return [];
    return itens.filter((item) => {
      const matchesCategory =
        activeCategory === "Todos" || categoriaPretty(item.categoria) === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        item.nome.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, itens]);

  function handleAddToMudanca(item: ItemCatalogo) {
    setSelectedItem(item);

    if (!mudancas || mudancas.length === 0) {
      // No mudanças — show dialog with empty state
      setDialogOpen(true);
      return;
    }

    setDialogOpen(true);
  }

  function handleSelectMudanca(mudanca: { id: string; enderecoDestino: string }) {
    setDialogOpen(false);
    toast.success(
      `"${selectedItem?.nome}" adicionado à mudança para ${mudanca.enderecoDestino.split("–")[0].trim()}`
    );
    // TODO: chamar API para adicionar item à carga da mudança
  }

  const statusLabel: Record<string, string> = {
    RASCUNHO: "Rascunho",
    COTANDO: "Cotando",
    CONFIRMADA: "Confirmada",
    CONCLUIDA: "Concluída",
  };

  if (itensLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Catálogo de Itens
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Encontre e adicione itens à sua mudança com dimensões e peso pré-definidos.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">
        {filteredItems.length}{" "}
        {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-500">
            Nenhum item encontrado para{" "}
            <span className="font-medium">&quot;{search}&quot;</span>.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("Todos");
            }}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onAdd={handleAddToMudanca} />
          ))}
        </div>
      )}

      {/* Dialog: selecionar mudança */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar mudança</DialogTitle>
            <DialogDescription>
              {mudancas && mudancas.length > 0 ? (
                <>
                  Em qual mudança você quer adicionar{" "}
                  <span className="font-medium text-gray-900">
                    {selectedItem?.nome}
                  </span>
                  ?
                </>
              ) : (
                <>
                  Você não tem nenhuma mudança cadastrada.
                  <br />
                  Cadastre uma mudança primeiro para poder adicionar itens.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {mudancas && mudancas.length > 0 ? (
            <div className="flex flex-col gap-2 mt-2">
              {mudancas.map((mudanca) => (
                <button
                  key={mudanca.id}
                  onClick={() => handleSelectMudanca(mudanca)}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                      <span className="truncate text-gray-700">
                        {mudanca.enderecoOrigem}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-0.5">
                      <ArrowRight className="h-3 w-3 shrink-0 text-gray-400" />
                      <span className="truncate text-gray-700">
                        {mudanca.enderecoDestino}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5">
                        {statusLabel[mudanca.status] || mudanca.status}
                      </span>
                      <span>{mudanca._count.cotacoes} cotações</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <PackageOpen className="h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500 text-center">
                Você não tem nenhuma mudança.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
