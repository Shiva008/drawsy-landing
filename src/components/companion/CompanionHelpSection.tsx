import { companionHelp } from "@/lib/companion/content";

export function CompanionHelpSection() {
  return (
    <section
      className="landing-companion-help"
      id="help"
      aria-labelledby="companion-help-title"
    >
      <div className="landing-companion-inner">
        <div className="landing-companion-help-head" data-reveal>
          <p className="landing-companion-kicker">{companionHelp.eyebrow}</p>
          <h2
            id="companion-help-title"
            className="landing-companion-section-title"
          >
            {companionHelp.title}
          </h2>
          <p className="landing-companion-section-sub">{companionHelp.subtitle}</p>
        </div>

        <div className="landing-companion-help-panel" data-reveal="soft">
          <div className="landing-companion-value-callout">
            <p className="landing-companion-value-callout-title">
              {companionHelp.valueTitle}
            </p>
            <p className="landing-companion-value-callout-lead">
              {companionHelp.valueLead}
            </p>
            <ul className="landing-companion-value-points">
              {companionHelp.valuePoints.map((point) => (
                <li key={point}>
                  <span className="landing-companion-point-check" aria-hidden>
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="landing-companion-help-list">
            {companionHelp.items.map((item) => (
              <details key={item.question} className="landing-companion-help-item">
                <summary className="landing-companion-help-summary">
                  <span>{item.question}</span>
                  <span className="landing-companion-help-chevron" aria-hidden>
                    ▾
                  </span>
                </summary>
                <p className="landing-companion-help-answer">
                  {item.answer}
                  {"links" in item && item.links?.length ? (
                    <>
                      {" "}
                      <a href={item.links[0].href}>{item.links[0].label}</a>.
                    </>
                  ) : null}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
