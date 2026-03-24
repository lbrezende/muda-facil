"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSidebarCollapse } from "@/lib/sidebar-context";
import dynamic from "next/dynamic";
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
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Monitor,
  WashingMachine,
  GripVertical,
  List,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMudanca } from "@/hooks/use-mudancas";
import { ROOM_TYPES, type TruckInfo } from "@/lib/room-estimation";
import { TruckRecommendationPanel } from "@/components/dashboard/truck-recommendation";
import {
  FURNITURE_BY_ROOM,
  getFurnitureForRoom,
  getOtherFurniture,
  type FurnitureItem,
} from "@/lib/furniture-catalog";
import { ItemIcon } from "@/components/icons/item-icons";
import {
  estimateItemsFromRooms,
  type CatalogItemForPlacement,
} from "@/lib/cargo3d/auto-placement";

// ─── Dynamic import for Three.js canvas (no SSR) ──────────────────────────

const TruckCanvas3D = dynamic(
  () => import("@/components/cargo3d/TruckCanvas3D").then((m) => m.TruckCanvas3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-xl">
        <p className="text-muted-foreground">Carregando visualização 3D...</p>
      </div>
    ),
  }
);

// ─── Types ────────────────────────────────────────────────

interface RoomItem {
  id: string;
  name: string;
  volumeM3: number;
  pesoKg: number;
}

