"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Shared machinery for the per-project architecture diagrams. Each diagram file owns only its
 * geometry and its caption; everything about how a box draws in, how an arrow animates, and how
 * a travelling dot is timed lives here so the three read as one family.
 */

export const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", "Roboto Mono", monospace';

/** Text sits on top of lines, so it carries a white halo — which also erases whatever it covers. */
export const HALO = {
  paintOrder: "stroke" as const,
  stroke: "#ffffff",
  strokeWidth: 4,
  strokeLinejoin: "round" as const,
};

export type Rect = { x: number; y: number; w: number; h: number };
export type Point = [number, number];

/**
 * SVG marker ids are global to the document, so each diagram defines its own and its arrows read
 * it from here rather than every geometry file threading the same string through every `<Arrow>`.
 */
const ArrowMarkerContext = createContext("arch-arrow");

const boxVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export function Box({
  x,
  y,
  w,
  h,
  title,
  subtitle,
  dashed,
  tint,
  active,
  delay,
}: Rect & {
  title: string;
  subtitle?: string;
  dashed?: boolean;
  tint?: boolean;
  active: boolean;
  delay: number;
}) {
  return (
    <motion.g
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={boxVariants}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={tint ? "currentColor" : "none"}
        fillOpacity={tint ? 0.03 : undefined}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text
        x={x + w / 2}
        y={subtitle ? y + h / 2 - 5 : y + h / 2 + 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="currentColor"
        {...HALO}
      >
        {title}
      </text>
      {subtitle ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 13}
          textAnchor="middle"
          fontSize={9.5}
          fill="currentColor"
          opacity={0.62}
          {...HALO}
        >
          {subtitle}
        </text>
      ) : null}
    </motion.g>
  );
}

/** The dashed frame drawn around a group of boxes, with its label tucked inside the top-right. */
export function Container({
  x,
  y,
  w,
  h,
  label,
  active,
  delay,
}: Rect & { label: string; active: boolean; delay: number }) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="4 3"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.55 : 0 }}
        transition={{ duration: 0.4, delay }}
      />
      <motion.text
        x={x + w - 18}
        y={y + 22}
        textAnchor="end"
        fontSize={10.5}
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.55 : 0 }}
        transition={{ duration: 0.4, delay }}
      >
        {label}
      </motion.text>
    </g>
  );
}

/**
 * One edge. `label` sits beside the line, never on top of it — the white halo that keeps
 * text readable also erases whatever it covers, so a centred label eats its own arrow.
 * `anchor` picks which side, and long labels are split into two short lines instead of
 * running across neighbouring lanes.
 */
export function Arrow({
  points,
  label,
  label2,
  labelX,
  labelY,
  anchor = "middle",
  dashed,
  active,
  delay,
}: {
  points: Point[];
  label: string;
  label2?: string;
  labelX: number;
  labelY: number;
  anchor?: "start" | "middle" | "end";
  dashed?: boolean;
  active: boolean;
  delay: number;
}) {
  const markerId = useContext(ArrowMarkerContext);
  const pointsAttr = points.map(([px, py]) => `${px},${py}`).join(" ");
  const labelDelay = delay + (dashed ? 0.15 : 0.4);

  return (
    <g>
      <motion.polyline
        points={pointsAttr}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeDasharray={dashed ? "3 3" : undefined}
        markerEnd={`url(#${markerId})`}
        initial={{ opacity: 0, pathLength: dashed ? 1 : 0 }}
        animate={
          active
            ? { opacity: 1, pathLength: 1 }
            : { opacity: 0, pathLength: dashed ? 1 : 0 }
        }
        transition={{
          opacity: { duration: 0.25, delay },
          pathLength: dashed
            ? { duration: 0 }
            : { duration: 0.5, delay, ease: "easeInOut" },
        }}
      />
      <motion.text
        x={labelX}
        y={labelY}
        textAnchor={anchor}
        fontSize={11}
        fill="currentColor"
        {...HALO}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.75 : 0 }}
        transition={{ duration: 0.3, delay: labelDelay }}
      >
        {label}
      </motion.text>
      {label2 ? (
        <motion.text
          x={labelX}
          y={labelY + 16}
          textAnchor={anchor}
          fontSize={11}
          fill="currentColor"
          {...HALO}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 0.75 : 0 }}
          transition={{ duration: 0.3, delay: labelDelay }}
        >
          {label2}
        </motion.text>
      ) : null}
    </g>
  );
}

/** Even-speed keyframes for a dot traveling a multi-segment path, fading in/out at the ends. */
function buildFlowKeyframes(points: Point[]) {
  const pts =
    points.length >= 3
      ? points
      : [
          points[0],
          [
            (points[0][0] + points[1][0]) / 2,
            (points[0][1] + points[1][1]) / 2,
          ] as Point,
          points[1],
        ];
  const distances = pts
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = distances.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const times = [0, ...distances.map((dist) => (acc += dist) / total)];
  return {
    cx: pts.map((p) => p[0]),
    cy: pts.map((p) => p[1]),
    times,
    opacity: pts.map((_, i) => (i === 0 || i === pts.length - 1 ? 0 : 0.85)),
  };
}

