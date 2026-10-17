import { companionPlatformGroups } from "@/lib/companion/downloads";

type CompanionPlatformLogosProps = {
  className?: string;
};

export function CompanionPlatformLogos({
  className = "",
}: CompanionPlatformLogosProps) {
  return (
    <div
      className={`landing-companion-platforms ${className}`.trim()}
      role="group"
      aria-label="Available for macOS, Windows, and Linux"
    >
      {companionPlatformGroups.map((group) => (
        <span key={group.id} className="landing-companion-platform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={group.logo}
            alt=""
            width={22}
            height={22}
            className="landing-companion-platform-logo"
            aria-hidden
          />
          <span className="landing-companion-platform-name">{group.name}</span>
        </span>
      ))}
    </div>
  );
}
