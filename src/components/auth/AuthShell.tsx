import Image from "next/image";
import { AuthNavbar } from "./AuthNavbar";

type AuthShellProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden>
        <Image
          src="/bg_landing_auth.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="auth-bg-fade" />
      </div>

      <AuthNavbar />

      <div className="auth-stage">
        <div className="auth-stack">
          <div className="auth-card">
            <div className="auth-card-surface">{children}</div>
          </div>
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
