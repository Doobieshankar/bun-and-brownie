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
    <div className="mx-auto mt-16 max-w-md">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
        Bun & Brownie
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
        Admin login
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        Edit menu items, prices, images, and this week&apos;s combo.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-surface-2 px-4 py-3 text-base outline-none ring-accent focus:ring-2"
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
  );
}
