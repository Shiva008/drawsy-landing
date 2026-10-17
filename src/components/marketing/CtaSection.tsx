import Link from "next/link";
import { brand } from "@/config/brand";
import { authConfig } from "@/config/auth";

/** Frame 26 — Ready to see it differently? (1360×360 @ ~14043) */

export function CtaSection() {
  return (
    <section
      className="landing-cta"
      id="cta"
      aria-labelledby="landing-cta-title"
    >
      <div className="landing-cta-inner">
        <div className="landing-cta-card" data-reveal>
          <div className="landing-cta-media" aria-hidden />
          <h2 id="landing-cta-title" className="landing-cta-title">
            Ready to see it differently?
          </h2>
          <p className="landing-cta-subtitle">
            Bring your ideas, information, and complexity to{" "}
            {brand.shortName}—and turn them into something you can see,
            understand, and explore.
          </p>
          <Link href={authConfig.routes.signup} className="landing-cta-btn">
            Visualise with {brand.shortName}
          </Link>
        </div>
      </div>
    </section>
  );
}
