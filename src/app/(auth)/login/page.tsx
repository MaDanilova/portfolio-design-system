"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <div className="bg-surface-raised rounded-xl border border-border p-6">
        <h1 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-ink-secondary mb-6">
          Sign in to your account to continue.
        </p>

        {error && (
          <div className="mb-4">
            <Alert status="error" title="Sign in failed" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Spinner size="sm" />}
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>

      <p className="text-sm text-ink-muted text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-mist hover:text-mist-dim transition-colors duration-fast font-medium"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
