import type { Metadata } from "next";

import { AccountProfile } from "@/components/account/AccountProfile";
import { AccountShell } from "@/components/account/AccountShell";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <AccountShell
      title="Account"
      subtitle="Manage this browser’s Drawsy account session."
    >
      <AccountProfile />
    </AccountShell>
  );
}
