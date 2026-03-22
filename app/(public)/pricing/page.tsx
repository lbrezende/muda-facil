"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleCheckout() {
    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Planos simples, sem surpresas
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Comece grátis e faça upgrade quando precisar de mais.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
          {/* FREE Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-xl">Gratuito</CardTitle>
              <CardDescription>Para testar sem compromisso</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Feature text="1 mudança ativa" />
              <Feature text="Até 15 itens no canvas" />
              <Feature text="3 cotações por mudança" />
              <Feature text="Catálogo de itens básico" />
              <FeatureDisabled text="Filtros avançados de cotação" />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/login")}
              >
                Começar grátis
              </Button>
            </CardContent>
          </Card>

          {/* PRO Plan */}
          <Card className="relative border-[#E84225] border-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-medium text-white">
                Mais popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>Para mudar sem limites</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 29,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Feature text="Mudanças ilimitadas" highlight />
              <Feature text="Itens ilimitados no canvas" highlight />
              <Feature text="Cotações ilimitadas" highlight />
              <Feature text="Filtros avançados de cotação" highlight />
              <Feature text="14 dias grátis para testar" highlight />
              <Button
                className="w-full mt-4 bg-[#E84225] hover:bg-[#C73820]"
                onClick={handleCheckout}
              >
                Começar trial gratuito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Check className={`h-4 w-4 shrink-0 ${highlight ? "text-[#E84225]" : "text-gray-400"}`} />
      <span className={`text-sm ${highlight ? "text-gray-900" : "text-gray-600"}`}>
        {text}
      </span>
    </div>
  );
}

function FeatureDisabled({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <X className="h-4 w-4 shrink-0 text-gray-300" />
      <span className="text-sm text-gray-400 line-through">{text}</span>
    </div>
  );
}
