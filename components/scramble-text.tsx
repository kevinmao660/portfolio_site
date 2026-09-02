"use client";

import { useEffect, useRef, useState } from "react";

type ScrambleTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  scrambleMs?: number;
  delayMs?: number;
  once?: boolean;
};

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]{}=+*^#$";

/** Reveals text by cycling random characters into place, left to right, on scroll into view. */
export function ScrambleText({
  text,
  as = "span",
  className,
  scrambleMs = 500,
  delayMs = 0,
  once = true,
}: ScrambleTextProps) {
  const Tag = as;
  const elRef = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState(text);
  const [reducedMotion, setReducedMotion] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = elRef.current;
    if (!el) return;

    let rafId: number | undefined;
    let timeoutId: number | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (once && started.current) continue;
          started.current = true;
          if (once) io.unobserve(el);

          timeoutId = window.setTimeout(() => {
            const start = performance.now();
            const len = text.length;

            const tick = (now: number) => {
              const progress = Math.min(1, (now - start) / scrambleMs);
              const lockedCount = Math.floor(progress * len);

              let out = "";
              for (let i = 0; i < len; i += 1) {
                const ch = text[i];
                if (ch === " " || ch === "\n" || i < lockedCount) {
                  out += ch;
                } else {
                  out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
                }
              }
              setDisplay(out);

              if (progress < 1) {
                rafId = requestAnimationFrame(tick);
              } else {
                setDisplay(text);
              }
            };
            rafId = requestAnimationFrame(tick);
          }, delayMs);
          break;
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.12 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [delayMs, once, reducedMotion, scrambleMs, text]);

  return (
    <Tag
      ref={(node) => {
        elRef.current = node;
      }}
      className={className}
      aria-label={text}
    >
      {reducedMotion ? text : display}
    </Tag>
  );
}
