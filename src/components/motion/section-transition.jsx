"use client";
import * as React from "react";
import {
  calculatePixelGrid,
  useViewportGrid,
  usePixelCells,
} from "./pixel-grid";
import { jumpToSection, SECTION_TRANSITION_EVENT } from "./section-navigation";

/** Original animation controllers, restored as editable React source. */
let TRANSITION_OPEN_MS = 620;
let TRANSITION_CLOSE_MS = 620;
let TRANSITION_HOLD_MS = 140;
let TRANSITION_MIN_COLS = 6;
function getTransitionGrid({ width: width, height: height }) {
  let i = width >= 1440 ? 120 : width >= 1024 ? 140 : width >= 768 ? 160 : 180;
  return calculatePixelGrid({
    width: width,
    height: height,
    minCols: TRANSITION_MIN_COLS,
    minRows: 4,
    targetCellSize: i,
  });
}
function buildTransitionCell({ index: index, row: row, col: col, rows: rows }) {
  let s = ((row + 1) * 19 + (col + 1) * 23) % 100,
    n = Math.min(
      1,
      (1 - (row + 0.5) / rows) * 0.68 +
        ((((Math.floor(row / 1.5) + 1) * 29 +
          (Math.floor(col / 1.5) + 1) * 31) %
          100) /
          100) *
          0.14 +
        (s / 100) * 0.08,
    );
  return {
    id: `section-transition-cell-${index}`,
    delay: `${(0.52 * n).toFixed(3)}s`,
  };
}
function SectionTransition() {
  let t = React.useRef([]),
    [e, i] = React.useState("idle"),
    r = useViewportGrid({
      getGrid: getTransitionGrid,
      initialGrid: {
        cols: TRANSITION_MIN_COLS,
        rows: 10,
      },
    }),
    s = usePixelCells(r, buildTransitionCell),
    n = "idle" !== e;
  React.useEffect(() => {
    let e = () => {
        t.current.forEach((t) => {
          window.clearTimeout(t);
        });
        t.current = [];
      },
      r = (r) => {
        let s = r?.detail?.href;
        s &&
          (e(),
          i("opening"),
          t.current.push(
            window.setTimeout(() => {
              jumpToSection(s);
              i("closing");
            }, TRANSITION_OPEN_MS + TRANSITION_HOLD_MS),
          ),
          t.current.push(
            window.setTimeout(
              () => {
                i("idle");
              },
              TRANSITION_OPEN_MS + TRANSITION_HOLD_MS + TRANSITION_CLOSE_MS,
            ),
          ));
      };
    window.addEventListener(SECTION_TRANSITION_EVENT, r);
    return () => {
      e();
      window.removeEventListener(SECTION_TRANSITION_EVENT, r);
    };
  }, []);
  let a = React.useMemo(
    () =>
      "opening" === e
        ? "section-scroll-transition is-opening"
        : "closing" === e
          ? "section-scroll-transition is-closing"
          : "section-scroll-transition",
    [e],
  );
  return (
    <div className={a} aria-hidden={!n}>
      <div
        className="section-scroll-transition-pixels"
        style={{
          "--section-transition-cols": r.cols,
        }}
      >
        {s.map((t) => (
          <span
            key={t.id}
            className="section-scroll-transition-cell"
            style={{
              "--section-transition-delay": t.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export {
  TRANSITION_OPEN_MS,
  TRANSITION_CLOSE_MS,
  TRANSITION_HOLD_MS,
  TRANSITION_MIN_COLS,
  getTransitionGrid,
  buildTransitionCell,
  SectionTransition,
};
