/**
 * Tartoon logo — an octagon (a nod to the signature modular shelving) drawn
 * blueprint-style with a centre cross, paired with the serif wordmark.
 * Monochrome via currentColor so it inherits ink/paper from context.
 */

export function LogoMark({ className }: { className?: string }) {
  // Regular octagon inscribed in a 48×48 box
  const pts = octagonPoints(24, 24, 21);
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points={pts} />
      {/* blueprint centre cross */}
      <line x1="24" y1="6" x2="24" y2="42" strokeWidth="1" opacity="0.55" />
      <line x1="6" y1="24" x2="42" y2="24" strokeWidth="1" opacity="0.55" />
      {/* centre node */}
      <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className={markClassName ?? "h-7 w-7 text-oak"} />
      {showWordmark && (
        <span className="font-display text-xl leading-none tracking-tight text-ink">
          Tartoon
        </span>
      )}
    </span>
  );
}

function octagonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 8 }, (_, i) => {
    // start at -22.5° so the octagon has flat top/bottom
    const a = (Math.PI / 4) * i + Math.PI / 8;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}
