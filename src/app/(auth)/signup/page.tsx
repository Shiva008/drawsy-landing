import type { Metadata } from "next";
import { AuthFooterLink } from "@/components/auth/AuthFooterLink";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupView } from "@/components/auth/SignupView";
import { authConfig } from "@/config/auth";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Create your ${siteConfig.name} account`,
  description: `Create a ${siteConfig.name} account and start turning information into visual understanding.`,
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      footer={
        <AuthFooterLink
          prompt="Already have an account?"
          href={authConfig.routes.login}
          linkLabel="Login"
        />
      }
    >
      <SignupView />
    </AuthShell>
  );
}
