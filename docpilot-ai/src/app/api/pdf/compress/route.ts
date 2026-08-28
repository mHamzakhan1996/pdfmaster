import { NextRequest, NextResponse } from "next/server";
import { compressPdf } from "@/lib/pdf/operations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  try {
    const buffer = await file.arrayBuffer();
    const compressed = await compressPdf(buffer);
    const originalKB = (buffer.byteLength / 1024).toFixed(1);
    const compressedKB = (compressed.byteLength / 1024).toFixed(1);

    return new NextResponse(Buffer.from(compressed), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
        "X-Original-Size-KB": originalKB,
        "X-Compressed-Size-KB": compressedKB,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Compression failed", detail: err.message }, { status: 500 });
  }
}
