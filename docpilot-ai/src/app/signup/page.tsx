"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileStack, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-center">Create your account</h1>
          <p className="text-center text-sm text-ink-500 dark:text-ink-400 mt-1.5 mb-6">
            5 free documents every day. No credit card required.
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-sm px-3 py-2.5">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-300 text-sm px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> Account created! Redirecting…
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={handleGoogle} loading={googleLoading}>
            {!googleLoading && <GoogleIcon />} Sign up with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" /> OR <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                required value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="At least 8 characters"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>Create account</Button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-center text-sm text-ink-500 dark:text-ink-400 mt-3">
            Already have an account? <Link href="/login" className="text-brand-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
