"use client";

import { useEffect, useMemo, useRef } from "react";
import { BREAKPOINTS, useMaxWidth } from "@/hooks/use-responsive";

/** Six cached grain frames at 12 fps; the same static SVG texture on mobile. */
export function NoiseLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isStatic = useMaxWidth(BREAKPOINTS.NOISE_STATIC);
  const texture = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="1.35" numOctaves="2" seed="8" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.09"/></feComponentTransfer></filter><rect width="128" height="128" filter="url(#n)" opacity="1"/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, []);

  useEffect(() => {
    if (isStatic) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let frames: HTMLCanvasElement[] = [];
    let index = 0;
    let resizeTimer = 0;
    let drawTimer = 0;
    const draw = () => {
      if (!frames.length) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        frames[index % frames.length],
        0,
        0,
        canvas.width,
        canvas.height,
      );
      index += 1;
      drawTimer = window.setTimeout(draw, 83.33333333333333);
    };
    const resize = () => {
      window.clearTimeout(drawTimer);
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * ratio));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * ratio));
      const width = Math.max(1, Math.round(canvas.width / 1.4));
      const height = Math.max(1, Math.round(canvas.height / 1.4));
      const scratch = document.createElement("canvas");
      scratch.width = width;
      scratch.height = height;
      const scratchContext = scratch.getContext("2d", {
        willReadFrequently: true,
      });
      frames = [];
      if (!scratchContext) return;
      for (let frame = 0; frame < 6; frame += 1) {
        const data = scratchContext.createImageData(width, height);
        const pixels = new Uint32Array(data.data.buffer);
        pixels.fill(0xffffffff);
        for (let pixel = 0; pixel < pixels.length; pixel += 1) {
          if (Math.random() < 0.14) pixels[pixel] = 0xff000000;
        }
        const tile = document.createElement("canvas");
        tile.width = width;
        tile.height = height;
        const tileContext = tile.getContext("2d");
        if (tileContext) {
          tileContext.putImageData(data, 0, 0);
          frames.push(tile);
        }
      }
      index = 0;
      draw();
    };
    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 160);
    };
    resize();
    window.addEventListener("resize", scheduleResize);
    return () => {
      window.clearTimeout(drawTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", scheduleResize);
    };
  }, [isStatic]);

  return isStatic ? (
    <div
      className="site-noise-layer site-noise-layer-static"
      style={{ backgroundImage: texture }}
      aria-hidden="true"
    />
  ) : (
    <canvas ref={canvasRef} className="site-noise-layer" aria-hidden="true" />
  );
}
