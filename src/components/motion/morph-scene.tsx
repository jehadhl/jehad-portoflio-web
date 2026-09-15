"use client";
import * as React from "react";

/** Original animation controllers, restored as editable React source. */
function MorphScene({ onReady: onReady }) {
  let e = React.useRef(null),
    i = React.useRef(null),
    r = React.useRef(null);
  React.useEffect(() => {
    let s = e.current,
      n = i.current,
      a = r.current;
    if (!s || !n || !a) return;
    let o = null,
      l = false,
      c = false,
      p = () => {
        c || ((c = true), onReady?.());
      },
      u = (path) =>
        path.endsWith("webgl-fallback-scene.js")
          ? import("@/lib/morph/webgl-fallback-scene.js")
          : import("@/lib/morph/react-scene.js");
    let f =
        /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
        ("MacIntel" === window.navigator.platform &&
          window.navigator.maxTouchPoints > 1),
      d = () => {
        let t = n.getContext("2d");
        if (!t) {
          a.hidden = false;
          a.textContent = "Scene failed to load.";
          p();
          return;
        }
        let e = 0,
          i = performance.now(),
          r = () => {
            let e = s.getBoundingClientRect(),
              i = Math.min(window.devicePixelRatio || 1, 1.5);
            n.width = Math.max(Math.floor(e.width * i), 1);
            n.height = Math.max(Math.floor(e.height * i), 1);
            n.style.width = `${e.width}px`;
            n.style.height = `${e.height}px`;
            t.setTransform(i, 0, 0, i, 0, 0);
          },
          o = ({ radius: t, morph: e, time: i, core: r = false }) => {
            let s = new Path2D(),
              n = 104,
              a = r ? 0.12 : 0.045,
              o = e * (r ? 0.58 : 0.74);
            for (let r = 0; r <= n; r += 1) {
              let l = (r / n) * Math.PI * 2,
                h =
                  1 /
                  Math.max(Math.abs(Math.cos(l)), Math.abs(Math.sin(l)), 0.01),
                c =
                  t *
                  (1 +
                    (Math.sin(3 * l + 0.82 * i) * a +
                      Math.sin(5 * l - 0.54 * i) * a * 0.42) *
                      (1 - 0.7 * e)) *
                  (1 + (h - 1) * o),
                p = Math.cos(l) * c,
                u = Math.sin(l) * c;
              0 === r ? s.moveTo(p, u) : s.lineTo(p, u);
            }
            s.closePath();
            return s;
          },
          l = (r) => {
            let n = s.getBoundingClientRect(),
              a = Math.max(n.width, 1),
              h = Math.max(n.height, 1),
              c = (r - i) / 1e3,
              p = document.querySelector(".hero-canvas-track"),
              u = p?.getBoundingClientRect(),
              f = Math.max(
                (p?.offsetHeight || window.innerHeight) - window.innerHeight,
                1,
              ),
              d = Math.min(Math.max(-(u?.top || 0) / f, 0), 1),
              m = Math.min(Math.max((d - 0.04) / 0.46, 0), 1),
              g = Math.min(a, h) * (0.21 - 0.048 * m),
              v = g * (0.6 - 0.06 * m),
              y = 0.5 * a,
              b = h * (0.47 - 0.06 * d),
              x = o({
                radius: g,
                morph: m,
                time: c,
              }),
              _ = o({
                radius: v,
                morph: m,
                time: 1.12 * c,
                core: true,
              });
            t.clearRect(0, 0, a, h);
            t.fillStyle = "#ffffff";
            t.fillRect(0, 0, a, h);
            t.save();
            t.translate(y, b);
            t.rotate(0.18 * c);
            let w = t.createRadialGradient(
              -(0.28 * v),
              -(0.34 * v),
              0.1 * v,
              0,
              0,
              1.2 * v,
            );
            w.addColorStop(0, "#ff8a4a");
            w.addColorStop(0.48, "#f92d04");
            w.addColorStop(1, "#d93408");
            t.globalAlpha = 1;
            t.fillStyle = w;
            t.fill(_);
            t.globalAlpha = 0.46;
            t.fillStyle = "#ffffff";
            t.fill(x);
            t.globalAlpha = 0.62;
            t.strokeStyle = "rgba(255,255,255,0.92)";
            t.lineWidth = 1.6;
            t.stroke(x);
            t.globalAlpha = 0.22;
            t.strokeStyle = "rgba(5,5,5,0.35)";
            t.lineWidth = 0.8;
            t.stroke(x);
            t.restore();
            e = window.requestAnimationFrame(l);
          };
        a.hidden = true;
        a.textContent = "";
        r();
        window.addEventListener("resize", r);
        e = window.requestAnimationFrame(l);
        p();
        return () => {
          window.cancelAnimationFrame(e);
          window.removeEventListener("resize", r);
        };
      },
      m = (t) =>
        Promise.resolve(
          t({
            mount: s,
            canvas: n,
            status: a,
          }),
        ).then((t) => {
          l ? t?.() : ((o = t), p());
        }),
      g = () => (
        (a.hidden = false),
        (a.textContent = "Loading WebGL fallback..."),
        u("/morph-pen/webgl-fallback-scene.js").then(
          ({ initWebGLFallbackScene: t }) => {
            if (!l) return m(t);
          },
        )
      );
    (!f && window.navigator?.gpu ? u("/morph-pen/react-scene.js") : g())
      .then((t) => {
        if (!l && t?.initMorphScene) return m(t.initMorphScene);
      })
      .catch((t) => {
        console.error("Failed to load morph scene module.", t);
        g().catch((t) => {
          console.error("Failed to load fallback morph scene.", t);
          o = d();
        });
      });
    return () => {
      l = true;
      o?.();
    };
  }, [onReady]);
  return (
    <div ref={e} className="morph-scene">
      <canvas ref={i} className="morph-canvas" aria-hidden="true" />
      <div ref={r} className="morph-status" hidden={true} />
    </div>
  );
}

export { MorphScene };
