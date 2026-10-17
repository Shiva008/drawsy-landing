import type { Metadata } from "next";
import { ForgotPasswordView } from "@/components/auth/ForgotPasswordView";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Forgot your password?",
  description: `Reset your ${siteConfig.name} password.`,
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
