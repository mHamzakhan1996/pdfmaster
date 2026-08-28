import { NextRequest, NextResponse } from "next/server";
import { extractPages } from "@/lib/pdf/operations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const pagesParam = (formData.get("pages") as string) ?? ""; // e.g. "1,3,5-7"
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  const pageNumbers = parsePageRanges(pagesParam);

  try {
    const buffer = await file.arrayBuffer();
    const extracted = await extractPages(buffer, pageNumbers);
    return new NextResponse(Buffer.from(extracted), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="extracted.pdf"' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Extract failed", detail: err.message }, { status: 500 });
  }
}

function parsePageRanges(input: string): number[] {
  const pages = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) pages.add(i);
    } else {
      pages.add(Number(part));
    }
  }
  return Array.from(pages);
}
