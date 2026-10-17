"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * After sticky sections (audience runway) measure height, re-scroll to the
 * hash target so `/#connectors` etc. don’t stop inside the card rail.
 */
export function HashScrollRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let timers: number[] = [];

    const clearTimers = () => {
      for (const id of timers) window.clearTimeout(id);
      timers = [];
    };

    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;

      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-revealed");
      });

      const el = document.getElementById(id);
      if (!el) return;

      const go = () => {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      };

      go();
      requestAnimationFrame(() => {
        requestAnimationFrame(go);
      });

      // Audience runway / sticky nav finish measuring after first paint.
      for (const ms of [80, 200, 450, 900]) {
        timers.push(window.setTimeout(go, ms));
      }
    };

    clearTimers();
    scrollToHash();

    const onHashChange = () => {
      clearTimers();
      scrollToHash();
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("load", scrollToHash, { once: true });

    return () => {
      clearTimers();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
