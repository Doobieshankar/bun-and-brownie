"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { MenuItem } from "@/lib/content";

type Props = {
  items: MenuItem[];
};

export function Menu({ items }: Props) {
  return (
    <section id="menu" className="bg-ink text-on-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 lg:py-28 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
            From the oven
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
            Popular menu
          </h2>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-on-ink/65">
            Fresh buns, maska specials, fudgy brownies, and tiramisu tins —
            baked in Tumkur for Tumkur.
          </p>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => (
            <motion.li
              key={item.id ?? item.slug ?? item.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.55,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col"
            >
              <div className="bb-media relative aspect-[4/5] overflow-hidden rounded-2xl bg-on-ink/10 sm:aspect-[5/6]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full items-end bg-[linear-gradient(160deg,#6a4a32_0%,#3f2313_100%)] p-5">
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-on-ink/80">
                      {item.name}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-on-ink/65">
                    {item.description}
                  </p>
                </div>
                <p className="shrink-0 font-display text-xl font-semibold tracking-[-0.02em]">
                  {item.price}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
