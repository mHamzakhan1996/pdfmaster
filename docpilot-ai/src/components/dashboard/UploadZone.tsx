"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { useDocumentStore } from "@/hooks/useDocumentStore";

const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

export function UploadZone({ onUploaded }: { onUploaded?: (id: string) => void }) {
  const addDocument = useDocumentStore((s) => s.addDocument);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;
      setUploading(true);
      for (const file of accepted) {
        const doc = addDocument(file);
        onUploaded?.(doc.id);
      }
      setUploading(false);
    },
    [addDocument, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ACCEPT, multiple: true });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
        isDragActive
          ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
          : "border-ink-200 dark:border-ink-700 hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-950/20"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
          <UploadCloud className="h-6 w-6 text-brand-500" />
        </div>
        <p className="font-medium">{uploading ? "Uploading..." : "Drop files here, or click to browse"}</p>
        <p className="text-sm text-ink-400">PDF, Word, Excel, PowerPoint, Images — up to 50MB each</p>
      </div>
    </div>
  );
}
