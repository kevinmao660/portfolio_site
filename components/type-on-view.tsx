"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TypeOnViewProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  stepMs?: number;
  delayMs?: number;
  once?: boolean;
};

export function TypeOnView({
  text,
  as = "p",
  className,
  stepMs = 32,
  delayMs = 0,
  once = true,
}: TypeOnViewProps) {
  const Tag = as;
  const elRef = useRef<HTMLElement | null>(null);
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      queueMicrotask(() => setCount(chars.length));
      return;
    }

    const el = elRef.current;
    if (!el) return;

    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (once && started.current) continue;
          started.current = true;
          if (once) io.unobserve(el);

          timeoutId = window.setTimeout(() => {
            let i = 0;
            intervalId = window.setInterval(() => {
              i += 1;
              setCount((prev) => Math.min(chars.length, Math.max(prev, i)));
              if (i >= chars.length && intervalId) {
                window.clearInterval(intervalId);
                intervalId = undefined;
              }
            }, stepMs);
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
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [chars.length, delayMs, once, reducedMotion, stepMs]);

  const visible = reducedMotion ? text : chars.slice(0, count).join("");

  return (
    <Tag
      ref={(node) => {
        elRef.current = node;
      }}
      className={className}
      style={{ whiteSpace: "pre-line" }}
      aria-label={text}
    >
      {visible}
      {!reducedMotion && count < chars.length ? (
        <span className="typing-cursor-inline" aria-hidden>
          |
        </span>
      ) : null}
    </Tag>
  );
}
