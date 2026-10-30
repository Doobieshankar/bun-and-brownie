"use client";

import { useEffect } from "react";

/** Netlify Free injects #nl-badge-frame; free plan can't turn it off in UI. */
export function HideNetlifyBadge() {
  useEffect(() => {
    try {
      for (const key of ["nl-hud:public:v1", "nl-hud:owner-private:v1"]) {
        localStorage.setItem(key, "hidden");
      }
    } catch {
      // private mode / blocked storage
    }

    const strip = () => {
      document.getElementById("nl-badge-frame")?.remove();
      document.getElementById("nl-hud-frame")?.remove();
    };

    strip();
    const observer = new MutationObserver(strip);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
