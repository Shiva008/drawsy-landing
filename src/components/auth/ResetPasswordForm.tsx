"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authConfig } from "@/config/auth";
import { authMessages } from "@/config/auth-messages";
import { loginWithEmailHref, readPrefillEmail } from "@/lib/auth/email-query";

/**
 * Password reset is completed via the Firebase email action link
 * (same as the production Drawsy app). This page explains that and
 * sends users back to login after they finish in the email flow.
 */
function ResetPasswordFormInner() {
  const searchParams = useSearchParams();
  const email = readPrefillEmail(searchParams);
  const loginHref = loginWithEmailHref(email, authConfig.routes.login);

  return (
    <div className="auth-form" style={{ marginTop: 40 }}>
      <p className="rounded-[24px] border border-[rgba(22,22,22,0.2)] px-6 py-4 text-base font-medium text-[rgba(22,22,22,0.6)]">
        {authMessages.resetViaEmail}
      </p>
      <div className="auth-cta-wrap">
        <Link href={loginHref} className="btn-drawsy-cta">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="auth-form" style={{ marginTop: 40 }}>
          <Link href={authConfig.routes.login} className="btn-drawsy-cta">
            Back to Login
          </Link>
        </div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
