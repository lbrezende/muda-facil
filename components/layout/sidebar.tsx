"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  AtSign,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  {
    label: "Minhas Mudanças",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Catálogo de Itens",
    href: "/dashboard/catalogo",
    icon: Package,
  },
];

const BOTTOM_ITEMS = [
  {
    label: "Planos e pagamentos",
    href: "/settings/billing",
    icon: CreditCard,
  },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[#E5E9EB] bg-[#F6F8F9]">
      {/* Project header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E84225] text-white">
          <AtSign className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-6 tracking-[-0.084px] text-[#252C32]">
            MudaFácil
          </span>
          <span className="text-xs leading-4 text-[#84919A]">
            Organize sua mudança
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0 px-4">
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isExactDashboard = item.href === "/dashboard";
            const isActive = isExactDashboard
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm tracking-[-0.084px] transition-colors ${
                  isActive
                    ? "bg-[#FDEAE6] font-semibold text-[#E84225]"
                    : "font-normal text-[#252C32] hover:bg-[#E5E9EB]"
                }`}
              >
                <Icon className="h-6 w-6 shrink-0" />
                <span className="leading-6">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-[#E5E9EB]" />

        {BOTTOM_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm tracking-[-0.084px] transition-colors ${
                isActive
                  ? "bg-[#FDEAE6] font-semibold text-[#E84225]"
                  : "font-normal text-[#252C32] hover:bg-[#E5E9EB]"
              }`}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="leading-6">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {session?.user && (
        <div className="border-t border-[#E5E9EB] px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || ""}
              />
              <AvatarFallback className="bg-[#FDEAE6] text-xs font-semibold text-[#E84225]">
                {session.user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-[#252C32]">
                {session.user.name}
              </span>
              <span className="truncate text-xs text-[#84919A]">
                {session.user.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="shrink-0 rounded-md p-1 text-[#84919A] hover:bg-[#E5E9EB] hover:text-[#252C32]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
