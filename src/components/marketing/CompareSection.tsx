const TRADITIONAL = ["Information", "Prompt", "Answer", "Read"] as const;
const DRAWSY = ["Information", "Context", "AI", "Visualise"] as const;

/** public/Vector.svg — crisp vector tick, tinted per card */
function TickIcon() {
  return (
    <svg
      className="landing-compare-tick"
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M20.6106 2.14176C21.0375 3.24635 20.4388 4.0026 19.2801 4.74754C18.3451 5.3486 17.1539 5.99975 15.8917 7.113C14.6544 8.2043 13.4468 9.5187 12.3737 10.8125C11.3049 12.101 10.3965 13.336 9.7546 14.2505C9.3398 14.8414 8.761 15.7229 8.761 15.7229C8.35281 16.3687 7.61895 16.7596 6.83206 16.7498C6.045 16.74 5.32208 16.3312 4.93156 15.6751C3.93328 13.998 3.16296 13.3357 2.80891 13.0978C1.86158 12.4612 0.75 12.3671 0.75 10.8835C0.75 9.7054 1.74489 8.7503 2.97216 8.7503C3.83862 8.7823 4.64398 9.123 5.35756 9.6026C5.81369 9.9091 6.29689 10.3145 6.79948 10.8481C7.38934 10.0436 8.10016 9.1153 8.897 8.1547C10.0542 6.7597 11.4201 5.26309 12.8849 3.97116C14.3248 2.70115 15.9896 1.51235 17.7542 0.88381C18.9049 0.47397 20.1837 1.03718 20.6106 2.14176Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma sad-02 — padded viewBox; crop bottom + right via card overflow */
function SadFace() {
  return (
    <svg
      className="landing-compare-face-svg"
      viewBox="-10 -10 320 320"
      fill="none"
      aria-hidden
    >
      <circle
        cx="154"
        cy="150"
        r="125"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M91 114c9 10 26 10 35 0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M178 114c9 10 26 10 35 0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M104 212c18-20 74-20 92 0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Same circle geometry as sad — only the expression flips */
function HappyFace() {
  return (
    <svg
      className="landing-compare-face-svg"
      viewBox="-10 -10 320 320"
      fill="none"
      aria-hidden
    >
      <circle
        cx="154"
        cy="150"
        r="125"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M91 114c9-10 26-10 35 0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M178 114c9-10 26-10 35 0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M104 188c18 20 74 20 92 0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** “Most AI gives you an answer…” compare — Desktop-6 ~12265 */
export function CompareSection() {
  return (
    <section
      className="landing-compare"
      id="compare"
      aria-labelledby="landing-compare-title"
    >
      <div className="landing-compare-inner">
        <div className="landing-compare-frame">
          <h2 id="landing-compare-title" className="landing-compare-title" data-reveal>
            <span className="landing-compare-title-line">
              Most AI gives you an answer.
            </span>
            <span className="landing-compare-title-line">
              <span className="landing-compare-title-accent">Drawsy</span> helps
              you see it.
            </span>
          </h2>

          <div className="landing-compare-cards" data-reveal data-reveal-stagger>
            <article
              className="landing-compare-card is-traditional"
              data-reveal-child
            >
              <h3 className="landing-compare-card-title">Traditional AI</h3>
              <ul className="landing-compare-list">
                {TRADITIONAL.map((item) => (
                  <li key={item}>
                    <TickIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="landing-compare-face is-sad" aria-hidden>
                <SadFace />
              </div>
            </article>

            <article
              className="landing-compare-card is-drawsy"
              data-reveal-child
            >
              <h3 className="landing-compare-card-title">Drawsy</h3>
              <ul className="landing-compare-list">
                {DRAWSY.map((item) => (
                  <li key={item}>
                    <TickIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="landing-compare-face is-happy" aria-hidden>
                <HappyFace />
              </div>
              <div className="landing-compare-perk">
                <p>See + Understand</p>
                <p>Edit + Explore</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
