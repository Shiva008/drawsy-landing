import type { Metadata } from "next";
import { AuthFooterLink } from "@/components/auth/AuthFooterLink";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginView } from "@/components/auth/LoginView";
import { authConfig } from "@/config/auth";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Sign in to ${siteConfig.name}`,
  description: `Sign in to continue turning information into visual understanding.`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      footer={
        <AuthFooterLink
          prompt="Don't have an account?"
          href={authConfig.routes.signup}
          linkLabel="Sign Up"
        />
      }
    >
      <LoginView />
    </AuthShell>
  );
}
