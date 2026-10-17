"use client";

import { CompanionOsProvider } from "@/lib/companion/CompanionOsProvider";
import { CompanionInstallSection } from "@/components/companion/CompanionInstallSection";
import { CompanionConnectSection } from "@/components/companion/CompanionConnectSection";

/**
 * Full companion install + connect flow:
 * 1. Install (desktop, terminal, optional Node CLI) — one section
 * 2. Connect (5-step walkthrough + Open Drawsy)
 */
export function CompanionInstallFlow() {
  return (
    <CompanionOsProvider>
      <section
        className="landing-companion-download"
        id="download"
        aria-labelledby="companion-download-title"
      >
        <div className="landing-companion-inner">
          <CompanionInstallSection />
        </div>
      </section>

      <CompanionConnectSection />
    </CompanionOsProvider>
  );
}
