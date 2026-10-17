"use client";

import { useState } from "react";
import { authConfig } from "@/config/auth";
import { authMessages } from "@/config/auth-messages";
import { analyticsEvents, track } from "@/lib/analytics/events";
import {
  isCancelledAuthError,
  signInWithX,
  type DrawsyAuthResult,
} from "@/lib/auth/google";

type TwitterButtonProps = {
  intent?: "login" | "signup";
  createCanvasHandoff: boolean;
  disabled?: boolean;
  onSuccess: (result: DrawsyAuthResult) => void;
  onError?: (message: string) => void;
};

export function TwitterButton({
  intent = "login",
  createCanvasHandoff,
  disabled,
  onSuccess,
  onError,
}: TwitterButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!authConfig.providers.twitter) return null;

  async function handleClick() {
    if (loading || disabled) return;
    track(
      intent === "signup"
        ? analyticsEvents.twitter_signup_started
        : analyticsEvents.twitter_login_started,
    );
    setLoading(true);
    onError?.("");
    try {
      onSuccess(await signInWithX({ createCanvasHandoff }));
    } catch (error) {
      if (isCancelledAuthError(error)) {
        setLoading(false);
        return;
      }
      const message =
        error instanceof Error &&
        error.message.includes("not configured")
          ? authMessages.firebaseNotConfigured
          : "Couldn't sign you in with X. Please try again.";
      onError?.(message);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className="btn-drawsy-x"
    >
      <XIcon />
      {loading ? "Connecting to X…" : "Continue with X"}
    </button>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.51-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}
