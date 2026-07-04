import type { ProductId } from "@/lib/pricing";

/**
 * Schematic front-elevation drawing that redraws from the current spec.
 * Not a manufacturing drawing — a live blueprint-style preview.
 */
export function FrontElevation({
  product,
  w,
  h,
  sections,
  swatch,
  handles,
}: {
  product: ProductId;
  w: number; // mm
  h: number; // mm
  sections: number;
  swatch: string;
  handles: boolean;
}) {
  const VB_W = 620;
  const VB_H = 460;
  const PAD = 70; // room for dimension lines
  const innerW = VB_W - PAD * 2;
  const innerH = VB_H - PAD * 2;

  // Fit the real aspect ratio into the inner box
  const scale = Math.min(innerW / w, innerH / h);
  const pw = w * scale;
  const ph = h * scale;
  const x = (VB_W - pw) / 2;
  const y = (VB_H - ph) / 2;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full text-ink"
      fill="none"
      stroke="currentColor"
      role="img"
      aria-label={`${product} ${w}×${h} mm`}
    >
      <Body
        product={product}
        x={x}
        y={y}
        w={pw}
        h={ph}
        sections={Math.max(1, sections)}
        swatch={swatch}
        handles={handles}
      />

      {/* Bottom width dimension line */}
      <g
        stroke="currentColor"
        strokeWidth="1"
        fontFamily="var(--font-mono)"
        fontSize="12"
      >
        <line x1={x} y1={y + ph + 34} x2={x + pw} y2={y + ph + 34} />
        <line x1={x} y1={y + ph + 28} x2={x} y2={y + ph + 40} />
        <line x1={x + pw} y1={y + ph + 28} x2={x + pw} y2={y + ph + 40} />
        <text
          x={x + pw / 2}
          y={y + ph + 52}
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
        >
          {w} mm
        </text>
      </g>

      {/* Right height dimension line */}
      <g
        stroke="currentColor"
        strokeWidth="1"
        fontFamily="var(--font-mono)"
        fontSize="12"
      >
        <line x1={x + pw + 34} y1={y} x2={x + pw + 34} y2={y + ph} />
        <line x1={x + pw + 28} y1={y} x2={x + pw + 40} y2={y} />
        <line x1={x + pw + 28} y1={y + ph} x2={x + pw + 40} y2={y + ph} />
        <text
          x={x + pw + 52}
          y={y + ph / 2}
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          transform={`rotate(90 ${x + pw + 52} ${y + ph / 2})`}
        >
          {h} mm
        </text>
      </g>
    </svg>
  );
}

function Body({
  product,
  x,
  y,
  w,
  h,
  sections,
  swatch,
  handles,
}: {
  product: ProductId;
  x: number;
  y: number;
  w: number;
  h: number;
  sections: number;
  swatch: string;
  handles: boolean;
}) {
  const fill = swatch;

  if (product === "table") {
    const legW = Math.min(14, w * 0.05);
    const topH = Math.min(18, h * 0.28);
    return (
      <g strokeWidth="1.5">
        {/* top */}
        <rect x={x} y={y} width={w} height={topH} fill={fill} />
        {/* legs */}
        <rect x={x + 4} y={y + topH} width={legW} height={h - topH} fill={fill} />
        <rect
          x={x + w - legW - 4}
          y={y + topH}
          width={legW}
          height={h - topH}
          fill={fill}
        />
        {/* apron */}
        <line x1={x} y1={y + topH} x2={x + w} y2={y + topH} strokeWidth="1" />
      </g>
    );
  }

  if (product === "bed") {
    const headH = Math.min(h * 0.5, h);
    const baseY = y + h - Math.max(10, h * 0.18);
    return (
      <g strokeWidth="1.5">
        {/* headboard */}
        <rect x={x} y={y} width={w} height={headH} fill={fill} />
        {/* base / mattress line */}
        <rect x={x} y={baseY} width={w} height={y + h - baseY} fill={fill} />
        <line
          x1={x + w * 0.06}
          y1={baseY - 8}
          x2={x + w * 0.94}
          y2={baseY - 8}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </g>
    );
  }

  if (product === "bookshelf") {
    // horizontal shelves
    const rows = Math.max(2, sections);
    const lines = Array.from({ length: rows - 1 }, (_, i) => {
      const yy = y + (h / rows) * (i + 1);
      return <line key={i} x1={x} y1={yy} x2={x + w} y2={yy} strokeWidth="1" />;
    });
    return (
      <g strokeWidth="1.5">
        <rect x={x} y={y} width={w} height={h} fill={fill} />
        {lines}
      </g>
    );
  }

  // wardrobe / kitchen / tvunit → vertical fronts with handles
  const cols = Math.max(1, sections);
  const colW = w / cols;
  const dividers = Array.from({ length: cols - 1 }, (_, i) => {
    const xx = x + colW * (i + 1);
    return <line key={i} x1={xx} y1={y} x2={xx} y2={y + h} strokeWidth="1" />;
  });
  const handleEls = handles
    ? Array.from({ length: cols }, (_, i) => {
        const cx = x + colW * i + colW * 0.5;
        // handle near the vertical centre of each front, offset toward the gap
        const hx = cols > 1 && i < cols - 1 ? cx + colW * 0.32 : cx + colW * 0.3;
        const hy = y + h * 0.5;
        return (
          <line
            key={i}
            x1={hx}
            y1={hy - 14}
            x2={hx}
            y2={hy + 14}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })
    : null;

  return (
    <g strokeWidth="1.5">
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      {dividers}
      {handleEls}
    </g>
  );
}
