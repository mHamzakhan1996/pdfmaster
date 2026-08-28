"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DashboardUIState {
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
}

const DashboardUIContext = createContext<DashboardUIState | null>(null);

export function DashboardUIProvider({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <DashboardUIContext.Provider
      value={{
        mobileNavOpen,
        openMobileNav: () => setMobileNavOpen(true),
        closeMobileNav: () => setMobileNavOpen(false),
      }}
    >
      {children}
    </DashboardUIContext.Provider>
  );
}

/** Used by Topbar (to open the drawer) and MobileSidebar (to read/close it). */
export function useDashboardUI() {
  const ctx = useContext(DashboardUIContext);
  if (!ctx) {
    throw new Error("useDashboardUI must be used within DashboardUIProvider (see dashboard/layout.tsx)");
  }
  return ctx;
}
