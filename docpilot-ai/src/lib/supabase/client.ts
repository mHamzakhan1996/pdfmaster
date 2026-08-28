"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Used inside Client Components (auth forms, dashboard UI, realtime updates).
 *
 * Falls back to harmless placeholder values when NEXT_PUBLIC_SUPABASE_* env vars
 * are absent (e.g. during `next build` before secrets are configured, or in preview
 * environments without Supabase set up). This keeps builds and static analysis from
 * hard-failing; real auth calls will simply fail gracefully at runtime with a clear
 * "Invalid API key" error until real credentials are added to .env.local.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (typeof window !== "undefined") {
      console.warn(
        "[DocPilot AI] Supabase env vars are not set. Auth will not work until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured."
      );
    }
  }

  return createBrowserClient(url, key);
}
