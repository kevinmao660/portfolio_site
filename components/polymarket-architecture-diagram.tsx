"use client";

import {
  ArchitectureDiagram,
  Arrow,
  Box,
  Container,
  Flows,
  type Flow,
  type Point,
  type Rect,
} from "@/components/architecture-diagram";

const CAPTION =
  "One FastAPI process runs the whole backend — REST API, WS proxy, scanner, auto-deploy loop, reward bots and clear bot all live in it, which is why the browser's live feeds come from inside the same box. The scanner ranks rewarded markets by estimated $/hr; the auto-deploy loop nominates per channel, then arbitrates all nominees globally to decide which markets get bots. Both stores feed back into that decision: SQLite's per-channel blacklist keeps burned markets out of future nominations, and Postgres history yields a calibration factor that corrects the $/hr the arbiter ranks on. Reward bots open their own WS connections for the live book and their private order feed — the proxy is browser-only. The clear bot is an account-wide daemon, not a per-market one: it watches open positions and rests token-backed SELLs to flatten whatever the bots' bids got filled on.";

// Box geometry, single-sourced: the drawn rect and the reverb ring fired when a dot
// lands on it read from the same numbers, so they can't drift apart.
const BOX = {
  dash: { x: 290, y: 30, w: 430, h: 68 },
  proxy: { x: 90, y: 195, w: 210, h: 100 },
  scanner: { x: 345, y: 195, w: 240, h: 100 },
  clearbot: { x: 640, y: 195, w: 200, h: 100 },
  autodep: { x: 90, y: 370, w: 350, h: 120 },
  bots: { x: 620, y: 370, w: 260, h: 120 },
  postgres: { x: 110, y: 610, w: 260, h: 80 },
  sqlite: { x: 400, y: 610, w: 260, h: 80 },
  poly: { x: 220, y: 780, w: 780, h: 76 },
} satisfies Record<string, Rect>;

// Flow paths reused by the arrows and their travelling dots.
const P_REST_API: Point[] = [
  [430, 98],
  [430, 150],
];
const P_SSE: Point[] = [
  [560, 150],
  [560, 98],
];
const P_TICKS: Point[] = [
  [150, 195],
  [150, 120],
  [320, 120],
  [320, 98],
];
const P_RANKED: Point[] = [
  [360, 295],
  [360, 370],
];
const P_DEPLOY: Point[] = [
  [440, 392],
  [620, 392],
];
const P_REARB: Point[] = [
  [620, 468],
  [440, 468],
];
const P_HISTORY: Point[] = [
  [140, 490],
  [140, 610],
];
const P_CALIB: Point[] = [
  [300, 610],
  [300, 490],
];
const P_CACHE: Point[] = [
  [410, 490],
  [410, 610],
];
const P_BLACKLIST: Point[] = [
  [430, 610],
  [430, 490],
];
const P_ORDERS_OUT: Point[] = [
  [790, 530],
  [790, 780],
];
const P_PRIVATE_WS: Point[] = [
  [860, 780],
  [860, 490],
];
const P_POSITIONS: Point[] = [
  [980, 780],
  [980, 245],
  [840, 245],
];
const P_MARKET_WS: Point[] = [
  [220, 818],
  [30, 818],
  [30, 245],
  [90, 245],
];

const FLOWS: Flow[] = [
  { points: P_MARKET_WS, duration: 3.2, startDelay: 0.9, repeatDelay: 0.5, target: BOX.proxy },
  { points: P_TICKS, duration: 2.4, startDelay: 1.6, repeatDelay: 0.5, target: BOX.dash },
  { points: P_PRIVATE_WS, duration: 2.0, startDelay: 0.5, repeatDelay: 0.6, target: BOX.bots },
  { points: P_ORDERS_OUT, duration: 2.0, startDelay: 1.4, repeatDelay: 0.5, target: BOX.poly },
  { points: P_POSITIONS, duration: 3.0, startDelay: 2.2, repeatDelay: 0.9, target: BOX.clearbot },
  // Lands on the backend boundary rather than a box, so there's nothing to reverb.
  { points: P_REST_API, duration: 1.0, startDelay: 1.0, repeatDelay: 0.7 },
  { points: P_SSE, duration: 1.0, startDelay: 1.9, repeatDelay: 0.7, target: BOX.dash },
  { points: P_RANKED, duration: 1.1, startDelay: 1.8, repeatDelay: 0.8, target: BOX.autodep },
  { points: P_DEPLOY, duration: 1.2, startDelay: 1.3, repeatDelay: 0.9, target: BOX.bots },
  { points: P_REARB, duration: 1.2, startDelay: 2.4, repeatDelay: 0.9, target: BOX.autodep },
  { points: P_CACHE, duration: 1.1, startDelay: 2.4, repeatDelay: 0.8, target: BOX.sqlite },
  { points: P_HISTORY, duration: 1.2, startDelay: 0.6, repeatDelay: 0.8, target: BOX.postgres },
  // Auto-Deploy takes four inbound dots; these start delays space the arrivals
  // (1.5s / 2.5s / 2.9s / 3.6s) so its reverbs don't land on top of each other.
  { points: P_BLACKLIST, duration: 1.1, startDelay: 1.4, repeatDelay: 0.8, target: BOX.autodep },
  { points: P_CALIB, duration: 1.2, startDelay: 0.3, repeatDelay: 0.8, target: BOX.autodep },
];

