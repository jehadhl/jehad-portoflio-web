"use client";
import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as responsive from "@/hooks/use-responsive";
import {
  calculatePixelGrid,
  useViewportGrid,
  usePixelCells,
} from "./pixel-grid";
import { AboutGallery } from "./about-gallery";
import { WorkScribble } from "./work-scribble";
import { ToolsReel } from "./tools-reel";

/** Original animation controllers, restored as editable React source. */
function AboutPixelPanel({
  isMobile: isMobile,
  panelGrid: panelGrid,
  panelCells: panelCells,
  panelCellRefs: panelCellRefs,
}) {
  return isMobile ? null : (
    <div
      className="page-entry-panel-secondary"
      style={{
        "--page-entry-panel-cols": panelGrid.cols,
      }}
    >
      {panelCells.map((t) => (
        <span
          key={t.id}
          className="page-entry-panel-cell"
          aria-hidden="true"
          ref={(i) => {
            panelCellRefs.current[t.row * panelGrid.cols + t.col] = i;
          }}
        />
      ))}
    </div>
  );
}
function Services({ items: items, skillRowRefs: skillRowRefs }) {
  return (
    <div className="page-entry-skills">
      {items.map((t, i) => (
        <div
          key={t.index}
          className="row page-entry-skill-row"
          style={{
            "--skill-row-delay": `${0.08 * i}s`,
          }}
          ref={(t) => {
            skillRowRefs.current[i] = t;
          }}
        >
          <span className="page-entry-skill-hover-bar" aria-hidden="true" />
          <div className="col col-sm-12 col-md-2 col-lg-1">
            <p className="page-entry-skill-index">
              {"["}
              {t.index}
              {"]"}
            </p>
          </div>
          <div className="col col-sm-12 col-md-5 col-lg-4">
            <h3 className="page-entry-skill-title">{t.title}</h3>
          </div>
          <div className="col col-sm-12 col-md-5 col-lg-3">
            <p className="page-entry-skill-copy">{t.copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
let INITIAL_PANEL_GRID = {
  cols: 6,
  rows: 4,
};
let clampPanelProgress = (t, e, i) => Math.min(Math.max(t, e), i);
let getPanelGrid = ({ width: t, height: e }) => {
  let i = t >= 1440 ? 120 : t >= 1024 ? 140 : t >= 768 ? 160 : 180;
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: 6,
    minRows: 4,
    targetCellSize: i,
  });
};
let buildPanelCell = ({ index: t, row: e, col: i, rows: r }) => {
  let s = ((e + 1) * 23 + (i + 1) * 17) % 100,
    n = Math.min(
      1,
      (1 - (e + 0.5) / r) * 0.68 +
        ((((Math.floor(e / 1.5) + 1) * 29 + (Math.floor(i / 1.5) + 1) * 31) %
          100) /
          100) *
          0.14 +
        (s / 100) * 0.08,
    );
  return {
    id: `panel-cell-${t}`,
    row: e,
    col: i,
    seed: s,
    threshold: n,
  };
};
function usePanelGrid() {
  let t = useViewportGrid({
      getGrid: getPanelGrid,
      initialGrid: INITIAL_PANEL_GRID,
    }),
    e = usePixelCells(t, buildPanelCell);
  return {
    panelGrid: t,
    panelCells: e,
  };
}
function useMobileAbout() {
  return (0, responsive.useMaxWidth)(responsive.BREAKPOINTS.ABOUT_MOBILE);
}
function useServiceReveals(t, e) {
  React.useEffect(() => {
    let e = t.current.filter(Boolean);
    if (!e.length) return;
    let i = new IntersectionObserver(
      (t) => {
        t.forEach((t) => {
          t.isIntersecting &&
            (t.target.classList.add("is-visible"), i.unobserve(t.target));
        });
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "0px 0px -12% 0px",
      },
    );
    e.forEach((t) => i.observe(t));
    return () => {
      i.disconnect();
    };
  }, [t, e]);
}
function usePanelTransition({
  isMobileAbout: isMobileAbout,
  pageEntryRef: pageEntryRef,
  panelCellRefs: panelCellRefs,
  panelCells: panelCells,
}) {
  React.useEffect(() => {
    if (isMobileAbout)
      return void panelCellRefs.current.forEach((t) => {
        t && (t.style.opacity = "0");
      });
    let s = 0,
      n = () => {
        s = 0;
        let t = pageEntryRef.current;
        if (!t) return;
        let n = t.getBoundingClientRect(),
          a = Math.max(t.offsetHeight - window.innerHeight, 1),
          o = -n.top / a,
          l = clampPanelProgress(o, 0, 1),
          h = Math.pow(clampPanelProgress((l - 0.015) / 0.145, 0, 1), 1.15),
          c = clampPanelProgress((o - 0.9) / 0.25, 0, 1),
          p = 1 - clampPanelProgress((l - 0.048) / 0.056, 0, 1);
        t.style.setProperty("--page-entry-progress", l.toString());
        t.style.setProperty("--image-mask-scale", p.toString());
        panelCellRefs.current.forEach((t, e) => {
          if (!t) return;
          let i = panelCells[e]?.threshold ?? 1,
            s = h >= i && c < i ? "1" : "0";
          t.style.opacity !== s && (t.style.opacity = s);
        });
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
      s && window.cancelAnimationFrame(s);
      window.removeEventListener("scroll", a);
      window.removeEventListener("resize", a);
    };
  }, [isMobileAbout, pageEntryRef, panelCellRefs, panelCells]);
}
function renderHeadingWords(t) {
  return String(t || "")
    .split(" ")
    .map((t, e, i) => (
      <span key={`page-entry-heading-word-wrap-${e}`}>
        <span className="page-entry-heading-word">
          <span className="page-entry-heading-word-hidden">{t}</span>
          <span className="page-entry-heading-word-visible">{t}</span>
        </span>
        {e < i.length - 1 ? (
          <span className="page-entry-heading-space" aria-hidden="true">
            {" "}
          </span>
        ) : null}
      </span>
    ));
}
function ScrollHeading({ children: children, className = "" }) {
  let i = React.useRef(null),
    r = String(children || "");
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let t = i.current;
    if (!t) return;
    let e = t.querySelectorAll(".page-entry-heading-word");
    if (!e.length) return;
    let r = Array.from(e).map((t) => {
      let e = Array.from(t.children);
      gsap.set(e, {
        yPercent: (t) => (0 === t ? -100 : 0),
      });
      return gsap.to(e, {
        yPercent: "+=100",
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: t,
          start: "bottom 90%",
          end: "top 25%",
          scrub: 0.4,
        },
      });
    });
    return () => {
      r.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      e.forEach((t) => {
        gsap.set(t.children, {
          clearProps: "all",
        });
      });
    };
  }, [r]);
  return (
    <h2 ref={i} className={className} aria-label={r}>
      <span aria-hidden="true">{renderHeadingWords(r)}</span>
    </h2>
  );
}
/** @param {{content: import("@/content").SiteContent["about"], projectItems?: import("@/content").Tool[]}} props */
function About({ content: content, projectItems = [] }) {
  let i = React.useRef(null),
    r = React.useRef([]),
    s = React.useRef([]),
    { panelGrid: n, panelCells: a } = usePanelGrid(),
    o = useMobileAbout(),
    l = content?.sectionId ?? "work",
    h = content?.headings ?? {},
    c = content?.gallery ?? {},
    p = c?.images ?? [],
    u = content?.skills ?? [],
    f = content?.tools?.label ?? "Tools";
  useServiceReveals(s, u.length);
  usePanelTransition({
    isMobileAbout: o,
    pageEntryRef: i,
    panelCellRefs: r,
    panelCells: a,
  });
  return (
    <React.Fragment>
      <section className="page-entry-track">
        <div className="page-entry-inner">
          <div className="row page-entry-row page-entry-row-headings">
            <div className="col col-sm-12 col-md-6 col-lg-5">
              <ScrollHeading className="page-entry-heading page-entry-heading-left">
                {h.left}
              </ScrollHeading>
            </div>
            <div className="col col-sm-12 col-md-6 col-lg-5">
              <ScrollHeading className="page-entry-heading page-entry-heading-right">
                {h.right}
              </ScrollHeading>
            </div>
          </div>
        </div>
        <div
          className="page-entry-inner page-entry-split-trigger"
          aria-hidden="true"
        />
      </section>
      <section id={l} ref={i} className="page-entry-pixel-section">
        <div className="page-entry-pixel-wrap">
          <AboutPixelPanel
            isMobile={o}
            panelGrid={n}
            panelCells={a}
            panelCellRefs={r}
          />
          <div className="page-entry-content">
            <div className="page-entry-content-inner">
              <AboutGallery images={p} />
              <Services items={u} skillRowRefs={s} />
            </div>
            <div id="tools" className="page-entry-tools-section">
              <div className="page-entry-tools-mark" aria-hidden="true">
                <WorkScribble />
              </div>
              <div className="page-entry-tools-sticky">
                <div className="page-entry-tools-sticky-inner">
                  <p className="page-entry-tools-label" aria-hidden="true">
                    {f}
                  </p>
                  <ToolsReel items={projectItems} />
                </div>
              </div>
            </div>
            <div className="page-entry-work-progress" aria-hidden="true">
              <WorkScribble />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export {
  AboutPixelPanel,
  Services,
  INITIAL_PANEL_GRID,
  clampPanelProgress,
  getPanelGrid,
  buildPanelCell,
  usePanelGrid,
  useMobileAbout,
  useServiceReveals,
  usePanelTransition,
  renderHeadingWords,
  ScrollHeading,
  About,
};
