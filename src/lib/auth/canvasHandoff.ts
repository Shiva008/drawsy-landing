import { canonicalizeCanvasUrl, siteConfig } from "@/config/site";

const BRIDGE_TIMEOUT_MS = 4_000;

export const getDrawsyCanvasOrigin = () => {
  if (process.env.NODE_ENV === "development") {
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost") {
        return "http://localhost:3001";
      }
      if (window.location.hostname === "127.0.0.1") {
        return "http://127.0.0.1:3001";
      }
    }
  }
  return canonicalizeCanvasUrl(siteConfig.appUrl).origin;
};

/**
 * Ask an already-open Drawsy canvas for a one-time account handoff.
 * Canvas keeps the Firebase session and returns only an opaque code.
 */
export const requestCanvasAuthHandoff = () =>
  new Promise<string | null>((resolve) => {
    const canvasOrigin = getDrawsyCanvasOrigin();
    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    const frame = document.createElement("iframe");
    let settled = false;

    const cleanup = (handoffCode: string | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      frame.remove();
      resolve(handoffCode);
    };

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== canvasOrigin ||
        event.source !== frame.contentWindow
      ) {
        return;
      }
      const message = event.data as {
        type?: unknown;
        requestId?: unknown;
        handoffCode?: unknown;
      } | null;
      if (message?.type === "drawsy-auth-session-bridge-ready") {
        frame.contentWindow?.postMessage(
          {
            type: "drawsy-auth-session-request",
            requestId,
          },
          canvasOrigin,
        );
        return;
      }
      if (message?.requestId !== requestId) {
        return;
      }
      if (message.type === "drawsy-auth-session-none") {
        cleanup(null);
        return;
      }
      if (
        message.type === "drawsy-auth-session-handoff" &&
        typeof message.handoffCode === "string"
      ) {
        cleanup(message.handoffCode);
      }
    };

    const timeout = window.setTimeout(() => cleanup(null), BRIDGE_TIMEOUT_MS);
    window.addEventListener("message", onMessage);
    frame.hidden = true;
    frame.setAttribute("aria-hidden", "true");
    frame.src = `${canvasOrigin}/auth/session-bridge`;
    document.body.appendChild(frame);
  });
