"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative grid min-h-[100dvh] grid-cols-1 overflow-hidden bg-surface lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    >
      <div className="relative z-10 flex flex-col justify-end px-5 pb-14 pt-24 md:px-10 md:pb-20 lg:justify-center lg:pt-24 xl:px-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase"
        >
          Home baked in {site.city}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[9ch] font-display text-[clamp(3.25rem,7.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink"
        >
          {site.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[28ch] text-lg leading-relaxed text-ink-soft md:text-xl"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bb-btn"
          >
            <WhatsappLogo weight="fill" className="size-5" aria-hidden />
            {site.whatsappLabel}
          </a>
          <a href="#combo" className="bb-btn-glow">
            <span className="bb-btn-glow__inner">See the ₹300 combo</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-[46vh] p-4 md:p-6 lg:min-h-[100dvh] lg:p-8 lg:pl-0"
      >
        <div className="bb-media relative h-full min-h-[42vh] overflow-hidden rounded-2xl lg:min-h-[calc(100dvh-4rem)] lg:rounded-3xl">
          <Image
            src="/images/hero-desserts.jpg"
            alt="Chocolate brownie and tiramisu from Bun & Brownie"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.03]"
          />
        </div>
      </motion.div>
    </section>
  );
}
