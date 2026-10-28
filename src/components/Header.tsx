"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export function Header() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const hero = document.getElementById("top");
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight;
      const pastHero = y >= heroBottom - 48;
      const scrollingUp = y < lastY - 2;
      const scrollingDown = y > lastY + 2;

      if (!pastHero) {
        setVisible(true);
      } else if (scrollingUp) {
        setVisible(true);
      } else if (scrollingDown) {
        setVisible(false);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b border-ink/10 bg-surface/85 backdrop-blur-md transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-[72px] md:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt={`${site.name} logo`}
            width={44}
            height={44}
            className="size-10 rounded-full object-cover mix-blend-multiply md:size-11"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-[-0.03em] text-ink md:text-xl">
            {site.name}
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-[13px] font-medium tracking-[0.14em] text-ink-soft uppercase md:flex">
          <a href="#menu" className="transition-colors hover:text-accent">
            Menu
          </a>
          <a href="#combo" className="transition-colors hover:text-accent">
            Combo
          </a>
          <a href="#order" className="transition-colors hover:text-accent">
            Order
          </a>
        </nav>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="bb-btn bb-btn-sm"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
