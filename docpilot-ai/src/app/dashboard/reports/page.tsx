"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UploadCloud, TrendingUp, Loader2, Presentation, FileDown } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ReportResult {
  sheetName: string;
  rowCount: number;
  kpis: { label: string; value: string; trend?: string }[];
  insights: string[];
  executiveSummary: string;
  chartData: { index: number; value: number }[];
}

export default function ReportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setResult(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
  });

  async function generate() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/reports/generate", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Report generation failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Ensure OPENAI_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Topbar title="Report Generator" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-1">Generate a report from Excel</h2>
          <p className="text-sm text-ink-400 mb-5">
            Upload a spreadsheet. DocPilot AI builds KPI cards, a trend chart, insights, and an executive summary.
          </p>

          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isDragActive ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : "border-ink-200 dark:border-ink-700 hover:border-brand-400"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-8 w-8 text-ink-400 mx-auto mb-2" />
            <p className="text-sm font-medium">{file ? file.name : "Drop an .xlsx/.csv file, or click to browse"}</p>
          </div>

          <Button onClick={generate} loading={loading} disabled={!file} className="w-full mt-5">
            Generate Report
          </Button>

          {error && (
            <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-4 py-3">
              {error}
            </div>
          )}
        </Card>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {result.kpis?.map((kpi) => (
                <Card key={kpi.label} className="p-4">
                  <p className="text-xs text-ink-400">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  {kpi.trend && (
                    <span className={`text-xs inline-flex items-center gap-1 mt-1 ${kpi.trend === "up" ? "text-green-500" : kpi.trend === "down" ? "text-red-500" : "text-ink-400"}`}>
                      <TrendingUp className="h-3 w-3" /> {kpi.trend}
                    </span>
                  )}
                </Card>
              ))}
            </div>

            {result.chartData?.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="index" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#7042ff" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Executive Summary</h3>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{result.executiveSummary}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Key Insights</h3>
              <ul className="space-y-2">
                {result.insights?.map((insight, i) => (
                  <li key={i} className="text-sm text-ink-600 dark:text-ink-300 flex gap-2">
                    <span className="text-brand-500">•</span> {insight}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" icon={<Presentation className="h-4 w-4" />}>
                Export as PowerPoint
              </Button>
              <Button variant="outline" className="flex-1" icon={<FileDown className="h-4 w-4" />}>
                Export as PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
