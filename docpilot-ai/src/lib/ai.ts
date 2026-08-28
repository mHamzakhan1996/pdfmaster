/**
 * DocPilot AI — AI layer
 * Wraps OpenAI (default) with all document-intelligence features.
 * Swap to Gemini by implementing the same functions against @google/generative-ai
 * and toggling AI_PROVIDER in .env — the route handlers only call these exports.
 */

import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Lazily instantiated so that importing this module (e.g. during `next build`'s
// route data collection) never throws just because OPENAI_API_KEY isn't set yet.
// The clear error is instead surfaced the moment an AI route actually runs.
let _client: OpenAI | null = null;
function client(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not configured. Add it to your environment variables to enable AI features."
      );
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

/** Chat with a document: retrieval-augmented answer grounded in extracted text. */
export async function chatWithDocument(params: {
  question: string;
  documentText: string;
  history?: { role: "user" | "assistant"; content: string }[];
}) {
  const { question, documentText, history = [] } = params;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are DocPilot AI's document assistant. Answer strictly using the provided document context. " +
        "If the answer isn't in the document, say so clearly. Cite page numbers when available.",
    },
    { role: "system", content: `DOCUMENT CONTEXT:\n\n${truncate(documentText, 120_000)}` },
    ...history,
    { role: "user", content: question },
  ];

  const completion = await client().chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function summarizeDocument(text: string, length: "short" | "medium" | "long" = "medium") {
  const targetWords = { short: 120, medium: 300, long: 600 }[length];
  return runPrompt(
    `Summarize the following document in approximately ${targetWords} words. Focus on the main findings, arguments, and conclusions.\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function translateDocument(text: string, targetLanguage: string) {
  return runPrompt(
    `Translate the following document into ${targetLanguage}. Preserve structure, headings, and tone.\n\nDOCUMENT:\n${truncate(text, 60_000)}`
  );
}

export async function rewriteProfessionally(text: string, tone: "formal" | "concise" | "persuasive" = "formal") {
  return runPrompt(
    `Rewrite the following content in a professional, ${tone} tone. Improve clarity and grammar without changing the meaning.\n\nCONTENT:\n${truncate(text, 60_000)}`
  );
}

export async function extractKeyPoints(text: string) {
  return runPrompt(
    `Extract the key points from this document as a concise bulleted list (max 15 bullets).\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function generateReport(text: string) {
  return runPrompt(
    `Turn the following document into a structured executive report with sections: ` +
      `Executive Summary, Key Findings, Data Highlights, Recommendations, Conclusion.\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function generatePresentationOutline(text: string) {
  return runJsonPrompt<{ slides: { title: string; bullets: string[] }[] }>(
    `Convert this document into a slide-by-slide presentation outline (8-12 slides). ` +
      `Return strict JSON: {"slides":[{"title":"...","bullets":["...","..."]}]}\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function generateFAQs(text: string) {
  return runJsonPrompt<{ faqs: { question: string; answer: string }[] }>(
    `Generate 8-10 frequently asked questions with answers based on this document. ` +
      `Return strict JSON: {"faqs":[{"question":"...","answer":"..."}]}\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function generateQuiz(text: string, numQuestions = 10) {
  return runJsonPrompt<{
    questions: { question: string; options: string[]; correctIndex: number }[];
  }>(
    `Generate a ${numQuestions}-question multiple-choice quiz based on this document. Each question has 4 options. ` +
      `Return strict JSON: {"questions":[{"question":"...","options":["a","b","c","d"],"correctIndex":0}]}\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function extractTablesAndData(text: string) {
  return runJsonPrompt<{ tables: { title: string; headers: string[]; rows: string[][] }[] }>(
    `Identify tabular/numeric data in this document and structure it. ` +
      `Return strict JSON: {"tables":[{"title":"...","headers":["..."],"rows":[["..."]]}]}\n\nDOCUMENT:\n${truncate(text, 100_000)}`
  );
}

export async function generateSpreadsheetInsights(sheetSummary: string) {
  return runJsonPrompt<{
    kpis: { label: string; value: string; trend?: string }[];
    insights: string[];
    executiveSummary: string;
  }>(
    `You are a data analyst. Given this summary of a spreadsheet's contents (headers + sample rows + column stats), ` +
      `produce KPI cards, insights, and an executive summary. ` +
      `Return strict JSON: {"kpis":[{"label":"...","value":"...","trend":"up|down|flat"}],"insights":["..."],"executiveSummary":"..."}\n\nSHEET SUMMARY:\n${truncate(sheetSummary, 60_000)}`
  );
}

// ---------------- internal helpers ----------------

async function runPrompt(prompt: string): Promise<string> {
  const completion = await client().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "You are DocPilot AI, a precise and helpful document intelligence assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function runJsonPrompt<T>(prompt: string): Promise<T> {
  const completion = await client().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are DocPilot AI. Always respond with valid JSON only, no markdown fences." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });
  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as T;
}

function truncate(text: string, maxChars: number) {
  return text.length > maxChars ? text.slice(0, maxChars) + "\n...[truncated]" : text;
}
