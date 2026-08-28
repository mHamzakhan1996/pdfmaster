import { NextRequest, NextResponse } from "next/server";
import { rotatePages } from "@/lib/pdf/operations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const angle = Number(formData.get("angle") ?? 90) as 90 | 180 | 270;
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  try {
    const buffer = await file.arrayBuffer();
    const rotated = await rotatePages(buffer, angle);
    return new NextResponse(Buffer.from(rotated), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="rotated.pdf"' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Rotate failed", detail: err.message }, { status: 500 });
  }
}
