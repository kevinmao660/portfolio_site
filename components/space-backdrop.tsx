/** Subtle monochrome texture layer behind content. */
export function SpaceBackdrop() {
  return (
    <div className="space-backdrop pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <div className="space-stars" />
    </div>
  );
}
