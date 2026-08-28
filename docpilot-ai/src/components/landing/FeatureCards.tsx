"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText, FileStack, Scissors, Shrink, RefreshCcw,
  Languages, Sparkles, Presentation, HelpCircle, Table2, FileSearch, ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  { icon: MessageSquareText, title: "Chat with your PDF", desc: "Ask questions about any document and get answers grounded in the actual content, with page citations." },
  { icon: FileStack, title: "Merge & Split PDFs", desc: "Combine multiple files into one, or split large PDFs into individual pages in seconds." },
  { icon: Shrink, title: "Smart Compression", desc: "Shrink file sizes dramatically while preserving text and image quality." },
  { icon: RefreshCcw, title: "Universal Conversion", desc: "Convert freely between PDF, Word, Excel and PowerPoint without losing formatting." },
  { icon: Sparkles, title: "AI Summaries", desc: "Turn 100-page reports into a crisp executive summary in one click." },
  { icon: Languages, title: "Instant Translation", desc: "Translate entire documents into 50+ languages while preserving structure." },
  { icon: Presentation, title: "Doc → Slides", desc: "Generate a polished PowerPoint outline automatically from any report or PDF." },
  { icon: HelpCircle, title: "FAQs & Quizzes", desc: "Auto-generate FAQs or multiple-choice quizzes from training material and docs." },
  { icon: Table2, title: "Table Extraction", desc: "Pull structured tables and numeric data out of PDFs straight into usable data." },
  { icon: FileSearch, title: "Key Point Extraction", desc: "Get the bullet-point essentials from long, dense documents instantly." },
  { icon: Scissors, title: "Watermarks & Pages", desc: "Add or remove watermarks, rotate pages, or extract specific page ranges." },
  { icon: ShieldCheck, title: "Private by Design", desc: "Per-user isolated storage, encrypted uploads, and optional auto-delete after processing." },
];

export function FeatureCards() {
  return (
    <section id="features" className="py-24 border-t border-ink-100 dark:border-ink-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Everything you need, in one workspace</h2>
          <p className="mt-4 text-ink-500 dark:text-ink-400">
            Traditional PDF tools stop at conversion. DocPilot AI understands your documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.06 }}
            >
              <Card className="p-6 h-full hover:-translate-y-1 hover:shadow-glow transition-all duration-300">
                <div className="h-11 w-11 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
