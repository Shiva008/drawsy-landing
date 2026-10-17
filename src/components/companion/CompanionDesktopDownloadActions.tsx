"use client";

import {
  companionRelease,
  companionDesktopSurface,
  type InstallOs,
} from "@/lib/companion/downloads";
import { companionDownload } from "@/lib/companion/content";
import { useCompanionRelease } from "@/lib/companion/useCompanionRelease";
import { useCompanionArchitecture } from "@/lib/companion/useCompanionArchitecture";

type CompanionDesktopDownloadActionsProps = {
  os: InstallOs;
};

export function CompanionDesktopDownloadActions({
  os,
}: CompanionDesktopDownloadActionsProps) {
  const release = useCompanionRelease();
  const arch = useCompanionArchitecture();
  const surface = companionDesktopSurface[os];
  const versionLabel = release ? `v${release.version}` : null;
  const macChipLabel =
    arch === "arm"
      ? "Apple Silicon"
      : arch === "x86"
        ? "Intel"
        : "Apple Silicon";

  return (
    <div className="landing-companion-surface-body">
      {versionLabel ? (
        <p className="landing-companion-release-version">
          Latest release:{" "}
          <span className="landing-companion-release-version-num">
            {versionLabel}
          </span>
        </p>
      ) : null}

      <a
        href={surface.primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="landing-btn-primary landing-companion-surface-cta"
      >
        <span className="landing-btn-label">{surface.primaryCta}</span>
        <span aria-hidden className="landing-companion-surface-cta-arrow">
          →
        </span>
      </a>

      {os === "windows" ? (
        <div className="landing-companion-direct-downloads">
          <a
            href={release?.windowsExeUrl ?? companionRelease.releasesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-btn-secondary landing-companion-direct-download"
          >
            {release?.windowsExeUrl
              ? `Download ${versionLabel ?? "latest"} (EXE)`
              : "Download from GitHub"}
          </a>
          <p className="landing-companion-surface-desc landing-companion-surface-desc--muted">
            {companionDownload.windowsDirectHint}
          </p>
          <a
            href={companionRelease.releasesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-companion-surface-alt-link"
          >
            All Windows files on GitHub (ZIP)
          </a>
        </div>
      ) : null}

      {os === "macos" && release?.macDmgUrl ? (
        <div className="landing-companion-direct-downloads">
          <a
            href={release.macDmgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-btn-secondary landing-companion-direct-download"
          >
            Download {versionLabel} · {macChipLabel} (DMG)
          </a>
          {release.macZipUrl ? (
            <a
              href={release.macZipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-companion-surface-alt-link"
            >
              ZIP for {macChipLabel}
            </a>
          ) : null}
          {arch === "x86" ? (
            <p className="landing-companion-surface-desc landing-companion-surface-desc--muted">
              Current GitHub builds are Apple Silicon. If you need Intel, check
              releases or use the terminal install.
            </p>
          ) : null}
        </div>
      ) : null}

      {os === "linux" && release?.linuxAppImageUrl ? (
        <div className="landing-companion-direct-downloads">
          <a
            href={release.linuxAppImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-btn-secondary landing-companion-direct-download"
          >
            Download {versionLabel} (AppImage)
          </a>
          {release.linuxDebUrl ? (
            <a
              href={release.linuxDebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-companion-surface-alt-link"
            >
              Debian / Ubuntu (.deb)
            </a>
          ) : null}
        </div>
      ) : null}

      {os !== "windows" && !release ? (
        <a
          href={companionRelease.releasesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="landing-companion-surface-alt-link"
        >
          View all releases on GitHub
        </a>
      ) : null}
    </div>
  );
}
