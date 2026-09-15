"use client";
import * as React from "react";
import gsap from "gsap";
import * as responsive from "@/hooks/use-responsive";
import {
  calculatePixelGrid,
  useViewportGrid,
  usePixelCells,
} from "./pixel-grid";
import {
  isSectionLink,
  jumpToSection,
  requestSectionTransition,
} from "./section-navigation";

/** Original animation controllers, restored as editable React source. */
let MENU_CLOSE_DELAY_MS = 1e3;
let MENU_LINK_PIXEL_COLUMNS = 44;
let getMenuGrid = ({ width: t, height: e }) => {
  let i = t >= responsive.BREAKPOINTS.MENU_GRID_DENSE ? 96 : 76;
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: 6,
    minRows: 8,
    targetCellSize: i,
  });
};
let buildMenuCell = ({ index: t, row: e, col: i, rows: r }) => {
  let s = ((e + 1) * 19 + (i + 1) * 23) % 100,
    n = 0.052 * e,
    a = (r - e - 1) * 0.052,
    o = (s / 100) * 0.14;
  return {
    id: `menu-cell-${t}`,
    openDelay: `${n + o}s`,
    closeDelay: `${a + o}s`,
  };
};
/** @param {{name?: string, links?: import("@/content").NavigationItem[]}} props */
function SiteHeader({ name = "", links = [] }) {
  let i = React.useRef(null),
    r = React.useRef(0),
    s = React.useRef(null),
    n = React.useRef(null),
    [a, o] = React.useState("closed"),
    [l, h] = React.useState(false),
    c = (0, responsive.useMaxWidth)(responsive.BREAKPOINTS.TOPBAR_MENU),
    p = useViewportGrid({
      getGrid: getMenuGrid,
      initialGrid: {
        cols: 6,
        rows: 10,
      },
    }),
    u = usePixelCells(p, buildMenuCell);
  React.useEffect(() => {
    c || o("closed");
  }, [c]);
  React.useEffect(
    () => (
      document.body.classList.toggle("menu-open", "closed" !== a),
      () => {
        document.body.classList.remove("menu-open");
      }
    ),
    [a],
  );
  React.useEffect(() => {
    let t = () => {
      let t = n.current;
      if (!t) return;
      let { left: e } = t.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--hero-music-inline-start",
        `${e}px`,
      );
    };
    t();
    window.addEventListener("resize", t);
    return () => {
      window.removeEventListener("resize", t);
    };
  }, [links.length]);
  React.useEffect(
    () => () => {
      window.clearTimeout(i.current);
      s.current && window.cancelAnimationFrame(s.current);
    },
    [],
  );
  React.useEffect(() => {
    r.current = window.scrollY;
    let t = () => {
        let t = window.scrollY,
          e = t - r.current;
        t <= 12 || "closed" !== a ? h(false) : Math.abs(e) > 6 && h(e > 0);
        r.current = t;
        s.current = null;
      },
      e = () => {
        s.current || (s.current = window.requestAnimationFrame(t));
      };
    window.addEventListener("scroll", e, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", e);
      s.current && (window.cancelAnimationFrame(s.current), (s.current = null));
    };
  }, [a]);
  let f = "closed" !== a,
    d = "open" === a,
    m = "closing" === a,
    g = () => {
      if ("open" === a) {
        o("closing");
        window.clearTimeout(i.current);
        i.current = window.setTimeout(() => {
          o("closed");
        }, MENU_CLOSE_DELAY_MS);
        return;
      }
      window.clearTimeout(i.current);
      o("open");
    },
    v = (t, e, r = {}) => {
      let s = true === r.useMenuCloseOnly;
      if (!isSectionLink(e)) {
        "open" === a &&
          (o("closing"),
          window.clearTimeout(i.current),
          (i.current = window.setTimeout(() => {
            o("closed");
          }, MENU_CLOSE_DELAY_MS)));
        return;
      }
      if ((t.preventDefault(), window.clearTimeout(i.current), s)) {
        jumpToSection(e);
        o("closing");
        i.current = window.setTimeout(() => {
          o("closed");
        }, MENU_CLOSE_DELAY_MS);
        return;
      }
      if ("open" !== a) {
        o("closed");
        requestSectionTransition(e);
        return;
      }
      o("closing");
      i.current = window.setTimeout(() => {
        o("closed");
        requestSectionTransition(e);
      }, MENU_CLOSE_DELAY_MS);
    },
    y = (t, e) => {
      let i = t.currentTarget,
        r = t.currentTarget.querySelectorAll(".topbar-link-hover-pixel");
      gsap.killTweensOf(i);
      gsap.killTweensOf(r);
      gsap.to(i, {
        color: e ? "#FF641C" : "#050505",
        duration: e ? 0.28 : 0.16,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(r, {
        autoAlpha: +!!e,
        duration: e ? 0.48 : 0.08,
        ease: e ? "power2.out" : "power3.out",
        stagger: e
          ? {
              each: 0.065,
              from: "start",
              grid: [1, MENU_LINK_PIXEL_COLUMNS],
              axis: "x",
            }
          : 0,
        overwrite: true,
        onComplete: () => {
          e ||
            gsap.set(r, {
              autoAlpha: 0,
            });
        },
        onInterrupt: () => {
          e ||
            gsap.set(r, {
              autoAlpha: 0,
            });
        },
      });
    };
  return (
    <React.Fragment>
      <header className={`topbar${l ? " is-hidden" : ""}`}>
        <div className="topbar-row">
          <div className="topbar-name-wrap">
            <p className="topbar-name">{name}</p>
          </div>
          <nav ref={n} className="topbar-nav" aria-label="Primary">
            {links.map((t) => (
              <a
                key={t.href}
                href={t.href}
                className={t.className}
                onClick={(e) => v(e, t.href)}
              >
                <span className="topbar-link-label">{t.label}</span>
              </a>
            ))}
          </nav>
          <button
            type="button"
            className={`topbar-menu-toggle${f ? " is-open" : ""}`}
            aria-expanded={d}
            aria-controls="mobile-site-menu"
            aria-label={f ? "Close menu" : "Open menu"}
            onClick={g}
          />
        </div>
      </header>
      <div
        id="mobile-site-menu"
        className={`topbar-menu-overlay${d ? " is-open" : ""}${m ? " is-closing" : ""}`}
        aria-hidden={!f}
      >
        <div
          className="topbar-menu-pixels"
          style={{
            "--topbar-menu-cols": p.cols,
          }}
          aria-hidden="true"
        >
          {u.map((t) => (
            <span
              key={t.id}
              className="topbar-menu-cell"
              style={{
                "--menu-cell-open-delay": t.openDelay,
                "--menu-cell-close-delay": t.closeDelay,
              }}
            />
          ))}
        </div>
        <div className="topbar-menu-panel">
          <nav className="topbar-menu-nav" aria-label="Mobile primary">
            {links.map((t) => (
              <a
                key={t.href}
                href={t.href}
                className={t.className}
                onClick={(e) =>
                  v(e, t.href, {
                    useMenuCloseOnly: true,
                  })
                }
                onPointerEnter={(t) => y(t, true)}
                onPointerLeave={(t) => y(t, false)}
              >
                <span className="topbar-link-hover-pixels" aria-hidden="true">
                  {Array.from(
                    {
                      length: MENU_LINK_PIXEL_COLUMNS,
                    },
                    (t, e) => (
                      <span
                        key={`topbar-link-hover-pixel-${e}`}
                        className="topbar-link-hover-pixel"
                      />
                    ),
                  )}
                </span>
                <span className="topbar-link-label">{t.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
}

export {
  MENU_CLOSE_DELAY_MS,
  MENU_LINK_PIXEL_COLUMNS,
  getMenuGrid,
  buildMenuCell,
  SiteHeader,
};
