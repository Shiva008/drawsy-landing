import Image from "next/image";
import Link from "next/link";

const STEPS = [
  {
    id: "visual-context",
    label: "Visual Context",
    src: "/icons/developers/visual-context.png",
  },
  {
    id: "drawsy",
    label: "Drawsy",
    src: "/icons/developers/drawsy.png",
  },
  {
    id: "companion",
    label: "Companion",
    src: "/icons/developers/companion.png",
  },
  {
    id: "codex",
    label: "Codex/OpenCode",
    src: "/icons/developers/codex.png",
  },
  {
    id: "local",
    label: "Local Project",
    src: "/icons/developers/local-project.png",
  },
  {
    id: "preview",
    label: "Live Preview",
    src: "/icons/developers/live-preview.png",
  },
] as const;

/** “And for developers…” chain — Desktop-6 ~8908 */
export function DevelopersSection() {
  return (
    <section
      className="landing-developers"
      id="developers"
      aria-labelledby="landing-developers-title"
    >
      <div className="landing-developers-inner">
        <div className="landing-developers-frame">
          <div data-reveal>
            <h2
              id="landing-developers-title"
              className="landing-developers-title"
            >
              And for{" "}
              <span className="landing-developers-title-accent">developers</span>
              {", the visual can keep going."}
            </h2>

            <div className="landing-developers-cta">
              <Link
                href="/companion"
                className="landing-btn-primary landing-developers-btn"
              >
                <span className="landing-btn-label">Explore Companion</span>
              </Link>
            </div>
          </div>

          <ol className="landing-developers-chain" data-reveal="soft">
            {STEPS.map((step, index) => {
              const stacked = step.label.includes("/");
              const [line1, line2] = stacked
                ? step.label.split("/")
                : [step.label, null];

              return (
                <li key={step.id} className="landing-developers-pair">
                  {index > 0 ? (
                    <span className="landing-developers-link" aria-hidden />
                  ) : null}
                  <div className="landing-developers-step">
                    <div className="landing-developers-orb">
                      <Image
                        src={step.src}
                        alt=""
                        width={84}
                        height={84}
                        className="landing-developers-orb-img"
                        sizes="96px"
                      />
                    </div>
                    <p
                      className={
                        stacked
                          ? "landing-developers-label is-stacked"
                          : "landing-developers-label"
                      }
                    >
                      {stacked ? (
                        <>
                          {line1}/
                          <br />
                          {line2}
                        </>
                      ) : (
                        line1
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
