"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authConfig } from "@/config/auth";
import { authMessages } from "@/config/auth-messages";
import { analyticsEvents, track } from "@/lib/analytics/events";
import { loginWithEmailHref } from "@/lib/auth/email-query";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { signUpWithEmail, type DrawsyAuthResult } from "@/lib/auth/google";
import type { SignupState } from "@/lib/auth/states";
import { PasswordInput } from "./PasswordInput";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type EmailSignupFormProps = {
  disabled?: boolean;
  onSuccess: (result: DrawsyAuthResult) => void;
  onError?: (message: string | null) => void;
};

export function EmailSignupForm({
  disabled,
  onSuccess,
  onError,
}: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsVisible, setPasswordsVisible] = useState(false);
  const [state, setState] = useState<SignupState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    onError?.(null);
    track(analyticsEvents.signup_started);

    if (!isValidEmail(email)) {
      setError(authMessages.invalidEmail);
      setState("error");
      return;
    }
    if (password.length < authConfig.password.minLength) {
      setError(authMessages.passwordTooShort);
      setState("error");
      return;
    }
    if (password !== confirmPassword) {
      setError(authMessages.passwordMismatch);
      setState("error");
      return;
    }

    setState("submitting");
    track(analyticsEvents.signup_email_submitted);

    try {
      const result = await signUpWithEmail({
        email: email.trim(),
        password,
      });
      setState("success");
      onSuccess(result);
    } catch (authError) {
      const message = getAuthErrorMessage(authError, "email");
      setState("error");
      setError(message);
      onError?.(message);
    }
  }

  const busy = state === "submitting" || disabled;
  const alreadyExists =
    error === authMessages.emailExists ||
    error?.includes("already exists");

  return (
    <form onSubmit={onSubmit} className="auth-form" noValidate>
      <div className="auth-field">
        <label htmlFor="signup-email" className="auth-label">
          Email
        </label>
        <input
          id="signup-email"
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

      <PasswordInput
        id="signup-password"
        name="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Create Password"
        autoComplete="new-password"
        required
        minLength={authConfig.password.minLength}
        disabled={busy}
        visible={passwordsVisible}
        onVisibleChange={setPasswordsVisible}
      />

      <PasswordInput
        id="signup-confirm"
        name="confirmPassword"
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Confirm Password"
        autoComplete="new-password"
        required
        minLength={authConfig.password.minLength}
        disabled={busy}
        visible={passwordsVisible}
        showToggle={false}
      />

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
          {alreadyExists ? (
            <>
              {" "}
              <Link
                href={loginWithEmailHref(email, authConfig.routes.login)}
                className="underline"
              >
                Login instead
              </Link>
            </>
          ) : null}
        </p>
      ) : null}

      <div className="auth-cta-wrap">
        <button type="submit" disabled={busy} className="btn-drawsy-cta">
          {busy && state === "submitting"
            ? "Creating account…"
            : "Sign Up With Email"}
        </button>
      </div>
    </form>
  );
}
