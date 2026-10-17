"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authConfig } from "@/config/auth";
import { authMessages } from "@/config/auth-messages";
import { analyticsEvents, track } from "@/lib/analytics/events";
import { loginWithEmailHref } from "@/lib/auth/email-query";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { sendDrawsyPasswordReset } from "@/lib/auth/google";
import type { ForgotPasswordState } from "@/lib/auth/states";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type ForgotPasswordFormProps = {
  initialEmail?: string;
  returnTo?: string | null;
  onSentChange?: (sent: boolean, email: string) => void;
};

export function ForgotPasswordForm({
  initialEmail = "",
  returnTo = null,
  onSentChange,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [state, setState] = useState<ForgotPasswordState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState(initialEmail);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    track(analyticsEvents.forgot_password_started);

    if (!isValidEmail(email)) {
      setError(authMessages.invalidEmail);
      setState("error");
      return;
    }

    setState("submitting");
    track(analyticsEvents.forgot_password_submitted);

    try {
      const trimmed = email.trim();
      await sendDrawsyPasswordReset(trimmed);
      setSentEmail(trimmed);
      setState("sent");
      onSentChange?.(true, trimmed);
    } catch (authError) {
      setState("error");
      setError(getAuthErrorMessage(authError, "reset"));
    }
  }

  if (state === "sent") {
    const loginHref = loginWithEmailHref(sentEmail, authConfig.routes.login, {
      returnTo,
    });
    return (
      <div className="auth-form" style={{ marginTop: 40 }} aria-live="polite">
        <p className="rounded-[24px] border border-[rgba(22,22,22,0.2)] px-6 py-4 text-base font-medium text-[rgba(22,22,22,0.6)]">
          {authMessages.forgotPasswordSent}
          {sentEmail ? (
            <>
              {" "}
              <span className="font-semibold text-[var(--foreground)]">
                {sentEmail}
              </span>
            </>
          ) : null}
        </p>
        <div className="auth-cta-wrap" style={{ display: "grid", gap: 12 }}>
          <Link href={loginHref} className="btn-drawsy-cta">
            Back to Login
          </Link>
          <button
            type="button"
            className="btn-drawsy-google"
            onClick={() => {
              setState("idle");
              onSentChange?.(false, sentEmail);
            }}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  const busy = state === "submitting";

  return (
    <form onSubmit={onSubmit} className="auth-form" noValidate>
      <div className="auth-field">
        <label htmlFor="forgot-email" className="auth-label">
          Email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={busy}
          placeholder="Enter Your Email"
          className="input-drawsy"
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="auth-cta-wrap">
        <button type="submit" disabled={busy} className="btn-drawsy-cta">
          {busy ? "Sending…" : "Send Reset Link"}
        </button>
      </div>
    </form>
  );
}
