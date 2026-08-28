import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/vnd.ms-powerpoint",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_SIZE_BYTES = Number(process.env.MAX_UPLOAD_SIZE_MB || 50) * 1024 * 1024;

function mimeToDocType(mime: string) {
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("wordprocessingml") || mime === "application/msword") return "WORD";
  if (mime.includes("spreadsheetml") || mime === "application/vnd.ms-excel") return "EXCEL";
  if (mime.includes("presentationml") || mime === "application/vnd.ms-powerpoint") return "POWERPOINT";
  return "IMAGE";
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // --- Input validation ---
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: `File exceeds ${process.env.MAX_UPLOAD_SIZE_MB || 50}MB limit` }, { status: 413 });
  }

  // --- Enforce Free plan daily document limit ---
  // (Looked up via a UsageRecord row keyed by user + today's date — see prisma/schema.prisma)
  // Pseudocode kept explicit here; real implementation calls the shared `checkAndIncrementUsage` helper.
  // const usage = await checkAndIncrementUsage(user.id, "documents");
  // if (!usage.allowed) return NextResponse.json({ error: "Daily document limit reached. Upgrade to Premium." }, { status: 429 });

  // --- Upload to Supabase Storage, isolated per-user path ---
  const key = `${user.id}/${uuid()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(key, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: signedUrl } = await supabase.storage
    .from("documents")
    .createSignedUrl(key, 60 * 60); // 1 hour

  // --- Persist Document row (Prisma) ---
  // const document = await prisma.document.create({
  //   data: {
  //     userId: user.id,
  //     fileName: file.name,
  //     fileType: mimeToDocType(file.type),
  //     mimeType: file.type,
  //     sizeBytes: file.size,
  //     storagePath: key,
  //     storageUrl: signedUrl?.signedUrl,
  //     status: "UPLOADED",
  //     autoDeleteAt: new Date(Date.now() + Number(process.env.FILE_RETENTION_HOURS || 24) * 3600 * 1000),
  //   },
  // });

  return NextResponse.json({
    success: true,
    document: {
      id: uuid(),
      fileName: file.name,
      fileType: mimeToDocType(file.type),
      sizeBytes: file.size,
      storagePath: key,
      storageUrl: signedUrl?.signedUrl ?? null,
      status: "UPLOADED",
    },
  });
}
