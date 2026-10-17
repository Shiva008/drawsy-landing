import { getDrawsyCanvasOrigin } from "./canvasHandoff";

export type DrawsyAccountEventType =
  | "entitlement-changed"
  | "session-revoked";

export type DrawsyAccountEvent = {
  source: "drawsy-account";
  type: DrawsyAccountEventType;
  at: number;
};

export const DRAWSY_ACCOUNT_EVENT_COOKIE = "drawsy_account_event_v1";

const accountEventCookieMaxAge = 300;

const accountEventMarker = (event: DrawsyAccountEvent) => {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${event.type}.${event.at}.${randomPart}`;
};

export const readAccountEventMarker = () => {
  if (typeof document === "undefined") return null;
  try {
    const prefix = `${DRAWSY_ACCOUNT_EVENT_COOKIE}=`;
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));
    if (!cookie) return null;
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return null;
  }
};

export const parseAccountEventMarker = (
  marker: string | null,
): DrawsyAccountEvent | null => {
  if (!marker) return null;
  const [type, timestamp] = marker.split(".");
  const at = Number(timestamp);
  if (
    (type !== "entitlement-changed" && type !== "session-revoked") ||
    !Number.isFinite(at)
  ) {
    return null;
  }
  return { source: "drawsy-account", type, at };
};

export const publishAccountEventMarker = (event: DrawsyAccountEvent) => {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const sharedDomain =
    window.location.hostname === "drawsyai.com" ||
    window.location.hostname.endsWith(".drawsyai.com")
      ? "; Domain=.drawsyai.com"
      : "";
  document.cookie = `${DRAWSY_ACCOUNT_EVENT_COOKIE}=${encodeURIComponent(
    accountEventMarker(event),
  )}; Max-Age=${accountEventCookieMaxAge}; Path=/; SameSite=Lax${secure}${sharedDomain}`;
};

export const isDrawsyAccountEvent = (
  value: unknown,
): value is DrawsyAccountEvent => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DrawsyAccountEvent>;
  return (
    candidate.source === "drawsy-account" &&
    (candidate.type === "entitlement-changed" ||
      candidate.type === "session-revoked") &&
    typeof candidate.at === "number"
  );
};

export const notifyAccountChanged = (type: DrawsyAccountEventType) => {
  const event: DrawsyAccountEvent = {
    source: "drawsy-account",
    type,
    at: Date.now(),
  };
  publishAccountEventMarker(event);
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("drawsy-account-events-v1");
    channel.postMessage(event);
    channel.close();
  }
  const canvasOrigin = getDrawsyCanvasOrigin();
  window.opener?.postMessage(event, canvasOrigin);
};
