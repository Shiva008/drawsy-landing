"use client";

type CopyLabels = {
  idle: string;
  ok: string;
  fail: string;
};

type CompanionTerminalBlockProps = {
  shellLabel: string;
  command: string;
  copyKey: string;
  copyStatus: string | null;
  onCopy: (key: string, value: string) => void;
  copyLabels?: CopyLabels;
  /** Long multi-line blocks (agent prompt). */
  codeLayout?: "inline" | "scroll";
};

const defaultCopyLabels: CopyLabels = {
  idle: "Copy command",
  ok: "Copied",
  fail: "Copy failed",
};

function copyLabel(
  copyStatus: string | null,
  key: string,
  labels: CopyLabels,
) {
  if (copyStatus === `${key}-ok`) return labels.ok;
  if (copyStatus === `${key}-fail`) return labels.fail;
  return labels.idle;
}

export function CompanionTerminalBlock({
  shellLabel,
  command,
  copyKey,
  copyStatus,
  onCopy,
  copyLabels = defaultCopyLabels,
  codeLayout = "inline",
}: CompanionTerminalBlockProps) {
  return (
    <div
      className={`landing-companion-terminal${
        codeLayout === "scroll" ? " landing-companion-terminal--scroll" : ""
      }`}
    >
      <div className="landing-companion-terminal-bar">
        <span>{shellLabel}</span>
        <button
          type="button"
          onClick={() => onCopy(copyKey, command)}
          className="landing-companion-copy"
        >
          {copyLabel(copyStatus, copyKey, copyLabels)}
        </button>
      </div>
      <pre className="landing-companion-terminal-code">
        <code>{command}</code>
      </pre>
    </div>
  );
}
