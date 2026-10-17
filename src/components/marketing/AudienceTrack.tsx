"use client";

import { useEffect, useRef, type ReactNode } from "react";

type AudienceTrackProps = {
  children: ReactNode;
  heading?: ReactNode;
};

/** Vertical scroll distance per card-step — higher = slower / more parallax. */
const SCROLL_DRAG = 1.85;
/** Lerp toward the scroll target each frame (soft site scroll feel). */
const EASE = 0.14;

/**
 * Sticky horizontal rail: while pinned, vertical page scroll drives the
 * cards sideways with eased parallax, landing so a full card fits on
 * screen at every snap (all breakpoints). After the last card, scroll
 * continues below.
 */
export function AudienceTrack({ children, heading }: AudienceTrackProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    active: boolean;
    axis: "x" | "y" | null;
    x: number;
    y: number;
    progress: number;
  }>({
    active: false,
    axis: null,
    x: 0,
    y: 0,
    progress: 0,
  });

  useEffect(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!runway || !sticky || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pinTop = 70;
    let maxX = 0;
    let snaps: number[] = [0];
    let current = 0;
    let target = 0;
    let raf = 0;
    let running = false;

    const endPad = () =>
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--landing-card-pad",
        ),
      ) || 30;

    const measurePinTop = () => {
      // Prefer the glass capsule bottom so an open drawer never shifts pin top
      const capsule = document.querySelector(".landing-nav-inner");
      const nav = document.querySelector(".landing-nav");
      const bottom =
        capsule?.getBoundingClientRect().bottom ??
        nav?.getBoundingClientRect().bottom ??
        62;
      pinTop = Math.round(bottom + 8);
      sticky.style.top = `${pinTop}px`;
      runway.style.setProperty("--audience-pin-top", `${pinTop}px`);
    };

    /** Align each card’s left to the rail pad; final snap shows last card fully. */
    const measureSnaps = () => {
      const viewport = track.parentElement;
      const viewW = viewport?.clientWidth ?? window.innerWidth;
      const cards = [
        ...track.querySelectorAll<HTMLElement>(".landing-audience-card"),
      ];
      if (cards.length === 0 || viewW <= 0) {
        maxX = 0;
        snaps = [0];
        return;
      }

      const padL = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const padR = endPad();
      const last = cards[cards.length - 1];
      const contentRight = last.offsetLeft + last.offsetWidth + padR;
      maxX = Math.max(0, contentRight - viewW);

      const points = cards.map((card) =>
        Math.max(0, Math.min(maxX, card.offsetLeft - padL)),
      );
      if (points[points.length - 1] !== maxX) points.push(maxX);
      snaps = points;
    };

    const applyProgress = (value: number) => {
      current = value;
      track.style.transform = `translate3d(${-value}px, 0, 0)`;
    };

    const syncRunwayHeight = () => {
      if (reduceMotion) {
        runway.style.height = "auto";
        applyProgress(0);
        target = 0;
        return;
      }
      measureSnaps();
      const next = `${sticky.offsetHeight + maxX * SCROLL_DRAG}px`;
      if (runway.style.height !== next) {
        runway.style.height = next;
      }
    };

    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    /** Map vertical pin progress onto card snaps so a full card fits each step. */
    const readTarget = () => {
      if (maxX <= 0 || snaps.length < 2) return 0;
      const runwayTop = runway.getBoundingClientRect().top;
      const travel = maxX * SCROLL_DRAG;
      const u = Math.min(1, Math.max(0, (pinTop - runwayTop) / travel));
      const seg = u * (snaps.length - 1);
      const i = Math.min(snaps.length - 2, Math.floor(seg));
      const local = smoothstep(seg - i);
      return snaps[i] + (snaps[i + 1] - snaps[i]) * local;
    };

    /** Hash / jump scroll — skip sideways card lerp so the rail isn’t mid-animation. */
    const snapThreshold = 64;

    const tick = () => {
      target = readTarget();
      if (reduceMotion) {
        applyProgress(target);
        running = false;
        raf = 0;
        return;
      }

      const jump = Math.abs(target - current) > snapThreshold;
      const next = jump ? target : current + (target - current) * EASE;
      if (jump || Math.abs(target - next) < 0.15) {
        applyProgress(target);
      } else {
        applyProgress(next);
      }

      const rect = runway.getBoundingClientRect();
      const near =
        rect.bottom > -200 && rect.top < window.innerHeight + 200;
      if (near || Math.abs(target - current) > 0.15) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        raf = 0;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const layout = () => {
      measurePinTop();
      syncRunwayHeight();
      target = readTarget();
      if (reduceMotion) {
        applyProgress(target);
      } else {
        kick();
      }
    };

    let boots = 0;
    const boot = () => {
      layout();
      if ((maxX <= 0 || sticky.offsetHeight < 80) && boots++ < 45) {
        requestAnimationFrame(boot);
      }
    };
    boot();
    requestAnimationFrame(() => requestAnimationFrame(layout));
    const t1 = window.setTimeout(layout, 120);
    const t2 = window.setTimeout(layout, 400);

    const onHashChange = () => {
      layout();
      applyProgress(readTarget());
      target = current;
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", layout);
    window.visualViewport?.addEventListener("resize", layout);
    window.addEventListener("hashchange", onHashChange);

    if (window.location.hash) {
      // Deep link past this rail — jump track to final/current scroll position.
      applyProgress(readTarget());
      target = current;
      window.setTimeout(() => {
        applyProgress(readTarget());
        target = current;
      }, 160);
      window.setTimeout(() => {
        applyProgress(readTarget());
        target = current;
      }, 480);
    }

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(layout);
    });
    ro.observe(sticky);
    const viewport = track.parentElement;
    if (viewport) ro.observe(viewport);
    const navCapsule = document.querySelector(".landing-nav-inner");
    if (navCapsule) ro.observe(navCapsule);
    for (const card of track.querySelectorAll(".landing-audience-card")) {
      ro.observe(card);
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag.current = {
        active: true,
        axis: null,
        x: e.clientX,
        y: e.clientY,
        progress: current,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;

      if (!drag.current.axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          drag.current.active = false;
          drag.current.axis = "y";
          track.classList.remove("is-dragging");
          return;
        }
        drag.current.axis = "x";
        track.setPointerCapture(e.pointerId);
        track.classList.add("is-dragging");
      }

      if (drag.current.axis !== "x") return;
      e.preventDefault();
      const next = Math.min(
        maxX,
        Math.max(0, drag.current.progress - dx),
      );
      const delta = (next - current) * SCROLL_DRAG;
      if (delta !== 0) window.scrollBy(0, delta);
      kick();
    };

    const endDrag = (e: PointerEvent) => {
      if (!drag.current.active && drag.current.axis !== "x") {
        drag.current.axis = null;
        return;
      }
      drag.current.active = false;
      drag.current.axis = null;
      track.classList.remove("is-dragging");
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove, { passive: false });
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", layout);
      window.visualViewport?.removeEventListener("resize", layout);
      window.removeEventListener("hashchange", onHashChange);
      ro.disconnect();
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div ref={runwayRef} className="landing-audience-runway">
      <div ref={stickyRef} className="landing-audience-sticky">
        {heading}
        <div className="landing-audience-viewport">
          <div
            ref={trackRef}
            className="landing-audience-track"
            role="list"
            tabIndex={0}
            aria-label="Audience cards"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
