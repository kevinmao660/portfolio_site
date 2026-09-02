type HoverCornersProps = {
  /** Bracket arm length in pixels. */
  size?: number;
};

/**
 * Small "L" brackets at a box's four corners that nudge outward and fade in on hover —
 * a focus-frame accent, like a camera viewfinder locking on. Parent must be `relative`
 * and carry the Tailwind `group` class.
 */
export function HoverCorners({ size = 14 }: HoverCornersProps) {
  const base =
    "pointer-events-none absolute border-black opacity-0 transition-all duration-300 ease-out group-hover:opacity-100";

  return (
    <>
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={`${base} -left-px -top-px border-l border-t group-hover:-translate-x-1 group-hover:-translate-y-1`}
      />
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={`${base} -right-px -top-px border-r border-t group-hover:translate-x-1 group-hover:-translate-y-1`}
      />
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={`${base} -bottom-px -left-px border-b border-l group-hover:-translate-x-1 group-hover:translate-y-1`}
      />
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={`${base} -bottom-px -right-px border-b border-r group-hover:translate-x-1 group-hover:translate-y-1`}
      />
    </>
  );
}
