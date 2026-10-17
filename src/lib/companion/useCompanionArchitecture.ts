"use client";

import { useEffect, useState } from "react";
import {
  detectCompanionArchitecture,
  type CompanionCpuArch,
} from "@/lib/companion/detectOs";

/** Async CPU arch for download labels (Apple Silicon vs Intel). */
export function useCompanionArchitecture(): CompanionCpuArch {
  const [arch, setArch] = useState<CompanionCpuArch>("unknown");

  useEffect(() => {
    let active = true;
    void detectCompanionArchitecture().then((next) => {
      if (active) setArch(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return arch;
}
