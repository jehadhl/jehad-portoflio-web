"use client";
import * as React from "react";
import { calculatePixelGrid, buildPixelCells } from "./pixel-grid";
import { useScrollProgress } from "./scroll-progress";
import { HoverPixels } from "./hover-pixels";

/** Original animation controllers, restored as editable React source. */
let INITIAL_QUOTE_GRID = {
  cols: 18,
  rows: 12,
};
function getQuoteGrid(t, e) {
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: 8,
    minRows: 5,
    targetCellSize: t <= 800 ? 72 : 96,
    roundCols: "round",
    roundRows: "round",
  });
}
function buildQuoteCells(t, e) {
  let i = (t - 1) * 0.5,
    r = (e - 1) * 0.5;
  return buildPixelCells({
    cols: t,
    rows: e,
    buildCell: ({ index: t, col: e, row: s }) => {
      let n = Math.hypot(e - i, s - r),
        a = ((s + 1) * 17 + (e + 1) * 29) % 7;
      return {
        id: `quote-cell-${t}`,
        col: e,
        row: s,
        threshold: Number(((0.065 * n + 0.018 * a) / 1.45).toFixed(3)),
      };
    },
  });
}
function Quote({ text: text }) {
  let e = React.useRef(null),
    [i, r] = React.useState(INITIAL_QUOTE_GRID),
    s = React.useMemo(() => buildQuoteCells(i.cols, i.rows), [i.cols, i.rows]),
    n = useScrollProgress(
      e,
      React.useCallback((t) => {
        let e = t.getBoundingClientRect(),
          i = window.innerHeight || 1;
        return (i - e.top - 0.12 * i) / (i + 0.75 * e.height);
      }, []),
    );
  React.useEffect(() => {
    let t = e.current;
    if (!t) return;
    let i = () => {
      let e = t.getBoundingClientRect(),
        i = getQuoteGrid(e.width, e.height);
      r((t) => (t.cols === i.cols && t.rows === i.rows ? t : i));
    };
    i();
    window.addEventListener("resize", i);
    return () => {
      window.removeEventListener("resize", i);
    };
  }, []);
  return (
    <section ref={e} className="quote-section">
      <div
        className="quote-section-pixels"
        style={{
          "--quote-grid-cols": i.cols,
          "--quote-grid-rows": i.rows,
        }}
        aria-hidden="true"
      >
        {s.map((t) => (
          <span
            key={t.id}
            className="quote-section-cell"
            style={{
              visibility: n >= t.threshold ? "hidden" : "visible",
            }}
          />
        ))}
      </div>
      <HoverPixels
        containerRef={e}
        cells={s}
        cols={i.cols}
        rows={i.rows}
        className="quote-section-hover-pixels"
      />
      <div className="quote-section-inner">
        <p>{text}</p>
      </div>
    </section>
  );
}

export { INITIAL_QUOTE_GRID, getQuoteGrid, buildQuoteCells, Quote };
