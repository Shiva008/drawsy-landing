import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { BillingAccount } from "@/components/account/BillingAccount";

export const metadata: Metadata = {
  title: "Billing",
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  return (
    <AccountShell
      title="Billing"
      subtitle="Manage your Drawsy Pro subscription."
    >
      <BillingAccount />
    </AccountShell>
  );
}
