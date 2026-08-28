"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ToolDefinition } from "@/types";
import { useDocumentStore } from "@/hooks/useDocumentStore";

export function ToolGrid({ tools, title }: { tools: ToolDefinition[]; title: string }) {
  const activeDocumentId = useDocumentStore((s) => s.activeDocumentId);

  return (
    <div>
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const Icon = (Icons as any)[tool.icon] || Icons.File;
          const href = activeDocumentId
            ? `/dashboard/tools/${tool.id}?doc=${activeDocumentId}`
            : `/dashboard/tools/${tool.id}`;
          return (
            <Link key={tool.id} href={href}>
              <Card className="p-4 h-full hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="h-9 w-9 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-3">
                  <Icon className="h-4.5 w-4.5 text-brand-500" />
                </div>
                <p className="font-medium text-sm">{tool.title}</p>
                <p className="text-xs text-ink-400 mt-1 leading-relaxed">{tool.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
