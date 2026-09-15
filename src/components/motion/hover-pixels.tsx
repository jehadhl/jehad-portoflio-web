"use client";
import * as React from "react";
import { calculatePixelGrid, buildPixelCells } from "./pixel-grid";

/** Original animation controllers, restored as editable React source. */
let HOVER_IDLE_MS = 64;
let HOVER_LIFESPAN_MS = 260;
function HoverPixels({
  containerRef: containerRef,
  cells: cells,
  cols: cols,
  rows: rows,
  className: className,
  cellClassName = "quote-section-hover-cell",
  idleMs = HOVER_IDLE_MS,
  lifespanMs = HOVER_LIFESPAN_MS,
}) {
  let l = React.useRef(0),
    h = React.useRef([]),
    c = React.useRef(cells);
  React.useEffect(() => {
    c.current = cells;
    h.current.length = cells.length;
  }, [cells]);
  let p = React.useMemo(
    () => ({
      "--quote-grid-cols": cols,
      "--quote-grid-rows": rows,
    }),
    [cols, rows],
  );
  React.useEffect(() => {
    let s = containerRef.current;
    if (!s) return;
    let n = Array(cells.length).fill(0),
      c = {
        x: 0,
        y: 0,
        inside: false,
        lastMoveAt: 0,
      },
      p = () => {
        let t = performance.now(),
          e = false,
          s = c.inside && t - c.lastMoveAt <= idleMs;
        if (s) {
          let e = Math.round(c.x * (cols - 1)),
            s = Math.round(c.y * (rows - 1)) * cols + e;
          undefined !== n[s] && (n[s] = t + lifespanMs);
        }
        n.forEach((i, r) => {
          let s = h.current[r];
          s &&
            (i > t
              ? ((e = true), (s.style.visibility = "visible"))
              : (s.style.visibility = "hidden"));
        });
        l.current = e || s ? window.requestAnimationFrame(p) : 0;
      },
      u = () => {
        l.current || (l.current = window.requestAnimationFrame(p));
      },
      f = (t) => {
        let e = s.getBoundingClientRect();
        c.x = Math.min(Math.max((t.clientX - e.left) / e.width, 0), 1);
        c.y = Math.min(Math.max((t.clientY - e.top) / e.height, 0), 1);
        c.inside = true;
        c.lastMoveAt = performance.now();
        u();
      },
      d = () => {
        c.inside = false;
        u();
      };
    s.addEventListener("pointermove", f);
    s.addEventListener("pointerleave", d);
    return () => {
      s.removeEventListener("pointermove", f);
      s.removeEventListener("pointerleave", d);
      l.current && window.cancelAnimationFrame(l.current);
    };
  }, [cells.length, cols, rows, containerRef, idleMs, lifespanMs, className]);
  return (
    <div className={className} style={p} aria-hidden="true">
      {cells.map((t, e) => (
        <span
          key={`${t.id}-hover`}
          className={cellClassName}
          ref={(t) => {
            h.current[e] = t;
          }}
        />
      ))}
    </div>
  );
}
let INITIAL_MEDIA_GRID = {
  cols: 8,
  rows: 5,
};
function getMediaHoverGrid(t, e) {
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: 5,
    minRows: 4,
    targetCellSize: t <= 900 ? 58 : 76,
    roundCols: "round",
    roundRows: "round",
  });
}
function buildMediaHoverCells(t, e) {
  return buildPixelCells({
    cols: t,
    rows: e,
    buildCell: ({ index: t }) => ({
      id: `media-hover-cell-${t}`,
    }),
  });
}
function MediaHoverPixels({
  containerRef: containerRef,
  className = "media-hover-pixels",
}) {
  let [i, r] = React.useState(INITIAL_MEDIA_GRID),
    s = React.useMemo(
      () => buildMediaHoverCells(i.cols, i.rows),
      [i.cols, i.rows],
    );
  React.useEffect(() => {
    let e = containerRef.current;
    if (!e) return;
    let i = 0,
      s = () => {
        let t = e.getBoundingClientRect(),
          i = getMediaHoverGrid(t.width, t.height);
        r((t) => (t.cols === i.cols && t.rows === i.rows ? t : i));
      },
      n = () => {
        i ||
          (i = window.requestAnimationFrame(() => {
            i = 0;
            s();
          }));
      };
    s();
    let a = new ResizeObserver(n);
    a.observe(e);
    window.addEventListener("resize", n);
    return () => {
      i && window.cancelAnimationFrame(i);
      a.disconnect();
      window.removeEventListener("resize", n);
    };
  }, [containerRef]);
  return (
    <HoverPixels
      containerRef={containerRef}
      cells={s}
      cols={i.cols}
      rows={i.rows}
      className={className}
      cellClassName="media-hover-cell"
      idleMs={72}
      lifespanMs={320}
    />
  );
}

export {
  HOVER_IDLE_MS,
  HOVER_LIFESPAN_MS,
  HoverPixels,
  INITIAL_MEDIA_GRID,
  getMediaHoverGrid,
  buildMediaHoverCells,
  MediaHoverPixels,
};
