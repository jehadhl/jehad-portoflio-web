"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import type { Tool } from "@/content";
import { useScrollIndex } from "@/archive/use-scroll-index";
import { useReducedMotion } from "@/archive/use-reduced-motion";
import { LottiePlayer } from "./lottie-player";

function VideoStudy({
  src,
  title,
  active,
}: {
  src: string;
  title: string;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver((entries) => {
      if (
        active &&
        !reducedMotion &&
        entries.some((entry) => entry.isIntersecting)
      )
        void video.play().catch(() => {
          video.controls = true;
        });
      else video.pause();
    });
    observer.observe(video);
    if (!active || reducedMotion) video.pause();
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [active, reducedMotion]);
  return (
    <video
      ref={ref}
      src={src}
      className="tools-strip-media-asset"
      aria-label={title}
      muted
      loop
      playsInline
      controls={reducedMotion}
      preload={active ? "metadata" : "none"}
    />
  );
}

export function ToolsReel({ label, items }: { label: string; items: Tool[] }) {
  const { ref, index, select, reducedMotion } = useScrollIndex(items.length);
  const copy = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];

  useEffect(() => {
    if (!copy.current || reducedMotion) return;
    const animation = gsap.fromTo(
      copy.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35 },
    );
    return () => {
      animation.kill();
    };
  }, [index, reducedMotion]);

  return (
    <section
      id="tools"
      ref={ref}
      className="page-entry-tools-section"
      style={{ "--tool-count": items.length } as CSSProperties}
      aria-label={label}
    >
      <div className="page-entry-tools-sticky">
        <div className="page-entry-tools-sticky-inner">
          <div className="page-entry-tools-mark">
            <h2 className="page-entry-tools-label">{label}</h2>
          </div>
          <div
            className="tools-strip"
            role="region"
            aria-label="Motion studies"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                select(index + 1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                select(index - 1);
              }
            }}
            onPointerDown={(event) => {
              if (event.pointerType === "touch")
                gesture.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerCancel={() => {
              gesture.current = null;
            }}
            onPointerUp={(event) => {
              const start = gesture.current;
              gesture.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
                select(index + (dx < 0 ? 1 : -1));
            }}
          >
            <div className="tools-strip-frame">
              <div className="tools-strip-rule" />
              <div className="tools-strip-meta">
                <div ref={copy}>
                  <p className="tools-strip-copy">{item.copy}</p>
                </div>
                <p className="tools-strip-label">Scroll # {index}</p>
              </div>
              <div className="tools-strip-media-stage">
                {items.map((study, position) => (
                  <div
                    className="tool-study-panel"
                    key={study.index}
                    hidden={position !== index}
                  >
                    <div className="tools-strip-media">
                      {study.lottie ? (
                        <LottiePlayer
                          src={study.lottie}
                          label={study.title}
                          active={position === index}
                          className="tools-strip-media-asset tools-strip-media-lottie"
                        />
                      ) : study.video ? (
                        <VideoStudy
                          src={study.video}
                          title={study.title}
                          active={position === index}
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className="tools-strip-footer">
                <p className="tools-strip-counter tools-strip-counter-large">
                  {String(index).padStart(3, "0")}
                </p>
                <div className="tools-strip-title-block">
                  <h3 className="tools-strip-title">{item.title}</h3>
                  <p className="tools-strip-subtitle">{item.subtitle}</p>
                </div>
                <div className="tools-strip-arrows">
                  <button
                    className="tools-strip-arrow"
                    onClick={() => select(index - 1)}
                    disabled={index === 0}
                    aria-label="Previous motion study"
                  >
                    ←
                  </button>
                  <button
                    className="tools-strip-arrow"
                    onClick={() => select(index + 1)}
                    disabled={index === items.length - 1}
                    aria-label="Next motion study"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
