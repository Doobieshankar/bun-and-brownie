import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin · Bun & Brownie",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface text-ink">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">{children}</div>
    </div>
  );
}
