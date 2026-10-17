"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { authConfig } from "@/config/auth";
import { useAccountSessionSync } from "@/lib/auth/useAccountSessionSync";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import { AuthLogo } from "./AuthLogo";

const NAV_LINKS = [
  { label: "Use Cases", href: "/#use-cases" },
  { label: "Companion", href: "/companion" },
  { label: "Connectors", href: "/#connectors" },
  { label: "Resources", href: "/#resources" },
  { label: "Pricing", href: "/pricing" },
] as const;

/** Password users must verify email before they count as signed-in in nav. */
function isNavSignedIn(user: User | null) {
  if (!user) return false;
  const passwordOnly = user.providerData.some(
    (provider) => provider.providerId === "password",
  );
  if (passwordOnly && !user.emailVerified) return false;
  return true;
}

function isActiveNavLink(pathname: string, href: string) {
  if (href === "/companion") return pathname.startsWith("/companion");
  if (href === "/pricing") return pathname.startsWith("/pricing");
  return false;
}

const SCROLL_GLASS_AT = 24;

export function AuthNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_GLASS_AT);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    try {
      const auth = getDrawsyAuth();
      unsubscribe = onAuthStateChanged(auth, (next) => {
        if (!active) return;
        setUser(next);
        setAuthReady(true);
      });
    } catch {
      queueMicrotask(() => {
        if (active) setAuthReady(true);
      });
    }
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useAccountSessionSync({
    onRevoked: () => setUser(null),
    redirectToLogin:
      pathname.startsWith(authConfig.routes.profile) ||
      pathname.startsWith(authConfig.routes.billing),
    returnTo: pathname,
  });

  const onLoginFlow =
    pathname === authConfig.routes.login ||
    pathname === authConfig.routes.forgotPassword ||
    pathname.startsWith(authConfig.routes.resetPassword);

  const onSignupFlow = pathname === authConfig.routes.signup;
  const signedIn = isNavSignedIn(user);

  // Login ↔ Sign Up swap on auth pages; elsewhere follow real auth state.
  let ctaHref: string = authConfig.routes.login;
  let ctaLabel = "Login";
  if (onLoginFlow) {
    ctaHref = authConfig.routes.signup;
    ctaLabel = "Sign Up";
  } else if (onSignupFlow) {
    ctaHref = authConfig.routes.login;
    ctaLabel = "Login";
  } else if (!authReady) {
    ctaHref = authConfig.routes.login;
    ctaLabel = "…";
  } else if (signedIn) {
    ctaHref = authConfig.routes.profile;
    ctaLabel = "Account";
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const glassOn = scrolled || open;

  return (
    <header
      className={`auth-nav${open ? " is-open" : ""}${glassOn ? " is-scrolled" : ""}`}
    >
      <div className="auth-nav-inner">
        <AuthLogo />

        <nav className="auth-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActiveNavLink(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`auth-nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="auth-nav-end">
          <Link
            href={ctaHref}
            className={`auth-nav-login${onLoginFlow ? " is-signup" : ""}`}
            aria-busy={!authReady && !onLoginFlow && !onSignupFlow}
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            className="auth-nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="auth-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="auth-nav-toggle-bar" />
            <span className="auth-nav-toggle-bar" />
            <span className="auth-nav-toggle-bar" />
          </button>
        </div>
      </div>

      <div
        id="auth-mobile-menu"
        className="auth-nav-drawer"
        hidden={!open}
        aria-hidden={!open}
      >
        <nav className="auth-nav-drawer-links" aria-label="Mobile">
          {NAV_LINKS.map((link) => {
            const active = isActiveNavLink(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`auth-nav-drawer-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href={ctaHref}
          className="auth-nav-drawer-login"
          onClick={() => setOpen(false)}
        >
          {ctaLabel}
        </Link>
      </div>

      {open ? (
        <button
          type="button"
          className="auth-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
