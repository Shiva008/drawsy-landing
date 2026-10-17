const CARDS = [
  {
    id: "systems",
    title: "Systems",
    body: "See how system connects",
    items: [
      "Architecture",
      "Services",
      "Dependencies",
      "Infrastructure",
      "APIs",
    ],
    tone: "magenta",
  },
  {
    id: "code",
    title: "Code",
    body: "See relationships inside your code.",
    items: ["Code Bases", "Modules", "Dependencies", "Architecture"],
    tone: "purple",
  },
  {
    id: "data",
    title: "Data",
    body: "Make complex structures visible.",
    items: [
      "Relationships",
      "Entities",
      "Evidence",
      "Information Structure",
    ],
    tone: "blue",
  },
  {
    id: "workflows",
    title: "Workflows",
    body: "Understand how processes move.",
    items: [
      "User Journeys",
      "Business Processes",
      "Automation",
      "Decision Flows",
    ],
    tone: "green",
  },
  {
    id: "ideas",
    title: "Ideas & Research",
    body: "Turn scattered thinking into a visual map.",
    items: ["Research", "Concepts", "References", "Findings", "Ideas"],
    tone: "yellow",
  },
] as const;

/** “What can you visualise?” — Desktop-6 ~8260 */
export function VisualiseSection() {
  return (
    <section
      className="landing-visualise"
      id="visualise"
      aria-labelledby="landing-visualise-title"
    >
      <div className="landing-visualise-inner">
        <div className="landing-visualise-frame">
          <div data-reveal>
            <h2 id="landing-visualise-title" className="landing-visualise-title">
              What can you{" "}
              <span className="landing-visualise-title-accent">visualise</span>?
            </h2>

            <p className="landing-visualise-subtitle">
              Visualise systems, workflows, code, data, and ideas, and see how
              everything connects.
            </p>
          </div>

          <ul className="landing-visualise-grid" data-reveal data-reveal-stagger>
            {CARDS.map((card) => (
              <li
                key={card.id}
                className={`landing-visualise-card tone-${card.tone}`}
                data-reveal-child
              >
                <h3 className="landing-visualise-card-title">{card.title}</h3>
                <p className="landing-visualise-card-body">{card.body}</p>
                <ul className="landing-visualise-card-list">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
