import type { Metadata } from "next";
import { AuthFooterLink } from "@/components/auth/AuthFooterLink";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { authConfig } from "@/config/auth";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create a new password",
  description: `Set a new password for your ${siteConfig.name} account.`,
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      footer={
        <AuthFooterLink
          prompt="Back to"
          href={authConfig.routes.login}
          linkLabel="Login"
        />
      }
    >
      <h1 className="auth-title">Create a new password</h1>
      <p className="auth-subtitle">
        Use the reset link from your email, then sign in with your new password.
      </p>
      <ResetPasswordForm />
    </AuthShell>
  );
}
