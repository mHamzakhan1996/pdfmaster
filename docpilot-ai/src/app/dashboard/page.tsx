"use client";

export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { DocumentRow } from "@/components/dashboard/DocumentRow";
import { ToolGrid } from "@/components/dashboard/ToolGrid";
import { PDF_TOOLS, AI_TOOLS } from "@/lib/tools";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import { Card } from "@/components/ui/Card";
import { FileText, Sparkles, Clock } from "lucide-react";

export default function DashboardPage() {
  const documents = useDocumentStore((s) => s.documents);

  const stats = [
    { label: "Documents today", value: documents.length, of: 5, icon: FileText },
    { label: "AI requests today", value: Math.min(documents.length * 2, 10), of: 10, icon: Sparkles },
    { label: "Avg. processing time", value: "4.2s", icon: Clock },
  ];

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center shrink-0">
                <s.icon className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">
                  {s.value}{s.of ? <span className="text-sm font-normal text-ink-400"> / {s.of}</span> : ""}
                </p>
                <p className="text-xs text-ink-400 mt-1">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Upload */}
        <div>
          <h2 className="font-semibold mb-4">Upload a document</h2>
          <UploadZone />
        </div>

        {/* Recent documents */}
        {documents.length > 0 && (
          <div>
            <h2 className="font-semibold mb-4">Your documents</h2>
            <div className="space-y-2.5">
              {documents.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        <ToolGrid tools={PDF_TOOLS} title="PDF Tools" />
        <ToolGrid tools={AI_TOOLS} title="AI Document Tools" />
      </div>
    </>
  );
}
