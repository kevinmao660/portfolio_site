"use client";

import { useEffect, useState } from "react";

/** Fixed background grid that brightens in a radius around the cursor. */
export function SpotlightGrid() {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsHover || reducedMotion) return;

    setInteractive(true);

    let rafId = 0;
    let pendingX = 50;
    let pendingY = 50;

    const onMove = (e: PointerEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 100;
      pendingY = (e.clientY / window.innerHeight) * 100;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--spot-x", `${pendingX}%`);
          document.documentElement.style.setProperty("--spot-y", `${pendingY}%`);
          rafId = 0;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className={`ghost-grid pointer-events-none fixed inset-0 z-0 ${
        interactive ? "ghost-grid--spotlight" : ""
      }`}
      aria-hidden
    />
  );
}
