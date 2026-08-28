"use client";

import Link from "next/link";
import { FileText, FileSpreadsheet, Presentation, Image as ImageIcon, File, X, MoreHorizontal } from "lucide-react";
import { DocPilotDocument } from "@/types";
import { useDocumentStore } from "@/hooks/useDocumentStore";

const iconMap = {
  PDF: FileText,
  WORD: File,
  EXCEL: FileSpreadsheet,
  POWERPOINT: Presentation,
  IMAGE: ImageIcon,
};

const colorMap = {
  PDF: "text-red-500 bg-red-50 dark:bg-red-950/30",
  WORD: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  EXCEL: "text-green-500 bg-green-50 dark:bg-green-950/30",
  POWERPOINT: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
  IMAGE: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentRow({ doc }: { doc: DocPilotDocument }) {
  const removeDocument = useDocumentStore((s) => s.removeDocument);
  const Icon = iconMap[doc.fileType];

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-ink-100 dark:border-ink-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors group">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[doc.fileType]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{doc.fileName}</p>
        <p className="text-xs text-ink-400">{formatBytes(doc.sizeBytes)} · {new Date(doc.createdAt).toLocaleString()}</p>
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
          doc.status === "COMPLETED"
            ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
            : doc.status === "PROCESSING"
            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
            : "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400"
        }`}
      >
        {doc.status}
      </span>
      <Link
        href={`/dashboard/chat?doc=${doc.id}`}
        className="text-xs font-medium text-brand-500 hover:underline shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
      >
        Open
      </Link>
      <button
        onClick={() => removeDocument(doc.id)}
        className="h-7 w-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
        aria-label="Remove document"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
