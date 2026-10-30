import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { HideNetlifyBadge } from "@/components/HideNetlifyBadge";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bun & Brownie · Home baked in Tumkur",
  description:
    "Local bakery in Tumkur for maska buns, fudgy brownies, and tiramisu tins. Kyathsandra, Kotitopu — order on WhatsApp, Swiggy, or Zomato.",
  openGraph: {
    title: "Bun & Brownie",
    description:
      "Fresh buns, maska buns, brownies & tiramisu. Home baked in Tumkur · Kotitopu.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface font-sans text-ink">
        <HideNetlifyBadge />
        {children}
      </body>
    </html>
  );
}
