/** Frame 18 — Turning complexity to clarity (1440×2890) */

export function ClaritySection() {
  return (
    <section
      className="landing-clarity"
      id="clarity"
      aria-labelledby="landing-clarity-title"
    >
      <div className="landing-clarity-inner">
        <div className="landing-clarity-frame">
          <div data-reveal>
            <h2 id="landing-clarity-title" className="landing-clarity-title">
              Turning complexity to clarity.
            </h2>
            <p className="landing-clarity-subtitle">
              Bring the information you&apos;re already working with into Drawsy
              and see the relationships, structure, and bigger picture take shape.
            </p>
          </div>

          {/* 01 — Frame 34 + Frame 50 */}
          <div
            className="landing-clarity-panel landing-clarity-panel-1"
            aria-hidden
            data-reveal="soft"
          />
          <div className="landing-clarity-copy landing-clarity-copy-1" data-reveal>
            <p className="landing-clarity-num">01.</p>
            <h3 className="landing-clarity-step-title">The Mess</h3>
            <p className="landing-clarity-step-body">
              Drop in notes, docs, tickets, and threads — all the scattered
              pieces you already have.
            </p>
          </div>

          {/* 02 — Frame 52 + Frame 51 */}
          <div className="landing-clarity-copy landing-clarity-copy-2" data-reveal>
            <p className="landing-clarity-num">02.</p>
            <h3 className="landing-clarity-step-title">Drawsy Understands</h3>
            <p className="landing-clarity-step-body">
              Drawsy reads relationships and structure across your context.
            </p>
          </div>
          <div
            className="landing-clarity-panel landing-clarity-panel-2"
            aria-hidden
            data-reveal="soft"
          />

          {/* 03 — Frame 54 + Frame 53 */}
          <div
            className="landing-clarity-panel landing-clarity-panel-3"
            aria-hidden
            data-reveal="soft"
          />
          <div className="landing-clarity-copy landing-clarity-copy-3" data-reveal>
            <p className="landing-clarity-num">03.</p>
            <h3 className="landing-clarity-step-title">The Result</h3>
            <p className="landing-clarity-step-body">
              You get a clear, editable visual you can keep building on.
            </p>
          </div>

          <p className="landing-clarity-outro-title" data-reveal>
            Scattered information
            <br />
            → Visual understanding
          </p>

          <div className="landing-clarity-grid" aria-hidden data-reveal="soft">
            <div className="landing-clarity-grid-row">
              <div className="landing-clarity-tile is-wide" />
              <div className="landing-clarity-tile is-narrow" />
            </div>
            <div className="landing-clarity-grid-row">
              <div className="landing-clarity-tile is-narrow" />
              <div className="landing-clarity-tile is-wide" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
