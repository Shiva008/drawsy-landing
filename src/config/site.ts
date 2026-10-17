/**
 * Drawsy uses two hosts on the same brand:
 *
 * app.drawsyai.com         → Landing, login, public marketing
 * drawsyai.com             → Free canvas / authenticated workspace
 */

export const domains = {
  /** This marketing / auth site. */
  marketing: "https://app.drawsyai.com",
  /** Product canvas + workspace. */
  product: "https://drawsyai.com",
} as const;

/** Legacy canvas host — never send users here after login/signup. */
const LEGACY_CANVAS_HOST_SUFFIX = "drawsyai.tech";

/**
 * Force canvas URLs onto https://drawsyai.com (rewrite legacy .tech hosts).
 */
export function canonicalizeCanvasUrl(input: string | URL): URL {
  const url = input instanceof URL ? new URL(input.toString()) : new URL(input);
  if (
    url.hostname === LEGACY_CANVAS_HOST_SUFFIX ||
    url.hostname.endsWith(`.${LEGACY_CANVAS_HOST_SUFFIX}`)
  ) {
    const next = new URL(domains.product);
    next.pathname = url.pathname || "/";
    next.search = url.search;
    next.hash = url.hash;
    return next;
  }
  return url;
}

export function isDrawsyCanvasOrigin(origin: string): boolean {
  try {
    const url = canonicalizeCanvasUrl(origin);
    return url.origin === domains.product;
  } catch {
    return false;
  }
}

export const siteConfig = {
  name: "Drawsy AI",
  shortName: "Drawsy",
  url: domains.marketing,
  /** Free canvas on the product host. */
  appUrl: domains.product,
  authUrl: "/login",
  profileUrl: "/profile",
  billingUrl: "/billing",
  appPricingUrl: "/pricing",
  email: "support@drawsyai.com",
  description:
    "Drawsy AI is an AI-native visual workspace that turns information, prompts, and connected context into clear, editable visuals.",
  category: "AI-native visual workspace",
  social: {
    twitter: "@DrawsyAI",
  },
} as const;
