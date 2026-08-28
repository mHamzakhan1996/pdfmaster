import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { generateSpreadsheetInsights } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/reports/generate
 * Accepts an uploaded Excel file, parses it, and returns
 * AI-generated KPIs, insights, an executive summary, and
 * chart-ready series data for the dashboard's Report Generator.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (rows.length === 0) {
      return NextResponse.json({ error: "Sheet appears to be empty" }, { status: 400 });
    }

    const headers = Object.keys(rows[0]);
    const numericColumns = headers.filter((h) => typeof rows[0][h] === "number");

    // Build lightweight column stats to keep the AI prompt small
    const columnStats = numericColumns.map((col) => {
      const values = rows.map((r) => Number(r[col])).filter((v) => !Number.isNaN(v));
      const sum = values.reduce((a, b) => a + b, 0);
      return {
        column: col,
        count: values.length,
        sum: Number(sum.toFixed(2)),
        avg: Number((sum / (values.length || 1)).toFixed(2)),
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    const sheetSummary = JSON.stringify(
      { headers, sampleRows: rows.slice(0, 10), columnStats, totalRows: rows.length },
      null,
      2
    );

    const insights = await generateSpreadsheetInsights(sheetSummary);

    // Chart-ready series: first numeric column trended across rows
    const chartData =
      numericColumns.length > 0
        ? rows.slice(0, 50).map((r, i) => ({ index: i + 1, value: Number(r[numericColumns[0]]) || 0 }))
        : [];

    return NextResponse.json({
      success: true,
      sheetName: firstSheetName,
      rowCount: rows.length,
      headers,
      numericColumns,
      columnStats,
      chartData,
      ...insights, // { kpis, insights, executiveSummary }
    });
  } catch (err: any) {
    console.error("report generation error", err);
    return NextResponse.json({ error: "Report generation failed", detail: err.message }, { status: 500 });
  }
}
