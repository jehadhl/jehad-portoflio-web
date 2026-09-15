"use client";
import * as React from "react";
import lottie from "@/lib/lottie-client";
import {
  calculatePixelGrid,
  useViewportGrid,
  usePixelCells,
} from "./pixel-grid";

/** Original animation controllers, restored as editable React source. */
let INITIAL_LOADER_GRID = {
  cols: 8,
  rows: 6,
};
// Faster reveal for snappier intro
let LOADER_REVEAL_MS = 350;
let LOADER_ANIMATION = "/assets/lottie/runman01.json";
function getLoaderGrid({ width: width, height: height }) {
  // larger target cell size -> fewer cells -> faster reveal
  let i = width >= 1440 ? 150 : width >= 1024 ? 130 : width >= 768 ? 110 : 90;
  return calculatePixelGrid({
    width: width,
    height: height,
    minCols: 8,
    minRows: 7,
    targetCellSize: i,
  });
}
function buildLoaderCell({ index: index, row: row, col: col, rows: rows }) {
  let s = ((row + 1) * 19 + (col + 1) * 23) % 100;
  return {
    id: `loader-cell-${index}`,
    threshold: Math.min(
      0.88,
      (1 - (row + 0.5) / rows) * 0.7 +
        ((((Math.floor(row / 1.5) + 1) * 31 +
          (Math.floor(col / 1.5) + 1) * 17) %
          100) /
          100) *
          0.18 +
        (s / 100) * 0.12,
    ),
  };
}
function SiteLoader({ isReady = false }) {
  let e = React.useRef(null),
    i = React.useRef(0),
    r = React.useRef(0),
    s = React.useRef(false),
    [n, a] = React.useState("loading"),
    [o, l] = React.useState(0),
    h = useViewportGrid({
      getGrid: getLoaderGrid,
      initialGrid: INITIAL_LOADER_GRID,
    }),
    c = usePixelCells(h, buildLoaderCell);
  return (React.useLayoutEffect(() => {
    let t,
      i = e.current;
    if (!i) return;
    (t = lottie.loadAnimation({
      container: i,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: LOADER_ANIMATION,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: false,
      },
    })).setSubframe(false);
    // speed up the lottie animation slightly for a snappier feel
    try {
      t.setSpeed?.(1.4);
    } catch (e) {}
    let r = () => {
      t.goToAndPlay(0, true);
    };
    t.addEventListener("DOMLoaded", r);
    return () => {
      t.removeEventListener("DOMLoaded", r);
      t?.destroy();
    };
  }, []),
  React.useEffect(() => {
    if (!isReady || s.current) return;
    s.current = true;
    a("revealing");
    let e = () => {
        i.current && (window.cancelAnimationFrame(i.current), (i.current = 0));
        l(1);
        r.current = window.setTimeout(() => {
          a("hidden");
        }, 120);
      },
      n = performance.now(),
      o = (t) => {
        let r = Math.min((t - n) / LOADER_REVEAL_MS, 1);
        (l(r), r >= 1) ? e() : (i.current = window.requestAnimationFrame(o));
      };
    i.current = window.requestAnimationFrame(o);
    return () => {
      i.current && window.cancelAnimationFrame(i.current);
      r.current && window.clearTimeout(r.current);
    };
  }, [isReady]),
  "hidden" === n) ? null : (
    <div className={`site-loader${"revealing" === n ? " is-revealing" : ""}`}>
      <div
        className="site-loader-pixels"
        style={{
          "--site-loader-cols": h.cols,
          "--site-loader-rows": h.rows,
        }}
        aria-hidden="true"
      >
        {c.map((t) => (
          <LoaderCell key={t.id} cell={t} revealProgress={o} />
        ))}
      </div>
      {"loading" === n || "revealing" === n ? (
        <div
          className={`site-loader-inner${"revealing" === n ? " is-revealing" : ""}`}
        >
          <div className="site-loader-media" aria-hidden="true">
            <div ref={e} className="site-loader-lottie" />
          </div>
          <p className="site-loader-label">{"Loading"}</p>
        </div>
      ) : null}
    </div>
  );
}
function LoaderCell({ cell: cell, revealProgress: revealProgress }) {
  return (
    <span
      className="site-loader-cell"
      style={{
        visibility: revealProgress >= cell.threshold ? "hidden" : "visible",
      }}
    />
  );
}

export {
  INITIAL_LOADER_GRID,
  LOADER_REVEAL_MS,
  LOADER_ANIMATION,
  getLoaderGrid,
  buildLoaderCell,
  SiteLoader,
  LoaderCell,
};
