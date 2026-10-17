"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { authMessages } from "@/config/auth-messages";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import {
  getFirebaseAuthErrorCode,
  refreshDrawsyEmailVerification,
  resendDrawsyEmailVerification,
  type DrawsyAuthResult,
} from "@/lib/auth/google";
import { getAuthErrorMessage } from "@/lib/auth/errors";

type VerifyEmailPanelProps = {
  email: string;
  createCanvasHandoff: boolean;
  onVerified: (result: DrawsyAuthResult) => void;
  onUseDifferentEmail: () => void;
};

export function VerifyEmailPanel({
  email,
  createCanvasHandoff,
  onVerified,
  onUseDifferentEmail,
}: VerifyEmailPanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRefresh() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      onVerified(
        await refreshDrawsyEmailVerification({ createCanvasHandoff }),
      );
    } catch (authError) {
      if (getFirebaseAuthErrorCode(authError) === "AUTH_EMAIL_NOT_VERIFIED") {
        setError(authMessages.verifyEmailPending);
      } else {
        setError(getAuthErrorMessage(authError, "email"));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await resendDrawsyEmailVerification();
      setMessage(authMessages.verifyEmailResent);
    } catch (authError) {
      setError(getAuthErrorMessage(authError, "email"));
    } finally {
      setBusy(false);
    }
  }

  async function handleDifferentEmail() {
    await signOut(getDrawsyAuth());
    onUseDifferentEmail();
  }

  return (
    <div className="auth-form" aria-live="polite">
      <h2 className="auth-title" style={{ fontSize: "1.5rem" }}>
        {authMessages.verifyEmailTitle}
      </h2>
      <p className="auth-subtitle" style={{ marginTop: 8 }}>
        {authMessages.verifyEmailBody}
        {email ? (
          <>
            {" "}
            <span className="font-semibold text-[var(--foreground)]">
              {email}
            </span>
          </>
        ) : null}
      </p>

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm font-medium text-[rgba(22,22,22,0.7)]" role="status">
          {message}
        </p>
      ) : null}

      <div className="auth-cta-wrap" style={{ display: "grid", gap: 12 }}>
        <button
          type="button"
          disabled={busy}
          className="btn-drawsy-cta"
          onClick={handleRefresh}
        >
          {busy ? "Checking…" : "I've verified — continue"}
        </button>
        <button
          type="button"
          disabled={busy}
          className="btn-drawsy-google"
          onClick={handleResend}
        >
          Resend verification email
        </button>
        <button
          type="button"
          disabled={busy}
          className="auth-forgot"
          onClick={handleDifferentEmail}
          style={{ background: "none", border: 0, cursor: "pointer" }}
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}
