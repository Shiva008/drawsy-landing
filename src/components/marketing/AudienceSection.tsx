import { AudienceTrack } from "@/components/marketing/AudienceTrack";

const CARDS = [
  {
    id: "developers",
    title: "Developers",
    body: "Code, architecture, APIs, infrastructure, tickets, and documentation rarely tell the whole story in one place.",
    tone: "blue" as const,
    icon: "/source-code-square.png",
  },
  {
    id: "designers",
    title: "Designers",
    body: "Research, user flows, requirements, references, feedback, and product decisions are scattered across different places.",
    tone: "light" as const,
    icon: "/ai-paintbrush.png",
  },
  {
    id: "product-managers",
    title: "Product Managers",
    body: "Requirements, customer feedback, metrics, roadmaps, dependencies, and team discussions create a huge web of context.",
    tone: "green" as const,
    icon: "/columns-3-cog.png",
  },
  {
    id: "everyone-else",
    title: "Everyone Else",
    body: "Sometimes you just have a lot of information and need to understand it.",
    tone: "magenta" as const,
    icon: "/perplexity-ai.png",
  },
] as const;

export function AudienceSection() {
  return (
    <section
      className="landing-audience"
      id="use-cases"
      aria-labelledby="landing-audience-title"
    >
      <AudienceTrack
        heading={
          <div className="landing-audience-inner" data-reveal="soft">
            <h2 id="landing-audience-title" className="landing-audience-title">
              Information is everywhere.{" "}
              <span className="landing-audience-title-accent">Understanding</span>{" "}
              it isn&apos;t.
            </h2>
          </div>
        }
      >
        {CARDS.map((card) => (
          <article
            key={card.id}
            className={`landing-audience-card tone-${card.tone}`}
            role="listitem"
          >
            <h3 className="landing-audience-card-title">{card.title}</h3>
            <p className="landing-audience-card-body">{card.body}</p>
            <div className="landing-audience-card-icon" aria-hidden>
              {/* PNGs — smaller, fully inside card so the radius doesn’t clip */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.icon}
                alt=""
                width={260}
                height={260}
                className="landing-audience-card-icon-img"
                draggable={false}
              />
            </div>
          </article>
        ))}
      </AudienceTrack>
    </section>
  );
}
