"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getToolById } from "@/lib/tools";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import { extractTextFromPdf } from "@/lib/extractText";
import {
  mergePdfs, splitPdf, compressPdf, rotatePages, addWatermark, extractPages,
} from "@/lib/pdf/operations";

export default function ToolRunnerPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const toolId = params.tool as string;
  const tool = useMemo(() => getToolById(toolId), [toolId]);

  const documents = useDocumentStore((s) => s.documents);
  const docId = search.get("doc");
  const activeDoc = documents.find((d) => d.id === docId) || documents[0];

  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultJson, setResultJson] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("DocPilot AI");
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [pageRange, setPageRange] = useState("1-3");
  const [targetLang, setTargetLang] = useState("Spanish");

  if (!tool) {
    return (
      <>
        <Topbar title="Tool not found" />
        <div className="p-6">Unknown tool: {toolId}</div>
      </>
    );
  }

  const Icon = (Icons as any)[tool.icon] || Icons.File;

  async function runPdfTool() {
    if (!activeDoc?.file) return;
    setStatus("running");
    setErrorMsg("");
    try {
      let output: Uint8Array | Uint8Array[] | null = null;
      const buf = await activeDoc.file.arrayBuffer();

      switch (tool!.id) {
        case "compress-pdf":
          output = await compressPdf(buf);
          break;
        case "rotate-pages":
          output = await rotatePages(buf, rotateAngle);
          break;
        case "add-watermark":
          output = await addWatermark(buf, watermarkText);
          break;
        case "extract-pages": {
          const pages = parseRange(pageRange);
          output = await extractPages(buf, pages);
          break;
        }
        case "split-pdf": {
          const parts = await splitPdf(buf);
          output = parts[0]; // preview first page; full set offered as info below
          setResultText(`Split into ${parts.length} single-page PDFs. Downloading page 1 as a preview — use the API route for the full ZIP in production.`);
          break;
        }
        case "merge-pdf":
          output = await mergePdfs([buf, buf]); // demo: merges doc with itself when only 1 file selected
          setResultText("Demo merge: combined the selected document with a duplicate of itself. Upload 2+ files to merge distinct PDFs.");
          break;
        default:
          break;
      }

      if (output) {
        const bytes = Array.isArray(output) ? output : output;
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
      }
      setStatus("done");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
      setStatus("error");
    }
  }

  async function runAiTool() {
    if (!activeDoc?.file) return;
    setStatus("running");
    setErrorMsg("");
    setResultText(null);
    setResultJson(null);

    try {
      const { text } = await extractTextFromPdf(activeDoc.file);

      const toolMap: Record<string, { serverTool: string; options?: any }> = {
        summarize: { serverTool: "SUMMARIZE" },
        translate: { serverTool: "TRANSLATE", options: { targetLanguage: targetLang } },
        rewrite: { serverTool: "REWRITE" },
        "extract-key-points": { serverTool: "EXTRACT_KEY_POINTS" },
        "generate-report": { serverTool: "GENERATE_REPORT" },
        "generate-presentation": { serverTool: "GENERATE_PRESENTATION" },
        "generate-faqs": { serverTool: "GENERATE_FAQS" },
        "generate-quiz": { serverTool: "GENERATE_QUIZ" },
        "extract-tables": { serverTool: "EXTRACT_TABLES" },
      };

      const mapped = toolMap[tool!.id];
      if (!mapped) throw new Error("Tool not wired yet");

      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: mapped.serverTool, documentText: text, options: mapped.options }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (typeof data.result === "string") setResultText(data.result);
      else setResultJson(data.result);

      setStatus("done");
    } catch (err: any) {
      setErrorMsg(err.message || "AI request failed — check that OPENAI_API_KEY is configured on the server.");
      setStatus("error");
    }
  }

  function run() {
    if (tool!.category === "pdf") runPdfTool();
    else if (tool!.id === "chat-with-pdf") router.push(`/dashboard/chat?doc=${activeDoc?.id}`);
    else runAiTool();
  }

  return (
    <>
      <Topbar title={tool.title} />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
              <Icon className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <h2 className="font-semibold">{tool.title}</h2>
              <p className="text-sm text-ink-400">{tool.description}</p>
            </div>
          </div>
        </Card>

        {!activeDoc && (
          <div>
            <p className="text-sm font-medium mb-3">Upload a document to get started</p>
            <UploadZone />
          </div>
        )}

        {activeDoc && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{activeDoc.fileName}</p>
                <p className="text-xs text-ink-400">{(activeDoc.sizeBytes / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>Change file</Button>
            </div>

            {/* Tool-specific options */}
            {tool.id === "add-watermark" && (
              <div>
                <label className="text-sm font-medium">Watermark text</label>
                <input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
            {tool.id === "rotate-pages" && (
              <div>
                <label className="text-sm font-medium">Rotation angle</label>
                <div className="flex gap-2 mt-1.5">
                  {[90, 180, 270].map((a) => (
                    <button
                      key={a}
                      onClick={() => setRotateAngle(a as 90 | 180 | 270)}
                      className={`px-4 py-2 rounded-lg text-sm border ${rotateAngle === a ? "bg-brand-500 text-white border-brand-500" : "border-ink-200 dark:border-ink-700"}`}
                    >
                      {a}°
                    </button>
                  ))}
                </div>
              </div>
            )}
            {tool.id === "extract-pages" && (
              <div>
                <label className="text-sm font-medium">Page range (e.g. 1,3,5-7)</label>
                <input
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
            {tool.id === "translate" && (
              <div>
                <label className="text-sm font-medium">Target language</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {["Spanish", "French", "German", "Urdu", "Arabic", "Chinese", "Hindi", "Portuguese"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            <Button onClick={run} loading={status === "running"} className="w-full">
              Run {tool.title}
            </Button>

            {status === "error" && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-4 py-3">
                {errorMsg}
              </div>
            )}

            {downloadUrl && (
              <a href={downloadUrl} download={`${tool.id}-result.pdf`}>
                <Button variant="secondary" className="w-full">Download result</Button>
              </a>
            )}

            {resultText && (
              <div className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {resultText}
              </div>
            )}

            {resultJson && (
              <pre className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(resultJson, null, 2)}
              </pre>
            )}
          </Card>
        )}
      </div>
    </>
  );
}

function parseRange(input: string): number[] {
  const pages = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) pages.add(i);
    } else {
      pages.add(Number(part));
    }
  }
  return Array.from(pages);
}
