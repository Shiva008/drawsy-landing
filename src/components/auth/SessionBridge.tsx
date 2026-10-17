"use client";

import { getIdToken } from "firebase/auth";
import { useEffect } from "react";

import { getDrawsyAuth } from "@/lib/auth/firebase";
import { ensureDrawsySession } from "@/lib/auth/google";

const allowedCanvasOrigins = new Set([
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3001", "http://127.0.0.1:3001"]
    : []),
  "https://drawsyai.com",
]);

export function SessionBridge() {
  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (
        !allowedCanvasOrigins.has(event.origin) ||
        event.data?.type !== "drawsy-auth-session-request" ||
        !event.source
      ) {
        return;
      }

      const requestId =
        typeof event.data?.requestId === "string"
          ? event.data.requestId
          : undefined;

      const reply = (payload: Record<string, unknown>) => {
        (event.source as WindowProxy).postMessage(
          requestId ? { ...payload, requestId } : payload,
          event.origin,
        );
      };

      try {
        const auth = getDrawsyAuth();
        await auth.authStateReady();
        if (!auth.currentUser) {
          reply({ type: "drawsy-auth-session-none" });
          return;
        }
        const user = await ensureDrawsySession(auth.currentUser);
        const response = await fetch("/api/auth/handoff", {
          method: "POST",
          cache: "no-store",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ idToken: await getIdToken(user) }),
        });
        if (!response.ok) {
          reply({ type: "drawsy-auth-session-none" });
          return;
        }
        const { handoffCode } = (await response.json()) as {
          handoffCode: string;
        };
        reply({ type: "drawsy-auth-session-handoff", handoffCode });
      } catch {
        reply({ type: "drawsy-auth-session-none" });
      }
    };

    window.addEventListener("message", onMessage);
    // Notify parent with an allowlist when possible (avoid opaque "*")
    let readyTarget = "*";
    try {
      if (document.referrer) {
        readyTarget = new URL(document.referrer).origin;
      }
    } catch {
      readyTarget = "*";
    }
    window.parent.postMessage(
      { type: "drawsy-auth-session-bridge-ready" },
      readyTarget,
    );
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
