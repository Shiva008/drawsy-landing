"use client";

import { useEffect, useState } from "react";
import type { CompanionReleaseAssets } from "@/lib/companion/githubRelease";

export function useCompanionRelease() {
  const [release, setRelease] = useState<CompanionReleaseAssets | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/companion/release")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CompanionReleaseAssets | null) => {
        if (active && data) setRelease(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return release;
}
