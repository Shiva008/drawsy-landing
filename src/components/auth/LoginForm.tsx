"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authConfig } from "@/config/auth";
import { authMessages } from "@/config/auth-messages";
import { analyticsEvents, track } from "@/lib/analytics/events";
import { loginWithEmailHref } from "@/lib/auth/email-query";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { signInWithEmail, type DrawsyAuthResult } from "@/lib/auth/google";
import type { LoginState } from "@/lib/auth/states";
import { PasswordInput } from "./PasswordInput";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type LoginFormProps = {
  createCanvasHandoff: boolean;
  initialEmail?: string;
  returnTo?: string | null;
  disabled?: boolean;
  onSuccess: (result: DrawsyAuthResult) => void;
  onError?: (message: string | null) => void;
};

export function LoginForm({
  createCanvasHandoff,
  initialEmail = "",
  returnTo = null,
  disabled,
  onSuccess,
  onError,
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    onError?.(null);

    if (!isValidEmail(email)) {
      setError(authMessages.invalidEmail);
      setState("error");
      return;
    }
    if (!password) {
      setError(authMessages.requiredFields);
      setState("error");
      return;
    }
    if (password.length < authConfig.password.minLength) {
      setError(authMessages.passwordTooShort);
      setState("error");
      return;
    }

    setState("submitting");

    try {
      const result = await signInWithEmail({
        email: email.trim(),
        password,
        createCanvasHandoff,
      });
      setState("authenticated");
      track(analyticsEvents.login_success);
      onSuccess(result);
    } catch (authError) {
      const message = getAuthErrorMessage(authError, "email");
      const invalid = message === authMessages.invalidPassword;
      setState(invalid ? "invalid_credentials" : "error");
      setError(message);
      onError?.(message);
      track(analyticsEvents.login_failed);
    }
  }

  const busy = state === "submitting" || disabled;
  const forgotHref = loginWithEmailHref(
    email,
    authConfig.routes.forgotPassword,
    { returnTo },
  );

  return (
    <form onSubmit={onSubmit} className="auth-form" noValidate>
      <div className="auth-field">
        <label htmlFor="login-email" className="auth-label">
          Email
        </label>
        <input
          id="login-email"
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
        id="login-password"
        name="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter Password"
        autoComplete="current-password"
        required
        disabled={busy}
      />

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="auth-cta-wrap">
        <button type="submit" disabled={busy} className="btn-drawsy-cta">
          {busy && state === "submitting" ? "Logging in…" : "Login With Email"}
        </button>
      </div>

      <Link href={forgotHref} className="auth-forgot">
        Forgot Password?
      </Link>
    </form>
  );
}
