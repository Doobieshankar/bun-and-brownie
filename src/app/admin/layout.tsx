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
    <div className="min-h-dvh overflow-x-hidden bg-surface text-ink">
      <div className="mx-auto max-w-5xl px-4 pt-2 pb-8 sm:px-5 md:px-8 md:pt-6">
        {children}
      </div>
    </div>
  );
}
