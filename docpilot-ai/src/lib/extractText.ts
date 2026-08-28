"use client";

/**
 * Extracts plain text from a PDF File entirely in the browser using pdfjs-dist.
 * This text is then sent to /api/process or /api/chat as the grounding context
 * for AI features (summarize, chat, translate, etc.) without uploading the
 * raw file to a third party beyond the configured AI provider.
 */
export async function extractTextFromPdf(file: File): Promise<{ text: string; pageCount: number }> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += `\n\n[Page ${i}]\n${pageText}`;
  }

  return { text, pageCount: pdf.numPages };
}

/** Extracts text from a .docx file in the browser using mammoth. */
export async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}
