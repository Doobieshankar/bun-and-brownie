"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-8">
      <div className="w-full max-w-md">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
          Bun & Brownie
        </p>
        <h1 className="mt-3 font-display text-[2.5rem] leading-none font-semibold tracking-[-0.04em]">
          Admin login
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Edit menu items, prices, images, and this week&apos;s combo.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-ink/10 bg-surface-2 p-5 sm:p-6"
        >
          <label className="block min-w-0">
            <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-ink/15 bg-surface px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-accent/40"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <button type="submit" className="bb-btn w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
