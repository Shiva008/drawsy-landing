import type { Metadata } from "next";

import { BillingCheckout } from "@/components/account/BillingCheckout";
import { PricingShell } from "@/components/pricing/PricingShell";
import { PricingView } from "@/components/pricing/PricingView";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Pricing — Free and ${siteConfig.shortName} Pro`,
  description:
    "Drawsy pricing: Free local work, or Pro cloud sync from $6.90/month and $69/year. Pay securely with Razorpay.",
  robots: { index: true, follow: true },
};

export default function PricingPage() {
  return (
    <PricingShell>
      <BillingCheckout />
      <PricingView />
    </PricingShell>
  );
}
