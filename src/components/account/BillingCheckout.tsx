"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useRef, useState } from "react";
import { getIdToken, onAuthStateChanged, type User } from "firebase/auth";

import { authConfig } from "@/config/auth";
import { notifyAccountChanged } from "@/lib/auth/accountEvents";
import {
  getDrawsyCanvasOrigin,
  requestCanvasAuthHandoff,
} from "@/lib/auth/canvasHandoff";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import {
  ensureDrawsySession,
  exchangeDrawsyAuthHandoff,
} from "@/lib/auth/google";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

let checkoutScriptPromise: Promise<void> | null = null;

const loadCheckout = () => {
  if (window.Razorpay) return Promise.resolve();
  if (checkoutScriptPromise) return checkoutScriptPromise;
  checkoutScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => {
          checkoutScriptPromise = null;
          reject(new Error("Checkout could not load."));
        },
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      checkoutScriptPromise = null;
      reject(new Error("Checkout could not load."));
    };
    document.head.appendChild(script);
  });
  return checkoutScriptPromise;
};

async function establishBillingSession(
  user: User,
  cadence: "monthly" | "annual",
) {
  const idToken = await getIdToken(await ensureDrawsySession(user));
  const response = await fetch("/api/billing/handoff", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      idToken,
      returnTo: "pricing",
      cadence,
    }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your account session has expired.");
    }
    if (response.status === 503) {
      throw new Error(
        "Billing is temporarily unavailable. Try again shortly.",
      );
    }
    throw new Error("Checkout could not start.");
  }
  return (await response.json()) as { redirectTo?: string };
}

function CheckoutShell({
  titleId,
  children,
  onClose,
}: {
  titleId: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="pricing-checkout-overlay" role="presentation">
      <button
        type="button"
        className="pricing-checkout-backdrop"
        aria-label="Close checkout"
        onClick={onClose}
      />
      <div
        className="pricing-checkout-card"
        id="checkout"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {children}
      </div>
    </div>
  );
}

function BillingCheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const titleId = useId();
  const mode = params.get("billing");
  const cadence = params.get("cadence") === "monthly" ? "monthly" : "annual";
  const [busy, setBusy] = useState(mode === "start");
  const [message, setMessage] = useState("");
  /** When set to current `mode`, the Pro probe for that mode finished. */
  const [probedMode, setProbedMode] = useState<string | null>(null);
  const checkingExisting = mode === "ready" && probedMode !== "ready";
  const handoffStarted = useRef(false);

  const closeCheckout = () => {
    router.replace("/pricing", { scroll: false });
  };

  // Already on Pro → skip checkout UI; billing page owns management.
  useEffect(() => {
    if (mode !== "ready") return;
    let active = true;
    void fetch("/api/billing/subscription", {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!active) return;
        if (response.ok) {
          const payload = (await response.json()) as {
            subscription?: { status?: string } | null;
            entitlement?: { plan?: string };
          };
          if (
            payload.subscription ||
            payload.entitlement?.plan === "pro"
          ) {
            window.location.replace(authConfig.routes.billing);
            return;
          }
        }
        if (active) setProbedMode("ready");
      })
      .catch(() => {
        if (active) setProbedMode("ready");
      });
    return () => {
      active = false;
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "start") return;
    const auth = getDrawsyAuth();
    return onAuthStateChanged(auth, (user) => {
      if (handoffStarted.current) return;

      void (async () => {
        try {
          let sessionUser = user;
          if (!sessionUser) {
            const handoffCode = await requestCanvasAuthHandoff();
            if (handoffCode) {
              sessionUser = await exchangeDrawsyAuthHandoff(handoffCode);
            }
          }
          if (!sessionUser) {
            const returnTo = `${window.location.pathname}${window.location.search}`;
            window.location.replace(
              `${authConfig.routes.login}?returnTo=${encodeURIComponent(returnTo)}`,
            );
            return;
          }
          handoffStarted.current = true;
          const { redirectTo } = await establishBillingSession(
            sessionUser,
            cadence,
          );
          window.location.replace(
            redirectTo ?? `/pricing?billing=ready&cadence=${cadence}`,
          );
        } catch (error) {
          handoffStarted.current = false;
          setMessage(
            error instanceof Error
              ? error.message
              : "Checkout could not start.",
          );
          setBusy(false);
        }
      })();
    });
  }, [cadence, mode]);

  if (mode === "invalid" || mode === "expired") {
    return (
      <CheckoutShell titleId={titleId} onClose={closeCheckout}>
        <p className="pricing-eyebrow">Checkout</p>
        <h2 id={titleId} className="pricing-checkout-title">
          {mode === "expired"
            ? "This checkout link expired"
            : "This checkout link is invalid"}
        </h2>
        <p className="pricing-lead">
          Start again from a Pro plan — it only takes a moment.
        </p>
        <div className="pricing-checkout-actions">
          <Link
            href={`/billing/start?cadence=${cadence}`}
            className="pricing-card-cta is-primary"
          >
            Restart Pro checkout
          </Link>
          <button
            type="button"
            className="pricing-card-cta is-outline"
            onClick={closeCheckout}
          >
            Back to plans
          </button>
        </div>
      </CheckoutShell>
    );
  }

  if (mode !== "ready" && mode !== "start") return null;

  // Avoid flashing the pay panel while we confirm they are not already Pro.
  if (mode === "ready" && checkingExisting) {
    return (
      <CheckoutShell titleId={titleId} onClose={closeCheckout}>
        <p className="pricing-eyebrow">Secure checkout</p>
        <h2 id={titleId} className="pricing-checkout-title">
          Checking your plan…
        </h2>
        <p className="pricing-lead">One moment while we confirm your account.</p>
      </CheckoutShell>
    );
  }

  const begin = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/billing/subscription", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cadence }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: { code?: string; message?: string } | string;
        } | null;
        const code =
          typeof payload?.error === "object" ? payload.error?.code : undefined;
        const detail =
          typeof payload?.error === "object"
            ? payload.error?.message
            : typeof payload?.error === "string"
              ? payload.error
              : undefined;
        if (code === "subscription_already_exists" || response.status === 409) {
          window.location.replace(authConfig.routes.billing);
          return;
        }
        if (response.status === 401) {
          throw new Error("Your billing session expired. Start Pro again.");
        }
        throw new Error(detail || "Subscription could not be created.");
      }
      const checkout = (await response.json()) as {
        keyId: string;
        subscriptionId: string;
        variant: { displayPrice: string; period: string; currency?: string };
      };
      await loadCheckout();
      const instance = new window.Razorpay!({
        key: checkout.keyId,
        subscription_id: checkout.subscriptionId,
        name: "Drawsy AI",
        description: `Drawsy Pro ${checkout.variant.period}${
          checkout.variant.displayPrice
            ? ` · ${checkout.variant.displayPrice}`
            : ""
        }`,
        handler: async (result: Record<string, string>) => {
          try {
            const verify = await fetch("/api/billing/verify", {
              method: "POST",
              credentials: "same-origin",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                paymentId: result.razorpay_payment_id,
                subscriptionId: result.razorpay_subscription_id,
                signature: result.razorpay_signature,
              }),
            });
            if (!verify.ok) {
              setMessage(
                "Payment was received but verification is still pending. Open Billing in a moment, or contact support if Pro does not unlock.",
              );
              setBusy(false);
              return;
            }
            notifyAccountChanged("entitlement-changed");
            setMessage("Drawsy Pro is active. Returning to your canvas…");
            const destination = new URL(
              "/?billing=success",
              getDrawsyCanvasOrigin(),
            ).href;
            window.setTimeout(() => {
              window.location.href = destination;
            }, 900);
          } catch {
            setMessage(
              "Payment was received but verification is still pending. Open Billing in a moment, or contact support if Pro does not unlock.",
            );
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
        theme: { color: "#6b5fe0" },
      });
      instance.open();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Checkout could not start.",
      );
      setBusy(false);
    }
  };

  return (
    <CheckoutShell titleId={titleId} onClose={closeCheckout}>
      <p className="pricing-eyebrow">Secure checkout</p>
      <h2 id={titleId} className="pricing-checkout-title">
        {mode === "start"
          ? "Preparing your secure checkout"
          : "Complete your Pro upgrade"}
      </h2>
      <p className="pricing-lead">
        {mode === "start"
          ? "Confirming your Drawsy account…"
          : `Razorpay will securely handle your ${cadence} Pro payment.`}
      </p>
      {mode === "ready" ? (
        <div className="pricing-checkout-actions">
          <button
            type="button"
            className="pricing-card-cta is-primary"
            disabled={busy}
            onClick={begin}
          >
            {busy ? "Opening checkout…" : `Pay with Razorpay · ${cadence} Pro`}
          </button>
          <button
            type="button"
            className="pricing-card-cta is-outline"
            onClick={closeCheckout}
          >
            Back to plans
          </button>
        </div>
      ) : null}
      {message ? (
        <p className="pricing-checkout-message">
          {message}{" "}
          {message.toLowerCase().includes("billing") ||
          message.toLowerCase().includes("pending") ? (
            <Link href="/billing">Manage billing</Link>
          ) : null}
        </p>
      ) : null}
    </CheckoutShell>
  );
}

export function BillingCheckout() {
  // No overlay fallback — only show dialog when billing=* is actually active.
  return (
    <Suspense fallback={null}>
      <BillingCheckoutInner />
    </Suspense>
  );
}
