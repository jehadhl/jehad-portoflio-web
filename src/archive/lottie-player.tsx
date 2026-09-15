"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function LottiePlayer({
  src,
  label,
  active = true,
  className = "",
}: {
  src: string;
  label: string;
  active?: boolean;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    void import("lottie-web").then(({ default: lottie }) => {
      if (cancelled) return;
      const item = lottie.loadAnimation({
        container: element,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: src,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      animation.current = item;
      observer = new IntersectionObserver((entries) => {
        if (
          active &&
          !reducedMotion &&
          entries.some((entry) => entry.isIntersecting)
        )
          item.play();
        else if (reducedMotion) item.goToAndStop(0, true);
        else item.pause();
      });
      observer.observe(element);
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
      animation.current?.destroy();
      animation.current = null;
    };
  }, [src, active, reducedMotion]);

  return (
    <div ref={container} className={className} role="img" aria-label={label} />
  );
}
