"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authConfig } from "@/config/auth";
import { authMessages } from "@/config/auth-messages";
import { analyticsEvents } from "@/lib/analytics/events";
import { requestCanvasAuthHandoff } from "@/lib/auth/canvasHandoff";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import {
  ensureDrawsySession,
  exchangeDrawsyAuthHandoff,
  type DrawsyAuthResult,
} from "@/lib/auth/google";
import { readPrefillEmail } from "@/lib/auth/email-query";
import {
  completeAuthRedirect,
  destinationIsCanvas,
} from "@/lib/auth/redirect";
import { AuthDivider } from "./AuthDivider";
import { GoogleButton } from "./GoogleButton";
import { LoginForm } from "./LoginForm";
import { TrackView } from "./TrackView";
import { TwitterButton } from "./TwitterButton";
import { VerifyEmailPanel } from "./VerifyEmailPanel";

function LoginViewInner() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const initialEmail = readPrefillEmail(searchParams);
  const createHandoff = destinationIsCanvas(returnTo);
  const isAccountReturn = (() => {
    if (!returnTo) return false;
    const path = returnTo.startsWith("http")
      ? (() => {
          try {
            return new URL(returnTo).pathname;
          } catch {
            return "";
          }
        })()
      : returnTo.split("?")[0] ?? "";
    return (
      path === authConfig.routes.profile ||
      path === authConfig.routes.billing ||
      path === authConfig.routes.pricing ||
      path.startsWith(`${authConfig.routes.billing}/`)
    );
  })();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [checkingCanvasSession, setCheckingCanvasSession] = useState(true);

  const handleSuccess = useCallback(
    (result: DrawsyAuthResult) => {
      if (result.verificationRequired) {
        setVerifyEmail(result.email ?? "");
        setError(null);
        return;
      }
      setRedirecting(true);
      completeAuthRedirect(result, returnTo);
    },
    [returnTo],
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const auth = getDrawsyAuth();
        await auth.authStateReady();
        if (!active) return;

        // Already signed in locally with a Drawsy session → leave login.
        if (auth.currentUser) {
          try {
            await ensureDrawsySession(auth.currentUser);
            if (!active) return;
            setRedirecting(true);
            completeAuthRedirect({}, returnTo);
            return;
          } catch {
            /* unverified / bootstrap failed — fall through to form */
          }
        }

        // Account deep-links: try an open canvas session next.
        if (isAccountReturn) {
          try {
            const handoffCode = await requestCanvasAuthHandoff();
            if (!active) return;
            if (handoffCode) {
              const user = await exchangeDrawsyAuthHandoff(handoffCode);
              if (!active || !user) return;
              setRedirecting(true);
              completeAuthRedirect({}, returnTo);
              return;
            }
          } catch {
            if (active) {
              setError(
                "Could not connect to your open canvas. You can sign in below.",
              );
            }
          }
        }
      } finally {
        if (active) setCheckingCanvasSession(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAccountReturn, returnTo]);

  if (verifyEmail !== null) {
    return (
      <VerifyEmailPanel
        email={verifyEmail}
        createCanvasHandoff={createHandoff}
        onVerified={handleSuccess}
        onUseDifferentEmail={() => setVerifyEmail(null)}
      />
    );
  }

  if (checkingCanvasSession) {
    return (
      <p className="auth-subtitle" role="status" aria-live="polite">
        Checking your session…
      </p>
    );
  }

  return (
    <>
      <TrackView event={analyticsEvents.login_viewed} />

      <h1 className="auth-title">See it come together.</h1>
      <p className="auth-subtitle auth-subtitle-login">
        Sign in to continue turning information into visual understanding.
      </p>

      {redirecting ? (
        <p className="auth-subtitle" role="status" aria-live="polite">
          {authMessages.redirecting}
        </p>
      ) : null}

      {error ? (
        <p className="mb-3 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="auth-google-wrap">
        <GoogleButton
          intent="login"
          createCanvasHandoff={createHandoff}
          disabled={redirecting}
          onSuccess={handleSuccess}
          onError={setError}
        />
        <TwitterButton
          intent="login"
          createCanvasHandoff={createHandoff}
          disabled={redirecting}
          onSuccess={handleSuccess}
          onError={setError}
        />
      </div>

      <AuthDivider />
      <LoginForm
        createCanvasHandoff={createHandoff}
        initialEmail={initialEmail}
        returnTo={returnTo}
        disabled={redirecting}
        onSuccess={handleSuccess}
        onError={setError}
      />
    </>
  );
}

export function LoginView() {
  return (
    <Suspense fallback={<p className="auth-subtitle">Loading…</p>}>
      <LoginViewInner />
    </Suspense>
  );
}
