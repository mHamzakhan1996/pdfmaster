import { NextRequest, NextResponse } from "next/server";
import { mergePdfs } from "@/lib/pdf/operations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (files.length < 2) {
    return NextResponse.json({ error: "Provide at least 2 PDF files to merge" }, { status: 400 });
  }

  try {
    const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
    const merged = await mergePdfs(buffers);
    return new NextResponse(Buffer.from(merged), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Merge failed", detail: err.message }, { status: 500 });
  }
}
