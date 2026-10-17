"use client";

import {
  companionAfterInstallSteps,
  companionConnect,
} from "@/lib/companion/content";

function StepDescription({
  description,
  links,
}: {
  description: string;
  links?: readonly { label: string; href: string }[];
}) {
  if (!links?.length) {
    return <>{description}</>;
  }

  return (
    <>
      {description}{" "}
      <a
        href={links[0].href}
        className="landing-companion-after-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {links[0].label}
      </a>
      {links[1] ? (
        <>
          {" · "}
          <a
            href={links[1].href}
            className="landing-companion-after-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {links[1].label}
          </a>
        </>
      ) : null}
    </>
  );
}

export function CompanionAfterInstallSteps() {
  return (
    <div className="landing-companion-after" data-reveal>
      <p className="landing-companion-kicker">{companionConnect.eyebrow}</p>
      <h2
        id="companion-connect-title"
        className="landing-companion-section-title landing-companion-after-section-title"
      >
        {companionConnect.title}
      </h2>
      <p className="landing-companion-section-sub landing-companion-connect-sub">
        {companionConnect.subtitle}
      </p>

      <ul
        className="landing-companion-after-row"
        aria-label={companionConnect.title}
      >
        {companionAfterInstallSteps.map((item, index) => (
          <li key={item.step} className="landing-companion-after-step">
            {index > 0 ? (
              <span className="landing-companion-after-arrow" aria-hidden>
                →
              </span>
            ) : null}
            <article className="landing-companion-after-card">
              <span className="landing-companion-after-num" aria-hidden>
                {item.step}
              </span>
              <span className="landing-companion-after-orb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt="" width={56} height={56} />
              </span>
              <h3 className="landing-companion-after-title">{item.name}</h3>
              <p className="landing-companion-after-body">
                <StepDescription
                  description={item.description}
                  links={"links" in item ? item.links : undefined}
                />
              </p>
            </article>
          </li>
        ))}
      </ul>

      <div className="landing-companion-connect-actions landing-companion-connect-actions--foot">
        <a
          href={companionConnect.openDrawsyHref}
          className="landing-btn-primary landing-companion-open-drawsy"
          target="_blank"
          rel="noopener noreferrer"
        >
          {companionConnect.openDrawsy}
        </a>
        <a href="#download" className="landing-companion-back-install">
          {companionConnect.backToInstall}
        </a>
      </div>
    </div>
  );
}
