"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-revealed)";

/**
 * Site-wide scroll reveal. Mount once in the root layout.
 * Hash / deep links skip entrance motion and keep observing late-mounted nodes
 * (otherwise opacity:0 can stick forever after `html.js`).
 */
export function RevealRoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const reveal = (el: Element) => {
      el.classList.add("is-revealed");
    };

    const revealAll = () => {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
    };

    const hashActive = () => Boolean(window.location.hash);

    const inView = (el: Element) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      const vh = window.innerHeight || 0;
      return rect.top < vh * 0.9 && rect.bottom > vh * 0.04;
    };

    const scan = () => {
      if (reduceMotion || hashActive()) {
        revealAll();
        return;
      }
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (inView(el)) reveal(el);
      });
    };

    scan();
    const raf = requestAnimationFrame(scan);
    const t1 = window.setTimeout(scan, 100);
    const t2 = window.setTimeout(scan, 350);
    const t3 = window.setTimeout(scan, 800);

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        scan();
      });
    };

    const onHashChange = () => {
      revealAll();
      scan();
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.visualViewport?.addEventListener("resize", onScrollOrResize);
    window.addEventListener("load", scan, { once: true });
    window.addEventListener("hashchange", onHashChange);

    const mo = new MutationObserver(() => {
      if (reduceMotion || hashActive()) {
        revealAll();
        return;
      }
      onScrollOrResize();
      if (io) {
        document.querySelectorAll(SELECTOR).forEach((el) => io?.observe(el));
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    let io: IntersectionObserver | null = null;
    if (!reduceMotion && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (hashActive()) {
            revealAll();
            return;
          }
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal(entry.target);
              io?.unobserve(entry.target);
            }
          }
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      document.querySelectorAll(SELECTOR).forEach((el) => io?.observe(el));
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.visualViewport?.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("hashchange", onHashChange);
      mo.disconnect();
      io?.disconnect();
    };
  }, []);

  return null;
}
