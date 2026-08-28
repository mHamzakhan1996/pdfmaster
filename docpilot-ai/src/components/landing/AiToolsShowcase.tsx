"use client";

import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AiToolsShowcase() {
  return (
    <section id="ai-tools" className="py-24 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900/30">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-sm font-semibold text-brand-500">AI ASSISTANT</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
            Ask your documents anything
          </h2>
          <p className="mt-4 text-ink-500 dark:text-ink-400 leading-relaxed">
            Upload a 100-page report and ask "What are the main findings?" — DocPilot AI reads the
            entire document and answers grounded in your actual content, with page references.
            No more skimming, no more ctrl+F.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-600 dark:text-ink-300">
            <li>• Works across PDF, Word, Excel and PowerPoint</li>
            <li>• Multi-turn conversation with memory of prior questions</li>
            <li>• Summaries, key points, and follow-up Q&A in one thread</li>
          </ul>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-ink-100 dark:border-ink-800 mb-4">
              <div className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">DocPilot Assistant — Q3_Financial_Report.pdf</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="ml-auto max-w-[80%] bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
                Give me the main findings from this report
              </div>
              <div className="max-w-[85%] bg-ink-100 dark:bg-ink-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-ink-700 dark:text-ink-200">
                Based on the report: (1) Revenue grew 18% YoY driven by APAC expansion (p.4),
                (2) Gross margin improved to 62% from cost optimization (p.9), (3) Customer
                churn dropped to 3.1%, the lowest in 6 quarters (p.14). Want the full breakdown?
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-ink-200 dark:border-ink-700 px-3 py-2">
              <input
                disabled
                placeholder="Ask a follow-up question..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
              />
              <Send className="h-4 w-4 text-brand-500" />
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
