"use client";

import { useState } from "react";
import { companionDownload } from "@/lib/companion/content";
import { buildCompanionAgentInstallPrompt } from "@/lib/companion/agentInstallPrompt";
import { CompanionTerminalBlock } from "@/components/companion/CompanionTerminalBlock";

export function CompanionAgentInstallPrompt() {
  const prompt = buildCompanionAgentInstallPrompt();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

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
    <article
      className="landing-companion-surface-card landing-companion-surface-card--agent"
      data-reveal="soft"
      aria-labelledby="companion-agent-prompt-title"
    >
      <header className="landing-companion-surface-head">
        <p className="landing-companion-surface-eyebrow">
          {companionDownload.agentPromptEyebrow}
        </p>
        <h3
          id="companion-agent-prompt-title"
          className="landing-companion-surface-title"
        >
          {companionDownload.agentPromptHeading}
        </h3>
        <p className="landing-companion-surface-desc">
          {companionDownload.agentPromptLead}
        </p>
        <p className="landing-companion-surface-desc landing-companion-surface-desc--muted">
          {companionDownload.agentPromptCompat}
        </p>
      </header>

      <CompanionTerminalBlock
        shellLabel={companionDownload.agentPromptBarLabel}
        command={prompt}
        copyKey="agent"
        copyStatus={copyStatus}
        onCopy={(key, value) => void copy(key, value)}
        copyLabels={{
          idle: companionDownload.agentPromptCopy,
          ok: companionDownload.agentPromptCopied,
          fail: companionDownload.agentPromptCopyFailed,
        }}
        codeLayout="scroll"
      />

      <div className="landing-companion-agent-next">
        <p className="landing-companion-agent-next-label">
          {companionDownload.agentPromptAfterCopyTitle}
        </p>
        <ol className="landing-companion-setup-steps landing-companion-setup-steps--compact">
          {companionDownload.agentPromptAfterCopySteps.map((step, index) => (
            <li key={step}>
              <span className="landing-companion-setup-step-num" aria-hidden>
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="sr-only" aria-live="polite">
        {copyStatus === "agent-ok"
          ? "Agent setup prompt copied to clipboard"
          : copyStatus === "agent-fail"
            ? "Could not copy prompt"
            : ""}
      </p>
    </article>
  );
}
