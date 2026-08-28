"use client";

import { Bell, Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardUI } from "@/hooks/useDashboardUI";

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth();
  const { openMobileNav } = useDashboardUI();
  const initials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-ink-900/60 border-b border-ink-100 dark:border-ink-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={openMobileNav}
            className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center border border-ink-200 dark:border-ink-700 shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="font-semibold text-base sm:text-lg truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-1.5 w-64">
            <Search className="h-4 w-4 text-ink-400" />
            <input placeholder="Search documents..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-ink-400" />
          </div>
          <button className="h-9 w-9 rounded-lg flex items-center justify-center border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800">
            <Bell className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
