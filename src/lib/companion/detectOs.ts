export type CompanionOsId = "macos" | "windows" | "linux" | "unknown";
export type CompanionCpuArch = "arm" | "x86" | "unknown";

type NavigatorUADataLike = {
  mobile?: boolean;
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{
    architecture?: string;
    bitness?: string;
    platform?: string;
    mobile?: boolean;
  }>;
};

function getUaData(): NavigatorUADataLike | null {
  if (typeof navigator === "undefined") return null;
  const data = (
    navigator as Navigator & { userAgentData?: NavigatorUADataLike }
  ).userAgentData;
  return data ?? null;
}

function mapPlatformToken(raw: string): CompanionOsId | null {
  const platform = raw.trim().toLowerCase();
  if (!platform) return null;
  if (platform === "windows") return "windows";
  if (platform === "macos" || platform === "mac os") return "macos";
  // Chrome OS is not a supported Companion target — force a manual pick.
  if (platform === "chrome os" || platform === "chromeos") return "unknown";
  if (platform === "linux") return "linux";
  if (
    platform === "android" ||
    platform === "ios" ||
    platform === "ipados"
  ) {
    return "unknown";
  }
  return null;
}

function isTouchMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform = (navigator.platform || "").toLowerCase();
  return platform.startsWith("mac") && navigator.maxTouchPoints > 1;
}

/**
 * Desktop OS for Companion install CTAs.
 * Order matches modern download pages (Cursor / VS Code style):
 * 1) User-Agent Client Hints (`navigator.userAgentData`) — Chromium
 * 2) `navigator.platform` — Safari / Firefox
 * 3) User-Agent string — last resort
 * Phones / tablets / iPadOS → `"unknown"` (manual pick).
 */
export function detectCompanionOs(userAgent = ""): CompanionOsId {
  if (typeof navigator === "undefined" && !userAgent) return "unknown";

  // 1) UA Client Hints (Chrome, Edge, Brave, Opera, …)
  const uaData = getUaData();
  if (uaData) {
    if (uaData.mobile) return "unknown";
    const fromHints = mapPlatformToken(uaData.platform || "");
    if (fromHints) {
      // iPadOS can still report macOS in some environments — touch check.
      if (fromHints === "macos" && isTouchMac()) return "unknown";
      return fromHints;
    }
  }

  // 2) navigator.platform (Safari / Firefox; still the best sync signal there)
  if (typeof navigator !== "undefined") {
    const navPlatform = (navigator.platform || "").toLowerCase();
    if (navPlatform.startsWith("win")) return "windows";
    if (navPlatform.startsWith("mac")) {
      if (isTouchMac()) return "unknown";
      return "macos";
    }
    if (navPlatform.includes("linux")) {
      const ua = (navigator.userAgent || "").toLowerCase();
      if (/android/.test(ua)) return "unknown";
      if (/cros/.test(ua)) return "unknown";
      return "linux";
    }
  }

  // 3) User-Agent string
  const ua = (
    userAgent ||
    (typeof navigator !== "undefined" ? navigator.userAgent : "") ||
    ""
  ).toLowerCase();

  if (!ua) return "unknown";
  if (/iphone|ipod|android/.test(ua)) return "unknown";
  if (/ipad/.test(ua)) return "unknown";
  if (/mobile/.test(ua) && !/windows/.test(ua)) return "unknown";
  if (/cros/.test(ua)) return "unknown";
  if (isTouchMac()) return "unknown";

  if (/windows|win64|win32|wow64/.test(ua)) return "windows";
  if (/macintosh|mac os x|mac_powerpc/.test(ua)) return "macos";
  if (/linux|x11/.test(ua)) return "linux";
  return "unknown";
}

function mapArchitecture(raw: string | undefined): CompanionCpuArch {
  const value = (raw || "").toLowerCase();
  if (!value) return "unknown";
  if (value === "arm" || value.startsWith("arm")) return "arm";
  if (value === "x86" || value === "x86_64" || value.includes("x86")) {
    return "x86";
  }
  return "unknown";
}

/**
 * Optional CPU architecture (Apple Silicon vs Intel / x64 vs ARM).
 * Uses UA-CH high-entropy hints when the browser allows it; otherwise unknown.
 */
export async function detectCompanionArchitecture(): Promise<CompanionCpuArch> {
  const uaData = getUaData();
  if (!uaData?.getHighEntropyValues) return "unknown";
  try {
    const hints = await uaData.getHighEntropyValues([
      "architecture",
      "bitness",
      "platform",
    ]);
    return mapArchitecture(hints.architecture);
  } catch {
    return "unknown";
  }
}
