"use client";

import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaywallGateProps {
  children: React.ReactNode;
  featureName: string;
  currentUsage: number;
  limit: number;
  isBlocked: boolean;
}

export function PaywallGate({
  children,
  featureName,
  currentUsage,
  limit,
  isBlocked,
}: PaywallGateProps) {
  const router = useRouter();

  if (!isBlocked) {
    return <>{children}</>;
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Lock className="h-6 w-6 text-[#009B3A]" />
        </div>
        <CardTitle className="text-lg">Limite atingido</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Você atingiu o limite de{" "}
          <span className="font-semibold">{limit} {featureName}</span> no plano
          gratuito.
        </p>
        <p className="text-xs text-gray-500">
          Uso atual: {currentUsage}/{limit}
        </p>
        <Button
          onClick={() => router.push("/pricing")}
          className="bg-[#009B3A] hover:bg-[#007A2E]"
        >
          Fazer upgrade para Pro
        </Button>
      </CardContent>
    </Card>
  );
}
