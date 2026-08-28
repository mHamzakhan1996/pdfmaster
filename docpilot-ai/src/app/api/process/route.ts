import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  summarizeDocument,
  translateDocument,
  rewriteProfessionally,
  extractKeyPoints,
  generateReport,
  generatePresentationOutline,
  generateFAQs,
  generateQuiz,
  extractTablesAndData,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 120;

type AiTool =
  | "SUMMARIZE"
  | "TRANSLATE"
  | "REWRITE"
  | "EXTRACT_KEY_POINTS"
  | "GENERATE_REPORT"
  | "GENERATE_PRESENTATION"
  | "GENERATE_FAQS"
  | "GENERATE_QUIZ"
  | "EXTRACT_TABLES";

/**
 * POST /api/process
 * Body: { tool: AiTool, documentText: string, options?: Record<string, any> }
 * Single dispatch endpoint for every AI document tool in the dashboard.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tool, documentText, options = {} }: { tool: AiTool; documentText: string; options?: any } = await req.json();

  if (!documentText) {
    return NextResponse.json({ error: "documentText is required" }, { status: 400 });
  }

  try {
    let result: unknown;

    switch (tool) {
      case "SUMMARIZE":
        result = await summarizeDocument(documentText, options.length ?? "medium");
        break;
      case "TRANSLATE":
        result = await translateDocument(documentText, options.targetLanguage ?? "English");
        break;
      case "REWRITE":
        result = await rewriteProfessionally(documentText, options.tone ?? "formal");
        break;
      case "EXTRACT_KEY_POINTS":
        result = await extractKeyPoints(documentText);
        break;
      case "GENERATE_REPORT":
        result = await generateReport(documentText);
        break;
      case "GENERATE_PRESENTATION":
        result = await generatePresentationOutline(documentText);
        break;
      case "GENERATE_FAQS":
        result = await generateFAQs(documentText);
        break;
      case "GENERATE_QUIZ":
        result = await generateQuiz(documentText, options.numQuestions ?? 10);
        break;
      case "EXTRACT_TABLES":
        result = await extractTablesAndData(documentText);
        break;
      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
    }

    // Persist a Job row via Prisma in production (status SUCCEEDED, resultText/resultUrl, completedAt, etc.)

    return NextResponse.json({ success: true, tool, result });
  } catch (err: any) {
    console.error("process error", err);
    return NextResponse.json({ error: "Processing failed", detail: err.message }, { status: 500 });
  }
}
