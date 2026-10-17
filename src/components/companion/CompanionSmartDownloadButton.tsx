"use client";

import {
  getCompanionInstallLabel,
  getCompanionPlatform,
  getCompanionPrimaryHref,
} from "@/lib/companion/downloads";
import { useCompanionOs } from "@/lib/companion/useCompanionOs";

type CompanionSmartDownloadButtonProps = {
  className?: string;
  /** When unknown OS, link here instead of #download on companion page. */
  fallbackHref?: string;
  unknownLabel?: string;
};

/**
 * SSR + first paint as "unknown", then client OS via useSyncExternalStore.
 * Avoids hydration mismatch from UA-based labels/hrefs.
 */
export function CompanionSmartDownloadButton({
  className = "landing-btn-primary",
  fallbackHref = "/companion#download",
  unknownLabel,
}: CompanionSmartDownloadButtonProps) {
  const os = useCompanionOs();
  const platform = getCompanionPlatform(os);
  const label = getCompanionInstallLabel(os, unknownLabel);
  const href = platform ? getCompanionPrimaryHref(os) : fallbackHref;
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className={className}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={
        platform
          ? `Install Drawsy Companion on ${platform.name}`
          : "Choose your platform to install Drawsy Companion"
      }
    >
      <span className="landing-btn-label">{label}</span>
    </a>
  );
}
