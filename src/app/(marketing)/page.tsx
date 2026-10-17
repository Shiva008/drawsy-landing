import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";
import { authConfig } from "@/config/auth";
import { LandingNav } from "@/components/marketing/LandingNav";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { AudienceSection } from "@/components/marketing/AudienceSection";
import { ContextSection } from "@/components/marketing/ContextSection";
import { ConnectorsSection } from "@/components/marketing/ConnectorsSection";
import { ClaritySection } from "@/components/marketing/ClaritySection";
import { MagicSection } from "@/components/marketing/MagicSection";
import { VisualiseSection } from "@/components/marketing/VisualiseSection";
import { DevelopersSection } from "@/components/marketing/DevelopersSection";
import { CanvasSection } from "@/components/marketing/CanvasSection";
import { LocalAISection } from "@/components/marketing/LocalAISection";
import { CompareSection } from "@/components/marketing/CompareSection";
import { ConversationSection } from "@/components/marketing/ConversationSection";
import { CtaSection } from "@/components/marketing/CtaSection";
import { FooterSection } from "@/components/marketing/FooterSection";

export default function MarketingHomePage() {
  return (
    <main className="landing-page">
      <LandingNav />

      <section className="landing-hero" aria-label="Hero">
        {/* Sky background */}
        <div className="landing-hero-bg" aria-hidden>
          <Image
            src="/bg_landing_auth.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Frame 49 — soft blue glow (transparent ends via blur) */}
          <div className="landing-hero-glow" />

          {/* Frame 32 — fade to white at bottom */}
          <div className="landing-hero-fade" />
        </div>

        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Turn information into something you can{" "}
            <span className="landing-hero-title-accent">see</span>
            <span className="landing-hero-title-dot">.</span>
          </h1>

          <p className="landing-hero-subtitle">
            {brand.shortName} is an intelligent visualiser that turns prompts,
            information and connected sources into clear, editable diagrams.
          </p>

          <div className="landing-hero-actions">
            <Link
              href={authConfig.routes.signup}
              className="landing-btn-primary"
            >
              <span className="landing-btn-label">
                Visualise with {brand.shortName}
              </span>
            </Link>
            <a href="#how-it-works" className="landing-btn-secondary">
              See How it Works
            </a>
          </div>

          <div className="landing-hero-preview">
            <ProductPreview />
          </div>
        </div>
      </section>

      <AudienceSection />
      <ContextSection />
      <ConnectorsSection />
      <ClaritySection />
      <MagicSection />
      <VisualiseSection />
      <DevelopersSection />
      <CanvasSection />
      <LocalAISection />
      <CompareSection />
      <ConversationSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
