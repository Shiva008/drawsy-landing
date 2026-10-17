import Image from "next/image";

type LocalAIBoardProps = {
  className?: string;
  /** Soft reveal on the landing page; omit on companion hero if parent handles reveal. */
  reveal?: boolean;
};

/**
 * Codex + OpenCode → Companion → canvas board.
 * Shared by Local AI section + Companion page hero.
 */
export function LocalAIBoard({
  className = "",
  reveal = true,
}: LocalAIBoardProps) {
  return (
    <div
      className={`landing-localai-board ${className}`.trim()}
      {...(reveal ? { "data-reveal": "soft" } : {})}
    >
      <div className="landing-localai-wires" aria-hidden>
        <svg
          className="landing-localai-paths"
          viewBox="0 0 1360 620"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            className="landing-localai-path"
            d="M240 120 C300 120 300 310 340 310"
          />
          <path
            className="landing-localai-path"
            d="M240 500 C300 500 300 310 340 310"
          />
          <path className="landing-localai-path" d="M340 310 H400" />
          <path className="landing-localai-path" d="M640 310 H720" />
        </svg>
        <span className="landing-localai-dot d-codex" />
        <span className="landing-localai-dot d-opencode" />
        <span className="landing-localai-dot d-merge" />
        <span className="landing-localai-dot d-companion-in" />
        <span className="landing-localai-dot d-companion-out" />
        <span className="landing-localai-dot d-canvas" />
      </div>

      <article className="landing-localai-tile is-codex">
        <h3 className="landing-localai-tile-label">Codex</h3>
        <div className="landing-localai-tile-mark">
          <Image
            src="/icons/localai/codex.png"
            alt=""
            width={64}
            height={64}
            className="landing-localai-mark-img"
          />
        </div>
      </article>

      <article className="landing-localai-tile is-opencode">
        <h3 className="landing-localai-tile-label">OpenCode</h3>
        <div className="landing-localai-tile-mark">
          <Image
            src="/icons/localai/opencode.png"
            alt=""
            width={38}
            height={48}
            className="landing-localai-mark-img"
          />
        </div>
      </article>

      <div className="landing-localai-mobile-join" aria-hidden>
        <svg
          className="landing-localai-mobile-paths"
          viewBox="0 0 320 72"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            className="landing-localai-path"
            d="M80 0 V22 C80 48 160 48 160 72"
          />
          <path
            className="landing-localai-path"
            d="M240 0 V22 C240 48 160 48 160 72"
          />
        </svg>
        <span className="landing-localai-dot d-mobile-codex" />
        <span className="landing-localai-dot d-mobile-opencode" />
        <span className="landing-localai-dot d-mobile-merge" />
      </div>

      <article className="landing-localai-tile is-companion">
        <h3 className="landing-localai-tile-label">Companion</h3>
        <div className="landing-localai-tile-mark">
          <Image
            src="/drawsy_logo.png"
            alt=""
            width={64}
            height={64}
            className="landing-localai-mark-img"
          />
        </div>
      </article>

      <div className="landing-localai-mobile-stem" aria-hidden>
        <span className="landing-localai-mobile-line" />
        <span className="landing-localai-dot d-mobile-stem-top" />
        <span className="landing-localai-dot d-mobile-stem-bot" />
      </div>

      <div className="landing-localai-canvas" aria-hidden />
    </div>
  );
}
