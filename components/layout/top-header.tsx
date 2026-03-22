"use client";

import { useSession } from "next-auth/react";
import {
  Truck,
  Search,
  HelpCircle,
  Settings,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function TopHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-[#E5E9EB] bg-white px-6">
      {/* Left icon */}
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#E84225] hover:bg-[#F6F8F9]"
        >
          <Truck className="h-6 w-6" />
        </Link>
      </div>

      {/* Center tabs */}
      <div className="ml-4 flex items-center gap-1">
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-1 text-sm leading-6 tracking-[-0.084px] text-[#252C32] hover:bg-[#F6F8F9]"
        >
          Minhas Mudanças
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div className="relative mr-2">
          <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9AA6AC]" />
          <input
            type="text"
            placeholder="Buscar"
            className="h-8 w-[200px] rounded-md border border-[#DDE2E4] bg-white pl-8 pr-3 text-sm leading-6 tracking-[-0.084px] text-[#252C32] placeholder:text-[#9AA6AC] focus:border-[#E84225] focus:outline-none"
          />
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]">
          <Bell className="h-6 w-6" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]">
          <HelpCircle className="h-6 w-6" />
        </button>
        <Link
          href="/settings/billing"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]"
        >
          <Settings className="h-6 w-6" />
        </Link>

        {session?.user && (
          <Avatar className="ml-2 h-6 w-6 border border-black/10">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || ""}
            />
            <AvatarFallback className="bg-[#FDEAE6] text-[10px] font-semibold text-[#E84225]">
              {session.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
