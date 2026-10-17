"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthFooterLink } from "@/components/auth/AuthFooterLink";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { authConfig } from "@/config/auth";
import { loginWithEmailHref, readPrefillEmail } from "@/lib/auth/email-query";

function ForgotPasswordViewInner() {
  const searchParams = useSearchParams();
  const initialEmail = readPrefillEmail(searchParams);
  const returnTo = searchParams.get("returnTo");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const loginHref = loginWithEmailHref(email, authConfig.routes.login, {
    returnTo,
  });

  return (
    <AuthShell
      footer={
        <AuthFooterLink
          prompt={sent ? "Ready to sign in?" : "Remembered it?"}
          href={loginHref}
          linkLabel="Login"
        />
      }
    >
      {sent ? (
        <>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">
            Open the reset link we sent, choose a new password, then sign in.
          </p>
        </>
      ) : (
        <>
          <h1 className="auth-title">Forgot your password?</h1>
          <p className="auth-subtitle">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </>
      )}

      <ForgotPasswordForm
        initialEmail={initialEmail}
        returnTo={returnTo}
        onSentChange={(nextSent, nextEmail) => {
          setSent(nextSent);
          setEmail(nextEmail);
        }}
      />
    </AuthShell>
  );
}

export function ForgotPasswordView() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <p className="auth-subtitle">Loading…</p>
        </AuthShell>
      }
    >
      <ForgotPasswordViewInner />
    </Suspense>
  );
}
