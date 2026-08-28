"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Bot, User, Loader2, FileText } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { Card } from "@/components/ui/Card";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import { extractTextFromPdf } from "@/lib/extractText";
import { ChatMessage } from "@/types";
import { v4 as uuid } from "uuid";

export default function ChatPage() {
  const search = useSearchParams();
  const documents = useDocumentStore((s) => s.documents);
  const docId = search.get("doc");
  const activeDoc = documents.find((d) => d.id === docId) || documents[documents.length - 1];

  const [documentText, setDocumentText] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeDoc?.file) return;
    setExtracting(true);
    setDocumentText(null);
    setMessages([]);
    extractTextFromPdf(activeDoc.file)
      .then(({ text, pageCount }) => {
        setDocumentText(text);
        setMessages([
          {
            id: uuid(),
            role: "assistant",
            content: `I've read "${activeDoc.fileName}" (${pageCount} pages). Ask me anything about it — main findings, summaries, specific numbers, whatever you need.`,
            createdAt: new Date().toISOString(),
          },
        ]);
      })
      .catch(() =>
        setMessages([
          {
            id: uuid(),
            role: "assistant",
            content: "I couldn't extract text from this file client-side. Try a text-based PDF, or use the server upload pipeline.",
            createdAt: new Date().toISOString(),
          },
        ])
      )
      .finally(() => setExtracting(false));
  }, [activeDoc?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send() {
    if (!input.trim() || !documentText) return;
    const question = input.trim();
    setInput("");
    const userMsg: ChatMessage = { id: uuid(), role: "user", content: question, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: activeDoc?.id,
          question,
          documentText,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const answer = res.ok ? data.answer : `Error: ${data.error || "AI request failed"}`;
      setMessages((m) => [...m, { id: uuid(), role: "assistant", content: answer, createdAt: new Date().toISOString() }]);
    } catch {
      setMessages((m) => [...m, { id: uuid(), role: "assistant", content: "Network error — please try again.", createdAt: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Topbar title="AI Assistant" />
      <div className="p-6 max-w-3xl mx-auto">
        {!activeDoc && (
          <div>
            <p className="text-sm font-medium mb-3">Upload a document to start chatting</p>
            <UploadZone />
          </div>
        )}

        {activeDoc && (
          <Card className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-ink-100 dark:border-ink-800">
              <FileText className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium truncate">{activeDoc.fileName}</span>
              {extracting && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400 ml-auto" />}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-ink-900 dark:bg-white" : "bg-brand-500"}`}>
                    {m.role === "user" ? <User className="h-4 w-4 text-white dark:text-ink-900" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-brand-500 text-white rounded-tr-sm"
                        : "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-ink-100 dark:bg-ink-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-2 rounded-xl border border-ink-200 dark:border-ink-700 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                  disabled={extracting || !documentText}
                  placeholder={extracting ? "Reading document..." : "Ask a question about this document..."}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400 disabled:opacity-50"
                />
                <button onClick={send} disabled={sending || !input.trim()} className="text-brand-500 disabled:opacity-40">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
