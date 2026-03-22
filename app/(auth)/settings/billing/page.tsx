"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getPlanDisplayName } from "@/lib/subscription";

export default function BillingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session?.user) return null;

  const user = session.user;
  const plan = user.plan;

  const trialDaysLeft = user.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(user.trialEndsAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const renewalDate = user.stripeCurrentPeriodEnd
    ? new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("pt-BR")
    : null;

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao criar checkout");
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao conectar com Stripe"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao abrir portal");
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao conectar com Stripe"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6 px-8 pt-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assinatura</h1>
        <p className="text-sm text-gray-500">
          Gerencie seu plano e pagamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Plano atual
                <Badge
                  variant={plan === "PRO" ? "default" : "secondary"}
                  className={plan === "PRO" ? "bg-[#E84225]" : ""}
                >
                  {getPlanDisplayName(plan)}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {plan === "TRIAL" && trialDaysLeft > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Clock className="h-3 w-3" />
                    {trialDaysLeft} dias restantes no trial
                  </span>
                )}
                {plan === "PRO" && renewalDate && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Renovação em {renewalDate}
                  </span>
                )}
                {plan === "FREE" && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <AlertCircle className="h-3 w-3" />
                    Plano gratuito — funcionalidades limitadas
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {plan === "PRO" ? (
            <Button
              variant="outline"
              onClick={handlePortal}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              Gerenciar assinatura
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Faça upgrade para o Pro e desbloqueie listas ilimitadas.
              </p>
              <Button
                className="bg-[#E84225] hover:bg-[#C73820]"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upgrade para Pro — R$ 19,90/mês
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
