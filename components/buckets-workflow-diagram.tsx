"use client";

import {
  ArchitectureDiagram,
  Arrow,
  Box,
  Flows,
  type Flow,
  type Point,
  type Rect,
} from "@/components/architecture-diagram";

const CAPTION =
  "A capture is one breath rather than one thought, so a single call decides how many thoughts are in it and files each with its own bucket, type and deadline — and only your own words survive the cut. From there it does two things on its own: it surfaces what's actually due or overdue, so nothing you said out loud gets buried, and it re-reads your buckets to ask whether one wants splitting or regrouping. Both loops learn from you — moving an item teaches the next sort, and anything you turn down is never proposed again.";

// Box geometry, single-sourced: the drawn rect and the reverb ring fired when a dot
// lands on it read from the same numbers, so they can't drift apart.
const BOX = {
  say: { x: 90, y: 40, w: 320, h: 86 },
  split: { x: 90, y: 190, w: 320, h: 86 },
  file: { x: 90, y: 340, w: 320, h: 86 },
  fix: { x: 90, y: 490, w: 320, h: 86 },
  learn: { x: 90, y: 640, w: 320, h: 86 },
  remind: { x: 630, y: 190, w: 320, h: 86 },
  watch: { x: 630, y: 340, w: 320, h: 86 },
  propose: { x: 630, y: 490, w: 320, h: 86 },
  choose: { x: 630, y: 640, w: 320, h: 86 },
} satisfies Record<string, Rect>;

// Flow paths reused by the arrows and their travelling dots.
const P_SAY: Point[] = [
  [250, 126],
  [250, 190],
];
const P_THOUGHTS: Point[] = [
  [250, 276],
  [250, 340],
];
const P_WRONG: Point[] = [
  [250, 426],
  [250, 490],
];
const P_RECORD: Point[] = [
  [250, 576],
  [250, 640],
];
/** Loop one: a correction you made by hand is in the prompt the next time you capture. */
const P_NEXT: Point[] = [
  [90, 683],
  [40, 683],
  [40, 233],
  [90, 233],
];
/** Filing is what feeds both right-hand branches — reading the pile, and reading its shape. */
const P_REMIND: Point[] = [
  [410, 360],
  [520, 360],
  [520, 233],
  [630, 233],
];
const P_STRUCTURE: Point[] = [
  [410, 383],
  [630, 383],
];
const P_PATTERN: Point[] = [
  [790, 426],
  [790, 490],
];
const P_PICK: Point[] = [
  [790, 576],
  [790, 640],
];
/** Loop two: the bucket has to change again before it is allowed to ask a second time. */
const P_NO: Point[] = [
  [950, 683],
  [1000, 683],
  [1000, 383],
  [950, 383],
];

const FLOWS: Flow[] = [
  { points: P_SAY, duration: 0.9, startDelay: 0.4, repeatDelay: 0.8, target: BOX.split },
  { points: P_THOUGHTS, duration: 0.9, startDelay: 1.2, repeatDelay: 0.8, target: BOX.file },
  { points: P_WRONG, duration: 0.9, startDelay: 2.0, repeatDelay: 0.8, target: BOX.fix },
  { points: P_RECORD, duration: 0.9, startDelay: 0.6, repeatDelay: 0.9, target: BOX.learn },
  // Both loops run long and slow, so they read as the thing that closes the circle.
  { points: P_NEXT, duration: 2.6, startDelay: 0.8, repeatDelay: 0.6, target: BOX.split },
  { points: P_REMIND, duration: 1.8, startDelay: 0.9, repeatDelay: 0.8, target: BOX.remind },
  { points: P_STRUCTURE, duration: 1.3, startDelay: 1.6, repeatDelay: 0.8, target: BOX.watch },
  { points: P_PATTERN, duration: 0.9, startDelay: 2.2, repeatDelay: 0.8, target: BOX.propose },
  { points: P_PICK, duration: 0.9, startDelay: 1.0, repeatDelay: 0.9, target: BOX.choose },
  { points: P_NO, duration: 2.2, startDelay: 1.9, repeatDelay: 0.7, target: BOX.watch },
];