interface RoomBlock {
  key: string;
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

// ─── Truck types with 3D dimensions ─────────────────────────────────────────

interface TruckInfo3D extends TruckInfo {
  larguraCm: number;
  alturaCm: number;
  comprimentoCm: number;
}

const CAMINHOES: TruckInfo3D[] = [
  { id: "1", nome: "Fiorino", tipo: "FIORINO", capacidadeM3: 1.5, capacidadeKg: 600, larguraCm: 110, alturaCm: 105, comprimentoCm: 165 },
  { id: "2", nome: "HR / VUC", tipo: "HR", capacidadeM3: 6, capacidadeKg: 1500, larguraCm: 175, alturaCm: 175, comprimentoCm: 310 },
  { id: "3", nome: "3/4", tipo: "TRES_QUARTOS", capacidadeM3: 12, capacidadeKg: 3000, larguraCm: 210, alturaCm: 210, comprimentoCm: 450 },
  { id: "4", nome: "Baú", tipo: "BAU", capacidadeM3: 20, capacidadeKg: 5000, larguraCm: 240, alturaCm: 240, comprimentoCm: 600 },
];

// ─── Furniture catalog items mapped to 3D dimensions ──────────────────────
// Keyed by catalog item id from furniture-catalog.ts → 3D box dimensions in cm

const FURNITURE_3D_DIMS: Record<string, { larguraCm: number; alturaCm: number; profundidadeCm: number }> = {
  // QUARTO
  "cama-solteiro":   { larguraCm: 90,  alturaCm: 45,  profundidadeCm: 190 },
  "cama-casal":      { larguraCm: 140, alturaCm: 45,  profundidadeCm: 190 },
  "cama-queen":      { larguraCm: 160, alturaCm: 50,  profundidadeCm: 200 },
  "cama-king":       { larguraCm: 193, alturaCm: 50,  profundidadeCm: 203 },
  "guarda-roupa":    { larguraCm: 160, alturaCm: 200, profundidadeCm: 52  },
  "comoda":          { larguraCm: 80,  alturaCm: 85,  profundidadeCm: 45  },
  "criado-mudo":     { larguraCm: 45,  alturaCm: 55,  profundidadeCm: 35  },
  "sapateira":       { larguraCm: 60,  alturaCm: 120, profundidadeCm: 30  },
  "penteadeira":     { larguraCm: 100, alturaCm: 140, profundidadeCm: 40  },
  "berco":           { larguraCm: 70,  alturaCm: 100, profundidadeCm: 130 },
  // SALA
  "sofa-2l":         { larguraCm: 150, alturaCm: 80,  profundidadeCm: 85  },
  "sofa-3l":         { larguraCm: 200, alturaCm: 80,  profundidadeCm: 85  },
  "sofa-canto":      { larguraCm: 250, alturaCm: 85,  profundidadeCm: 200 },
  "poltrona":        { larguraCm: 75,  alturaCm: 85,  profundidadeCm: 75  },
  "mesa-centro":     { larguraCm: 100, alturaCm: 45,  profundidadeCm: 60  },
  "rack-tv":         { larguraCm: 180, alturaCm: 55,  profundidadeCm: 40  },
  "estante-sala":    { larguraCm: 120, alturaCm: 180, profundidadeCm: 30  },
  "mesa-jantar":     { larguraCm: 160, alturaCm: 75,  profundidadeCm: 90  },
  "cadeira-jantar":  { larguraCm: 45,  alturaCm: 90,  profundidadeCm: 45  },
  "aparador":        { larguraCm: 120, alturaCm: 80,  profundidadeCm: 40  },
  "tapete":          { larguraCm: 200, alturaCm: 5,   profundidadeCm: 150 },
  // COZINHA
  "geladeira":       { larguraCm: 70,  alturaCm: 170, profundidadeCm: 65  },
  "geladeira-duplex":{ larguraCm: 80,  alturaCm: 180, profundidadeCm: 70  },
  "fogao":           { larguraCm: 55,  alturaCm: 85,  profundidadeCm: 60  },
  "micro-ondas":     { larguraCm: 45,  alturaCm: 28,  profundidadeCm: 35  },
  "mesa-cozinha":    { larguraCm: 120, alturaCm: 75,  profundidadeCm: 80  },
  "armario-cozinha": { larguraCm: 100, alturaCm: 180, profundidadeCm: 40  },
  "lava-loucas":     { larguraCm: 60,  alturaCm: 85,  profundidadeCm: 55  },
  "forno":           { larguraCm: 50,  alturaCm: 40,  profundidadeCm: 45  },
  // BANHEIRO
  "armario-banheiro":{ larguraCm: 60,  alturaCm: 70,  profundidadeCm: 20  },
  "espelho-banheiro":{ larguraCm: 80,  alturaCm: 100, profundidadeCm: 5   },
  // ESCRITORIO
  "mesa-escritorio": { larguraCm: 120, alturaCm: 75,  profundidadeCm: 60  },
  "cadeira-escritorio":{ larguraCm: 60, alturaCm: 110, profundidadeCm: 60 },
  "estante-escritorio":{ larguraCm: 80, alturaCm: 200, profundidadeCm: 30 },
  "gaveteiro":       { larguraCm: 40,  alturaCm: 60,  profundidadeCm: 50  },
  "impressora":      { larguraCm: 45,  alturaCm: 20,  profundidadeCm: 35  },
  // AREA_SERVICO
  "maquina-lavar":   { larguraCm: 60,  alturaCm: 85,  profundidadeCm: 55  },
  "secadora":        { larguraCm: 60,  alturaCm: 85,  profundidadeCm: 60  },
  "tanque":          { larguraCm: 55,  alturaCm: 85,  profundidadeCm: 50  },
  "tabua-passar":    { larguraCm: 35,  alturaCm: 5,   profundidadeCm: 120 },
  // OUTROS
  "bicicleta":       { larguraCm: 170, alturaCm: 100, profundidadeCm: 60  },
  "caixa-grande":    { larguraCm: 60,  alturaCm: 50,  profundidadeCm: 50  },
  "caixa-media":     { larguraCm: 50,  alturaCm: 40,  profundidadeCm: 40  },
  "tv-50":           { larguraCm: 115, alturaCm: 67,  profundidadeCm: 10  },
  "ar-condicionado": { larguraCm: 90,  alturaCm: 30,  profundidadeCm: 20  },
  "ventilador":      { larguraCm: 40,  alturaCm: 130, profundidadeCm: 40  },
  "quadro-grande":   { larguraCm: 120, alturaCm: 90,  profundidadeCm: 5   },
  "piano-digital":   { larguraCm: 130, alturaCm: 80,  profundidadeCm: 40  },
  "churrasqueira":   { larguraCm: 50,  alturaCm: 80,  profundidadeCm: 40  },
};

/** Convert FurnitureItem from the catalog to the 3D canvas item format */
function furnitureTo3D(item: FurnitureItem) {
  const dims = FURNITURE_3D_DIMS[item.id] ?? deriveDefaultDims(item.volumeM3);
  return {
    id: item.id,
    nome: item.name,
    categoria: item.category,
    larguraCm: dims.larguraCm,
    alturaCm: dims.alturaCm,
    profundidadeCm: dims.profundidadeCm,
    pesoKg: item.pesoKg,
    volumeM3: item.volumeM3,
  };
}

/** Fallback: derive approximate cube dimensions from volume */
function deriveDefaultDims(volumeM3: number) {
  const side = Math.round(Math.cbrt(volumeM3 * 1_000_000) / 10) * 10 || 40;
  return { larguraCm: side, alturaCm: side, profundidadeCm: side };
}

function formatDate(iso: string | null): string {
  if (!iso) return "Sem data";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function uid(): string {
  return Math.random().toString(36).slice(2, 8);
}

// ─── Build room blocks from numComodos ───────────────────

function buildInitialRooms(numComodos: number): RoomBlock[] {
  const blocks: RoomBlock[] = [];
  if (numComodos <= 0) return blocks;

  const kitchens = 1;
  const bathrooms = Math.min(numComodos, Math.max(1, Math.floor(numComodos / 3)));
  const salas = 1;
  const quartos = Math.max(0, numComodos - kitchens - bathrooms - salas);

  const distribution: Record<string, number> = {
    QUARTO: quartos, SALA: salas, COZINHA: kitchens, BANHEIRO: bathrooms,
  };

  for (const room of ROOM_TYPES) {
    const count = distribution[room.key] || 0;
    if (count > 0) {
      const items: RoomItem[] = [];
      for (let i = 0; i < count; i++) {
        const defaults = ROOM_DEFAULT_ITEMS[room.key] || [];
        items.push(...defaults.map((d) => ({ ...d, id: `${d.id}-${i}-${uid()}` })));
      }
      blocks.push({ key: room.key, label: room.label, icon: room.icon, count, items, expanded: true });
    }
  }
  return blocks;
}

// ─── Item Picker Popup (T1) ─────────────────────────────

function ItemPickerPopup({
  roomKey,
  roomLabel,
  onSelect,
  onClose,
}: {
  roomKey: string;
  roomLabel: string;
  onSelect: (item: FurnitureItem) => void;
  onClose: () => void;
}) {
  const [showOthers, setShowOthers] = useState(false);

  const roomFurniture = getFurnitureForRoom(roomKey);
  const otherFurniture = getOtherFurniture(roomKey);

  const displayItems = showOthers ? otherFurniture : roomFurniture;
  const title = showOthers ? "Outros móveis" : `Móveis de ${roomLabel}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white shadow-2xl flex flex-col max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {showOthers && (
              <button
                onClick={() => setShowOthers(false)}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {displayItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 p-3 text-center hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <ItemIcon nome={item.name} className="h-5 w-5 text-gray-500" />
                <span className="text-xs font-medium text-gray-800 leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] text-gray-400">
                  {item.volumeM3} m³ · {item.pesoKg} kg
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer: "Outros" link */}
        {!showOthers && (
          <div className="border-t border-gray-100 px-4 py-2.5 shrink-0">
            <button
              onClick={() => setShowOthers(true)}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline w-full justify-center"
            >
              <Plus className="h-3 w-3" />
              Ver outros móveis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Drag & Drop Furniture Sidebar (T2) ──────────────────

function FurnitureSidebar({
  onDragStart,
}: {
  onDragStart: (item: FurnitureItem) => void;
}) {
  return (
    <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-lg bg-white">
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Arraste para adicionar
        </h3>
      </div>

      {Object.entries(FURNITURE_BY_ROOM).map(([key, room]) => (
        <div key={key}>
          <div className="px-3 py-1.5 bg-gray-50/50 border-b border-gray-100">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {room.label}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-2">
            {room.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/furniture",
                    JSON.stringify(item)
                  );
                  e.dataTransfer.effectAllowed = "copy";
                  onDragStart(item);
                }}
                className="flex flex-col items-center gap-0.5 rounded-md border border-gray-100 p-1.5 cursor-grab hover:border-primary/40 hover:bg-primary/5 transition-colors active:cursor-grabbing"
                title={`${item.name}\n${item.volumeM3} m³ · ${item.pesoKg} kg`}
              >
                <GripVertical className="h-2.5 w-2.5 text-gray-300" />
                <ItemIcon nome={item.name} className="h-4 w-4 text-gray-500" />
                <span className="text-[9px] text-gray-600 leading-tight text-center line-clamp-2">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Droppable Room Block ────────────────────────────────

function DroppableRoomCard({
  block,
  onToggleExpand,
  onRemoveItem,
  onAddItem,
  onDropItem,
}: {
  block: RoomBlock;
  onToggleExpand: () => void;
  onRemoveItem: (itemId: string) => void;
  onAddItem: () => void;
  onDropItem: (item: FurnitureItem) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const dragCounter = useRef(0);
  const Icon = ROOM_ICONS[block.icon];

  const handleDragEnter = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("application/furniture")) {
      e.preventDefault();
      dragCounter.current++;
      if (dragCounter.current === 1) {
        setDragOver(true);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("application/furniture")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    const data = e.dataTransfer.getData("application/furniture");
    if (data) {
      try {
        const item = JSON.parse(data) as FurnitureItem;
        onDropItem(item);
      } catch {}
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all ${
        dragOver
          ? "border-2 border-dashed border-blue-400 bg-blue-50/50 shadow-md"
          : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Room header */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
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

      {/* Drop zone indicator */}
      {dragOver && (
        <div className="px-4 py-3 text-center border-b border-blue-200 bg-blue-50">
          <p className="text-xs font-medium text-blue-600">
            Solte aqui esse móvel
          </p>
        </div>
      )}

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
                  <ItemIcon nome={item.name} className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {item.volumeM3} m³ · {item.pesoKg} kg
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="flex h-5 w-5 items-center justify-center rounded text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onAddItem}
            className="flex items-center gap-1.5 mt-2 px-2 py-1.5 text-xs text-primary font-medium hover:bg-primary/5 rounded-md transition-colors w-full"
          >
            <Plus className="h-3 w-3" />
            Adicionar item em {block.label}
          </button>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function MudancaDetailPage() {
  const { data: session, status: authStatus } = useSession();
  const params = useParams();
  const id = params.id as string;
  const { data: mudanca, isLoading, isError } = useMudanca(id);

  const [roomBlocks, setRoomBlocks] = useState<RoomBlock[] | null>(null);
  const [pickerRoom, setPickerRoom] = useState<{ key: string; label: string } | null>(null);
  const [activeTab, setActiveTab] = useState("comodos");
  const { setCollapsed } = useSidebarCollapse();

  // Collapse sidebar when in 3D mode, expand when leaving
  useEffect(() => {
    setCollapsed(activeTab === "canvas3d");
    return () => setCollapsed(false);
  }, [activeTab, setCollapsed]);

  // Initialize room blocks from mudança data
  if (mudanca && roomBlocks === null) {
    const numComodos = (mudanca as Record<string, unknown>).numComodos as number || 3;
    setTimeout(() => setRoomBlocks(buildInitialRooms(numComodos)), 0);
  }

  const totals = useMemo(() => {
    if (!roomBlocks) return { items: 0, volumeM3: 0, pesoKg: 0 };
    let items = 0, volumeM3 = 0, pesoKg = 0;
    for (const block of roomBlocks) {
      items += block.items.length;
      for (const item of block.items) {
        volumeM3 += item.volumeM3;
        pesoKg += item.pesoKg;
      }
    }
    return { items, volumeM3: Math.round(volumeM3 * 10) / 10, pesoKg: Math.round(pesoKg) };
  }, [roomBlocks]);

  // Build the flat catalog items list for the 3D canvas
  const catalog3DItems = useMemo(
    () => Object.values(FURNITURE_BY_ROOM).flatMap((room) => room.items.map(furnitureTo3D)),
    []
  );

  // Determine the recommended truck for the 3D canvas
  const recommendedTruck = useMemo(() => {
    const best = CAMINHOES.find(
      (t) => t.capacidadeM3 >= totals.volumeM3 && t.capacidadeKg >= totals.pesoKg
    ) ?? CAMINHOES[CAMINHOES.length - 1];
    return best;
  }, [totals]);

  // Build the CatalogItemForPlacement list that mirrors catalog3DItems but with
  // the type expected by auto-placement (same shape, just the explicit interface)
  const catalogForAutoPlace = useMemo<CatalogItemForPlacement[]>(
    () => catalog3DItems.map((item) => ({
      id: item.id,
      nome: item.nome,
      categoria: item.categoria,
      larguraCm: item.larguraCm,
      alturaCm: item.alturaCm,
      profundidadeCm: item.profundidadeCm,
      pesoKg: item.pesoKg,
      volumeM3: item.volumeM3,
    })),
    [catalog3DItems]
  );

  // Auto-placement items derived from current room blocks.
  // We build a rooms map from the current roomBlocks state, then pass it to
  // estimateItemsFromRooms so the result matches what the user has configured.
  const autoPlaceItems = useMemo<CatalogItemForPlacement[]>(() => {
    if (!roomBlocks || roomBlocks.length === 0) return [];
    const roomCounts: Record<string, number> = {};
    for (const block of roomBlocks) {
      roomCounts[block.key] = block.count;
    }
    return estimateItemsFromRooms(roomCounts, catalogForAutoPlace);
  }, [roomBlocks, catalogForAutoPlace]);

  // Track whether the user has ever switched to the 3D tab so we auto-place
  // only on first visit (not on every re-render after room edits).
  const hasVisited3DTab = useRef(false);
  const [autoPlaceKey, setAutoPlaceKey] = useState(0);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (tab === "canvas3d" && !hasVisited3DTab.current) {
      hasVisited3DTab.current = true;
      // Bump key to remount TruckCanvas3D so autoPlaceOnMount fires fresh
      setAutoPlaceKey((k) => k + 1);
    }
  }, []);

  // Calculate truck count needed for the estimated volume (for the banner)
  const estimatedTruckCount = useMemo(() => {
    if (!recommendedTruck || totals.volumeM3 === 0) return 1;
    const count = Math.ceil(totals.volumeM3 / recommendedTruck.capacidadeM3);
    return Math.max(1, count);
  }, [totals.volumeM3, recommendedTruck]);

  const removeItem = useCallback((roomKey: string, itemId: string) => {
    setRoomBlocks((prev) =>
      prev?.map((b) =>
        b.key === roomKey ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b
      ) ?? null
    );
  }, []);

  const addFurnitureToRoom = useCallback((roomKey: string, furniture: FurnitureItem) => {
    const newItem: RoomItem = {
      id: `${furniture.id}-${uid()}`,
      name: furniture.name,
      volumeM3: furniture.volumeM3,
      pesoKg: furniture.pesoKg,
    };
    setRoomBlocks((prev) =>
      prev?.map((b) =>
        b.key === roomKey ? { ...b, items: [...b.items, newItem] } : b
      ) ?? null
    );
  }, []);

  const toggleExpand = useCallback((roomKey: string) => {
    setRoomBlocks((prev) =>
      prev?.map((b) =>
        b.key === roomKey ? { ...b, expanded: !b.expanded } : b
      ) ?? null
    );
  }, []);

  const handleDragDrop = useCallback((roomKey: string, furniture: FurnitureItem) => {
    addFurnitureToRoom(roomKey, furniture);
  }, [addFurnitureToRoom]);

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) redirect("/login");

  if (isError || !mudanca) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Mudança não encontrada</h2>
        <Link href="/dashboard" className="mt-4 text-sm text-primary hover:underline">
          Voltar para mudanças
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[mudanca.status] || STATUS_STYLES.RASCUNHO;
  const distanciaKm = (mudanca as Record<string, unknown>).distanciaKm as number | null;
  const cotacoes = (mudanca as Record<string, unknown>).cotacoes as Array<{
    id: string; precoCentavos: number; transportadora: { nome: string; notaMedia: number };
  }> | undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">Detalhes da mudança</h1>
              <Badge variant="outline" className={`text-[11px] ${statusStyle.className}`}>
                {statusStyle.label}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                {mudanca.enderecoOrigem}
              </span>
              <ArrowRight className="h-3 w-3 hidden sm:block" />
              <span className="hidden sm:inline">{mudanca.enderecoDestino}</span>
              {distanciaKm && (
                <span className="flex items-center gap-1 font-medium">
                  <Navigation className="h-3 w-3 text-primary" />
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

      {/* Tab bar — sticky */}
      <div className="border-b border-gray-200 bg-white px-4 md:px-6 pt-3 pb-0 sticky top-0 z-20">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-transparent p-0 h-auto gap-0 border-b-0">
            <TabsTrigger
              value="comodos"
              className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <List className="h-4 w-4" />
              Itens por cômodo
            </TabsTrigger>
            <TabsTrigger
              value="canvas3d"
              className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Box className="h-4 w-4" />
              Carga 3D
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Itens por cômodo ── */}
          <TabsContent value="comodos" className="mt-0">
            {/* Body: left (items by room) + right (summary + furniture sidebar) */}
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row" style={{ minHeight: "calc(100vh - 200px)" }}>
              {/* Left: Items organized by room */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold text-gray-900">Itens por cômodo</h2>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Ajuste os itens para uma estimativa mais precisa
                  </span>
                </div>

                {roomBlocks && roomBlocks.length > 0 ? (
                  roomBlocks.map((block) => (
                    <DroppableRoomCard
                      key={block.key}
                      block={block}
                      onToggleExpand={() => toggleExpand(block.key)}
                      onRemoveItem={(itemId) => removeItem(block.key, itemId)}
                      onAddItem={() => setPickerRoom({ key: block.key, label: block.label })}
                      onDropItem={(item) => handleDragDrop(block.key, item)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Nenhum cômodo configurado</p>
                  </div>
                )}
              </div>

              {/* Right: Summary panel + Furniture drag sidebar */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50 overflow-y-auto p-4 space-y-4">
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
                            <p className="text-sm font-medium text-gray-900">{c.transportadora.nome}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-gray-500">{c.transportadora.notaMedia?.toFixed(1)}</span>
                              {i === 0 && <span className="text-[10px] font-medium text-green-600 ml-1">Melhor preço</span>}
                            </div>
                          </div>
                          <span className="text-base font-bold text-gray-900">
                            R$ {(c.precoCentavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      <p className="text-[10px] text-gray-400 italic text-center mt-2">
                        Preços estimados. Detalhe seus itens para maior precisão.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* T2: Furniture drag-and-drop sidebar */}
                <FurnitureSidebar onDragStart={() => {}} />
              </div>
            </div>
          </TabsContent>

          {/* ── Tab: Carga 3D ── */}
          <TabsContent value="canvas3d" className="mt-0">
            <div className="flex flex-col" style={{ height: "calc(100vh - 160px)" }}>
              {/* Instruction + truck estimate banner */}
              <div className="px-4 md:px-6 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs text-blue-700">
                    Posicionamento automático ativo. Selecione um item no painel para adicionar manualmente.
                  </p>
                  {estimatedTruckCount > 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold px-2.5 py-0.5 border border-amber-200">
                      <Truck className="h-3 w-3" />
                      Estimativa: {estimatedTruckCount} caminhões necessários
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 shrink-0">
                  <Truck className="h-3.5 w-3.5" />
                  <span className="font-medium">{recommendedTruck.nome}</span>
                  <span className="text-blue-400">({recommendedTruck.capacidadeM3} m³)</span>
                </div>
              </div>

              {/* 3D canvas — fills remaining height */}
              <div className="flex-1 overflow-hidden">
                <TruckCanvas3D
                  key={autoPlaceKey}
                  larguraCm={recommendedTruck.larguraCm}
                  alturaCm={recommendedTruck.alturaCm}
                  comprimentoCm={recommendedTruck.comprimentoCm}
                  capacidadeM3={recommendedTruck.capacidadeM3}
                  capacidadeKg={recommendedTruck.capacidadeKg}
                  mudancaId={id}
                  items={catalog3DItems}
                  autoPlaceOnMount={autoPlaceItems.length > 0 ? autoPlaceItems : undefined}
                  truckId={recommendedTruck.id}
                  truckNome={recommendedTruck.nome}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* T1: Item picker popup */}
      {pickerRoom && (
        <ItemPickerPopup
          roomKey={pickerRoom.key}
          roomLabel={pickerRoom.label}
          onSelect={(item) => addFurnitureToRoom(pickerRoom.key, item)}
          onClose={() => setPickerRoom(null)}
        />
      )}
    </div>
  );
}
