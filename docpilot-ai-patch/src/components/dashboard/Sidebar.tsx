"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  FileStack, LayoutGrid, MessageSquareText, BarChart3, CreditCard, Settings, LogOut, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardUI } from "@/hooks/useDashboardUI";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/chat", label: "AI Assistant", icon: MessageSquareText },
  { href: "/dashboard/reports", label: "Report Generator", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <>
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2 font-display font-bold text-lg mb-8 px-1">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
          <FileStack className="h-4.5 w-4.5 text-white" />
        </div>
        DocPilot <span className="text-brand-500">AI</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500 text-white"
                  : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-100 dark:border-ink-800 pt-4">
        <div className="rounded-xl bg-brand-50 dark:bg-brand-950/30 p-3.5 mb-3">
          <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Free Plan</p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">3 of 5 documents used today</p>
          <div className="mt-2 h-1.5 rounded-full bg-brand-100 dark:bg-brand-900 overflow-hidden">
            <div className="h-full w-3/5 bg-brand-500 rounded-full" />
          </div>
          <Link href="/dashboard/billing" onClick={onNavigate} className="mt-2.5 inline-block text-xs font-semibold text-brand-600 dark:text-brand-300 hover:underline">
            Upgrade to Premium →
          </Link>
        </div>
        <button
          onClick={async () => { await signOut(); onNavigate?.(); router.push("/"); }}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
        >
          <LogOut className="h-4.5 w-4.5" /> Log out
        </button>
      </div>
    </>
  );
}

/** Desktop sidebar — permanently visible at md+ breakpoints. */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-ink-100 dark:border-ink-800 h-screen sticky top-0 p-5">
      <SidebarContent pathname={pathname} />
    </aside>
  );
}

/**
 * Mobile drawer — slides in from the left on phones/narrow screens.
 * Rendered by DashboardLayout, opened via the hamburger button in Topbar.
 * This is what was missing before: below the md breakpoint the sidebar was
 * simply hidden with no replacement, leaving no way to navigate the dashboard.
 */
export function MobileSidebar() {
  const pathname = usePathname();
  const { mobileNavOpen, closeMobileNav } = useDashboardUI();
  if (!mobileNavOpen) return null;
  return (
    <div className="md:hidden fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/50" onClick={closeMobileNav} />
      <div className="relative flex flex-col w-72 max-w-[80%] h-full p-5 bg-white dark:bg-ink-950">
        <button onClick={closeMobileNav} className="ml-auto mb-2 h-8 w-8 rounded-full border border-ink-200 dark:border-ink-700 flex items-center justify-center">
          <X className="h-4 w-4" />
        </button>
        <SidebarContent pathname={pathname} onNavigate={closeMobileNav} />
      </div>
    </div>
  );
}
