"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function CatCompanion() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    ["6vw", "20vw", "68vw", "72vw", "80vw"],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    ["18vh", "22vh", "52vh", "80vh", "84vh"],
  );
  const rotate = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, -8, 10, -12, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [1, 1.06, 1.12, 0.96, 0.92]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      style={
        prefersReducedMotion
          ? { x: "78vw", y: "82vh" }
          : { x, y, rotate, scale }
      }
    >
      <div className="technical-panel rounded-3xl px-3 py-2 shadow-[0_16px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
          Cat.01
        </div>
        <svg
          width="92"
          height="72"
          viewBox="0 0 92 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/90"
        >
          <path
            d="M18 50C18 36.7 28.7 26 42 26H56C69.3 26 80 36.7 80 50V56H18V50Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          <path d="M30 28L36 10L46 24L30 28Z" fill="currentColor" />
          <path d="M66 28L60 10L50 24L66 28Z" fill="currentColor" />
          <ellipse cx="35" cy="42" rx="3" ry="4" fill="#050505" />
          <ellipse cx="61" cy="42" rx="3" ry="4" fill="#050505" />
          <path
            d="M45 47C47.5 50 49.5 50 52 47"
            stroke="#050505"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M9 45L28 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 52L28 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M64 48L83 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M64 52L82 53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M73 56C79 58 84 61 86 66"
            stroke="#79D8FF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}
