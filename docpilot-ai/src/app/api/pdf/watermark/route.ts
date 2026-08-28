import { NextRequest, NextResponse } from "next/server";
import { addWatermark, removeWatermarkHeuristic } from "@/lib/pdf/operations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const mode = (formData.get("mode") as string) ?? "add"; // "add" | "remove"
  const text = (formData.get("text") as string) ?? "DocPilot AI";
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  try {
    const buffer = await file.arrayBuffer();
    const output = mode === "remove" ? await removeWatermarkHeuristic(buffer) : await addWatermark(buffer, text);
    return new NextResponse(Buffer.from(output), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="watermarked.pdf"` },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Watermark operation failed", detail: err.message }, { status: 500 });
  }
}