/** Real, researched system architecture for the Polymarket Incentives Bot — not a generic template. */
export function PolymarketArchitectureDiagram() {
  return (
    <ArchitectureDiagram arrowId="pm-arrow" caption={CAPTION} viewBox="0 0 1040 890">
      {({ active, dots, d }) => (
        <>
          {/* Frontend */}
          <Box
            {...BOX.dash}
            title="React Dashboard"
            subtitle="Scanner · Deployers · Arbiter · Earnings · Blacklist"
            active={active}
            delay={d(0)}
          />

          {/* Backend container — one process holds all of it */}
          <Container
            x={60}
            y={150}
            w={950}
            h={380}
            label="FASTAPI BACKEND — SINGLE PROCESS"
            active={active}
            delay={d(0.05)}
          />

          <Box
            {...BOX.proxy}
            title="WS Proxy"
            subtitle="browser-only book relay"
            active={active}
            delay={d(0.18)}
          />
          <Box
            {...BOX.scanner}
            title="Scanner"
            subtitle="ranks by est $/hr"
            active={active}
            delay={d(0.24)}
          />
          <Box
            {...BOX.clearbot}
            title="Clear Bot"
            subtitle="account-wide · rests SELLs"
            active={active}
            delay={d(0.3)}
          />
          <Box
            {...BOX.autodep}
            title="Auto-Deploy Loop"
            subtitle="nominate → arbitrate → execute"
            active={active}
            delay={d(0.36)}
          />
          <Box
            {...BOX.bots}
            title="Reward Bots ×N"
            subtitle="1 resting bid / market"
            active={active}
            delay={d(0.42)}
          />

          {/* Storage */}
          <Box
            {...BOX.postgres}
            title="Postgres"
            subtitle="history + market catalog"
            active={active}
            delay={d(0.5)}
          />
          <Box
            {...BOX.sqlite}
            title="SQLite"
            subtitle="cache · blacklist · settings"
            active={active}
            delay={d(0.5)}
          />

          {/* External venue */}
          <Box
            {...BOX.poly}
            title="Polymarket US (external)"
            subtitle="REST + WS"
            dashed
            active={active}
            delay={d(0.6)}
          />

          {/* ── Frontend ↔ backend ─────────────────────────────── */}
          <Arrow
            points={P_REST_API}
            label="REST: scan · deploy · configure"
            labelX={420}
            labelY={140}
            anchor="end"
            active={active}
            delay={d(0.16)}
          />
          <Arrow
            points={P_SSE}
            label="SSE: bot + deployer streams"
            labelX={570}
            labelY={140}
            anchor="start"
            active={active}
            delay={d(0.2)}
          />
          <Arrow
            points={P_TICKS}
            label="live book ticks (WS)"
            labelX={160}
            labelY={110}
            anchor="start"
            active={active}
            delay={d(0.24)}
          />

          {/* ── Inside the backend ─────────────────────────────── */}
          <Arrow
            points={P_RANKED}
            label="ranked markets"
            labelX={350}
            labelY={336}
            anchor="end"
            active={active}
            delay={d(0.46)}
          />
          <Arrow
            points={P_DEPLOY}
            label="deploy / stop"
            labelX={530}
            labelY={412}
            active={active}
            delay={d(0.52)}
          />
          <Arrow
            points={P_REARB}
            label="fill → re-arbitrate"
            labelX={530}
            labelY={452}
            active={active}
            delay={d(0.56)}
          />

          {/* ── Stores, and the two decisions they feed back into ── */}
          <Arrow
            points={P_HISTORY}
            label="run + reward history"
            labelX={150}
            labelY={556}
            anchor="start"
            active={active}
            delay={d(0.62)}
          />
          <Arrow
            points={P_CALIB}
            label="calibration factors"
            labelX={290}
            labelY={586}
            anchor="end"
            active={active}
            delay={d(0.7)}
          />
          <Arrow
            points={P_CACHE}
            label="scan cache"
            labelX={400}
            labelY={556}
            anchor="end"
            active={active}
            delay={d(0.62)}
          />
          <Arrow
            points={P_BLACKLIST}
            label="blacklist filter"
            labelX={440}
            labelY={586}
            anchor="start"
            active={active}
            delay={d(0.7)}
          />

          {/* ── The exchange ───────────────────────────────────── */}
          <Arrow
            points={P_ORDERS_OUT}
            label="REST: books · orders ·"
            label2="cancels · sells"
            labelX={780}
            labelY={706}
            anchor="end"
            active={active}
            delay={d(0.66)}
          />
          <Arrow
            points={P_PRIVATE_WS}
            label="WS: live book +"
            label2="private orders"
            labelX={870}
            labelY={706}
            anchor="start"
            dashed
            active={active}
            delay={d(0.3)}
          />
          <Arrow
            points={P_POSITIONS}
            label="open positions"
            labelX={970}
            labelY={556}
            anchor="end"
            active={active}
            delay={d(0.36)}
          />
          <Arrow
            points={P_MARKET_WS}
            label="WS: market"
            label2="data → proxy"
            labelX={40}
            labelY={706}
            anchor="start"
            dashed
            active={active}
            delay={d(0.26)}
          />

          {/* Live data-flow cues, staggered so they don't move in lockstep. Each dot's
              target box reverbs as the dot lands — same ring the Reward Bots had, now
              driven by arrivals instead of running free. */}
          <Flows flows={FLOWS} active={dots} />
        </>
      )}
    </ArchitectureDiagram>
  );
}
