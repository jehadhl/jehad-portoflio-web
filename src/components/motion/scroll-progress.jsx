"use client";
import * as React from "react";

/** Original animation controllers, restored as editable React source. */
let clampScrollProgress = (t, e, i) => Math.min(Math.max(t, e), i);
function useScrollProgress(t, e) {
  let [i, r] = React.useState(0);
  React.useEffect(() => {
    let i = t.current;
    if (!i) return;
    let s = 0,
      n = () => {
        s = 0;
        let t = clampScrollProgress(e(i), 0, 1);
        r((e) => (e === t ? e : t));
      },
      a = () => {
        s || (s = window.requestAnimationFrame(n));
      };
    a();
    window.addEventListener("scroll", a, {
      passive: true,
    });
    window.addEventListener("resize", a);
    return () => {
      window.removeEventListener("scroll", a);
      window.removeEventListener("resize", a);
      s && window.cancelAnimationFrame(s);
    };
  }, [t, e]);
  return i;
}

export { clampScrollProgress, useScrollProgress };
