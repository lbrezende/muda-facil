"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { Loader2, MapPin, ArrowRight, Calendar, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Page ─────────────────────────────────────────────────

export default function NovaMudancaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [dataDesejada, setDataDesejada] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#009B3A]" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  function validate(): string | null {
    if (!origem.trim()) return "Informe o endereço de origem.";
    if (!destino.trim()) return "Informe o endereço de destino.";
    if (!dataDesejada) return "Selecione a data desejada.";
    if (origem.trim() === destino.trim())
      return "Os endereços de origem e destino não podem ser iguais.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);

    // Simulate async create — replace with real API call when ready
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Mudança criada com sucesso!", {
      description: `${origem} → ${destino}`,
    });

    setIsSubmitting(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Nova Mudança
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Preencha os dados abaixo para criar e começar a organizar sua mudança.
        </p>
      </div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-xl">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <Truck className="h-5 w-5 text-[#009B3A]" />
              Dados da mudança
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Origem */}
              <div className="space-y-1.5">
                <label
                  htmlFor="origem"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#009B3A]" />
                  Endereço de origem
                </label>
                <Input
                  id="origem"
                  type="text"
                  placeholder="Ex: Rua das Flores, 123 – São Paulo, SP"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  disabled={isSubmitting}
                  className="h-10"
                />
              </div>

              {/* Arrow divider */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="h-px flex-1 bg-gray-200 w-12" />
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="h-px flex-1 bg-gray-200 w-12" />
                </div>
              </div>

              {/* Destino */}
              <div className="space-y-1.5">
                <label
                  htmlFor="destino"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#1A1A1A]" />
                  Endereço de destino
                </label>
                <Input
                  id="destino"
                  type="text"
                  placeholder="Ex: Av. Paulista, 1500 – São Paulo, SP"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  disabled={isSubmitting}
                  className="h-10"
                />
              </div>

              {/* Data desejada */}
              <div className="space-y-1.5">
                <label
                  htmlFor="dataDesejada"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
                >
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  Data desejada
                </label>
                <Input
                  id="dataDesejada"
                  type="date"
                  value={dataDesejada}
                  onChange={(e) => setDataDesejada(e.target.value)}
                  disabled={isSubmitting}
                  className="h-10"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#009B3A] text-white hover:bg-[#007A2E] font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando mudança...
                  </>
                ) : (
                  "Criar Mudança"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Helper text */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Após criar, você poderá adicionar itens e solicitar cotações de fretes.
        </p>
      </div>
    </div>
  );
}
