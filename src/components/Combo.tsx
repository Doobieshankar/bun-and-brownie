"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { site } from "@/lib/site";
import type { ComboContent } from "@/lib/content";

type Props = {
  combo: ComboContent;
};

export function Combo({ combo }: Props) {
  const headlineLines = combo.headline.split("\n").filter(Boolean);
  const imageSrc = combo.imageUrl || "/images/combo-tin.jpg";
  const whatsappHref = `${site.whatsapp}?text=${encodeURIComponent(
    combo.whatsappText ||
      `Hi! I want the ${combo.title} combo for ${combo.price}.`,
  )}`;

  return (
    <section id="combo" className="border-t border-ink/10 bg-surface-2">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-10 lg:grid-cols-12 lg:gap-10 lg:py-28 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 lg:order-1 lg:col-span-5"
        >
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
            {combo.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-5xl">
            {headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-ink-soft">
            {combo.title} — our most-loved tin. Perfect for sharing, or keeping
            all to yourself.
          </p>

          <div className="mt-8 flex items-end gap-3">
            <span className="font-display text-6xl font-semibold leading-none tracking-[-0.04em] text-ink md:text-7xl">
              {combo.price}
            </span>
            <span className="pb-2 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              combo offer
            </span>
          </div>

          <p className="mt-4 text-sm text-muted">{combo.note}</p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bb-btn mt-8"
          >
            <WhatsappLogo weight="fill" className="size-5" aria-hidden />
            Order this combo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 lg:col-span-7"
        >
          <div className="bb-media relative aspect-square overflow-hidden rounded-2xl bg-surface sm:aspect-[4/3] lg:aspect-[5/4] lg:rounded-3xl">
            <Image
              src={imageSrc}
              alt={combo.title}
              fill
              unoptimized={imageSrc.startsWith("/api/media/")}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
