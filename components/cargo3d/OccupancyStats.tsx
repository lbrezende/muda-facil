"use client";

import type { Cargo3DStats } from "@/lib/cargo3d/cargo-types";

interface OccupancyStatsProps {
  stats: Cargo3DStats;
}

function getOccupancyColor(percent: number): string {
  if (percent > 90) return "text-red-600";
  if (percent > 70) return "text-amber-500";
  return "text-emerald-600";
}

function getProgressBarColor(percent: number): string {
  if (percent > 90) return "bg-red-500";
  if (percent > 70) return "bg-amber-400";
  return "bg-emerald-500";
}

export function OccupancyStats({ stats }: OccupancyStatsProps) {
  const clamped = Math.min(stats.occupancyPercent, 100);

  return (
    <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md px-3 py-2 min-w-[160px] text-xs">
      <p className="font-semibold text-slate-700 mb-1.5 text-[11px] uppercase tracking-wide">
        Ocupação
      </p>

      {/* Occupancy bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-slate-500">Volume</span>
          <span className={`font-bold ${getOccupancyColor(clamped)}`}>
            {clamped}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(clamped)}`}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="space-y-1">
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Itens</span>
          <span className="font-medium text-slate-700">{stats.itemCount}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Volume</span>
          <span className="font-medium text-slate-700">
            {stats.totalVolumeM3.toFixed(1)}/
            <span className="text-slate-400">{stats.truckCapacidadeM3}m³</span>
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Peso</span>
          <span className="font-medium text-slate-700">
            {stats.totalPesoKg}
            <span className="text-slate-400">/{stats.truckCapacidadeKg}kg</span>
          </span>
        </div>
      </div>
    </div>
  );
}
