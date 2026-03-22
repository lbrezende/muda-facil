"use client";

import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import Link from "next/link";

export function TrialBanner() {
  const { data: session } = useSession();

  if (!session?.user) return null;
  if (session.user.plan !== "TRIAL") return null;
  if (!session.user.trialEndsAt) return null;

  const trialEnd = new Date(session.user.trialEndsAt);
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (daysLeft <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-[#E84225] px-4 py-2 text-sm text-white">
      <Clock className="h-4 w-4" />
      <span>
        {daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"} no seu
        trial.
      </span>
      <Link href="/pricing" className="underline font-medium hover:text-red-100">
        Fazer upgrade
      </Link>
    </div>
  );
}
