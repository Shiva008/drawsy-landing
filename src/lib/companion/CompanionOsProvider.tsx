"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CompanionOsId, InstallOs } from "@/lib/companion/downloads";
import { useCompanionOs } from "@/lib/companion/useCompanionOs";

type CompanionOsSelection = {
  detected: CompanionOsId;
  selectedOs: InstallOs | null;
  isAutoDetected: boolean;
  chooseOtherPlatform: () => void;
  selectOs: (os: InstallOs) => void;
  needsPlatformPick: boolean;
};

const CompanionOsContext = createContext<CompanionOsSelection | null>(null);

export function CompanionOsProvider({ children }: { children: ReactNode }) {
  const detected = useCompanionOs();
  const [manualOs, setManualOs] = useState<InstallOs | null>(null);
  const [ignoreDetection, setIgnoreDetection] = useState(false);

  const value = useMemo((): CompanionOsSelection => {
    const autoOs = detected === "unknown" ? null : detected;
    const effectiveAuto = ignoreDetection ? null : autoOs;
    const selectedOs = manualOs ?? effectiveAuto;
    const isAutoDetected =
      Boolean(autoOs) && !ignoreDetection && manualOs === null;

    return {
      detected,
      selectedOs,
      isAutoDetected,
      chooseOtherPlatform: () => {
        setIgnoreDetection(true);
        setManualOs(null);
      },
      selectOs: (os) => setManualOs(os),
      needsPlatformPick: selectedOs === null,
    };
  }, [detected, ignoreDetection, manualOs]);

  return (
    <CompanionOsContext.Provider value={value}>
      {children}
    </CompanionOsContext.Provider>
  );
}

export function useCompanionOsSelection(): CompanionOsSelection {
  const ctx = useContext(CompanionOsContext);
  if (!ctx) {
    throw new Error(
      "useCompanionOsSelection must be used within CompanionOsProvider",
    );
  }
  return ctx;
}
