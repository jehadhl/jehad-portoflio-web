"use client";
import * as React from "react";
import { calculatePixelGrid, buildPixelCells } from "./pixel-grid";
import { MediaHoverPixels } from "./hover-pixels";
import { useScrollProgress } from "./scroll-progress";

/** Original animation controllers, restored as editable React source. */
function splitProjectIndex(t = "") {
  let [e = "0", i = "0"] = t.split("");
  return [e, i];
}
function clampProjectProgress(t, e, i) {
  return Math.min(Math.max(t, e), i);
}
function smoothProjectStep(t) {
  return t * t * (3 - 2 * t);
}
let INITIAL_PROJECT_GRID = {
  cols: 12,
  rows: 8,
};
function getProjectGrid(t, e) {
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: t <= 1e3 ? 8 : 12,
    minRows: t <= 1e3 ? 5 : 8,
    targetCellSize: t <= 1200 ? 72 : 88,
    roundCols: "round",
    roundRows: "round",
  });
}
function buildProjectCells(t, e) {
  return buildPixelCells({
    cols: t,
    rows: e,
    buildCell: ({ index: i, row: r, col: s }) => {
      let n = clampProjectProgress(
        0.12 +
          (r / Math.max(e - 1, 1)) * 0.75 +
          ((((r + 1) * 19 + (s + 1) * 31) % 11) / 10) * 0.08 +
          (Math.abs(s - (t - 1) * 0.5) / Math.max(t - 1, 1)) * 0.04,
        0,
        0.995,
      );
      return {
        id: `project-image-cell-${i}`,
        row: r,
        col: s,
        threshold: Number(n.toFixed(3)),
      };
    },
  });
}
function ProjectPixelTransition({
  currentProject: currentProject,
  nextProject: nextProject,
  progress: progress,
}) {
  let r = React.useRef(null),
    [s, n] = React.useState(INITIAL_PROJECT_GRID),
    [a, o] = React.useState({
      width: 1,
      height: 1,
    });
  React.useEffect(() => {
    let t = r.current;
    if (!t) return;
    let e = () => {
      let e = t.getBoundingClientRect(),
        i = Math.max(e.width, 1),
        r = Math.max(e.height, 1),
        s = getProjectGrid(e.width, e.height);
      o((t) =>
        t.width === i && t.height === r
          ? t
          : {
              width: i,
              height: r,
            },
      );
      n((t) => (t.cols === s.cols && t.rows === s.rows ? t : s));
    };
    e();
    let i = new ResizeObserver(e);
    i.observe(t);
    window.addEventListener("resize", e);
    return () => {
      i.disconnect();
      window.removeEventListener("resize", e);
    };
  }, []);
  let l = React.useMemo(
      () => buildProjectCells(s.cols, s.rows),
      [s.cols, s.rows],
    ),
    h = a.width / Math.max(s.cols, 1),
    c = a.height / Math.max(s.rows, 1);
  return (
    <div ref={r} className="projects-cycle-media-frame">
      <MediaHoverPixels containerRef={r} />
      <figure className="projects-figure projects-cycle-figure projects-cycle-figure-base">
        <div className="projects-image-clip">
          <img
            src={nextProject.image}
            alt={nextProject.alt}
            className="projects-image"
          />
        </div>
      </figure>
      <div
        className="projects-cycle-pixel-layer"
        style={{
          "--projects-pixel-cols": s.cols,
          "--projects-pixel-rows": s.rows,
        }}
        aria-hidden="true"
      >
        {l.map((e) => (
          <span
            key={`${currentProject.index}-${e.id}`}
            className="projects-cycle-pixel-cell"
            style={{
              visibility: progress >= e.threshold ? "hidden" : "visible",
            }}
          >
            <img
              src={currentProject.image}
              alt=""
              className="projects-cycle-pixel-image"
              style={{
                width: `${a.width}px`,
                height: `${a.height}px`,
                left: `${-e.col * h}px`,
                top: `${-e.row * c}px`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
function ProjectCycle({ items = [], workLabel = "Work" }) {
  let i = React.useRef(null),
    r = Math.max(items.length - 1, 1),
    s = 100 + 40 * r,
    n = clampProjectProgress(
      useScrollProgress(
        i,
        React.useCallback((t) => {
          let e = t.getBoundingClientRect(),
            i = Math.max(t.offsetHeight - window.innerHeight, 1);
          return -e.top / i;
        }, []),
      ),
      0,
      1,
    ),
    {
      currentProject: a,
      nextProject: o,
      currentFirstDigit: l,
      currentSecondDigit: h,
      nextFirstDigit: c,
      nextSecondDigit: p,
      localProgress: u,
      delayedDigitProgress: f,
      currentCopyOpacity: d,
      nextCopyOpacity: m,
    } = React.useMemo(() => {
      let e = n * r,
        i = Math.min(Math.floor(e), items.length - 2),
        s = Math.min(i + 1, items.length - 1),
        a = clampProjectProgress(e - i, 0, 1),
        o = smoothProjectStep(a),
        l = a > 0.001,
        h = +!l,
        c = +!!l,
        [p, u] = splitProjectIndex(items[i]?.index),
        [f, d] = splitProjectIndex(items[s]?.index);
      return {
        currentProject: items[i],
        nextProject: items[s],
        currentFirstDigit: p,
        currentSecondDigit: u,
        nextFirstDigit: f,
        nextSecondDigit: d,
        localProgress: o,
        delayedDigitProgress: smoothProjectStep(
          clampProjectProgress((a - 0.08) / 0.92, 0, 1),
        ),
        currentCopyOpacity: h,
        nextCopyOpacity: c,
      };
    }, [items, n, r]);
  if (!a || !o) return null;
  let g = u >= 0.5 ? o : a;
  return (
    <div
      ref={i}
      className="projects-track"
      style={{
        "--projects-track-height": `${s}vh`,
      }}
    >
      <div className="projects-sticky">
        <div className="projects-work-title" aria-hidden="true">
          <p>{workLabel}</p>
        </div>
        <div className="projects-cycle-row">
          <div className="projects-cycle-col projects-cycle-col-index">
            <p className="projects-index" aria-label={o.index}>
              <span className="projects-index-digit-wrap">
                <span
                  className="projects-index-digit-stack"
                  style={{
                    transform: `translate3d(0, ${-(50 * u)}%, 0)`,
                  }}
                >
                  <span className="projects-index-digit">{l}</span>
                  <span className="projects-index-digit">{c}</span>
                </span>
              </span>
              <span className="projects-index-digit-wrap">
                <span
                  className="projects-index-digit-stack"
                  style={{
                    transform: `translate3d(0, ${-(50 * f)}%, 0)`,
                  }}
                >
                  <span className="projects-index-digit">{h}</span>
                  <span className="projects-index-digit">{p}</span>
                </span>
              </span>
            </p>
            {g.url ? (
              <a
                className="projects-view-link"
                href={g.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="projects-view-link-fill" aria-hidden="true" />
                <span
                  className="projects-view-link-text"
                  data-text="View project"
                >
                  <span>{"View project"}</span>
                </span>
              </a>
            ) : null}
          </div>
          <div className="projects-cycle-col projects-cycle-col-media">
            <ProjectPixelTransition
              currentProject={a}
              nextProject={o}
              progress={u}
            />
          </div>
          <div className="projects-cycle-col projects-cycle-col-copy">
            <div className="projects-cycle-copy-stack">
              <div
                className="projects-cycle-copy-layer"
                style={{
                  opacity: d,
                }}
                aria-hidden={d <= 0.01}
              >
                <div className="projects-list-copy">
                  <div className="projects-label">
                    <p className="projects-label-line">{a.title}</p>
                    <p className="projects-label-line">{a.subtitle}</p>
                  </div>
                  <div className="projects-copy-body">
                    <p className="projects-detail-line">{a.copy}</p>
                  </div>
                </div>
              </div>
              <div
                className="projects-cycle-copy-layer"
                style={{
                  opacity: m,
                }}
                aria-hidden={m <= 0.01}
              >
                <div className="projects-list-copy">
                  <div className="projects-label">
                    <p className="projects-label-line">{o.title}</p>
                    <p className="projects-label-line">{o.subtitle}</p>
                  </div>
                  <div className="projects-copy-body">
                    <p className="projects-detail-line">{o.copy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ProjectCard({ project: project }) {
  let e = React.useRef(null);
  if (!project) return null;
  let [i, r] = splitProjectIndex(project.index);
  return (
    <article className="projects-list-row">
      <div className="row projects-list-row-inner align-start">
        <div className="col col-sm-12 col-md-2 col-lg-2">
          <p className="projects-index" aria-label={project.index}>
            <span className="projects-index-digit-wrap">
              <span className="projects-index-digit-stack">
                <span className="projects-index-digit">{i}</span>
              </span>
            </span>
            <span className="projects-index-digit-wrap">
              <span className="projects-index-digit-stack">
                <span className="projects-index-digit">{r}</span>
              </span>
            </span>
          </p>
        </div>
        <div className="col col-sm-12 col-md-5 col-lg-5">
          <figure ref={e} className="projects-figure projects-list-figure">
            <MediaHoverPixels containerRef={e} />
            <div className="projects-image-clip">
              <img
                src={project.image}
                alt={project.alt}
                className="projects-image"
              />
            </div>
          </figure>
        </div>
        <div className="col col-sm-12 col-md-5 col-lg-5">
          <div className="projects-list-copy">
            <div className="projects-label">
              <p className="projects-label-line">{project.title}</p>
              <p className="projects-label-line">{project.subtitle}</p>
            </div>
            <div className="projects-copy-body">
              <p className="projects-detail-line">{project.copy}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
/** @param {{items?: import("@/content").Project[], workLabel?: string}} props */
function Projects({ items = [], workLabel = "Work" }) {
  return items.length ? (
    <section id="work" className="projects-section">
      <div className="projects-desktop">
        <ProjectCycle items={items} workLabel={workLabel} />
      </div>
      <div className="projects-mobile">
        <div className="page-entry-work-mark" aria-hidden="true">
          <p>{workLabel}</p>
        </div>
        <div className="projects-list">
          {items.map((t, e) => (
            <ProjectCard key={t.index ?? e} project={t} />
          ))}
        </div>
      </div>
    </section>
  ) : null;
}

export {
  splitProjectIndex,
  clampProjectProgress,
  smoothProjectStep,
  INITIAL_PROJECT_GRID,
  getProjectGrid,
  buildProjectCells,
  ProjectPixelTransition,
  ProjectCycle,
  ProjectCard,
  Projects,
};
