"use client";

import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth();
  const initials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 glass border-b border-ink-100 dark:border-ink-800">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="font-semibold text-lg">{title}</h1>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-1.5 w-64">
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
