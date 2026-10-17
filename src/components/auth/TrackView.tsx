"use client";

import { useEffect } from "react";
import type { AnalyticsEvent } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/events";

export function TrackView({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event);
  }, [event]);

  return null;
}
