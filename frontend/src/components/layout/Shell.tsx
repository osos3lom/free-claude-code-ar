"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "@/store/useAppStore";

export function Shell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* ── Mobile backdrop ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile slide-over sidebar ─────────────────────
           In RTL: slides in from the right (inline-end)    */}
      <div
        className={`
          fixed inset-y-0 end-0 z-50 flex md:hidden
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}
        `}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex md:hidden items-center justify-between px-4 h-12 shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
          <span className="text-sm font-semibold">Free Claude Code</span>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={lang === "ar" ? "فتح القائمة" : "Open menu"}
            className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
