"use client";

import {
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Monitor,
  WashingMachine,
  Minus,
  Plus,
  Package,
  Weight,
  Box,
} from "lucide-react";
import {
  ROOM_TYPES,
  calculateRoomSummary,
  type RoomType,
} from "@/lib/room-estimation";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Monitor,
  WashingMachine,
};

interface RoomSelectorProps {
  rooms: Record<string, number>;
  onChange: (rooms: Record<string, number>) => void;
  /** "grid" = original 2-column layout, "tabs" = Airbnb-style horizontal tabs */
  variant?: "grid" | "tabs";
}

export function RoomSelector({ rooms, onChange, variant = "grid" }: RoomSelectorProps) {
  const summary = calculateRoomSummary(rooms);

  const setCount = (key: RoomType, delta: number) => {
    const current = rooms[key] || 0;
    const next = Math.max(0, Math.min(10, current + delta));
    onChange({ ...rooms, [key]: next });
  };

  /* ═══════════════ TABS variant (Airbnb-style) ═══════════════ */
  if (variant === "tabs") {
    return (
      <div className="space-y-3">
        {/* Horizontal category tabs */}
        <div className="flex items-end justify-center gap-6 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-hide">
          {ROOM_TYPES.map((room) => {
            const Icon = ICONS[room.icon];
            const count = rooms[room.key] || 0;
            const isActive = count > 0;

            return (
              <div
                key={room.key}
                className="flex flex-col items-center shrink-0 group"
              >
                {/* Icon + label (clickable to add 1) */}
                <button
                  type="button"
                  onClick={() => {
                    if (count === 0) setCount(room.key, 1);
                  }}
                  className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-[#E84225] text-[#E84225]"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {room.label}
                  </span>
                </button>

                {/* Counter — shows only when active */}
                {isActive && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setCount(room.key, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-[#E84225] hover:text-[#E84225]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold text-[#E84225]">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCount(room.key, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-[#E84225] hover:text-[#E84225]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        {summary.numComodos > 0 && (
          <div className="flex items-center justify-center gap-5 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5 text-[#E84225]" />
              <span>
                ~<strong className="text-gray-800">{summary.estimatedItems}</strong> itens
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Box className="h-3.5 w-3.5 text-blue-500" />
              <span>
                ~<strong className="text-gray-800">{summary.volumeM3}</strong> m³
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Weight className="h-3.5 w-3.5 text-amber-500" />
              <span>
                ~<strong className="text-gray-800">{summary.pesoKg}</strong> kg
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════ GRID variant (original) ═══════════════ */
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Quais cômodos tem na sua casa?
        </span>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-2 gap-2">
        {ROOM_TYPES.map((room) => {
          const Icon = ICONS[room.icon];
          const count = rooms[room.key] || 0;
          const isActive = count > 0;

          return (
            <div
              key={room.key}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                isActive
                  ? "border-[#E84225]/30 bg-[#FFF5F3]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Icon + label */}
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-[#E84225]" : "text-gray-400"
                  }`}
                />
                <div className="min-w-0">
                  <span
                    className={`text-sm leading-tight ${
                      isActive
                        ? "font-medium text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {room.label}
                  </span>
                  <p className="text-[10px] text-gray-400 truncate">
                    {room.items.join(", ")}
                  </p>
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setCount(room.key, -1)}
                  disabled={count === 0}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span
                  className={`w-5 text-center text-sm font-semibold ${
                    isActive ? "text-[#E84225]" : "text-gray-400"
                  }`}
                >
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => setCount(room.key, 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {summary.numComodos > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5 text-[#E84225]" />
            <span>
              ~<strong className="text-gray-800">{summary.estimatedItems}</strong>{" "}
              itens
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Box className="h-3.5 w-3.5 text-blue-500" />
            <span>
              ~<strong className="text-gray-800">{summary.volumeM3}</strong> m³
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Weight className="h-3.5 w-3.5 text-amber-500" />
            <span>
              ~<strong className="text-gray-800">{summary.pesoKg}</strong> kg
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
