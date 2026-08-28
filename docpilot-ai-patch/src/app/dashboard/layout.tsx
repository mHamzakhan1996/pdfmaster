import { Sidebar, MobileSidebar } from "@/components/dashboard/Sidebar";
import { DashboardUIProvider } from "@/hooks/useDashboardUI";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardUIProvider>
      <div className="flex min-h-screen bg-ink-50/40 dark:bg-ink-950">
        <Sidebar />
        <MobileSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </DashboardUIProvider>
  );
}
