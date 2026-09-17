"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/archive/use-reduced-motion";

export function PixelImage({
  src,
  alt,
  revealOnScroll = false,
}: {
  src: string;
  alt: string;
  revealOnScroll?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = root.current;
    if (!element || reducedMotion) return;
    const cells = element.querySelectorAll(".image-pixel-cover");
    let tween: gsap.core.Tween | undefined;
    const reveal = () => {
      tween = gsap.fromTo(
        cells,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.16,
          stagger: { each: 0.005, from: "random" },
          ease: "none",
        },
      );
    };
    let observer: IntersectionObserver | undefined;
    if (revealOnScroll) {
      gsap.set(cells, { opacity: 1 });
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            reveal();
            observer?.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(element);
    } else reveal();
    return () => {
      observer?.disconnect();
      tween?.kill();
      gsap.set(cells, { clearProps: "opacity" });
    };
  }, [src, revealOnScroll, reducedMotion]);

  return (
    <div className="pixel-image" ref={root}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {!reducedMotion && (
        <div className="image-pixel-grid" aria-hidden="true">
          {Array.from({ length: 64 }, (_, index) => (
            <span key={index} className="image-pixel-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
