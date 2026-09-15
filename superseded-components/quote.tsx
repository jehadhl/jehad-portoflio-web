"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Quote({ text }: { text: string }) {
  const root = useRef<HTMLElement>(null);
  const [hot, setHot] = useState(-1);
  const reducedMotion = useReducedMotion();
  const columns = 12;
  const rows = 8;
  useEffect(() => {
    const section = root.current;
    if (!section || reducedMotion) return;
    const cells = section.querySelectorAll(".quote-section-cell");
    const animation = gsap.fromTo(
      cells,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.25,
        stagger: { each: 0.009, from: "random" },
        scrollTrigger: { trigger: section, start: "top 60%", once: true },
      },
    );
    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="quote-section"
      style={
        {
          "--quote-grid-cols": columns,
          "--quote-grid-rows": rows,
        } as CSSProperties
      }
      onPointerLeave={() => setHot(-1)}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = Math.min(
          columns - 1,
          Math.floor(((event.clientX - rect.left) / rect.width) * columns),
        );
        const y = Math.min(
          rows - 1,
          Math.floor(((event.clientY - rect.top) / rect.height) * rows),
        );
        setHot(y * columns + x);
      }}
    >
      {!reducedMotion && (
        <div className="quote-section-pixels" aria-hidden="true">
          {Array.from({ length: columns * rows }, (_, index) => (
            <span key={index} className="quote-section-cell" />
          ))}
        </div>
      )}
      <div className="quote-section-hover-pixels" aria-hidden="true">
        {Array.from({ length: columns * rows }, (_, index) => (
          <span
            key={index}
            className={`quote-section-hover-cell${index === hot ? " is-hot" : ""}`}
          />
        ))}
      </div>
      <div className="quote-section-inner">
        <p>{text}</p>
      </div>
    </section>
  );
}
