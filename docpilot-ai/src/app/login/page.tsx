"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileStack, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(searchParams.get("redirectedFrom") || "/dashboard");
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success, Supabase redirects the browser automatically.
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-ink-50 dark:bg-ink-950">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center font-display font-bold text-xl mb-8">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <FileStack className="h-5 w-5 text-white" />
          </div>
          DocPilot <span className="text-brand-500">AI</span>
        </Link>

        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-card p-8">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-center text-sm text-ink-500 dark:text-ink-400 mt-1.5 mb-6">
            Log in to continue to your dashboard
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-sm px-3 py-2.5">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={handleGoogle} loading={googleLoading}>
            {!googleLoading && <GoogleIcon />} Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" /> OR <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-brand-500 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>Log in</Button>
          </form>

          <p className="text-center text-sm text-ink-500 dark:text-ink-400 mt-6">
            Don't have an account? <Link href="/signup" className="text-brand-500 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
