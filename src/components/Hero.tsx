"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { site } from "@/lib/site";

type Props = {
  comboPrice: string;
};

export function Hero({ comboPrice }: Props) {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);

  // Same markup on server + first client paint; enter only after mount.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const show = entered;

  return (
    <section
      id="top"
      className="relative grid min-h-[100dvh] grid-cols-1 overflow-hidden bg-surface lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10 lg:pb-16 lg:pt-[calc(4.5rem+2rem)] xl:gap-14 xl:pb-20 xl:pt-[calc(4.5rem+2.5rem)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_28%,rgba(241,226,207,0.95),transparent_52%),radial-gradient(ellipse_at_80%_90%,rgba(228,209,185,0.55),transparent_45%)]"
      />

      <div className="relative z-10 flex flex-col justify-end px-5 pb-12 pt-24 md:px-10 md:pb-16 lg:justify-center lg:self-center lg:px-10 lg:py-0 xl:px-16">
        <p
          className={`mb-5 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            show
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
        >
          Home baked in {site.city}
        </p>

        <h1
          className={`max-w-[9ch] font-display text-[clamp(3rem,6.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink transition-[opacity,transform] duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            show
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          }`}
        >
          {site.name}
        </h1>

        <p
          className={`mt-5 max-w-[28ch] text-lg leading-relaxed text-ink-soft transition-[opacity,transform] duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-xl ${
            show
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          {site.tagline}
        </p>

        <div
          className={`mt-9 flex flex-wrap items-center gap-4 transition-[opacity,transform] duration-500 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            show
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
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
            <span className="bb-btn-glow__inner">
              See the {comboPrice} combo
            </span>
          </a>
        </div>
      </div>

      <div
        className={`relative min-h-[46vh] p-4 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-6 lg:flex lg:min-h-0 lg:items-center lg:p-0 lg:pr-8 xl:pr-12 ${
          show
            ? "translate-x-0 scale-100 opacity-100"
            : "translate-x-7 scale-[1.04] opacity-0"
        }`}
      >
        <div className="bb-media relative aspect-[4/5] h-full min-h-[42vh] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:h-[min(680px,72vh)] lg:min-h-0 lg:rounded-3xl">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={
              entered && !reduce
                ? { scale: [1, 1.045, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: 14,
              repeat: entered && !reduce ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/images/hero-desserts.jpg"
              alt="Chocolate brownie and tiramisu from Bun & Brownie"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
