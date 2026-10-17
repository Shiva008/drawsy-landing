import { getIdToken, signOut } from "firebase/auth";

import { notifyAccountChanged } from "./accountEvents";
import { getDrawsyAuth } from "./firebase";

/** Suppress same-tab session-sync while this tab is logging out. */
let ignoreSyncUntil = 0;

export const shouldIgnoreAccountSync = () => Date.now() < ignoreSyncUntil;

/**
 * Revoke Drawsy session (best-effort), clear billing cookie via BFF,
 * notify other surfaces, and Firebase sign-out.
 * Local sign-out always completes so tabs/cookies cannot desync.
 */
export async function logoutDrawsySession() {
  ignoreSyncUntil = Date.now() + 4_000;
  const auth = getDrawsyAuth();
  const user = auth.currentUser;
  let revokeFailed = false;

  try {
    if (user) {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: await getIdToken(user) }),
      });
      if (!response.ok && response.status !== 401) {
        revokeFailed = true;
      }
    } else {
      await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
    }
  } catch {
    revokeFailed = true;
  }

  notifyAccountChanged("session-revoked");
  try {
    await signOut(auth);
  } catch {
    /* ignore */
  }

  if (revokeFailed) {
    throw new Error("This device could not be signed out securely.");
  }
}