/** A small dot that continuously travels one arrow's path, once the diagram has drawn in — a live data-flow cue. */
function FlowDot({
  points,
  active,
  duration,
  startDelay,
  repeatDelay = 0.5,
}: {
  points: Point[];
  active: boolean;
  duration: number;
  startDelay: number;
  repeatDelay?: number;
}) {
  const { cx, cy, times, opacity } = buildFlowKeyframes(points);

  // `times` is a transition option, not an animation target — passing it inside
  // `animate` silently drops the distance-weighting, so a short segment takes as
  // long to travel as a long one. Per-value transitions don't inherit the parent's
  // options either (only `inherit: true` merges them), so spread them in.
  const base = {
    duration,
    delay: startDelay,
    repeat: Infinity,
    repeatDelay,
    ease: "easeInOut" as const,
  };
  const weighted = { ...base, times };

  return (
    <motion.circle
      r={2.5}
      fill="currentColor"
      initial={{ cx: cx[0], cy: cy[0], opacity: 0 }}
      animate={active ? { cx, cy, opacity } : { cx: cx[0], cy: cy[0], opacity: 0 }}
      transition={{ ...base, cx: weighted, cy: weighted, opacity: weighted }}
    />
  );
}

/** How long one reverb takes. Must stay under the shortest flow cycle so rings never overlap themselves. */
const RING_DURATION = 1.1;

/** A soft ring expanding out of a box — fired the moment a flow dot lands on it. */
function PulseRing({
  x,
  y,
  w,
  h,
  active,
  startDelay,
  repeatDelay,
}: Rect & {
  active: boolean;
  startDelay: number;
  repeatDelay: number;
}) {
  return (
    <motion.rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
      initial={{ opacity: 0, scale: 1 }}
      animate={
        active
          ? { opacity: [0, 0.45, 0], scale: [1, 1.045, 1.09] }
          : { opacity: 0, scale: 1 }
      }
      transition={{
        duration: RING_DURATION,
        delay: startDelay,
        repeat: Infinity,
        repeatDelay,
        ease: "easeOut",
      }}
    />
  );
}

/**
 * One travelling dot, and the box it lands on. `target` gets a reverb ring timed to the dot's
 * arrival — one cycle is `duration + repeatDelay`, and the dot arrives `duration` after it sets
 * off, so the ring fires there and repeats on the same period. Staggered start delays keep the
 * whole diagram from pulsing in lockstep.
 */
export type Flow = {
  points: Point[];
  duration: number;
  startDelay: number;
  repeatDelay: number;
  target?: Rect;
};

export function Flows({ flows, active }: { flows: Flow[]; active: boolean }) {
  return (
    <>
      {flows.map((f, i) => (
        <FlowDot
          key={`dot-${i}`}
          points={f.points}
          duration={f.duration}
          startDelay={f.startDelay}
          repeatDelay={f.repeatDelay}
          active={active}
        />
      ))}
      {flows.map((f, i) =>
        f.target ? (
          <PulseRing
            key={`ring-${i}`}
            {...f.target}
            active={active}
            startDelay={f.startDelay + f.duration}
            repeatDelay={Math.max(0, f.duration + f.repeatDelay - RING_DURATION)}
          />
        ) : null,
      )}
    </>
  );
}

type DiagramState = {
  /** Boxes and arrows are drawn; true immediately when the reader prefers reduced motion. */
  active: boolean;
  /** Travelling dots and reverb rings run — never under reduced motion, since they don't stop. */
  dots: boolean;
  /** Passes a stagger delay through, or flattens it to 0 under reduced motion. */
  d: (n: number) => number;
};

/**
 * The frame every diagram shares: scroll-triggered draw-in, reduced-motion handling, the arrow
 * marker, and the caption that doubles as the SVG's accessible label.
 */
export function ArchitectureDiagram({
  arrowId,
  caption,
  viewBox,
  minWidth = 760,
  children,
}: {
  arrowId: string;
  /**
   * Not rendered — the diagram speaks for itself on screen. This stays because the SVG needs an
   * accessible description, and `role="img"` gives a screen reader nothing but this string.
   */
  caption: string;
  viewBox: string;
  /** Scroll rather than shrink: below this width the 11px labels stop being readable. */
  minWidth?: number;
  children: (state: DiagramState) => ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const active = reducedMotion ? true : inView;
  const d = reducedMotion ? () => 0 : (n: number) => n;
  const dots = active && !reducedMotion;

  return (
    <ArrowMarkerContext.Provider value={arrowId}>
      <figure className="m-0" ref={ref}>
        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <svg
            viewBox={viewBox}
            role="img"
            aria-label={caption}
            className="h-auto w-full"
            style={{ minWidth, fontFamily: MONO }}
          >
            <defs>
              <marker
                id={arrowId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
            </defs>
            {children({ active, dots, d })}
          </svg>
        </div>
      </figure>
    </ArrowMarkerContext.Provider>
  );
}
