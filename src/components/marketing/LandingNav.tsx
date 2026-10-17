"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { brand } from "@/config/brand";
import { authConfig } from "@/config/auth";
import { getDrawsyAuth } from "@/lib/auth/firebase";
import { useAccountSessionSync } from "@/lib/auth/useAccountSessionSync";

const NAV_LINKS = [
  { label: "Use Cases", href: "/#use-cases" },
  { label: "Companion", href: "/companion" },
  { label: "Connectors", href: "/#connectors" },
  { label: "Resources", href: "/#resources" },
  { label: "Pricing", href: "/pricing" },
] as const;

const SCROLL_GLASS_AT = 24;

function isActiveNavLink(pathname: string, href: string) {
  if (href === "/companion") return pathname.startsWith("/companion");
  if (href === "/pricing") return pathname.startsWith("/pricing");
  return false;
}

function hashFromHref(href: string) {
  const i = href.indexOf("#");
  return i >= 0 ? href.slice(i + 1) : "";
}

/** Same-page hash links: reveal content + scroll after sticky runway layout. */
function goToHashTarget(id: string) {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("is-revealed");
  });
  const el = document.getElementById(id);
  if (!el) return;
  const go = () => el.scrollIntoView({ behavior: "auto", block: "start" });
  go();
  requestAnimationFrame(() => requestAnimationFrame(go));
  window.setTimeout(go, 120);
  window.setTimeout(go, 400);
}

export function LandingNav() {
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

  const passwordOnly = Boolean(
    user?.providerData.some((provider) => provider.providerId === "password"),
  );
  const signedIn = Boolean(
    user && !(passwordOnly && !user.emailVerified),
  );
  const accountHref = signedIn
    ? authConfig.routes.profile
    : authConfig.routes.login;
  const accountLabel = !authReady ? "…" : signedIn ? "Account" : "Sign In";

  return (
    <header
      className={`landing-nav${open ? " is-open" : ""}${scrolled ? " is-scrolled" : ""}`}
    >
      <svg
        className="landing-nav-liquid-filter"
        aria-hidden
        width="0"
        height="0"
      >
        <filter
          id="landing-nav-liquid"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.4" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="landing-nav-inner">
        <Link href="/" className="landing-nav-logo" aria-label={brand.name}>
          <Image
            src="/drawsy_logo.png"
            alt=""
            width={44}
            height={28}
            className="landing-nav-logo-mark"
            priority
          />
          <span className="landing-nav-logo-text">{brand.wordmark}</span>
        </Link>

        <nav className="landing-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActiveNavLink(pathname, link.href);
            const hashId = hashFromHref(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`landing-nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={(event) => {
                  if (!hashId || pathname !== "/") return;
                  event.preventDefault();
                  if (window.location.hash !== `#${hashId}`) {
                    window.history.pushState(null, "", `/#${hashId}`);
                  }
                  goToHashTarget(hashId);
                  window.dispatchEvent(new HashChangeEvent("hashchange"));
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="landing-nav-end">
          <Link
            href={accountHref}
            className="landing-nav-signin"
            aria-busy={!authReady}
          >
            {accountLabel}
          </Link>

          <button
            type="button"
            className="landing-nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="landing-nav-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="landing-nav-drawer"
        className="landing-nav-drawer"
        hidden={!open}
        aria-hidden={!open}
      >
        {NAV_LINKS.map((link) => {
          const active = isActiveNavLink(pathname, link.href);
          const hashId = hashFromHref(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`landing-nav-drawer-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={(event) => {
                setOpen(false);
                if (!hashId || pathname !== "/") return;
                event.preventDefault();
                if (window.location.hash !== `#${hashId}`) {
                  window.history.pushState(null, "", `/#${hashId}`);
                }
                goToHashTarget(hashId);
                window.dispatchEvent(new HashChangeEvent("hashchange"));
              }}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href={accountHref}
          className="landing-nav-drawer-signin"
          onClick={() => setOpen(false)}
        >
          {accountLabel}
        </Link>
      </div>

      {open ? (
        <button
          type="button"
          className="landing-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
