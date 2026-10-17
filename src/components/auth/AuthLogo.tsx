import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";

type AuthLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function AuthLogo({
  className = "auth-nav-brand",
  showWordmark = true,
}: AuthLogoProps) {
  return (
    <Link href="/" className={className} aria-label={brand.name}>
      <Image
        src="/drawsy_logo.png"
        alt=""
        width={44}
        height={28}
        className="auth-nav-logo-mark"
        priority
      />
      {showWordmark ? (
        <span className="auth-nav-logo-text">{brand.wordmark}</span>
      ) : null}
    </Link>
  );
}
