import Link from "next/link";

type AuthFooterLinkProps = {
  prompt: string;
  href: string;
  linkLabel: string;
};

export function AuthFooterLink({
  prompt,
  href,
  linkLabel,
}: AuthFooterLinkProps) {
  return (
    <p>
      {prompt}{" "}
      <Link
        href={href}
        className="underline decoration-solid underline-offset-2"
      >
        {linkLabel}
      </Link>
    </p>
  );
}
