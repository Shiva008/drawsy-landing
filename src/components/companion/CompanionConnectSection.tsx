"use client";

import { useEffect, useRef } from "react";
import { CompanionAfterInstallSteps } from "@/components/companion/CompanionAfterInstallSteps";

/** Post-install walkthrough — hero links here via `#after-install`. */
export function CompanionConnectSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash !== "#after-install") return;
      const el = sectionRef.current;
      if (!el) return;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      requestAnimationFrame(() => {
        el.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="landing-companion-connect"
      id="after-install"
      aria-labelledby="companion-connect-title"
    >
      <div className="landing-companion-inner">
        <CompanionAfterInstallSteps />
      </div>
    </section>
  );
}
