export function AuthDivider() {
  return (
    <div className="or-divider" role="separator">
      <DashLine />
      <span className="or-divider-text">Or</span>
      <DashLine />
    </div>
  );
}

/**
 * Figma dashed line: 15 dashes, first & last shorter, equal mid dashes & gaps.
 * Width 303px (Figma Line 1 / Line 2).
 */
function DashLine() {
  const width = 303;
  const dashCount = 15;
  // short=1u, long=2u, gap=1u → 2*1 + 13*2 + 14*1 = 42u
  const unit = width / 42;
  const short = unit;
  const long = unit * 2;
  const gap = unit;

  const dashes: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < dashCount; i++) {
    const w = i === 0 || i === dashCount - 1 ? short : long;
    dashes.push({ x, w });
    x += w;
    if (i < dashCount - 1) x += gap;
  }

  return (
    <svg
      className="or-divider-line"
      viewBox={`0 0 ${width} 1`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {dashes.map((d, i) => (
        <rect
          key={i}
          x={d.x}
          y={0}
          width={d.w}
          height="1"
          fill="rgba(22, 22, 22, 0.2)"
        />
      ))}
    </svg>
  );
}
