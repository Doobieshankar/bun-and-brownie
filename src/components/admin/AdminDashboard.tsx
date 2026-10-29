"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ComboContent, MenuItem } from "@/lib/content";

type Props = {
  initialProducts: MenuItem[];
  initialCombo: ComboContent;
  dbReady: boolean;
};

type ProductForm = {
  id?: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

export function AdminDashboard({
  initialProducts,
  initialCombo,
  dbReady,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [combo, setCombo] = useState(initialCombo);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"product" | "combo" | null>(null);

  const sorted = useMemo(
    () =>
      [...products].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.id ?? 0) - (b.id ?? 0),
      ),
    [products],
  );

  function flash(ok: string) {
    setMessage(ok);
    setError("");
  }

  function fail(err: string) {
    setError(err);
    setMessage("");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function uploadFile(file: File, target: "product" | "combo") {
    setUploading(target);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data.url as string;
    } finally {
      setUploading(null);
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!dbReady) return fail("Database is not configured");
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        imageUrl: form.imageUrl || null,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };
      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      const saved: MenuItem = {
        id: data.product.id,
        name: data.product.name,
        slug: data.product.slug,
        description: data.product.description,
        price: data.product.price,
        imageUrl: data.product.imageUrl,
        sortOrder: data.product.sortOrder,
        isActive: data.product.isActive,
      };

      setProducts((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? saved : item));
        }
        return [...prev, saved];
      });
      setForm(emptyProduct);
      setEditingId(null);
      flash(editingId ? "Product updated" : "Product created");
      router.refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id ?? null);
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl ?? "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive !== false,
    });
  }

  async function removeProduct(id?: number) {
    if (!id || !confirm("Delete this product?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setProducts((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyProduct);
      }
      flash("Product deleted");
      router.refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function moveProduct(id: number | undefined, direction: -1 | 1) {
    if (!id) return;
    const current = sorted;
    const index = current.findIndex((item) => item.id === id);
    const swapWith = index + direction;
    if (index < 0 || swapWith < 0 || swapWith >= current.length) return;
    const next = [...current];
    const tmp = next[index];
    next[index] = next[swapWith];
    next[swapWith] = tmp;
    const orderedIds = next.map((item) => item.id!).filter(Boolean);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reorder failed");
      setProducts(
        next.map((item, sortOrder) => ({
          ...item,
          sortOrder,
        })),
      );
      flash("Order updated");
      router.refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(item: MenuItem) {
    if (!item.id) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setProducts((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isActive: data.product.isActive } : row,
        ),
      );
      flash("Visibility updated");
      router.refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveCombo(event: FormEvent) {
    event.preventDefault();
    if (!dbReady) return fail("Database is not configured");
    setBusy(true);
    try {
      const res = await fetch("/api/combo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Combo save failed");
      setCombo(data.combo);
      flash("Combo updated");
      router.refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : "Combo save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
            Bun & Brownie
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">
            Content admin
          </h1>
          <p className="mt-2 max-w-[48ch] text-sm text-ink-soft">
            Edit popular menu products and the featured combo shown on the
            homepage.
          </p>
          {!dbReady ? (
            <p className="mt-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
              DATABASE_URL is missing. Set Neon + Cloudinary env vars to enable
              saving.
            </p>
          ) : null}
        </div>
        <button type="button" className="bb-btn-glow" onClick={logout}>
          <span className="bb-btn-glow__inner">Log out</span>
        </button>
      </header>

      {(message || error) && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            error ? "bg-accent/15 text-ink" : "bg-ink/5 text-ink"
          }`}
        >
          {error || message}
        </p>
      )}

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Popular menu
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Add images, prices, and short descriptions. Inactive items stay
            hidden on the site.
          </p>
        </div>

        <form
          onSubmit={saveProduct}
          className="grid gap-4 rounded-2xl border border-ink/10 bg-surface-2 p-5 md:grid-cols-2"
        >
          <label className="block md:col-span-1">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Name
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Price
            </span>
            <input
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              placeholder="₹50"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="min-h-24 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Image
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadFile(file, "product");
                    setForm((f) => ({ ...f, imageUrl: url }));
                    flash("Image uploaded");
                  } catch (err) {
                    fail(err instanceof Error ? err.message : "Upload failed");
                  }
                }}
              />
              {uploading === "product" ? (
                <span className="text-sm text-muted">Uploading…</span>
              ) : null}
            </div>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              placeholder="/images/combo-tin.jpg or https://…"
            />
            {form.imageUrl ? (
              <div className="relative mt-3 h-28 w-28 overflow-hidden rounded-xl">
                <Image
                  src={form.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
            />
            Active on homepage
          </label>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button type="submit" className="bb-btn" disabled={busy || !dbReady}>
              {editingId ? "Update product" : "Add product"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="bb-btn-glow"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyProduct);
                }}
              >
                <span className="bb-btn-glow__inner">Cancel edit</span>
              </button>
            ) : null}
          </div>
        </form>

        <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-surface">
          {sorted.map((item, index) => (
            <li
              key={item.id ?? item.slug ?? item.name}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-semibold tracking-[-0.03em]">
                  {item.name}
                </p>
                <p className="text-sm text-ink-soft">{item.description}</p>
                <p className="mt-1 text-sm font-semibold">{item.price}</p>
                <p className="mt-1 text-xs tracking-[0.12em] text-muted uppercase">
                  {item.isActive === false ? "Hidden" : "Visible"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase"
                  onClick={() => moveProduct(item.id, -1)}
                  disabled={index === 0 || busy}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase"
                  onClick={() => moveProduct(item.id, 1)}
                  disabled={index === sorted.length - 1 || busy}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase"
                  onClick={() => toggleActive(item)}
                  disabled={busy || !item.id}
                >
                  {item.isActive === false ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-full border border-accent/40 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-accent uppercase"
                  onClick={() => removeProduct(item.id)}
                  disabled={busy || !item.id}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Featured combo
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Controls the “Two treats / One perfect tin” section on the homepage.
          </p>
        </div>

        <form
          onSubmit={saveCombo}
          className="grid gap-4 rounded-2xl border border-ink/10 bg-surface-2 p-5 md:grid-cols-2"
        >
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Eyebrow
            </span>
            <input
              value={combo.eyebrow}
              onChange={(e) =>
                setCombo((c) => ({ ...c, eyebrow: e.target.value }))
              }
              className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Price
            </span>
            <input
              value={combo.price}
              onChange={(e) => setCombo((c) => ({ ...c, price: e.target.value }))}
              className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Headline
            </span>
            <textarea
              value={combo.headline}
              onChange={(e) =>
                setCombo((c) => ({ ...c, headline: e.target.value }))
              }
              className="min-h-20 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Title
            </span>
            <input
              value={combo.title}
              onChange={(e) => setCombo((c) => ({ ...c, title: e.target.value }))}
              className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Note
            </span>
            <input
              value={combo.note}
              onChange={(e) => setCombo((c) => ({ ...c, note: e.target.value }))}
              className="w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              WhatsApp message
            </span>
            <textarea
              value={combo.whatsappText}
              onChange={(e) =>
                setCombo((c) => ({ ...c, whatsappText: e.target.value }))
              }
              className="min-h-20 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadFile(file, "combo");
                  setCombo((c) => ({ ...c, imageUrl: url }));
                  flash("Combo image uploaded");
                } catch (err) {
                  fail(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
            {uploading === "combo" ? (
              <span className="mt-2 block text-sm text-muted">Uploading…</span>
            ) : null}
            {combo.imageUrl ? (
              <div className="relative mt-3 aspect-[5/4] max-w-md overflow-hidden rounded-2xl">
                <Image
                  src={combo.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="bb-btn" disabled={busy || !dbReady}>
              Save combo
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
