"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Loads the readable Three.js scene from src/lib/morph only in the browser. */
export function MorphScene() {
  const mount = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallbackCanvas = useRef<HTMLCanvasElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = mount.current;
    const surface = canvas.current;
    const message = status.current;
    if (!container || !surface || !message || reducedMotion) return;
    let cancelled = false;
    let dispose: undefined | (() => void);
    setFallback(false);
    async function initialize() {
      try {
        const context = {
          mount: container!,
          canvas: surface!,
          status: message!,
        };
        const initializeScene =
          "gpu" in navigator
            ? (await import("@/lib/morph/react-scene.js")).initMorphScene
            : (await import("@/lib/morph/webgl-fallback-scene.js"))
                .initWebGLFallbackScene;
        if (cancelled) return;
        const cleanup = await initializeScene(context);
        if (cancelled) cleanup?.();
        else dispose = cleanup;
      } catch (error) {
        if (!cancelled) {
          console.warn("Using the canvas scene fallback.", error);
          setFallback(true);
        }
      }
    }
    void initialize();
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const surface = fallbackCanvas.current;
    const container = mount.current;
    if (!surface || !container || (!fallback && !reducedMotion)) return;
    const context = surface.getContext("2d");
    if (!context) return;
    let frame = 0;
    const started = performance.now();
    const draw = (now: number) => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      if (
        surface.width !== Math.floor(width * ratio) ||
        surface.height !== Math.floor(height * ratio)
      ) {
        surface.width = Math.floor(width * ratio);
        surface.height = Math.floor(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const time = reducedMotion ? 0 : (now - started) / 1000;
      const radius = Math.min(width, height) * 0.135;
      context.save();
      context.translate(width * 0.5, height * 0.47);
      context.beginPath();
      for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        const r =
          radius *
          (1 +
            Math.sin(3 * angle + time * 0.8) * 0.13 +
            Math.sin(5 * angle - time * 0.3) * 0.05);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      const glow = context.createRadialGradient(
        -radius * 0.25,
        -radius * 0.25,
        0,
        0,
        0,
        radius * 1.4,
      );
      glow.addColorStop(0, "#ffc194");
      glow.addColorStop(0.5, "#f99a7f");
      glow.addColorStop(1, "#e66a59");
      context.fillStyle = glow;
      context.fill();
      context.beginPath();
      context.arc(0, 0, radius * 1.65, 0, Math.PI * 2);
      context.lineWidth = 0.7;
      context.strokeStyle = "rgba(70,70,70,0.11)";
      context.stroke();
      context.restore();
      if (!reducedMotion && document.visibilityState !== "hidden")
        frame = requestAnimationFrame(draw);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    refresh();
    window.addEventListener("resize", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [fallback, reducedMotion]);

  return (
    <div className="morph-scene" ref={mount}>
      <canvas
        ref={canvas}
        className="morph-canvas"
        hidden={fallback || reducedMotion}
        aria-hidden="true"
      />
      <canvas
        ref={fallbackCanvas}
        className="morph-canvas"
        hidden={!fallback && !reducedMotion}
        aria-hidden="true"
      />
      <div ref={status} className="morph-status" hidden />
    </div>
  );
}
