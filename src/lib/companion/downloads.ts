import type { CompanionOsId } from "@/lib/companion/detectOs";

export type { CompanionOsId, CompanionCpuArch } from "@/lib/companion/detectOs";
export {
  detectCompanionOs,
  detectCompanionArchitecture,
} from "@/lib/companion/detectOs";

/** Drawsy Companion GitHub releases — https://github.com/DrawsyAI/drawsy-ai-companion */
export const companionRelease = {
  repo: "DrawsyAI/drawsy-ai-companion",
  releasesUrl:
    "https://github.com/DrawsyAI/drawsy-ai-companion/releases/latest",
  storeUrl: "https://apps.microsoft.com/detail/9PD4MGJ9BW4F",
  installScriptUrl:
    "https://raw.githubusercontent.com/DrawsyAI/drawsy-ai-companion/main/scripts/install.sh",
} as const;

export type CompanionDownloadOption = {
  id: string;
  label: string;
  hint?: string;
  href: string;
};

export type CompanionPlatformGroup = {
  id: "macos" | "windows" | "linux";
  name: string;
  logo: string;
  downloads: CompanionDownloadOption[];
};

export const companionPlatformGroups: CompanionPlatformGroup[] = [
  {
    id: "macos",
    name: "macOS",
    logo: "/assets/companion/apple.svg",
    downloads: [
      {
        id: "mac-downloads",
        label: "View Apple Silicon downloads",
        hint: "DMG installer and ZIP",
        href: companionRelease.releasesUrl,
      },
    ],
  },
  {
    id: "windows",
    name: "Windows",
    logo: "/assets/companion/windows.svg",
    downloads: [
      {
        id: "windows-store",
        label: "Install from Microsoft Store",
        hint: "Recommended",
        href: companionRelease.storeUrl,
      },
      {
        id: "windows-github-downloads",
        label: "Other Windows downloads on GitHub",
        hint: "EXE and ZIP; may show a Windows warning",
        href: companionRelease.releasesUrl,
      },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    logo: "/assets/companion/linux-tux.png",
    downloads: [
      {
        id: "linux-downloads",
        label: "View Linux downloads",
        hint: "AppImage and Debian/Ubuntu package",
        href: companionRelease.releasesUrl,
      },
    ],
  },
];

export type InstallOs = Exclude<CompanionOsId, "unknown">;

export const desktopInstallCommands: Record<InstallOs, string> = {
  windows: "winget install --id 9PD4MGJ9BW4F --source msstore",
  macos: `curl -fsSL ${companionRelease.installScriptUrl} | sh`,
  linux: `curl -fsSL ${companionRelease.installScriptUrl} | sh`,
};

export function getCompanionPlatform(os: CompanionOsId) {
  if (os === "unknown") return null;
  return companionPlatformGroups.find((group) => group.id === os) ?? null;
}

/** Primary install destination for the detected OS. */
export function getCompanionPrimaryHref(os: CompanionOsId): string {
  if (os === "windows") return companionRelease.storeUrl;
  if (os === "macos" || os === "linux") return companionRelease.releasesUrl;
  return "/companion#download";
}

export function getCompanionInstallLabel(
  os: CompanionOsId,
  unknownLabel = "Choose how to install",
): string {
  const platform = getCompanionPlatform(os);
  return platform ? `Install on ${platform.name}` : unknownLabel;
}

export const companionDesktopSurface: Record<
  InstallOs,
  { description: string; primaryCta: string; primaryHref: string }
> = {
  windows: {
    description:
      "Microsoft Store (recommended) or direct download — no terminal required.",
    primaryCta: "Install from Microsoft Store",
    primaryHref: companionRelease.storeUrl,
  },
  macos: {
    description:
      "DMG or ZIP for Apple Silicon from GitHub Releases.",
    primaryCta: "View macOS downloads",
    primaryHref: companionRelease.releasesUrl,
  },
  linux: {
    description:
      "AppImage or Debian/Ubuntu package from GitHub Releases.",
    primaryCta: "View Linux downloads",
    primaryHref: companionRelease.releasesUrl,
  },
};

export const companionOsLabels: Record<InstallOs, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

export const allInstallOs: InstallOs[] = ["windows", "macos", "linux"];
