"use client";

import { useState } from "react";
import { companionDownload } from "@/lib/companion/content";
import { companionOsLabels, type InstallOs } from "@/lib/companion/downloads";
import { useCompanionOsSelection } from "@/lib/companion/CompanionOsProvider";
import { CompanionTerminalBlock } from "@/components/companion/CompanionTerminalBlock";

type PackageManager = "npm" | "pnpm" | "bun";

function getCliInstallCommand(os: InstallOs, manager: PackageManager) {
  const install =
    manager === "npm"
      ? "install --global --ignore-scripts @drawsy/companion@latest"
      : "add --global --ignore-scripts @drawsy/companion@latest";

  if (os === "windows") {
    const executable =
      manager === "npm" ? "npm.cmd" : manager === "pnpm" ? "pnpm.cmd" : "bun";
    return `${executable} ${install}; if ($LASTEXITCODE -eq 0) { drawsy-companion.cmd setup }`;
  }

  return `${manager} ${install} && drawsy-companion setup`;
}

/** Third install path — tucked under Download so Setup is not another install zone. */
export function CompanionNodeCliOptional() {
  const { selectedOs, needsPlatformPick } = useCompanionOsSelection();
  const [packageManager, setPackageManager] =
    useState<PackageManager>("npm");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const cliCommand = selectedOs
    ? getCliInstallCommand(selectedOs, packageManager)
    : null;

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

  return (
    <details className="landing-companion-cli-optional" data-reveal="soft">
      <summary className="landing-companion-cli-optional-summary">
        <span>{companionDownload.cliOptionalSummary}</span>
        <span className="landing-companion-cli-optional-chevron" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="landing-companion-cli-optional-body">
        <p className="landing-companion-surface-desc">
          {companionDownload.cliOptionalDescription}
        </p>
        {needsPlatformPick ? (
          <p className="landing-companion-setup-hint">
            {companionDownload.choosePlatformHint}
          </p>
        ) : (
          <>
            <div
              className="landing-companion-os-pills landing-companion-os-pills--compact"
              role="group"
              aria-label="Package manager"
            >
              {(["npm", "pnpm", "bun"] as const).map((manager) => (
                <button
                  key={manager}
                  type="button"
                  onClick={() => setPackageManager(manager)}
                  aria-pressed={packageManager === manager}
                  className={`landing-companion-os-pill${
                    packageManager === manager ? " is-active" : ""
                  }`}
                >
                  {manager}
                </button>
              ))}
            </div>
            {cliCommand && selectedOs ? (
              <CompanionTerminalBlock
                shellLabel={
                  selectedOs === "windows"
                    ? `PowerShell · ${packageManager}`
                    : `Terminal · ${packageManager}`
                }
                command={cliCommand}
                copyKey="cli"
                copyStatus={copyStatus}
                onCopy={(key, value) => void copy(key, value)}
              />
            ) : null}
            {selectedOs ? (
              <p className="landing-companion-cli-os-note">
                Uses the same {companionOsLabels[selectedOs]} system selected
                above.
              </p>
            ) : null}
          </>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {copyStatus?.endsWith("-ok")
          ? "Command copied to clipboard"
          : copyStatus?.endsWith("-fail")
            ? "Could not copy command"
            : ""}
      </p>
    </details>
  );
}
