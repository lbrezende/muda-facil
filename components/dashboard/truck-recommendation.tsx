"use client";

import { Check, AlertTriangle } from "lucide-react";
import {
  recommendTrucks,
  type TruckInfo,
  type TruckRecommendation as TruckRec,
} from "@/lib/room-estimation";

// Simple truck SVG icons by size
function TruckIcon({
  size,
  className = "",
}: {
  size: "small" | "medium" | "large" | "xlarge";
  className?: string;
}) {
  const widths = { small: 32, medium: 40, large: 48, xlarge: 56 };
  const heights = { small: 20, medium: 24, large: 28, xlarge: 32 };
  const w = widths[size];
  const h = heights[size];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      className={className}
    >
      {/* Cargo area */}
      <rect
        x="0"
        y="2"
        width={w * 0.65}
        height={h - 6}
        rx="2"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Cabin */}
      <rect
        x={w * 0.65}
        y={h * 0.3}
        width={w * 0.3}
        height={h * 0.5}
        rx="2"
        fill="currentColor"
        opacity="0.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Wheels */}
      <circle cx={w * 0.2} cy={h - 2} r={2.5} fill="currentColor" />
      <circle cx={w * 0.8} cy={h - 2} r={2.5} fill="currentColor" />
    </svg>
  );
}

const TRUCK_SIZES: Record<string, "small" | "medium" | "large" | "xlarge"> = {
  Fiorino: "small",
  "HR / VUC": "medium",
  "3/4": "large",
  Baú: "xlarge",
};

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

  if (compact) {
    // Mini version: just show the recommended truck
    const best = recommendations.find((r) => r.isRecommended);
    if (!best) return null;

    return (
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <TruckIcon
          size={TRUCK_SIZES[best.truck.nome] || "medium"}
          className="text-[#E84225]"
        />
        <span>
          <strong>{best.truck.nome}</strong>
          {best.quantity > 1 && ` × ${best.quantity}`} — {best.occupancyPercent}%
          ocupado
        </span>
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        Caminhão recomendado
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {recommendations.map((rec) => (
          <div
            key={rec.truck.id}
            className={`relative rounded-lg border p-3 transition-colors ${
              rec.isRecommended
                ? "border-green-300 bg-green-50/50 ring-1 ring-green-200"
                : rec.fits
                ? "border-gray-200 bg-white"
                : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            {/* Recommended badge */}
            {rec.isRecommended && (
              <div className="absolute -top-2 right-2 flex items-center gap-0.5 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-medium text-white">
                <Check className="h-3 w-3" />
                Ideal
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <TruckIcon
                size={TRUCK_SIZES[rec.truck.nome] || "medium"}
                className={
                  rec.isRecommended ? "text-green-600" : "text-gray-400"
                }
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {rec.truck.nome}
                </p>
                <p className="text-[10px] text-gray-500">
                  {rec.truck.capacidadeM3} m³ / {rec.truck.capacidadeKg} kg
                </p>
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    rec.occupancyPercent > 100
                      ? "bg-red-500"
                      : rec.occupancyPercent > 80
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(100, rec.occupancyPercent)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>{rec.occupancyPercent}% ocupado</span>
                {rec.quantity > 1 && (
                  <span className="flex items-center gap-0.5 text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    {rec.quantity}× caminhões
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
