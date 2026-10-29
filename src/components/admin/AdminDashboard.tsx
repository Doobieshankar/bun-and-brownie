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

type Tab = "menu" | "combo";

const emptyProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

const fieldClass =
  "w-full min-w-0 rounded-xl border border-ink/15 bg-surface px-3.5 py-3 text-base text-ink outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/30";

const labelClass =
  "mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase";

const chipClass =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-ink/15 bg-surface px-3 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition active:scale-[0.98] disabled:opacity-40";

export function AdminDashboard({
  initialProducts,
  initialCombo,
  dbReady,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("menu");
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
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.id ?? 0) - (b.id ?? 0),
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="pb-10">
      <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-ink/10 bg-surface/95 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-0 md:-mx-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
              Bun & Brownie
            </p>
            <h1 className="truncate font-display text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              Content admin
            </h1>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-ink/20 bg-surface px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-ink uppercase"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      {!dbReady ? (
        <p className="mb-5 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
          DATABASE_URL is missing. Set Neon env vars to enable saving.
        </p>
      ) : null}

      {(message || error) && (
        <p
          className={`mb-5 rounded-2xl px-4 py-3 text-sm ${
            error ? "bg-accent/15 text-ink" : "bg-ink/5 text-ink"
          }`}
          role="status"
        >
          {error || message}
        </p>
      )}

      <div
        role="tablist"
        aria-label="Admin sections"
        className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1"
      >
        {(
          [
            { id: "menu", label: "Popular menu" },
            { id: "combo", label: "Featured combo" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold tracking-[-0.01em] transition ${
              tab === item.id
                ? "bg-ink text-on-ink shadow-sm"
                : "text-ink-soft"
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "menu" ? (
        <section className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
              {editingId ? "Edit product" : "Add product"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Photos, prices, and short descriptions. Hidden items stay off the
              homepage.
            </p>
          </div>

          <form
            onSubmit={saveProduct}
            className="grid max-w-full gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-surface-2 p-4 sm:p-5 md:grid-cols-2"
          >
            <label className="block min-w-0">
              <span className={labelClass}>Name</span>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className={fieldClass}
                required
              />
            </label>
            <label className="block min-w-0">
              <span className={labelClass}>Price</span>
              <input
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className={fieldClass}
                placeholder="₹50"
                required
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={labelClass}>Description</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className={`${fieldClass} min-h-24 resize-y`}
              />
            </label>
            <div className="min-w-0 space-y-3 md:col-span-2">
              <span className={labelClass}>Image</span>
              <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-ink/25 bg-surface px-4 text-sm font-semibold text-ink-soft">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(file, "product");
                      setForm((f) => ({ ...f, imageUrl: url }));
                      flash("Image uploaded");
                    } catch (err) {
                      fail(
                        err instanceof Error ? err.message : "Upload failed",
                      );
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
                {uploading === "product"
                  ? "Uploading…"
                  : "Tap to upload photo"}
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                className={fieldClass}
                placeholder="/images/combo-tin.jpg or https://…"
              />
              {form.imageUrl ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-xl">
                  <Image
                    src={form.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>
            <label className="flex min-h-11 items-center gap-3 text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="size-5 rounded border-ink/30"
              />
              Active on homepage
            </label>
            <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
              <button
                type="submit"
                className="bb-btn w-full sm:w-auto"
                disabled={busy || !dbReady}
              >
                {editingId ? "Update product" : "Add product"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="min-h-12 rounded-full border border-ink/20 px-5 text-xs font-semibold tracking-[0.14em] uppercase"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyProduct);
                  }}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>

          <div>
            <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">
              Current menu
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {sorted.length} item{sorted.length === 1 ? "" : "s"}
            </p>
          </div>

          <ul className="space-y-3">
            {sorted.map((item, index) => (
              <li
                key={item.id ?? item.slug ?? item.name}
                className="overflow-hidden rounded-2xl border border-ink/10 bg-surface"
              >
                <div className="flex gap-3 p-3 sm:p-4">
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
                      <div className="flex h-full items-center justify-center px-2 text-center text-[10px] tracking-[0.08em] text-muted uppercase">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-lg font-semibold leading-tight tracking-[-0.03em]">
                        {item.name}
                      </p>
                      <p className="shrink-0 font-display text-lg font-semibold">
                        {item.price}
                      </p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                      {item.description}
                    </p>
                    <p
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase ${
                        item.isActive === false
                          ? "bg-accent/15 text-accent"
                          : "bg-ink/5 text-muted"
                      }`}
                    >
                      {item.isActive === false ? "Hidden" : "Visible"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-ink/10 bg-surface-2/60 p-3 sm:grid-cols-5">
                  <button
                    type="button"
                    className={chipClass}
                    onClick={() => moveProduct(item.id, -1)}
                    disabled={index === 0 || busy}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className={chipClass}
                    onClick={() => moveProduct(item.id, 1)}
                    disabled={index === sorted.length - 1 || busy}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className={chipClass}
                    onClick={() => toggleActive(item)}
                    disabled={busy || !item.id}
                  >
                    {item.isActive === false ? "Show" : "Hide"}
                  </button>
                  <button
                    type="button"
                    className={chipClass}
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`${chipClass} col-span-2 border-accent/35 text-accent sm:col-span-1`}
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
      ) : (
        <section className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
              Featured combo
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Updates the combo section and the hero “See the … combo” button.
            </p>
          </div>

          <form
            onSubmit={saveCombo}
            className="grid max-w-full gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-surface-2 p-4 sm:p-5 md:grid-cols-2"
          >
            <label className="block min-w-0">
              <span className={labelClass}>Eyebrow</span>
              <input
                value={combo.eyebrow}
                onChange={(e) =>
                  setCombo((c) => ({ ...c, eyebrow: e.target.value }))
                }
                className={fieldClass}
                required
              />
            </label>
            <label className="block min-w-0">
              <span className={labelClass}>Price</span>
              <input
                value={combo.price}
                onChange={(e) =>
                  setCombo((c) => ({ ...c, price: e.target.value }))
                }
                className={fieldClass}
                required
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={labelClass}>Headline</span>
              <textarea
                value={combo.headline}
                onChange={(e) =>
                  setCombo((c) => ({ ...c, headline: e.target.value }))
                }
                className={`${fieldClass} min-h-20 resize-y`}
                required
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={labelClass}>Title</span>
              <input
                value={combo.title}
                onChange={(e) =>
                  setCombo((c) => ({ ...c, title: e.target.value }))
                }
                className={fieldClass}
                required
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={labelClass}>Note</span>
              <input
                value={combo.note}
                onChange={(e) =>
                  setCombo((c) => ({ ...c, note: e.target.value }))
                }
                className={fieldClass}
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={labelClass}>WhatsApp message</span>
              <textarea
                value={combo.whatsappText}
                onChange={(e) =>
                  setCombo((c) => ({ ...c, whatsappText: e.target.value }))
                }
                className={`${fieldClass} min-h-20 resize-y`}
              />
            </label>
            <div className="min-w-0 space-y-3 md:col-span-2">
              <span className={labelClass}>Image</span>
              <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-ink/25 bg-surface px-4 text-sm font-semibold text-ink-soft">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(file, "combo");
                      setCombo((c) => ({ ...c, imageUrl: url }));
                      flash("Combo image uploaded");
                    } catch (err) {
                      fail(
                        err instanceof Error ? err.message : "Upload failed",
                      );
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
                {uploading === "combo" ? "Uploading…" : "Tap to upload photo"}
              </label>
              {combo.imageUrl ? (
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={combo.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bb-btn w-full sm:w-auto"
                disabled={busy || !dbReady}
              >
                Save combo
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
