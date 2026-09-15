"use client";
import { useEffect, type ReactNode } from "react";
import type Lenis from "lenis";
import { BREAKPOINTS } from "@/hooks/use-responsive";
declare global {
  interface Window {
    __siteLenis?: Lenis;
  }
}
/** Original desktop wheel smoothing, with native scrolling on Safari and mobile. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    let scrollingTimer = 0;
    const onScroll = () => {
      root.classList.add("site-is-scrolling");
      window.clearTimeout(scrollingTimer);
      scrollingTimer = window.setTimeout(
        () => root.classList.remove("site-is-scrolling"),
        140,
      );
    };
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const restore = () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollingTimer);
      root.classList.remove("site-is-scrolling");
      window.history.scrollRestoration = restoration;
    };
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia(
      `(max-width: ${BREAKPOINTS.LENIS_MOBILE}px)`,
    ).matches;
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (reduced || mobile || safari) return restore;
    let cancelled = false;
    let scroller: Lenis | null = null;
    let frame = 0;
    let refreshTimer = 0;
    const animate = (time: number) => {
      scroller?.raf(time);
      frame = window.requestAnimationFrame(animate);
    };
    const refresh = () => scroller?.resize();
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      scroller = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
      window.__siteLenis = scroller;
      frame = window.requestAnimationFrame(animate);
      window.addEventListener("load", refresh);
      refreshTimer = window.setTimeout(refresh, 500);
    });
    return () => {
      cancelled = true;
      restore();
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      window.cancelAnimationFrame(frame);
      if (window.__siteLenis === scroller) window.__siteLenis = undefined;
      scroller?.destroy();
    };
  }, []);
  return children;
}
