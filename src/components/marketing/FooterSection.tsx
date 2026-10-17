import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Use Cases", href: "/#use-cases" },
  { label: "Companion", href: "/companion" },
  { label: "Connectors", href: "/#connectors" },
  { label: "Resources", href: "/#resources" },
  { label: "Pricing", href: "/pricing" },
] as const;

/**
 * Footer — links + original Drawsy sketch asset (unprocessed).
 */
export function FooterSection() {
  return (
    <footer className="landing-footer" id="resources">
      <div className="landing-footer-frame">
        <nav className="landing-footer-nav" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="landing-footer-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="landing-footer-mark-clip" aria-hidden>
          <div className="landing-footer-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/drawsy_sketch.png"
              alt=""
              width={1024}
              height={433}
              className="landing-footer-mark-img"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
