import Image from "next/image";
import { AuthNavbar } from "@/components/auth/AuthNavbar";

type PricingShellProps = {
  children: React.ReactNode;
};

export function PricingShell({ children }: PricingShellProps) {
  return (
    <div className="pricing-page">
      <div className="pricing-bg" aria-hidden>
        <Image
          src="/bg_landing_auth.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="pricing-bg-fade" />
      </div>
      <AuthNavbar />
      <main className="pricing-main">{children}</main>
    </div>
  );
}
