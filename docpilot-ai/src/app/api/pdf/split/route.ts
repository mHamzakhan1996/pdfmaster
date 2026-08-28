import { NextRequest, NextResponse } from "next/server";
import { splitPdf } from "@/lib/pdf/operations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  try {
    const buffer = await file.arrayBuffer();
    const parts = await splitPdf(buffer);
    // Return as base64 array; client zips them or downloads individually
    const payload = parts.map((p, i) => ({
      page: i + 1,
      base64: Buffer.from(p).toString("base64"),
    }));
    return NextResponse.json({ success: true, pages: payload.length, files: payload });
  } catch (err: any) {
    return NextResponse.json({ error: "Split failed", detail: err.message }, { status: 500 });
  }
}
