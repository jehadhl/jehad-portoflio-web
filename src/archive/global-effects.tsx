"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Language } from "@/content";

gsap.registerPlugin(ScrollTrigger);

export function GlobalEffects({ language }: { language: Language }) {
  const noise = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          },
        );
      });
      gsap.fromTo(
        ".about-heading-word",
        { yPercent: 105 },
        {
          yPercent: 0,
          stagger: 0.065,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".page-entry-split-trigger",
            start: "top 70%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".about-pixel-edge span",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "bottom",
          stagger: { each: 0.025, from: "random" },
          duration: 0.2,
          scrollTrigger: {
            trigger: ".about-orange-stage",
            start: "top 90%",
            once: true,
          },
        },
      );
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      media.revert();
      window.removeEventListener("load", refresh);
    };
  }, [language]);

  useEffect(() => {
    const canvas = noise.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const tile = document.createElement("canvas");
    tile.width = tile.height = 160;
    const tileContext = tile.getContext("2d");
    if (!tileContext) return;
    const data = tileContext.createImageData(160, 160);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] =
        data.data[i + 1] =
        data.data[i + 2] =
          Math.random() > 0.5 ? 255 : 0;
      data.data[i + 3] = Math.floor(Math.random() * 19);
    }
    tileContext.putImageData(data, 0, 0);
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const pattern = context.createPattern(tile, "repeat");
      if (pattern) {
        context.fillStyle = pattern;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  useEffect(() => {
    const dot = cursor.current;
    if (!dot || !window.matchMedia("(pointer: fine)").matches) return;
    const x = gsap.quickTo(dot, "x", { duration: 0.22 });
    const y = gsap.quickTo(dot, "y", { duration: 0.22 });
    const move = (event: PointerEvent) => {
      dot.classList.add("is-visible");
      x(event.clientX - 12.5);
      y(event.clientY - 12.5);
    };
    const leave = () => dot.classList.remove("is-visible");
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      x.tween.kill();
      y.tween.kill();
    };
  }, []);

  return (
    <>
      <div className="site-corner-crosses" aria-hidden="true">
        {["tl", "tc", "tr", "bl", "bc", "br"].map((position) => (
          <span
            key={position}
            className={`site-corner-cross site-corner-cross-${position}`}
          />
        ))}
      </div>
      <canvas className="site-noise-layer" ref={noise} aria-hidden="true" />
      <div className="cursor-orb" ref={cursor} aria-hidden="true" />
    </>
  );
}
