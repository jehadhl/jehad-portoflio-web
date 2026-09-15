"use client";
import * as React from "react";

/** Original animation controllers, restored as editable React source. */
function calculatePixelGrid({
  width: width,
  height: height,
  minCols: minCols,
  minRows: minRows,
  targetCellSize: targetCellSize,
  roundCols = "ceil",
  roundRows = "ceil",
}) {
  let o = Math.max(width, 1),
    l = Math.max(height, 1),
    h = "round" === roundRows ? Math.round : Math.ceil,
    c = Math.max(
      minCols,
      ("round" === roundCols ? Math.round : Math.ceil)(o / targetCellSize),
    ),
    p = Math.max(minRows, h(l / (o / c)));
  return {
    cols: c,
    rows: p,
  };
}
function buildPixelCells({ cols: cols, rows: rows, buildCell: buildCell }) {
  return Array.from(
    {
      length: cols * rows,
    },
    (r, s) => {
      let n = Math.floor(s / cols),
        a = s % cols;
      return buildCell({
        index: s,
        row: n,
        col: a,
        cols: cols,
        rows: rows,
      });
    },
  );
}
function useViewportGrid({ getGrid: getGrid, initialGrid: initialGrid }) {
  let [i, r] = React.useState(initialGrid);
  React.useEffect(() => {
    let e = () => {
      r((e) => {
        let i = getGrid({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        return e.cols === i.cols && e.rows === i.rows ? e : i;
      });
    };
    e();
    window.addEventListener("resize", e);
    return () => {
      window.removeEventListener("resize", e);
    };
  }, [getGrid]);
  return i;
}
function usePixelCells(t, e) {
  return React.useMemo(
    () =>
      buildPixelCells({
        cols: t.cols,
        rows: t.rows,
        buildCell: e,
      }),
    [e, t.cols, t.rows],
  );
}

export { calculatePixelGrid, buildPixelCells, useViewportGrid, usePixelCells };