/** What using Buckets actually feels like, step by step — the workflow, not the wiring. */
export function BucketsWorkflowDiagram() {
  return (
    <ArchitectureDiagram arrowId="bk-flow" caption={CAPTION} viewBox="0 0 1040 800">
      {({ active, dots, d }) => (
        <>
          {/* The capture path */}
          <Box
            {...BOX.say}
            title="You say it"
            subtitle="one breath — often more than one thought"
            active={active}
            delay={d(0)}
          />
          <Box
            {...BOX.split}
            title="It splits"
            subtitle="only your own words survive the cut"
            active={active}
            delay={d(0.1)}
          />
          <Box
            {...BOX.file}
            title="It files each one"
            subtitle="a bucket · a type · a deadline if you gave one"
            active={active}
            delay={d(0.2)}
          />
          <Box
            {...BOX.fix}
            title="You fix what's wrong"
            subtitle="click anything · move it · nothing is final"
            active={active}
            delay={d(0.3)}
          />
          <Box
            {...BOX.learn}
            title="It learns the move"
            subtitle="your last 8 corrections ride along"
            active={active}
            delay={d(0.4)}
          />

          {/* What it does with the pile once things are in it */}
          <Box
            {...BOX.remind}
            title="It tells you what matters"
            subtitle="due · overdue first · what you'd have forgotten"
            active={active}
            delay={d(0.22)}
          />
          <Box
            {...BOX.watch}
            title="It re-reads your buckets"
            subtitle="does this one want splitting, or regrouping?"
            active={active}
            delay={d(0.3)}
          />
          <Box
            {...BOX.propose}
            title="It proposes a change"
            subtitle="divisions already there, in your words"
            active={active}
            delay={d(0.38)}
          />
          <Box
            {...BOX.choose}
            title="Create — or Not now"
            subtitle="nothing exists until you press Create"
            active={active}
            delay={d(0.46)}
          />

          {/* ── The capture path ───────────────────────────────── */}
          <Arrow
            points={P_SAY}
            label="one call"
            labelX={260}
            labelY={165}
            anchor="start"
            active={active}
            delay={d(0.5)}
          />
          <Arrow
            points={P_THOUGHTS}
            label="usually one, sometimes three"
            labelX={260}
            labelY={315}
            anchor="start"
            active={active}
            delay={d(0.56)}
          />
          <Arrow
            points={P_WRONG}
            label="when it lands somewhere wrong"
            labelX={260}
            labelY={465}
            anchor="start"
            active={active}
            delay={d(0.62)}
          />
          <Arrow
            points={P_RECORD}
            label="the move is written down"
            labelX={260}
            labelY={615}
            anchor="start"
            active={active}
            delay={d(0.68)}
          />
          <Arrow
            points={P_NEXT}
            label="next sort"
            label2="follows you"
            labelX={50}
            labelY={440}
            anchor="start"
            active={active}
            delay={d(0.74)}
          />

          {/* ── What it does back at you ───────────────────────── */}
          <Arrow
            points={P_REMIND}
            label="and what's coming up"
            labelX={534}
            labelY={320}
            anchor="start"
            active={active}
            delay={d(0.54)}
          />
          <Arrow
            points={P_STRUCTURE}
            label="as things pile up"
            labelX={520}
            labelY={404}
            active={active}
            delay={d(0.58)}
          />
          <Arrow
            points={P_PATTERN}
            label="when there's a pattern to see"
            labelX={780}
            labelY={465}
            anchor="end"
            active={active}
            delay={d(0.64)}
          />
          <Arrow
            points={P_PICK}
            label="one card at a time"
            labelX={800}
            labelY={615}
            anchor="start"
            active={active}
            delay={d(0.7)}
          />
          <Arrow
            points={P_NO}
            label="a no never"
            label2="comes back"
            labelX={990}
            labelY={440}
            anchor="end"
            active={active}
            delay={d(0.76)}
          />

          {/* Live cues, staggered so they don't move in lockstep. Each dot's target
              box reverbs as the dot lands. */}
          <Flows flows={FLOWS} active={dots} />
        </>
      )}
    </ArchitectureDiagram>
  );
}
