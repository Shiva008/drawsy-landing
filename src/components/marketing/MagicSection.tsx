import { MagicVector } from "@/components/marketing/MagicVector";

/**
 * “The Magic” — Explain it / Draw it / See it come alive + Frame 63 demo
 * Figma Desktop-6 band ~7000–8140
 */
export function MagicSection() {
  return (
    <section
      className="landing-magic"
      id="magic"
      aria-labelledby="landing-magic-headline"
    >
      {/* Vector 28 — full-bleed edge→edge (outside pad) */}
      <div className="landing-magic-vector" aria-hidden>
        <MagicVector />
      </div>

      <div className="landing-magic-inner">
        <div className="landing-magic-frame">
          <div data-reveal>
            <p className="landing-magic-label">The Magic</p>

            <h2 id="landing-magic-headline" className="landing-magic-headline">
              <span className="landing-magic-line landing-magic-line-1">
                Explain it.
              </span>
              <span className="landing-magic-line landing-magic-line-2">
                Draw it.
              </span>
              <span className="landing-magic-line landing-magic-line-3">
                See it come alive.
              </span>
            </h2>

            <p className="landing-magic-body">
              Drawsy can turn ideas into live visual explanations, creating,
              changing, and demonstrating the canvas as you explore a concept.
            </p>
          </div>

          {/* Frame 63 */}
          <div className="landing-magic-demo" data-reveal="soft">
            <p className="landing-magic-demo-eyebrow">User&apos;s Example</p>
            <p className="landing-magic-demo-prompt">
              “Explain photosynthesis.”
            </p>

            <div className="landing-magic-demo-panel">
              <div className="landing-magic-demo-shot" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
