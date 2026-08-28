"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [autoDelete, setAutoDelete] = useState(true);

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                disabled
                value={user?.email || ""}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 px-4 py-2.5 text-sm outline-none opacity-70"
              />
            </div>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Privacy & Security</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-delete files after processing</p>
              <p className="text-xs text-ink-400 mt-0.5">Files are permanently removed 24 hours after processing completes.</p>
            </div>
            <button
              onClick={() => setAutoDelete(!autoDelete)}
              className={`h-6 w-11 rounded-full transition-colors relative shrink-0 ${autoDelete ? "bg-brand-500" : "bg-ink-200 dark:bg-ink-700"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${autoDelete ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </Card>

        <Card className="p-6 border-red-200 dark:border-red-900">
          <h2 className="font-semibold text-red-600 dark:text-red-400 mb-1">Danger zone</h2>
          <p className="text-sm text-ink-400 mb-4">Permanently delete your account and all associated documents.</p>
          <Button variant="danger">Delete account</Button>
        </Card>
      </div>
    </>
  );
}
