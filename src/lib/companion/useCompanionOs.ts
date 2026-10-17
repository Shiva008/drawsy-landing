"use client";

import { useSyncExternalStore } from "react";
import {
  detectCompanionOs,
  type CompanionOsId,
} from "@/lib/companion/downloads";

const subscribe = () => () => {};

/**
 * Client OS for install CTAs — SSR / first paint stays `"unknown"`.
 * Uses UA Client Hints → navigator.platform → UA (see detectOs.ts).
 */
export function useCompanionOs(): CompanionOsId {
  return useSyncExternalStore(
    subscribe,
    detectCompanionOs,
    () => "unknown",
  );
}
