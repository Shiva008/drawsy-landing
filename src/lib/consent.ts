/**
 * Cookie / tracking consent helpers.
 *
 * Today Drawsy only sets essential cookies (auth, billing session, account
 * sync). Analytics is a no-op placeholder. When a real analytics/marketing
 * vendor is added, gate it with `hasConsent("analytics")` and show a CMP
 * with “Essential only” / “Accept all” (and optional category toggles).
 */

export type ConsentCategory = "essential" | "analytics" | "marketing";

export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: number;
};

const STORAGE_KEY = "drawsy_consent_v1";

export const defaultConsent = (): ConsentPreferences => ({
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: 0,
});

export const readConsent = (): ConsentPreferences => {
  if (typeof window === "undefined") return defaultConsent();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConsent();
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt:
        typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return defaultConsent();
  }
};

export const writeConsent = (
  next: Pick<ConsentPreferences, "analytics" | "marketing">,
) => {
  const value: ConsentPreferences = {
    essential: true,
    analytics: Boolean(next.analytics),
    marketing: Boolean(next.marketing),
    updatedAt: Date.now(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("drawsy-consent-changed", { detail: value }));
  return value;
};

export const hasConsent = (category: ConsentCategory) => {
  if (category === "essential") return true;
  const prefs = readConsent();
  return Boolean(prefs[category]);
};

/** True once the user has made any choice (banner can stay hidden). */
export const hasConsentChoice = () => readConsent().updatedAt > 0;
