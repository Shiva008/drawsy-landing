"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authMessages } from "@/config/auth-messages";
import { analyticsEvents } from "@/lib/analytics/events";
import type { DrawsyAuthResult } from "@/lib/auth/google";
import {
  completeAuthRedirect,
  destinationIsCanvas,
} from "@/lib/auth/redirect";
import { AuthDivider } from "./AuthDivider";
import { EmailSignupForm } from "./EmailSignupForm";
import { GoogleButton } from "./GoogleButton";
import { TrackView } from "./TrackView";
import { TwitterButton } from "./TwitterButton";
import { VerifyEmailPanel } from "./VerifyEmailPanel";

function SignupViewInner() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const createHandoff = destinationIsCanvas(returnTo);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

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

  return (
    <>
      <TrackView event={analyticsEvents.signup_viewed} />

      <h1 className="auth-title">Start seeing it differently.</h1>
      <p className="auth-subtitle">
        Create your Drawsy account and turn information into visual
        understanding.
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
          intent="signup"
          createCanvasHandoff={createHandoff}
          disabled={redirecting}
          onSuccess={handleSuccess}
          onError={setError}
        />
        <TwitterButton
          intent="signup"
          createCanvasHandoff={createHandoff}
          disabled={redirecting}
          onSuccess={handleSuccess}
          onError={setError}
        />
      </div>

      <AuthDivider />
      <EmailSignupForm
        disabled={redirecting}
        onSuccess={handleSuccess}
        onError={setError}
      />
    </>
  );
}

export function SignupView() {
  return (
    <Suspense fallback={<p className="auth-subtitle">Loading…</p>}>
      <SignupViewInner />
    </Suspense>
  );
}
