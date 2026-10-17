"use client";

import {
  canonicalizeCanvasUrl,
  isDrawsyCanvasOrigin,
} from "@/config/site";
import { getDrawsyCanvasOrigin } from "./canvasHandoff";
import type { DrawsyAuthResult } from "./google";

export function resolveAuthDestination(returnTo: string | null) {
  const canvasOrigin = getDrawsyCanvasOrigin();
  let destination = canonicalizeCanvasUrl(canvasOrigin);

  if (returnTo) {
    try {
      const candidate = canonicalizeCanvasUrl(
        new URL(returnTo, window.location.origin),
      );
      if (
        candidate.origin === new URL(canvasOrigin).origin ||
        candidate.origin === window.location.origin ||
        isDrawsyCanvasOrigin(candidate.origin)
      ) {
        destination = candidate;
      }
    } catch {
      destination = canonicalizeCanvasUrl(canvasOrigin);
    }
  }

  return { canvasOrigin, destination };
}

export function destinationIsCanvas(returnTo: string | null) {
  if (!returnTo) return true;
  if (returnTo.startsWith("/") && !returnTo.startsWith("//")) return false;
  try {
    const candidate = canonicalizeCanvasUrl(returnTo);
    return (
      (process.env.NODE_ENV === "development" &&
        (candidate.origin === "http://localhost:3001" ||
          candidate.origin === "http://127.0.0.1:3001")) ||
      isDrawsyCanvasOrigin(candidate.origin)
    );
  } catch {
    return true;
  }
}

export function completeAuthRedirect(result: DrawsyAuthResult, returnTo: string | null) {
  const { canvasOrigin, destination } = resolveAuthDestination(returnTo);
  if (
    destination.origin === new URL(canvasOrigin).origin &&
    result.handoffCode
  ) {
    destination.searchParams.set("drawsy_auth_handoff", result.handoffCode);
  }
  window.location.assign(destination.toString());
}
