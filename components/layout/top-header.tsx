"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Truck,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface TopHeaderProps {
  onMenuToggle?: () => void;
}

export function TopHeader({ onMenuToggle }: TopHeaderProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-[#E5E9EB] bg-white px-4 md:px-6">
      {/* Left: hamburger (mobile) + logo + nav */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9] md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-[#F6F8F9]"
        >
          <Truck className="h-5 w-5" />
        </Link>
        <Link
          href="/dashboard"
          className="hidden sm:inline-block rounded-md px-3 py-1 text-sm font-medium text-[#252C32] hover:bg-[#F6F8F9]"
        >
          Minhas Mudanças
        </Link>
      </div>

      <div className="flex-1" />

      {/* Right: notifications + user dropdown */}
      <div className="flex items-center gap-1">
        <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]">
          <Bell className="h-5 w-5" />
        </button>
        <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* User dropdown */}
        {session?.user && (
          <div className="relative ml-1 md:ml-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 md:gap-2 rounded-lg px-1.5 md:px-2 py-1 hover:bg-[#F6F8F9] transition-colors"
            >
              <Avatar className="h-7 w-7 border border-black/10">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || ""}
                />
                <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown
                className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/settings/billing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Configurações da conta
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
