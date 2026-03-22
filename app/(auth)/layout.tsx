"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { TrialBanner } from "@/components/layout/trial-banner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-['Inter',sans-serif]">
      <TrialBanner />
      <TopHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: hidden on mobile, visible on md+ */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        {/* Mobile sidebar (overlay) */}
        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
