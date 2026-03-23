"use client";

import { useState, useMemo } from "react";
import { Search, Truck, MapPin, ArrowRight, PackageOpen, Loader2 } from "lucide-react";
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

const CATEGORIAS = ["Todos", "Quarto", "Cozinha", "Sala", "Escritório", "Banheiro", "Área de Serviço", "Caixas"];

function categoriaPretty(cat: string): string {
  return CATEGORIA_MAP[cat] || cat;
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
    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900 leading-tight">
            {item.nome}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{categoriaPretty(item.categoria)}</div>
        </div>

        <div className="space-y-1 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Dimensões</span>
            <span className="font-medium text-gray-700">
              {item.larguraCm} × {item.alturaCm} × {item.profundidadeCm} cm
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Peso</span>
            <span className="font-medium text-gray-700">{item.pesoKg} kg</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Volume</span>
            <span className="font-medium text-[#009B3A]">{item.volumeM3} m³</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs border-gray-200 text-gray-600 hover:border-[#009B3A] hover:text-[#009B3A] mt-1"
          onClick={() => onAdd(item)}
        >
          Adicionar à mudança
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
                  ? "bg-[#009B3A] text-white"
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
            className="mt-3 text-xs text-[#009B3A] hover:underline"
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
                  className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-[#009B3A] hover:bg-red-50/50"
                >
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#009B3A]" />
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
