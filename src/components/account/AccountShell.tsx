import Link from "next/link";
import { AuthNavbar } from "@/components/auth/AuthNavbar";
import { brand } from "@/config/brand";

type AccountShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AccountShell({ title, subtitle, children }: AccountShellProps) {
  return (
    <div className="account-page">
      <div className="account-page-bg" aria-hidden />
      <AuthNavbar />
      <main className="account-main">
        <div className="account-stack">
          <div className="account-header">
            <p className="account-kicker">
              <Link href="/">{brand.name}</Link>
            </p>
            <h1 className="account-title">{title}</h1>
            <p className="account-subtitle">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
