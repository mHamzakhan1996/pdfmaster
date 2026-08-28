"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, Sparkles, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setFileName(accepted[0].name);
        // Stash the file reference for the dashboard to pick up post-auth
        sessionStorage.setItem("docpilot_pending_upload", accepted[0].name);
        setTimeout(() => router.push("/signup?upload=1"), 700);
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <section className="relative overflow-hidden pt-20 pb-28">
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Powered by GPT-4o & Gemini
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Transform Documents
          <br />
          <span className="text-gradient">with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg text-ink-500 dark:text-ink-400 max-w-2xl mx-auto"
        >
          Merge, split, compress, convert — then chat with, summarize, translate and turn
          your PDFs, Word, Excel & PowerPoint files into reports and slides. All in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <div
            {...getRootProps()}
            className={`group w-full max-w-xl cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all ${
              isDragActive
                ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                : "border-ink-200 dark:border-ink-700 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/20"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              {fileName ? (
                <>
                  <FileText className="h-10 w-10 text-brand-500" />
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-ink-400">Redirecting to sign up to continue…</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-ink-400 group-hover:text-brand-500 transition-colors" />
                  <p className="font-medium">Drop a document, or click to upload</p>
                  <p className="text-sm text-ink-400">PDF, Word, Excel, PowerPoint, Images — up to 50MB</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push("/signup")}>
              Get started free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("#pricing")}>
              View pricing
            </Button>
          </div>
          <p className="text-xs text-ink-400">No credit card required · 5 free documents every day</p>
        </motion.div>
      </div>
    </section>
  );
}
