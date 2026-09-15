"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/** A sticky section owns its scroll range. Buttons and scrolling use the same index. */
export function useScrollIndex(count: number, mobileBreakpoint = 900) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = ref.current;
      if (!section || window.innerWidth <= mobileBreakpoint || reducedMotion)
        return;
      const range = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / range),
      );
      setIndex(Math.min(count - 1, Math.round(progress * (count - 1))));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count, mobileBreakpoint, reducedMotion]);

  const select = useCallback(
    (next: number) => {
      const target = Math.min(count - 1, Math.max(0, next));
      const section = ref.current;
      if (section && window.innerWidth > mobileBreakpoint && !reducedMotion) {
        const top = window.scrollY + section.getBoundingClientRect().top;
        const range = Math.max(0, section.offsetHeight - window.innerHeight);
        window.scrollTo({
          top: top + (range * target) / Math.max(1, count - 1),
          behavior: "smooth",
        });
      } else {
        setIndex(target);
      }
    },
    [count, mobileBreakpoint, reducedMotion],
  );

  return { ref, index, select, reducedMotion };
}
