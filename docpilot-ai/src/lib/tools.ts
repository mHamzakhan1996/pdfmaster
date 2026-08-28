import { ToolDefinition } from "@/types";

export const PDF_TOOLS: ToolDefinition[] = [
  { id: "merge-pdf", category: "pdf", title: "Merge PDF", description: "Combine multiple PDFs into one file", icon: "FileStack", acceptTypes: ["PDF"], endpoint: "/api/pdf/merge" },
  { id: "split-pdf", category: "pdf", title: "Split PDF", description: "Break a PDF into individual pages", icon: "Scissors", acceptTypes: ["PDF"], endpoint: "/api/pdf/split" },
  { id: "compress-pdf", category: "pdf", title: "Compress PDF", description: "Reduce file size while keeping quality", icon: "Shrink", acceptTypes: ["PDF"], endpoint: "/api/pdf/compress" },
  { id: "pdf-to-word", category: "pdf", title: "PDF to Word", description: "Convert PDF into an editable .docx", icon: "FileOutput", acceptTypes: ["PDF"], endpoint: "/api/process" },
  { id: "word-to-pdf", category: "pdf", title: "Word to PDF", description: "Convert .docx documents into PDF", icon: "FileInput", acceptTypes: ["WORD"], endpoint: "/api/process" },
  { id: "excel-to-pdf", category: "pdf", title: "Excel to PDF", description: "Convert spreadsheets into PDF", icon: "Sheet", acceptTypes: ["EXCEL"], endpoint: "/api/process" },
  { id: "ppt-to-pdf", category: "pdf", title: "PPT to PDF", description: "Convert slide decks into PDF", icon: "Presentation", acceptTypes: ["POWERPOINT"], endpoint: "/api/process" },
  { id: "add-watermark", category: "pdf", title: "Add Watermark", description: "Stamp text watermarks on every page", icon: "Droplet", acceptTypes: ["PDF"], endpoint: "/api/pdf/watermark" },
  { id: "remove-watermark", category: "pdf", title: "Remove Watermark", description: "Strip existing watermarks from a PDF", icon: "DropletOff", acceptTypes: ["PDF"], endpoint: "/api/pdf/watermark" },
  { id: "rotate-pages", category: "pdf", title: "Rotate Pages", description: "Rotate pages 90°, 180° or 270°", icon: "RotateCw", acceptTypes: ["PDF"], endpoint: "/api/pdf/rotate" },
  { id: "extract-pages", category: "pdf", title: "Extract Pages", description: "Pull specific pages into a new PDF", icon: "FileSearch", acceptTypes: ["PDF"], endpoint: "/api/pdf/extract" },
];

export const AI_TOOLS: ToolDefinition[] = [
  { id: "chat-with-pdf", category: "ai", title: "Chat with PDF", description: "Ask questions, get grounded answers", icon: "MessageSquareText", acceptTypes: ["PDF", "WORD"], endpoint: "/api/chat" },
  { id: "summarize", category: "ai", title: "Summarize Document", description: "Get a concise executive summary", icon: "Sparkles", acceptTypes: ["PDF", "WORD", "IMAGE"], endpoint: "/api/process" },
  { id: "translate", category: "ai", title: "Translate Document", description: "Translate into 50+ languages", icon: "Languages", acceptTypes: ["PDF", "WORD"], endpoint: "/api/process" },
  { id: "rewrite", category: "ai", title: "Rewrite Professionally", description: "Polish tone, grammar & clarity", icon: "PenLine", acceptTypes: ["PDF", "WORD"], endpoint: "/api/process" },
  { id: "extract-key-points", category: "ai", title: "Extract Key Points", description: "Bullet-point the essentials", icon: "ListChecks", acceptTypes: ["PDF", "WORD"], endpoint: "/api/process" },
  { id: "generate-report", category: "ai", title: "Generate Report", description: "Structured executive report", icon: "FileBarChart", acceptTypes: ["PDF", "WORD", "EXCEL"], endpoint: "/api/process" },
  { id: "generate-presentation", category: "ai", title: "Generate Presentation", description: "Turn a doc into slide outlines", icon: "Presentation", acceptTypes: ["PDF", "WORD"], endpoint: "/api/process" },
  { id: "generate-faqs", category: "ai", title: "Generate FAQs", description: "Auto-build a FAQ from content", icon: "HelpCircle", acceptTypes: ["PDF", "WORD"], endpoint: "/api/process" },
  { id: "generate-quiz", category: "ai", title: "Generate Quiz", description: "Multiple-choice quiz from content", icon: "GraduationCap", acceptTypes: ["PDF", "WORD"], endpoint: "/api/process" },
  { id: "extract-tables", category: "ai", title: "Extract Tables & Data", description: "Pull structured tables out of docs", icon: "Table2", acceptTypes: ["PDF", "EXCEL"], endpoint: "/api/process" },
];

export const ALL_TOOLS = [...PDF_TOOLS, ...AI_TOOLS];

export function getToolById(id: string) {
  return ALL_TOOLS.find((t) => t.id === id);
}
