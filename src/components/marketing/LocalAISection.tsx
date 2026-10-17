import Link from "next/link";
import { CompanionSmartDownloadButton } from "@/components/companion/CompanionSmartDownloadButton";
import { CompanionPlatformLogos } from "@/components/companion/CompanionPlatformLogos";
import { LocalAIBoard } from "@/components/marketing/LocalAIBoard";
import { companionLanding } from "@/lib/companion/content";

/**
 * Use the AI you already have. — board + Companion install CTAs (merged).
 */
export function LocalAISection() {
  return (
    <section
      className="landing-localai"
      id="companion"
      aria-labelledby="landing-localai-title"
    >
      <div className="landing-localai-inner">
        <div className="landing-localai-frame">
          <div data-reveal>
            <h2 id="landing-localai-title" className="landing-localai-title">
              Use the AI you{" "}
              <span className="landing-localai-title-accent">already have.</span>
            </h2>
            <p className="landing-localai-subtitle">{companionLanding.subtitle}</p>
          </div>

          <LocalAIBoard />

          {/* Companion install — centered under the board */}
          <div className="landing-localai-companion-cta" data-reveal>
            <p className="landing-localai-companion-hint">
              {companionLanding.installHint}
            </p>
            <div className="landing-localai-companion-actions">
              <CompanionSmartDownloadButton />
              <Link href="/companion" className="landing-btn-secondary">
                {companionLanding.learnMore}
              </Link>
            </div>
            <CompanionPlatformLogos className="landing-localai-companion-platforms" />
          </div>
        </div>
      </div>
    </section>
  );
}
