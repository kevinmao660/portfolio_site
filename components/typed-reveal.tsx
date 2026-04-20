"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type TypedRevealProps = {
  text: string;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  delayMs?: number;
  stepMs?: number;
  once?: boolean;
};

export function TypedReveal({
  text,
  as = "p",
  className,
  delayMs = 0,
  stepMs = 16,
  once = true,
}: TypedRevealProps) {
  const Component = as;
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const characters = useMemo(() => Array.from(text), [text]);
  const [visibleCount, setVisibleCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion || !isInView || hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;

    let charIndex = 0;
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        charIndex = Math.min(characters.length, charIndex + 1);
        setVisibleCount(charIndex);

        if (charIndex >= characters.length && intervalId) {
          window.clearInterval(intervalId);
        }
      }, stepMs);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [characters.length, delayMs, isInView, prefersReducedMotion, stepMs]);

  const visibleText = prefersReducedMotion
    ? text
    : characters.slice(0, visibleCount).join("");

  return (
    <div ref={ref} className="contents">
      <Component
        className={className}
        aria-label={text}
        style={{ whiteSpace: "pre-line" }}
      >
        <span aria-hidden>{visibleText}</span>
        {!prefersReducedMotion && visibleCount < characters.length ? (
          <span aria-hidden className="typing-cursor">
            |
          </span>
        ) : null}
      </Component>
    </div>
  );
}
