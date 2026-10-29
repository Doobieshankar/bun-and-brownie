"use client";

import { motion } from "motion/react";
import {
  MapPin,
  Motorcycle,
  SealCheck,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { mapsUrl, site } from "@/lib/site";

export function Order() {
  return (
    <section id="order" className="bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 lg:py-28 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              Visit & order
            </p>
            <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-5xl lg:text-6xl">
              From our oven to your door
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
              {site.about} Order on WhatsApp, or get delivery through Swiggy and
              Zomato. Bulk and party orders welcome.
            </p>
            <p className="mt-5 text-sm text-ink-soft">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                Founders
              </span>
              <span className="mt-1.5 block font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                {site.founders.join(", ")}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5 lg:justify-self-end">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bb-btn bb-btn-ink w-full sm:w-auto"
            >
              <WhatsappLogo weight="fill" className="size-6" aria-hidden />
              {site.whatsappLabel}
            </a>
            <p className="text-sm text-muted">
              {site.phoneDisplay} · {site.handle}
            </p>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-ink/10 bg-surface-2 p-6 md:p-8"
          >
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-accent"
                weight="duotone"
                aria-hidden
              />
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                  Address
                </p>
                <p className="mt-2 max-w-[40ch] text-base leading-relaxed text-ink">
                  {site.address}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold tracking-[0.08em] text-accent uppercase underline-offset-4 hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="rounded-2xl border border-ink/10 bg-surface-2 p-6 md:p-8"
          >
            <div className="flex items-start gap-3">
              <Motorcycle
                className="mt-0.5 size-5 shrink-0 text-accent"
                weight="duotone"
                aria-hidden
              />
              <div className="w-full">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                  Online delivery
                </p>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">
                  Order through Swiggy or Zomato for delivery across Tumkur.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={site.swiggy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bb-btn-glow"
                  >
                    <span className="bb-btn-glow__inner">Order on Swiggy</span>
                  </a>
                  <a
                    href={site.zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bb-btn-glow"
                  >
                    <span className="bb-btn-glow__inner">Order on Zomato</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-3">
          {[
            { icon: SealCheck, label: site.fssai },
            { icon: Motorcycle, label: "Swiggy & Zomato delivery" },
            { icon: MapPin, label: `Based in ${site.city} · Kotitopu` },
          ].map(({ icon: Icon, label }, index) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="flex items-center gap-3 bg-surface px-5 py-6 text-sm text-ink-soft"
            >
              <Icon
                className="size-5 shrink-0 text-accent"
                weight="duotone"
                aria-hidden
              />
              <span>{label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
