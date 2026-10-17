import Image from "next/image";

const CONNECTORS = [
  { id: "github", title: "GitHub", src: "/assets/logos-3d/github.png" },
  { id: "gmail", title: "Gmail", src: "/assets/logos-3d/gmail.png" },
  { id: "calendar", title: "Calendar", src: "/assets/logos-3d/calendar.png" },
  { id: "notion", title: "Notion", src: "/assets/logos-3d/notion.png" },
  { id: "google-drive", title: "Drive", src: "/assets/logos-3d/drive.png" },
  { id: "slack", title: "Slack", src: "/assets/logos-3d/slack.png" },
  { id: "hydradb", title: "HydraDB", src: "/assets/logos-3d/hydradb.png" },
  { id: "read-ai", title: "Read AI", src: "/assets/logos-3d/read-ai.png" },
  { id: "fireflies", title: "Fireflies", src: "/assets/logos-3d/fireflies.png" },
  { id: "aws", title: "AWS", src: "/assets/logos-3d/aws.png" },
  { id: "more-connectors", title: "More connectors", src: "/assets/logos-3d/more-plus.png" },
] as const;

const ROW_TOP = CONNECTORS.slice(0, 6);
const ROW_BOTTOM = CONNECTORS.slice(6);

function ConnectorTile({
  id,
  title,
  src,
}: {
  id: string;
  title: string;
  src: string;
}) {
  return (
    <li id={`connector-${id}`} className="landing-connectors-item">
      <span className="landing-connectors-tile" title={title}>
        <Image
          src={src}
          alt={title}
          width={128}
          height={128}
          className="landing-connectors-icon"
          sizes="(max-width: 560px) 64px, (max-width: 900px) 72px, (max-width: 1400px) 96px, 112px"
          quality={90}
        />
      </span>
    </li>
  );
}

/** Connectors — “Your tools. Your context. One place.” */
export function ConnectorsSection() {
  return (
    <section
      className="landing-connectors"
      id="connectors"
      aria-labelledby="landing-connectors-heading"
    >
      <div className="landing-connectors-inner">
        <div className="landing-connectors-copy" data-reveal>
          <h2 id="landing-connectors-heading" className="landing-connectors-eyebrow">
            Connect your{" "}
            <span className="landing-connectors-eyebrow-accent">world</span>
          </h2>
          <p className="landing-connectors-title">
            Your tools.
            <br />
            Your context.
            <br />
            <span className="landing-connectors-title-accent">One</span> place.
          </p>
        </div>

        {/* One soft band — not 11 logo pops */}
        <div
          className="landing-connectors-logos"
          aria-label="Supported connectors"
          data-reveal="soft"
        >
          <ul className="landing-connectors-row landing-connectors-row-top">
            {ROW_TOP.map((item) => (
              <ConnectorTile key={item.id} {...item} />
            ))}
          </ul>
          <ul className="landing-connectors-row landing-connectors-row-bottom">
            {ROW_BOTTOM.map((item) => (
              <ConnectorTile key={item.id} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
