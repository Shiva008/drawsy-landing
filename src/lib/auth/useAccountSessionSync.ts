"use client";

import { useEffect, useRef } from "react";

import { authConfig } from "@/config/auth";
import {
  isDrawsyAccountEvent,
  parseAccountEventMarker,
  readAccountEventMarker,
  type DrawsyAccountEventType,
} from "@/lib/auth/accountEvents";
import {
  logoutDrawsySession,
  shouldIgnoreAccountSync,
} from "@/lib/auth/logout";

type UseAccountSessionSyncOptions = {
  /** Called after local logout when session is revoked. */
  onRevoked?: () => void;
  /** Called when entitlement changes (same-origin / cookie). */
  onEntitlementChanged?: () => void;
  /** Redirect to login after revoke. Default true. */
  redirectToLogin?: boolean;
  /** returnTo query for login redirect. Defaults to current path. */
  returnTo?: string;
};

/**
 * Keeps account surfaces in sync across tabs and brand hosts:
 * BroadcastChannel (same origin) + drawsy_account_event_v1 cookie (cross-subdomain).
 */
export function useAccountSessionSync(
  options: UseAccountSessionSyncOptions = {},
) {
  const {
    onRevoked,
    onEntitlementChanged,
    redirectToLogin = true,
    returnTo,
  } = options;

  const onRevokedRef = useRef(onRevoked);
  const onEntitlementRef = useRef(onEntitlementChanged);

  useEffect(() => {
    onRevokedRef.current = onRevoked;
    onEntitlementRef.current = onEntitlementChanged;
  }, [onRevoked, onEntitlementChanged]);

  useEffect(() => {
    let lastMarker = readAccountEventMarker();
    let handlingRevoke = false;

    const handleEvent = async (type: DrawsyAccountEventType) => {
      // Same-tab logout already ran — don't revoke/redirect again.
      if (shouldIgnoreAccountSync()) {
        lastMarker = readAccountEventMarker() ?? lastMarker;
        return;
      }

      if (type === "entitlement-changed") {
        onEntitlementRef.current?.();
        return;
      }
      if (handlingRevoke) return;
      handlingRevoke = true;
      try {
        await logoutDrawsySession();
      } catch {
        /* best-effort */
      }
      onRevokedRef.current?.();
      if (redirectToLogin) {
        const dest =
          returnTo ||
          `${window.location.pathname}${window.location.search}` ||
          authConfig.routes.profile;
        window.location.replace(
          `${authConfig.routes.login}?returnTo=${encodeURIComponent(dest)}`,
        );
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (!isDrawsyAccountEvent(event.data)) return;
      // Align cookie cursor so the poll won't re-fire the same event.
      lastMarker = readAccountEventMarker() ?? lastMarker;
      void handleEvent(event.data.type);
    };

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel("drawsy-account-events-v1");
      channel.addEventListener("message", onMessage);
    }

    const poll = window.setInterval(() => {
      const marker = readAccountEventMarker();
      if (!marker || marker === lastMarker) return;
      lastMarker = marker;
      const parsed = parseAccountEventMarker(marker);
      if (parsed) void handleEvent(parsed.type);
    }, 2000);

    return () => {
      channel?.removeEventListener("message", onMessage);
      channel?.close();
      window.clearInterval(poll);
    };
  }, [redirectToLogin, returnTo]);
}
