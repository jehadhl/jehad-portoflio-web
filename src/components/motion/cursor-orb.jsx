"use client";
import * as React from "react";

/** Original animation controllers, restored as editable React source. */
function CursorOrb() {
  let t = React.useRef(null);
  React.useEffect(() => {
    let e = t.current;
    if (!e || window.matchMedia("(pointer: coarse)").matches) return;
    let i = 0,
      r = {
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight,
        easedX: 0.5 * window.innerWidth,
        easedY: 0.5 * window.innerHeight,
        visible: false,
      },
      s = () => {
        r.easedX += (r.x - r.easedX) * 0.28;
        r.easedY += (r.y - r.easedY) * 0.28;
        e.style.transform = `translate3d(${r.easedX}px, ${r.easedY}px, 0) translate(-5px, -5px)`;
        i = window.requestAnimationFrame(s);
      },
      n = () => {
        r.visible = true;
        e.classList.add("is-visible");
      },
      a = () => {
        r.visible = false;
        e.classList.remove("is-visible");
      },
      o = (t) => {
        r.x = t.clientX;
        r.y = t.clientY;
        r.visible || n();
      };
    window.addEventListener("pointermove", o, {
      passive: true,
    });
    window.addEventListener("pointerleave", a);
    i = window.requestAnimationFrame(s);
    return () => {
      window.removeEventListener("pointermove", o);
      window.removeEventListener("pointerleave", a);
      i && window.cancelAnimationFrame(i);
    };
  }, []);
  return <div ref={t} className="cursor-orb" aria-hidden="true" />;
}

export { CursorOrb };
