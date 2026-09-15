"use client";
import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Original animation controllers, restored as editable React source. */
function WorkScribble() {
  let t = React.useRef(null),
    e = React.useRef(null);
  React.useEffect(() => {
    let i = t.current,
      r = e.current;
    if (!i || !r) return;
    let s = window.matchMedia("(max-width: 900px)").matches;
    gsap.registerPlugin(ScrollTrigger);
    let n = 0,
      a = gsap.quickSetter(r, "y", "px"),
      o = () => {
        n = Math.max(i.offsetHeight - r.offsetHeight, 0);
      };
    if (
      (gsap.set(r, {
        xPercent: -50,
        y: 0,
        opacity: 1,
      }),
      o(),
      s)
    )
      return void a(0.5 * n);
    let l = ScrollTrigger.create({
      trigger: i,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onRefreshInit: o,
      onRefresh: o,
      onUpdate: (t) => {
        a(n * t.progress);
      },
    });
    window.addEventListener("resize", o);
    return () => {
      window.removeEventListener("resize", o);
      l.kill();
    };
  }, []);
  return (
    <div ref={t} className="work-scribble" aria-hidden="true">
      <div className="work-scribble-line" />
      <span ref={e} className="work-scribble-square" />
    </div>
  );
}

export { WorkScribble };
