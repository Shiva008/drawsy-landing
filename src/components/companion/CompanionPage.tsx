import Image from "next/image";
import { LandingNav } from "@/components/marketing/LandingNav";
import { FooterSection } from "@/components/marketing/FooterSection";
import { LocalAIBoard } from "@/components/marketing/LocalAIBoard";
import { CompanionSmartDownloadButton } from "@/components/companion/CompanionSmartDownloadButton";
import { CompanionPlatformLogos } from "@/components/companion/CompanionPlatformLogos";
import { CompanionInstallFlow } from "@/components/companion/CompanionInstallFlow";
import { companionHero } from "@/lib/companion/content";
import { CompanionHelpSection } from "@/components/companion/CompanionHelpSection";

export function CompanionPage() {
  return (
    <main className="landing-page landing-companion-page">
      <LandingNav />

      <section
        className="landing-companion-hero"
        aria-labelledby="companion-hero-title"
      >
        <div className="landing-companion-hero-bg" aria-hidden>
          <Image
            src="/bg_landing_auth.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="landing-companion-hero-fade" />
        </div>

        {/* Hero budget: brand eyebrow + headline + one sub + CTAs + platforms + one image */}
        <div className="landing-companion-hero-inner">
          <div className="landing-companion-hero-copy" data-reveal>
            <p className="landing-companion-eyebrow">{companionHero.eyebrow}</p>
            <h1
              id="companion-hero-title"
              className="landing-companion-hero-title"
            >
              {companionHero.titleLead}{" "}
              <span className="landing-companion-accent">
                {companionHero.titleAccent}
              </span>
            </h1>
            <p className="landing-companion-hero-sub">{companionHero.subtitle}</p>

            <div className="landing-companion-hero-actions">
              <CompanionSmartDownloadButton
                fallbackHref="#download"
                unknownLabel={companionHero.primaryCtaUnknown}
              />
              <a href="#after-install" className="landing-btn-secondary">
                {companionHero.secondaryCta}
              </a>
            </div>

            <CompanionPlatformLogos />
          </div>

          <div
            className="landing-companion-hero-media"
            data-reveal="soft"
            aria-label="Codex and OpenCode connect through Companion to your canvas"
          >
            <LocalAIBoard
              className="landing-companion-hero-board"
              reveal={false}
            />
          </div>
        </div>
      </section>

      <CompanionInstallFlow />

      <CompanionHelpSection />

      <FooterSection />
    </main>
  );
}
