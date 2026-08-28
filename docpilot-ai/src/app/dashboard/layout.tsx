import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ink-50/40 dark:bg-ink-950">
      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
