"use client";

import { motion } from "motion/react";
import { site } from "@/lib/site";

export function Menu() {
  return (
    <section id="menu" className="bg-ink text-on-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              From the oven
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
              Popular menu
            </h2>
            <p className="mt-5 max-w-[32ch] text-base leading-relaxed text-on-ink/65">
              Fresh buns, maska specials, fudgy brownies, and tiramisu tins —
              baked in Tumkur for Tumkur.
            </p>
          </motion.div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-on-ink/15 border-y border-on-ink/15">
              {site.menu.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_auto] sm:gap-8"
                >
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                    {item.name}
                  </h3>
                  <p className="col-span-2 max-w-[42ch] text-sm leading-relaxed text-on-ink/65 sm:col-span-1 sm:text-base">
                    {item.line}
                  </p>
                  <p className="font-display text-xl font-semibold tracking-[-0.02em] text-on-ink sm:text-2xl">
                    {item.price}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
