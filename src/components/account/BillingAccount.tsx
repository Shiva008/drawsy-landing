"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { getIdToken } from "firebase/auth";

import { authConfig } from "@/config/auth";
import { notifyAccountChanged } from "@/lib/auth/accountEvents";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import { ensureDrawsySession } from "@/lib/auth/google";
import { useAccountSessionSync } from "@/lib/auth/useAccountSessionSync";

type BillingPayload = {
  subscription: {
    status: string;
    currentEnd: number | null;
    cancelAtCycleEnd: boolean;
    variantId: string;
  } | null;
  entitlement: { plan: "free" | "pro"; graceUntil: number | null };
};

const statusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    case "past_due":
      return "Past due";
    case "authenticated":
      return "Confirming";
    default:
      return status.replace(/_/g, " ");
  }
};

function BillingAccountInner() {
  const searchParams = useSearchParams();
  const switchYearly = searchParams.get("intent") === "switch-yearly";
  const [data, setData] = useState<BillingPayload | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useAccountSessionSync({
    onRevoked: () => setData(null),
    onEntitlementChanged: () => setReloadToken((n) => n + 1),
    redirectToLogin: true,
    returnTo: authConfig.routes.billing,
  });

  const load = useCallback(async () => {
    // Await before any setState so mount effects don't sync-cascade.
    const response = await fetch("/api/billing/subscription", {
      cache: "no-store",
    });

    if (response.status === 401) {
      const auth = getDrawsyAuth();
      await auth.authStateReady();
      const user = auth.currentUser;
      if (!user) {
        window.location.replace(
          `${authConfig.routes.login}?returnTo=%2Fbilling`,
        );
        return;
      }
      const handoff = await fetch("/api/billing/handoff", {
        method: "POST",
        cache: "no-store",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          idToken: await getIdToken(await ensureDrawsySession(user)),
          returnTo: "billing",
        }),
      });
      if (!handoff.ok) {
        if (handoff.status === 401) {
          throw new Error("Your account session has expired. Sign in again.");
        }
        throw new Error("Could not open billing for this account.");
      }
      const payload = (await handoff.json()) as { redirectTo?: string };
      window.location.replace(payload.redirectTo ?? "/billing");
      return;
    }

    if (!response.ok) {
      throw new Error(
        response.status === 503
          ? "Billing is temporarily unavailable."
          : "Billing could not load.",
      );
    }

    const payload = (await response.json()) as BillingPayload;
    setError("");
    setData(payload);
  }, []);

  useEffect(() => {
    let active = true;
    // Defer so setState isn't synchronous in the effect body (react-hooks lint).
    const timer = window.setTimeout(() => {
      void load().catch((caught) => {
        if (!active) return;
        setError(
          caught instanceof Error ? caught.message : "Billing could not load.",
        );
      });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [load, reloadToken]);

  const cancel = async () => {
    if (!window.confirm("Cancel Pro at the end of the current billing cycle?")) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/billing/subscription", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Cancellation could not be scheduled.");
      notifyAccountChanged("entitlement-changed");
      await load();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Cancellation could not be scheduled.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <section className="account-card">
        <p className="account-muted">{error}</p>
        <div className="account-actions">
          <button
            type="button"
            className="account-btn account-btn-primary"
            onClick={() => {
              setError("");
              setData(null);
              setReloadToken((n) => n + 1);
            }}
          >
            Try again
          </button>
          <Link className="account-btn account-btn-secondary" href="/profile">
            Back to account
          </Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return <p className="account-muted">Loading billing…</p>;
  }

  if (!data.subscription) {
    return (
      <section className="account-card">
        <p className="account-card-kicker">Drawsy Pro</p>
        <h2 className="account-card-title">No active subscription</h2>
        <p className="account-muted account-copy">
          No subscription is attached to this account yet.
        </p>
        <div className="account-actions">
          <Link
            className="account-btn account-btn-primary"
            href="/billing/start?cadence=annual"
          >
            Upgrade to Pro
          </Link>
          <Link className="account-btn account-btn-secondary" href="/profile">
            Back to account
          </Link>
        </div>
      </section>
    );
  }

  const cancellationScheduled =
    data.subscription.cancelAtCycleEnd ||
    data.subscription.status === "cancelled" ||
    data.subscription.status === "canceled";
  const onMonthly = data.subscription.variantId?.endsWith(".monthly");

  return (
    <>
      {switchYearly && onMonthly ? (
        <section className="account-card account-card-soft">
          <p className="account-card-kicker">Switch to yearly</p>
          <h2 className="account-card-title">Save about 20% on Pro</h2>
          <p className="account-muted account-copy">
            Like Notion and Linear, cadence changes happen from billing — not by
            starting a second checkout. Cancel the monthly cycle below (or
            finish / clear a pending checkout), then start yearly Pro.
          </p>
          <div className="account-actions">
            <Link
              className="account-btn account-btn-primary"
              href="/billing/start?cadence=annual"
            >
              Start yearly after cancel
            </Link>
          </div>
        </section>
      ) : null}

      <section className="account-card">
        <div className="account-media-head">
          <div>
            <p className="account-card-kicker">Drawsy Pro</p>
            <h2 className="account-card-title">
              {data.entitlement.plan === "pro"
                ? "Active"
                : statusLabel(data.subscription.status)}
            </h2>
            <p className="account-muted account-copy">
              {data.subscription.currentEnd
                ? `Current access through ${new Date(data.subscription.currentEnd).toLocaleDateString()}`
                : "Billing period is being confirmed."}
            </p>
            {onMonthly ? (
              <p className="account-muted account-copy">Billed monthly.</p>
            ) : data.subscription.variantId?.endsWith(".annual") ? (
              <p className="account-muted account-copy">Billed yearly.</p>
            ) : null}
            {cancellationScheduled ? (
              <p className="account-muted account-copy">
                Cancellation is scheduled for the end of this cycle.
              </p>
            ) : null}
          </div>
          {!cancellationScheduled ? (
            <button
              type="button"
              className="account-btn account-btn-secondary"
              disabled={busy}
              onClick={cancel}
            >
              {busy ? "Scheduling…" : "Cancel at cycle end"}
            </button>
          ) : null}
        </div>
        <div className="account-actions">
          <Link className="account-btn account-btn-secondary" href="/profile">
            Back to account
          </Link>
        </div>
      </section>
    </>
  );
}

export function BillingAccount() {
  return (
    <Suspense fallback={<p className="account-muted">Loading billing…</p>}>
      <BillingAccountInner />
    </Suspense>
  );
}
