/**
 * Subtle monochrome “space” decor: faint star field + solid black planet discs.
 * Sits behind page content; respects prefers-reduced-motion.
 */
export function SpaceBackdrop() {
  return (
    <div className="space-backdrop pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <div className="space-stars" />
      {/* Black planet silhouettes — varied scale & position */}
      <div className="space-orb space-orb-a" />
      <div className="space-orb space-orb-b" />
      <div className="space-orb space-orb-c" />
      <div className="space-orb space-orb-d" />
      <div className="space-orb space-orb-e" />
      <div className="space-orb-ring space-ring-a" />
      <div className="space-orb-ring space-ring-b" />
    </div>
  );
}
