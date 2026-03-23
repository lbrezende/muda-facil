"use client";

import { Star, Clock, Shield, ArrowRight } from "lucide-react";
import type { AutoQuote } from "@/hooks/use-quotes";

// Fun emoji logos for transportadoras
const TRANSPORT_EMOJIS: Record<string, string> = {
  "Zé do Frete": "🚛",
  "Frete Baratão": "📦",
  "EcoMuda": "🌿",
  "MudaJá Express": "⚡",
  "CarregaBem": "💪",
  "TransPorte Seguro": "🔒",
  "Mudança Fácil Express": "🚀",
  "Carreto Amigo": "🤝",
  "Rápido & Seguro Mudanças": "✅",
  "Mudança VIP": "👑",
  "TransLux Gold": "🏆",
  "Mãos de Seda": "🤲",
  "Foguete Mudanças": "🔥",
  "Canguru Transportes": "🦘",
};

function getEmoji(name: string): string {
  return TRANSPORT_EMOJIS[name] || "🚚";
}

interface QuotePreviewProps {
  quotes: AutoQuote[];
  compact?: boolean;
  mudancaId?: string;
}

export function QuotePreview({
  quotes,
  compact = false,
  mudancaId,
}: QuotePreviewProps) {
  const top3 = quotes.slice(0, 3);

  if (top3.length === 0) return null;

  if (compact) {
    // Mini version for dashboard cards
    return (
      <div className="space-y-1">
        {top3.map((q, i) => (
          <div
            key={q.transportadoraId || i}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-1 text-gray-600 truncate">
              <span>{getEmoji(q.transportadoraNome)}</span>
              <span className="truncate">{q.transportadoraNome}</span>
            </span>
            <span className="font-semibold text-gray-800 shrink-0 ml-2">
              R$ {q.precoReais}
            </span>
          </div>
        ))}
        <p className="text-[10px] text-gray-400 italic mt-1">
          * Estimativa baseada no tamanho da casa
        </p>
      </div>
    );
  }

  // Full version for modal
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Melhores estimativas de preço
        </h4>
      </div>

      <div className="space-y-2">
        {top3.map((q, i) => (
          <div
            key={q.transportadoraId || i}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              i === 0
                ? "border-green-200 bg-green-50/50"
                : "border-gray-200 bg-white"
            }`}
          >
            <span className="text-2xl">{getEmoji(q.transportadoraNome)}</span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {q.transportadoraNome}
                </span>
                {i === 0 && (
                  <span className="text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                    Melhor preço
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  {q.notaMedia.toFixed(1)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {q.tempoEstimadoDias}d
                </span>
                {q.seguroIncluso && (
                  <span className="flex items-center gap-0.5 text-green-600">
                    <Shield className="h-3 w-3" />
                    Seguro
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-gray-900">
                R$ {q.precoReais}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
        <p className="text-xs text-amber-700">
          <strong>Apenas uma estimativa</strong> baseada no tamanho da sua casa.
          Para um preço mais preciso, detalhe os móveis que você tem.
        </p>
        {mudancaId && (
          <a
            href={`/dashboard/mudanca/${mudancaId}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#009B3A] mt-1 hover:underline"
          >
            Detalhar meus móveis para preço real
            <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
