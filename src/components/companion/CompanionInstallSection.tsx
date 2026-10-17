"use client";

import { useState } from "react";
import {
  allInstallOs,
  companionDesktopSurface,
  companionOsLabels,
  desktopInstallCommands,
  getCompanionPlatform,
  type InstallOs,
} from "@/lib/companion/downloads";
import { companionDownload } from "@/lib/companion/content";
import { useCompanionOsSelection } from "@/lib/companion/CompanionOsProvider";
import { CompanionTerminalBlock } from "@/components/companion/CompanionTerminalBlock";
import { CompanionNodeCliOptional } from "@/components/companion/CompanionNodeCliOptional";
import { CompanionAgentInstallPrompt } from "@/components/companion/CompanionAgentInstallPrompt";
import { CompanionDesktopDownloadActions } from "@/components/companion/CompanionDesktopDownloadActions";

function shellLabel(os: InstallOs) {
  return os === "windows" ? "PowerShell / Command Prompt" : "Terminal";
}

export function CompanionInstallSection() {
  const {
    selectedOs,
    isAutoDetected,
    chooseOtherPlatform,
    selectOs,
    needsPlatformPick,
  } = useCompanionOsSelection();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const platform = selectedOs ? getCompanionPlatform(selectedOs) : null;
  const surface = selectedOs ? companionDesktopSurface[selectedOs] : null;
  const command = selectedOs ? desktopInstallCommands[selectedOs] : null;

  const sectionTitle =
    platform && isAutoDetected
      ? `${companionDownload.titleForPlatform} ${platform.name}`
      : companionDownload.title;

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${key}-ok`);
      window.setTimeout(() => setCopyStatus(null), 1800);
    } catch {
      setCopyStatus(`${key}-fail`);
      window.setTimeout(() => setCopyStatus(null), 2200);
    }
  }

  const showOsPills = needsPlatformPick || !isAutoDetected;

  return (
    <>
      <div data-reveal>
        <p className="landing-companion-kicker">{companionDownload.eyebrow}</p>
        <h2
          id="companion-download-title"
          className="landing-companion-section-title"
        >
          {sectionTitle}
        </h2>
        <p className="landing-companion-section-sub">
          {needsPlatformPick
            ? companionDownload.subtitleUnknown
            : companionDownload.subtitle}
        </p>
        {isAutoDetected && platform ? (
          <p className="landing-companion-detected-note">
            Detected {platform.name} ·{" "}
            <button
              type="button"
              className="landing-companion-detected-change"
              onClick={chooseOtherPlatform}
            >
              {companionDownload.otherPlatformPrompt}
            </button>
          </p>
        ) : null}
      </div>

      <div className="landing-companion-surfaces" data-reveal="soft">
        <article className="landing-companion-surface-card">
          <header className="landing-companion-surface-head">
            <p className="landing-companion-surface-eyebrow">
              {selectedOs
                ? companionDownload.desktopCardTitleForYou
                : companionDownload.desktopCardTitle}
            </p>
            <h3 className="landing-companion-surface-title">
              <span>{platform?.name ?? "Pick your system"}</span>
              {surface && selectedOs ? (
                <span className="landing-companion-recommended-badge">
                  {companionDownload.desktopRecommendedBadge}
                </span>
              ) : null}
            </h3>
            <p className="landing-companion-surface-desc">
              {surface?.description ?? companionDownload.choosePlatformHint}
            </p>
          </header>

          {showOsPills ? (
            <div
              className={`landing-companion-os-pills${
                needsPlatformPick
                  ? " landing-companion-os-pills--surface"
                  : " landing-companion-os-pills--compact"
              }`}
              role="group"
              aria-label="Choose your computer"
            >
              {allInstallOs.map((os) => (
                <button
                  key={os}
                  type="button"
                  onClick={() => selectOs(os)}
                  aria-pressed={selectedOs === os}
                  className={`landing-companion-os-pill${
                    selectedOs === os ? " is-active" : ""
                  }`}
                >
                  {companionOsLabels[os]}
                </button>
              ))}
            </div>
          ) : null}

          {surface && platform && selectedOs ? (
            <CompanionDesktopDownloadActions os={selectedOs} />
          ) : null}

          {platform ? (
            <div className="landing-companion-surface-preview" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={platform.logo} alt="" width={40} height={40} />
            </div>
          ) : null}
        </article>

        <article className="landing-companion-surface-card">
          <header className="landing-companion-surface-head">
            <p className="landing-companion-surface-eyebrow">
              {companionDownload.terminalCardTitle}
            </p>
            <h3 className="landing-companion-surface-title">
              {selectedOs
                ? `Install via ${companionOsLabels[selectedOs]} shell`
                : "Shell command"}
            </h3>
            <p className="landing-companion-surface-desc">
              {companionDownload.terminalCardDescription}
            </p>
          </header>

          {command && selectedOs ? (
            <>
              <CompanionTerminalBlock
                shellLabel={shellLabel(selectedOs)}
                command={command}
                copyKey="native"
                copyStatus={copyStatus}
                onCopy={(key, value) => void copy(key, value)}
              />
              <p className="landing-companion-surface-desc landing-companion-surface-desc--muted">
                {companionDownload.terminalSkipHint}
              </p>
            </>
          ) : (
            <p className="landing-companion-setup-hint">
              {companionDownload.choosePlatformHint}
            </p>
          )}
        </article>
      </div>

      <div className="landing-companion-install-more">
        <CompanionAgentInstallPrompt />
        <CompanionNodeCliOptional />
      </div>

      <p className="sr-only" aria-live="polite">
        {copyStatus?.endsWith("-ok")
          ? "Command copied to clipboard"
          : copyStatus?.endsWith("-fail")
            ? "Could not copy command"
            : ""}
      </p>
    </>
  );
}
