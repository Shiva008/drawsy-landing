"use client";

import { useCallback, useEffect, useState } from "react";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

import { getDrawsyAuth } from "@/lib/auth/firebase";
import { ensureDrawsySession } from "@/lib/auth/google";
import { useAccountSessionSync } from "@/lib/auth/useAccountSessionSync";
import type { BillingCadence } from "@/lib/billing/catalog";

export type BillingEntitlementState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "free" }
  | {
      status: "pro";
      /** True only when entitlement.plan is pro (paid/access live). */
      active: boolean;
      /** Pending checkout / provider sync (e.g. status created). */
      pending: boolean;
      subscriptionStatus: string | null;
      cancelAtCycleEnd: boolean;
      /** monthly | annual from variantId when known. */
      cadence: BillingCadence | null;
      variantId: string | null;
    }
  | { status: "error" };

type SubscriptionPayload = {
  subscription: {
    status: string;
    cancelAtCycleEnd: boolean;
    variantId?: string;
  } | null;
  entitlement: {
    plan: "free" | "pro";
    graceUntil: number | null;
    billingState?: string;
  };
};

const cadenceFromVariantId = (variantId?: string | null): BillingCadence | null => {
  if (!variantId) return null;
  if (variantId.endsWith(".monthly")) return "monthly";
  if (variantId.endsWith(".annual")) return "annual";
  return null;
};

async function ensureBillingCookie(user: NonNullable<
  ReturnType<typeof getDrawsyAuth>["currentUser"]
>) {
  const idToken = await getIdToken(await ensureDrawsySession(user));
  const response = await fetch("/api/billing/handoff", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      idToken,
      returnTo: "pricing",
      cadence: "annual",
    }),
  });
  return response.ok;
}

async function fetchSubscription() {
  return fetch("/api/billing/subscription", {
    cache: "no-store",
    credentials: "same-origin",
  });
}

/**
 * After login, resolve Free vs Pro via GET /api/billing/subscription
 * (billing session cookie + handoff). Uses variantId for monthly/annual.
 */
export function useBillingEntitlement() {
  const [state, setState] = useState<BillingEntitlementState>({
    status: "loading",
  });
  const [refresh, setRefresh] = useState(0);

  useAccountSessionSync({
    onRevoked: () => setState({ status: "anonymous" }),
    onEntitlementChanged: () => setRefresh((n) => n + 1),
    redirectToLogin: false,
  });

  const resolve = useCallback(async () => {
    const auth = getDrawsyAuth();
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) {
      setState({ status: "anonymous" });
      return;
    }

    let response = await fetchSubscription();
    if (response.status === 401) {
      const ok = await ensureBillingCookie(user);
      if (!ok) {
        setState({ status: "error" });
        return;
      }
      response = await fetchSubscription();
    }

    if (!response.ok) {
      setState({ status: "error" });
      return;
    }

    const payload = (await response.json()) as SubscriptionPayload;
    const variantId = payload.subscription?.variantId ?? null;
    const cadence = cadenceFromVariantId(variantId);
    const subStatus = payload.subscription?.status ?? null;
    const active = payload.entitlement?.plan === "pro";
    const pending = Boolean(
      payload.subscription &&
        !active &&
        subStatus &&
        !["cancelled", "canceled", "expired", "completed"].includes(subStatus),
    );

    if (active || pending || payload.subscription) {
      setState({
        status: "pro",
        active,
        pending: pending || (!active && Boolean(payload.subscription)),
        subscriptionStatus: subStatus,
        cancelAtCycleEnd: Boolean(payload.subscription?.cancelAtCycleEnd),
        cadence,
        variantId,
      });
      return;
    }
    setState({ status: "free" });
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    try {
      const auth = getDrawsyAuth();
      unsubscribe = onAuthStateChanged(auth, () => {
        if (!active) return;
        void resolve().catch(() => {
          if (active) setState({ status: "error" });
        });
      });
    } catch {
      queueMicrotask(() => {
        if (active) setState({ status: "anonymous" });
      });
    }
    return () => {
      active = false;
      unsubscribe();
    };
  }, [resolve, refresh]);

  return state;
}

export const isProEntitlement = (state: BillingEntitlementState) =>
  state.status === "pro";

export const viewingMatchesCadence = (
  state: BillingEntitlementState,
  billing: "monthly" | "yearly",
) => {
  if (state.status !== "pro" || !state.cadence) return false;
  const viewing: BillingCadence = billing === "yearly" ? "annual" : "monthly";
  return state.cadence === viewing;
};
