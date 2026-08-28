import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatWithDocument } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/chat
 * Body: { documentId: string, question: string, history?: {role, content}[] }
 * Answers a question grounded in the uploaded document's extracted text.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { documentId, question, documentText, history } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (!documentText) {
    return NextResponse.json({ error: "documentText is required (pass extracted text for this document)" }, { status: 400 });
  }

  // --- Enforce AI request usage limits for Free plan ---
  // const usage = await checkAndIncrementUsage(user.id, "aiRequests");
  // if (!usage.allowed) return NextResponse.json({ error: "Daily AI request limit reached." }, { status: 429 });

  try {
    const answer = await chatWithDocument({ question, documentText, history });

    // Persist to ChatSession/ChatMessage via Prisma in production:
    // await prisma.chatMessage.createMany({ data: [
    //   { sessionId, role: "user", content: question },
    //   { sessionId, role: "assistant", content: answer },
    // ]});

    return NextResponse.json({ answer, documentId });
  } catch (err: any) {
    console.error("chat error", err);
    return NextResponse.json({ error: "AI request failed. Check OPENAI_API_KEY." }, { status: 500 });
  }
}
