"use client";
import * as React from "react";
import gsap from "gsap";
import lottie from "@/lib/lottie-client";
import { calculatePixelGrid, buildPixelCells } from "./pixel-grid";
import { useScrollProgress } from "./scroll-progress";

/** Original animation controllers, restored as editable React source. */
function clampToolsProgress(t, e, i) {
  return Math.min(Math.max(t, e), i);
}
function wrapSlideIndex(t, e) {
  return e ? ((t % e) + e) % e : 0;
}
function smoothToolsStep(t) {
  return t * t * (3 - 2 * t);
}
function easeToolsSlideProgress(t) {
  if (t <= 0.12) {
    let e = (1 - smoothToolsStep(clampToolsProgress(t / 0.12, 0, 1))) * 0.72;
    return t * (1 - e);
  }
  if (t >= 0.34) {
    let e = 0.78 * smoothToolsStep(clampToolsProgress((t - 0.34) / 0.38, 0, 1));
    return t + (1 - t) * e;
  }
  return t;
}
function easeToolsEntry(t) {
  return t <= 0.4 ? 0.4 * Math.pow(clampToolsProgress(t / 0.4, 0, 1), 1.18) : t;
}
function easeToolsTrack(t) {
  let e = easeToolsEntry(t);
  return e >= 0.65
    ? 0.65 + 0.35 * smoothToolsStep(clampToolsProgress((e - 0.65) / 0.35, 0, 1))
    : e;
}
function formatToolsIndex(t) {
  return String(t ?? "1")
    .replace(/\D/g, "")
    .padStart(3, "0");
}
function formatToolsCounter(t) {
  let e = Number.parseInt(String(t ?? "1").replace(/\D/g, "") || "1", 10);
  return String(Number.isNaN(e) ? 1 : e);
}
function getToolsCounterIndex(t, e) {
  return t?.lottie ? 0 : Math.max(e, 0);
}
let INITIAL_TOOLS_GRID = {
  cols: 8,
  rows: 9,
};
function getToolsGrid(t, e) {
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: 4,
    minRows: 9,
    targetCellSize: t <= 1200 ? 72 : 88,
    roundCols: "round",
    roundRows: "round",
  });
}
function buildToolsTrailCells(t, e, i = 0, r = 1) {
  let s = Math.max(t * r, 1),
    n = Math.floor((e - 1) * 0.5),
    a = Math.min(2, n, Math.max(e - 1 - n, 0)),
    o = Math.max(1, Math.floor(0.75 * t)),
    l = 3,
    h = Math.max(s - o - 3 - 5, 1),
    c = a >= 2 ? [0, -1, -2, -1, 0, 1, 2, 1] : 1 === a ? [0, -1, 0, 1] : [0],
    p = a >= 2 ? [1, 2, 1, 2, 1, 2, 1, 2] : 1 === a ? [1, 2, 1, 2] : [1],
    u = p.reduce((t, e) => t + e, 0);
  return buildPixelCells({
    cols: t,
    rows: e,
    buildCell: ({ index: e, row: r, col: s }) => {
      let a = i * t + s,
        f = r + 0.5,
        d = n,
        m = 2;
      if (a >= o) {
        let t = a - o,
          e = t / Math.max(h - 1, 1);
        if (t < l) 0.51 > Math.abs(f - (n + 0.5)) && (m = e);
        else {
          let i = (t - l) % u,
            r = 0,
            s = 0;
          for (let t = 0; t < p.length; t += 1)
            if (i < (r += p[t])) {
              s = t;
              break;
            }
          0.56 > Math.abs(f - ((d = n + (c[s] ?? 0)) + 0.5)) && (m = e);
        }
      }
      return {
        id: `tools-pixel-cell-${e}`,
        threshold: Number(m.toFixed(3)),
      };
    },
  });
}
function ToolsPixelTrail({
  progress = 0,
  slideCount = 1,
  slideIndex = 0,
  grid: grid,
  hidden = false,
}) {
  let n = React.useRef([]),
    a = React.useMemo(
      () => buildToolsTrailCells(grid.cols, grid.rows, slideIndex, slideCount),
      [grid.cols, grid.rows, slideIndex, slideCount],
    );
  React.useEffect(() => {
    if (hidden)
      return void n.current.forEach((t) => {
        t && "hidden" !== t.style.visibility && (t.style.visibility = "hidden");
      });
    let e = clampToolsProgress(progress, 0, 1);
    n.current.forEach((t, i) => {
      if (!t) return;
      let r = e >= (a[i]?.threshold ?? 1) ? "visible" : "hidden";
      t.style.visibility !== r && (t.style.visibility = r);
    });
  }, [grid.cols, grid.rows, hidden, progress, slideCount, slideIndex]);
  return (
    <div
      className="tools-strip-pixel-layer"
      style={{
        "--tools-pixel-cols": grid.cols,
        "--tools-pixel-rows": grid.rows,
        "--tools-pixel-size": `${grid.cellSize ?? 0}px`,
      }}
      aria-hidden="true"
    >
      {a.map((t, e) => (
        <span
          key={t.id}
          className="tools-strip-pixel-cell"
          ref={(t) => {
            n.current[e] = t;
          }}
        />
      ))}
    </div>
  );
}
function renderToolMedia(t, e, i, r) {
  return t?.lottie ? (
    <div
      ref={(t) => {
        r.current[e] = t;
      }}
      className="tools-strip-media-asset tools-strip-media-lottie"
    />
  ) : t?.video ? (
    <video
      ref={(t) => {
        i.current[e] = t;
      }}
      className="tools-strip-media-asset"
      src={t.video}
      poster={t.image}
      muted={true}
      loop={true}
      playsInline={true}
      preload="auto"
    />
  ) : (
    <img src={t?.image} alt={t?.alt} className="tools-strip-media-asset" />
  );
}
function ToolsReel({ items = [] }) {
  let e = React.useRef(null),
    i = React.useRef(null),
    r = React.useRef([]),
    s = React.useRef([]),
    n = React.useRef({
      value: 0,
    }),
    a = React.useRef(0),
    o = React.useMemo(() => items, [items]),
    l = React.useMemo(() => o.filter((t) => !t?.lottie), [o]),
    [h, c] = React.useState(INITIAL_TOOLS_GRID),
    [p, u] = React.useState(0),
    [f, d] = React.useState(1),
    [m, g] = React.useState(false),
    v = m ? l : o,
    y = React.useMemo(
      () => (v.length <= 1 ? v : [v[v.length - 1], ...v, v[0]]),
      [v],
    ),
    b = m ? y : v,
    x = v.length,
    _ = Math.max(x - 1, 1),
    w = clampToolsProgress(
      useScrollProgress(
        e,
        React.useCallback((t) => {
          let e = t.closest(".page-entry-tools-section"),
            i = e?.querySelector(".page-entry-tools-mark");
          if (!e || !i) return 0;
          let r = e.getBoundingClientRect(),
            s = i.offsetHeight;
          return (
            (-r.top - s) / Math.max(e.offsetHeight - window.innerHeight - s, 1)
          );
        }, []),
      ),
      0,
      1,
    );
  React.useEffect(() => {
    let t = window.matchMedia("(max-width: 900px)"),
      e = () => {
        g(t.matches);
      };
    e();
    t.addEventListener("change", e);
    return () => {
      t.removeEventListener("change", e);
    };
  }, []);
  React.useEffect(() => {
    if (m) {
      if (!v.length) return void d(1);
      d((t) => wrapSlideIndex(t - 1, v.length) + 1);
    }
  }, [v.length, m]);
  React.useEffect(() => {
    let t = i.current;
    if (!t) return;
    let e = 0,
      r = () => {
        let e = t.getBoundingClientRect(),
          i = Math.round(e.width),
          r = getToolsGrid(i, Math.round(e.height)),
          s = i / Math.max(r.cols, 1);
        c((t) =>
          t.cols === r.cols && t.rows === r.rows && t.cellSize === s
            ? t
            : {
                ...r,
                cellSize: s,
              },
        );
      },
      s = () => {
        e ||
          (e = window.requestAnimationFrame(() => {
            e = 0;
            r();
          }));
      };
    r();
    let n = new ResizeObserver(s);
    n.observe(t);
    window.addEventListener("resize", s);
    return () => {
      e && window.cancelAnimationFrame(e);
      n.disconnect();
      window.removeEventListener("resize", s);
    };
  }, []);
  let {
      currentItem: k,
      nextItem: C,
      currentIndex: M,
      nextIndex: T,
      localProgress: A,
      snapProgress: P,
      trackProgress: S,
    } = React.useMemo(() => {
      if (!x)
        return {
          currentItem: null,
          nextItem: null,
          currentIndex: 0,
          nextIndex: 0,
          localProgress: 0,
          snapProgress: 0,
          trackProgress: 0,
        };
      if (m) {
        let t = wrapSlideIndex(f - 1, x);
        return {
          currentItem: v[t],
          nextItem: v[t],
          currentIndex: t,
          nextIndex: t,
          localProgress: 0,
          snapProgress: 0,
          trackProgress: f,
        };
      }
      let t = easeToolsTrack(w) * _,
        e = Math.min(Math.floor(t), x - 1),
        i = Math.min(e + 1, x - 1),
        r = easeToolsSlideProgress(
          e >= x - 1 ? 0 : clampToolsProgress(t - e, 0, 1),
        ),
        s = e >= x - 1 ? e : e + r;
      return {
        currentItem: v[e],
        nextItem: v[i],
        currentIndex: e,
        nextIndex: i,
        localProgress: r,
        snapProgress: r,
        trackProgress: Math.min(s, x - 1),
      };
    }, [v, m, f, w, x, _]),
    E = M < x - 1 && P >= 0.5 ? C : k,
    D = Math.min(M + P, x - 1),
    F = m && x > 0 ? wrapSlideIndex(p - 1, x) : 0,
    j = m ? p : clampToolsProgress(p, 0, Math.max(x - 1, 0)),
    L = m ? Math.floor(F) : Math.min(Math.floor(j), x - 1),
    I = m ? F - L : L >= x - 1 ? 0 : j - L,
    R = m
      ? wrapSlideIndex(Math.round(F), x)
      : L < x - 1 && I >= 0.5
        ? L + 1
        : L,
    N = v[R] ?? E,
    O = x > 0 ? (m ? F : j) : D,
    B = v,
    z = B.length > 0 ? (O / B.length) * 100 : 0,
    V = m ? clampToolsProgress(Math.round(p), 0, Math.max(b.length - 1, 0)) : R,
    q = m ? w : clampToolsProgress(x > 1 ? j / Math.max(x - 1, 1) : j, 0, 1),
    W = m ? q : clampToolsProgress((q - 0.03) / 0.97, 0, 1),
    G = W < 0.015;
  React.useEffect(() => {
    a.current = S;
  }, [S]);
  React.useEffect(() => {
    if (!x) {
      n.current.value = 0;
      u(0);
      return;
    }
    if (m) return;
    let t = 0,
      e = performance.now(),
      i = (r) => {
        let s = Math.min((r - e) / 1e3, 0.05),
          o = a.current,
          l = n.current.value,
          h = 1 - Math.pow(4e-4, s),
          c = 0.001 > Math.abs(o - l) ? o : l + (o - l) * h;
        n.current.value = c;
        u(c);
        e = r;
        t = window.requestAnimationFrame(i);
      };
    t = window.requestAnimationFrame(i);
    return () => {
      window.cancelAnimationFrame(t);
    };
  }, [m, x]);
  React.useEffect(() => {
    if (!x || !m) return;
    gsap.killTweensOf(n.current);
    let t = gsap.to(n.current, {
      value: S,
      duration: 0.7,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => {
        u(n.current.value);
      },
      onComplete: () => {
        n.current.value = S;
        u(S);
        x <= 1 ||
          (0 === S
            ? ((n.current.value = x), u(x), d(x))
            : S === x + 1 && ((n.current.value = 1), u(1), d(1)));
      },
    });
    return () => {
      t.kill();
    };
  }, [m, x, S]);
  React.useEffect(() => {
    r.current.forEach((t, e) => {
      t &&
        ((m ? e === V : 1.05 >= Math.abs(e - j))
          ? ((t.muted = true),
            (t.loop = true),
            (t.playsInline = true),
            t.play().catch(() => {}))
          : t.pause());
    });
  }, [V, j, m]);
  React.useEffect(() => {
    let t = [];
    s.current.forEach((e, i) => {
      let r = b[i];
      if (!e || !r?.lottie) return;
      let s = lottie.loadAnimation({
        container: e,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: r.lottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
        },
      });
      e.__toolsAnimation = s;
      t.push({
        animation: s,
        container: e,
      });
    });
    return () => {
      t.forEach(({ animation: t, container: e }) => {
        e.__toolsAnimation = undefined;
        t.destroy();
      });
    };
  }, [b]);
  React.useEffect(() => {
    s.current.forEach((t, e) => {
      let i = t?.__toolsAnimation;
      i && (e === V ? i.play() : i.stop());
    });
  }, [V]);
  let Y = React.useCallback(() => {
      d((t) => (v.length <= 1 ? 1 : 1 === t ? 0 : t - 1));
    }, [v.length]),
    X = React.useCallback(() => {
      d((t) => (v.length <= 1 ? 1 : t === v.length ? v.length + 1 : t + 1));
    }, [v.length]);
  return k && C ? (
    <section ref={e} className="tools-strip" aria-label="Selected project">
      <div className="tools-strip-frame">
        <div className="tools-strip-rule tools-strip-rule-top" />
        {m ? (
          <div className="tools-strip-footer tools-strip-footer-mobile-top">
            <div className="tools-strip-mobile-header">
              <p className="tools-strip-mobile-index">
                {formatToolsCounter(getToolsCounterIndex(N, R))}
              </p>
              <h3 className="tools-strip-mobile-title">{N?.title}</h3>
            </div>
          </div>
        ) : null}
        <div className="tools-strip-meta">
          <div className="tools-strip-copy-mask">
            <p className="tools-strip-copy">{N?.copy}</p>
          </div>
          <div className="tools-strip-label-mask">
            <p className="tools-strip-label">{"Scroll #"}</p>
          </div>
        </div>
        <div ref={i} className="tools-strip-media-stage">
          <div className="tools-strip-media-scroll-window">
            <div
              className="tools-strip-media-stage-track"
              style={{
                transform: `translate3d(-${100 * j}%, 0, 0)`,
              }}
            >
              {b.map((t, e) => (
                <div
                  key={`${t.video ?? t.image ?? t.index ?? e}-${e}`}
                  className="tools-strip-media-slide"
                >
                  {m ? null : (
                    <ToolsPixelTrail
                      progress={W}
                      slideCount={x}
                      slideIndex={e}
                      grid={h}
                      hidden={G && 0 === e}
                    />
                  )}
                  <div
                    className="tools-strip-media"
                    style={
                      m || t?.video
                        ? undefined
                        : {
                            transform: `scale(${1 - 0.08 * Math.min(Math.abs(e - j), 1)})`,
                          }
                    }
                  >
                    {renderToolMedia(t, e, r, s)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {m ? (
            <div className="tools-strip-arrows" aria-label="Project navigation">
              <button
                type="button"
                className="tools-strip-arrow"
                aria-label="Show previous project"
                onClick={Y}
              >
                <span aria-hidden="true">{"←"}</span>
              </button>
              <button
                type="button"
                className="tools-strip-arrow"
                aria-label="Show next project"
                onClick={X}
              >
                <span aria-hidden="true">{"→"}</span>
              </button>
            </div>
          ) : null}
        </div>
        <div
          className={`tools-strip-footer ${m ? "tools-strip-footer-mobile-bottom" : ""}`}
        >
          <div className="tools-strip-title-block">
            <div className="tools-strip-counter-mask tools-strip-counter-mask-small">
              <div className="tools-strip-counter-stack">
                <div
                  className="tools-strip-stack-list"
                  style={{
                    transform: `translate3d(0, -${z}%, 0)`,
                  }}
                >
                  {B.map((t, e) => (
                    <p
                      key={`small-stack-${t?.index ?? "item"}-${e}`}
                      className="tools-strip-counter tools-strip-counter-small tools-strip-stack-item"
                    >
                      {formatToolsCounter(getToolsCounterIndex(t, e))}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="tools-strip-counter-mask">
              <div
                className={`tools-strip-title-stack ${m ? "tools-strip-title-stack-mobile" : ""}`}
              >
                <div
                  className="tools-strip-stack-list"
                  style={{
                    transform: `translate3d(0, -${z}%, 0)`,
                  }}
                >
                  {B.map((t, e) => (
                    <h3
                      key={`title-stack-${t?.index ?? "item"}-${e}`}
                      className={`tools-strip-title tools-strip-stack-item tools-strip-title-item ${m ? "tools-strip-title-item-mobile" : ""}`}
                    >
                      {t?.title}
                    </h3>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="tools-strip-counter-mask tools-strip-counter-mask-large">
            <div className="tools-strip-counter-stack">
              <div
                className="tools-strip-stack-list"
                style={{
                  transform: `translate3d(0, -${z}%, 0)`,
                }}
              >
                {B.map((t, e) => (
                  <p
                    key={`large-stack-${t?.index ?? "item"}-${e}`}
                    className="tools-strip-counter tools-strip-counter-large tools-strip-stack-item"
                  >
                    {formatToolsIndex(getToolsCounterIndex(t, e))}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="tools-strip-rule tools-strip-rule-bottom" />
      </div>
    </section>
  ) : null;
}

export {
  clampToolsProgress,
  wrapSlideIndex,
  smoothToolsStep,
  easeToolsSlideProgress,
  easeToolsEntry,
  easeToolsTrack,
  formatToolsIndex,
  formatToolsCounter,
  getToolsCounterIndex,
  INITIAL_TOOLS_GRID,
  getToolsGrid,
  buildToolsTrailCells,
  ToolsPixelTrail,
  renderToolMedia,
  ToolsReel,
};
