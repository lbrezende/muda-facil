"use client";

import { Check, AlertTriangle, Truck } from "lucide-react";
import {
  recommendTrucks,
  type TruckInfo,
} from "@/lib/room-estimation";

// ─── Visual truck fill bar ───────────────────────────────

function TruckFillBar({
  occupancyPercent,
  quantity,
  truckName,
  isRecommended,
}: {
  occupancyPercent: number;
  quantity: number;
  truckName: string;
  isRecommended: boolean;
}) {
  // For multiple trucks, show each one
  const trucks = [];
  for (let i = 0; i < quantity; i++) {
    const isLast = i === quantity - 1;
    // Last truck may be partially full
    const fillPercent = isLast
      ? occupancyPercent
      : 100;

    trucks.push(
      <div key={i} className="flex items-center gap-2">
        {/* Truck body with fill animation */}
        <div className="relative flex-1 h-8 rounded-md border-2 border-gray-300 bg-gray-100 overflow-hidden">
          {/* Fill from left to right */}
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-r-sm ${
              fillPercent > 90
                ? "bg-red-400"
                : fillPercent > 70
                ? "bg-amber-400"
                : "bg-green-400"
            }`}
            style={{ width: `${Math.min(100, fillPercent)}%` }}
          />
          {/* Fill percentage text inside */}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {fillPercent}%
          </div>
        </div>

        {/* Cabin */}
        <div className="flex h-8 w-6 items-center justify-center rounded-md border-2 border-gray-300 bg-gray-200">
          <Truck className="h-3 w-3 text-gray-500" />
        </div>

        {/* Label for multi-truck */}
        {quantity > 1 && (
          <span className="text-[10px] text-gray-500 shrink-0 w-4">
            #{i + 1}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{truckName}</span>
          {isRecommended && (
            <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
              <Check className="h-3 w-3" />
              Ideal
            </span>
          )}
          {quantity > 1 && (
            <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              {quantity} caminhões
            </span>
          )}
        </div>
      </div>

      {/* Truck fill bars */}
      {trucks}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────

interface TruckRecommendationProps {
  volumeM3: number;
  pesoKg: number;
  caminhoes: TruckInfo[];
  compact?: boolean;
}

export function TruckRecommendationPanel({
  volumeM3,
  pesoKg,
  caminhoes,
  compact = false,
}: TruckRecommendationProps) {
  if (caminhoes.length === 0 || (volumeM3 === 0 && pesoKg === 0)) return null;

  const recommendations = recommendTrucks(volumeM3, pesoKg, caminhoes);
  const best = recommendations.find((r) => r.isRecommended) || recommendations[recommendations.length - 1];

  if (!best) return null;

  if (compact) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Caminhão estimado
        </h4>
        <TruckFillBar
          occupancyPercent={best.occupancyPercent}
          quantity={best.quantity}
          truckName={best.truck.nome}
          isRecommended={best.isRecommended}
        />
        <p className="text-[10px] text-gray-400">
          {best.truck.capacidadeM3} m³ de capacidade · {best.truck.capacidadeKg} kg max
        </p>
      </div>
    );
  }

  // Full version: show all trucks
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">
        Caminhão recomendado
      </h4>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.truck.id}
            className={`rounded-lg border p-3 transition-colors ${
              rec.isRecommended
                ? "border-green-200 bg-green-50/30"
                : "border-gray-100 bg-gray-50/50 opacity-60"
            }`}
          >
            <TruckFillBar
              occupancyPercent={rec.occupancyPercent}
              quantity={rec.quantity}
              truckName={rec.truck.nome}
              isRecommended={rec.isRecommended}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {rec.truck.capacidadeM3} m³ · {rec.truck.capacidadeKg} kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
