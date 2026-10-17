/** Figma Vector 28 — public/vector_28.png, soft lavender like Desktop-6 */
export function MagicVector() {
  return (
    <svg
      className="landing-magic-vector-svg"
      viewBox="0 0 1609 640"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="magic-v28-fill"
          x1="0"
          y1="80"
          x2="1609"
          y2="560"
          gradientUnits="userSpaceOnUse"
        >
          {/* Left purple/magenta → right blue (Figma Vector 28) */}
          <stop stopColor="#CE36E2" />
          <stop offset="0.35" stopColor="#8030F1" />
          <stop offset="0.65" stopColor="#6B5FE0" />
          <stop offset="1" stopColor="#322BFF" />
        </linearGradient>

        <filter id="magic-v28-boost" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="5" intercept="0" />
            <feFuncG type="linear" slope="5" intercept="0" />
            <feFuncB type="linear" slope="5" intercept="0" />
          </feComponentTransfer>
        </filter>

        <mask
          id="magic-v28-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1609"
          height="640"
        >
          <image
            href="/vector_28.png"
            width="1609"
            height="640"
            filter="url(#magic-v28-boost)"
            preserveAspectRatio="none"
          />
        </mask>
      </defs>

      <rect
        width="1609"
        height="640"
        fill="url(#magic-v28-fill)"
        mask="url(#magic-v28-mask)"
      />
    </svg>
  );
}
