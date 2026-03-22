"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, Truck, MapPin, ArrowRight } from "lucide-react";
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

// ─── Types ────────────────────────────────────────────────

type Categoria =
  | "Quarto"
  | "Cozinha"
  | "Sala"
  | "Escritório"
  | "Banheiro"
  | "Área de Serviço"
  | "Caixas";

interface Item {
  id: string;
  nome: string;
  categoria: Categoria;
  largura: number;
  altura: number;
  profundidade: number;
  peso: number;
  volume: number;
  cor: string;
}

interface MudancaMock {
  id: string;
  enderecoOrigem: string;
  enderecoDestino: string;
  status: string;
  numeroItens: number;
}

// ─── Mock Data ────────────────────────────────────────────

const MOCK_ITEMS: Item[] = [
  { id: "item_001", nome: "Cama Casal", categoria: "Quarto", largura: 188, altura: 45, profundidade: 138, peso: 40, volume: 1.17, cor: "bg-purple-400" },
  { id: "item_002", nome: "Guarda-Roupa 6 Portas", categoria: "Quarto", largura: 240, altura: 210, profundidade: 55, peso: 120, volume: 2.77, cor: "bg-purple-500" },
  { id: "item_003", nome: "Geladeira Duplex", categoria: "Cozinha", largura: 70, altura: 175, profundidade: 75, peso: 90, volume: 0.92, cor: "bg-sky-400" },
  { id: "item_004", nome: "Fogão 4 Bocas", categoria: "Cozinha", largura: 60, altura: 85, profundidade: 60, peso: 30, volume: 0.31, cor: "bg-sky-500" },
  { id: "item_005", nome: "Sofá 3 Lugares", categoria: "Sala", largura: 210, altura: 85, profundidade: 90, peso: 60, volume: 1.60, cor: "bg-emerald-400" },
  { id: "item_006", nome: "Mesa de Jantar", categoria: "Sala", largura: 160, altura: 76, profundidade: 90, peso: 35, volume: 1.09, cor: "bg-emerald-500" },
  { id: "item_007", nome: "Mesa de Escritório", categoria: "Escritório", largura: 150, altura: 75, profundidade: 70, peso: 25, volume: 0.79, cor: "bg-orange-400" },
  { id: "item_008", nome: "Cadeira de Escritório", categoria: "Escritório", largura: 65, altura: 115, profundidade: 65, peso: 15, volume: 0.49, cor: "bg-red-500" },
  { id: "item_009", nome: "Armário de Banheiro", categoria: "Banheiro", largura: 80, altura: 60, profundidade: 20, peso: 12, volume: 0.10, cor: "bg-teal-400" },
  { id: "item_010", nome: "Máquina de Lavar", categoria: "Área de Serviço", largura: 60, altura: 85, profundidade: 60, peso: 65, volume: 0.31, cor: "bg-indigo-400" },
  { id: "item_011", nome: "Caixa Pequena", categoria: "Caixas", largura: 40, altura: 30, profundidade: 30, peso: 10, volume: 0.04, cor: "bg-amber-400" },
  { id: "item_012", nome: "Caixa Grande", categoria: "Caixas", largura: 60, altura: 50, profundidade: 50, peso: 20, volume: 0.15, cor: "bg-amber-500" },
];

const MOCK_MUDANCAS: MudancaMock[] = [
  {
    id: "mud_001",
    enderecoOrigem: "Rua das Flores, 123 – São Paulo, SP",
    enderecoDestino: "Av. Paulista, 1500 – São Paulo, SP",
    status: "Confirmada",
    numeroItens: 34,
  },
  {
    id: "mud_002",
    enderecoOrigem: "Rua XV de Novembro, 80 – Curitiba, PR",
    enderecoDestino: "Rua Marechal Deodoro, 200 – Curitiba, PR",
    status: "Cotando",
    numeroItens: 21,
  },
  {
    id: "mud_003",
    enderecoOrigem: "Rua Consolação, 400 – São Paulo, SP",
    enderecoDestino: "Rua Oscar Freire, 900 – São Paulo, SP",
    status: "Rascunho",
    numeroItens: 8,
  },
];

const CATEGORIAS: Array<"Todos" | Categoria> = [
  "Todos",
  "Quarto",
  "Cozinha",
  "Sala",
  "Escritório",
  "Banheiro",
  "Área de Serviço",
  "Caixas",
];

// ─── ItemCard ──────────────────────────────────────────────

function ItemCard({
  item,
  onAdd,
}: {
  item: Item;
  onAdd: (item: Item) => void;
}) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900 leading-tight">
            {item.nome}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{item.categoria}</div>
        </div>

        <div className="space-y-1 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Dimensões</span>
            <span className="font-medium text-gray-700">
              {item.largura} × {item.altura} × {item.profundidade} cm
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Peso</span>
            <span className="font-medium text-gray-700">{item.peso} kg</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Volume</span>
            <span className="font-medium text-[#E84225]">{item.volume} m³</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs border-gray-200 text-gray-600 hover:border-[#E84225] hover:text-[#E84225] mt-1"
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
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"Todos" | Categoria>("Todos");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "Todos" || item.categoria === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        item.nome.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  function handleAddToMudanca(item: Item) {
    setSelectedItem(item);

    if (MOCK_MUDANCAS.length === 0) {
      toast.error("Você não tem nenhuma mudança. Crie uma primeiro.");
      router.push("/dashboard/nova-mudanca");
      return;
    }

    setDialogOpen(true);
  }

  function handleSelectMudanca(mudanca: MudancaMock) {
    setDialogOpen(false);
    toast.success(
      `"${selectedItem?.nome}" adicionado à mudança para ${mudanca.enderecoDestino.split("–")[0].trim()}`
    );
    // TODO: chamar API para adicionar item à carga da mudança
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
                  ? "bg-[#E84225] text-white"
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
            className="mt-3 text-xs text-[#E84225] hover:underline"
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
              Em qual mudança você quer adicionar{" "}
              <span className="font-medium text-gray-900">
                {selectedItem?.nome}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-2">
            {MOCK_MUDANCAS.map((mudanca) => (
              <button
                key={mudanca.id}
                onClick={() => handleSelectMudanca(mudanca)}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-[#E84225] hover:bg-red-50/50"
              >
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#E84225]" />
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
                      {mudanca.status}
                    </span>
                    <span>{mudanca.numeroItens} itens</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t pt-3 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setDialogOpen(false);
                router.push("/dashboard/nova-mudanca");
              }}
            >
              + Criar nova mudança
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
