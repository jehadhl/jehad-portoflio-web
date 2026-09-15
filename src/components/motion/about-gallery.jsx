"use client";
import * as React from "react";
import { calculatePixelGrid, buildPixelCells } from "./pixel-grid";

/** Original animation controllers, restored as editable React source. */
let INITIAL_GALLERY_GRID = {
  cols: 8,
  rows: 8,
};
let clampGalleryProgress = (t, e, i) => Math.min(Math.max(t, e), i);
function getGalleryGrid(t, e) {
  return calculatePixelGrid({
    width: t,
    height: e,
    minCols: 4,
    minRows: 5,
    targetCellSize: t <= 1200 ? 72 : 88,
    roundCols: "round",
    roundRows: "round",
  });
}
function buildGalleryCells(t, e) {
  return buildPixelCells({
    cols: t,
    rows: e,
    buildCell: ({ index: i, row: r, col: s }) => ({
      id: `about-gallery-cell-${i}`,
      threshold: Number(
        Math.min(
          0.98,
          0.08 +
            (r / Math.max(e - 1, 1)) * 0.72 +
            ((((r + 1) * 19 + (s + 1) * 31) % 11) / 10) * 0.08 +
            (Math.abs(s - (t - 1) * 0.5) / Math.max(t - 1, 1)) * 0.05,
        ).toFixed(3),
      ),
    }),
  });
}
function GalleryImage({ image: image, isMobile: isMobile }) {
  let i = React.useRef(null),
    r = React.useRef([]),
    [s, n] = React.useState(INITIAL_GALLERY_GRID),
    [a, o] = React.useState({
      width: 1,
      height: 1,
    }),
    l = React.useMemo(
      () => buildGalleryCells(s.cols, s.rows),
      [s.cols, s.rows],
    );
  if (
    (React.useEffect(() => {
      if (isMobile) return;
      let t = i.current;
      if (!t) return;
      let r = () => {
        let e = t.getBoundingClientRect(),
          i = Math.max(e.width, 1),
          r = Math.max(e.height, 1),
          s = getGalleryGrid(e.width, e.height);
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
      r();
      let s = new ResizeObserver(r);
      s.observe(t);
      window.addEventListener("resize", r);
      return () => {
        s.disconnect();
        window.removeEventListener("resize", r);
      };
    }, [isMobile]),
    React.useEffect(() => {
      if (isMobile) return;
      let t = i.current;
      if (!t) return;
      let s = 0,
        n = t.closest(".page-entry-pixel-section"),
        a = () => {
          if (((s = 0), !n)) return;
          let t = n.getBoundingClientRect(),
            e = Math.max(n.offsetHeight - window.innerHeight, 1),
            i = clampGalleryProgress(-t.top / e, 0, 1),
            a = clampGalleryProgress((i - 0.075) / 0.09, 0, 1);
          r.current.forEach((t, e) => {
            if (!t) return;
            let i = a >= (l[e]?.threshold ?? 1) ? "1" : "0";
            t.style.opacity !== i && (t.style.opacity = i);
          });
        },
        o = () => {
          s || (s = window.requestAnimationFrame(a));
        };
      o();
      window.addEventListener("scroll", o, {
        passive: true,
      });
      window.addEventListener("resize", o);
      return () => {
        s && window.cancelAnimationFrame(s);
        window.removeEventListener("scroll", o);
        window.removeEventListener("resize", o);
      };
    }, [l, isMobile]),
    !image?.src)
  )
    return null;
  let h = image.positionX ?? 50,
    c = image.positionY ?? 50,
    p = `${h}% ${c}%`;
  if (isMobile)
    return (
      <img
        src={image.src}
        alt={image.alt}
        className="page-entry-gallery-image"
        style={{
          objectPosition: p,
        }}
      />
    );
  let u = a.width / Math.max(s.cols, 1),
    f = a.height / Math.max(s.rows, 1);
  return (
    <div
      ref={i}
      className="page-entry-gallery-pixel-frame"
      style={{
        "--about-gallery-pixel-cols": s.cols,
        "--about-gallery-pixel-rows": s.rows,
      }}
    >
      <div className="page-entry-gallery-pixel-layer" aria-hidden="true">
        {l.map((e, i) => (
          <span
            key={e.id}
            className="page-entry-gallery-pixel-cell"
            ref={(t) => {
              r.current[i] = t;
            }}
          >
            <img
              src={image.src}
              alt={0 === i ? image.alt : ""}
              className="page-entry-gallery-pixel-image"
              style={{
                width: `${a.width}px`,
                height: `${a.height}px`,
                left: `${-(i % s.cols) * u}px`,
                top: `${-Math.floor(i / s.cols) * f}px`,
                objectPosition: p,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
function AboutGallery({ images = [] }) {
  let [e, i] = React.useState(false);
  React.useEffect(() => {
    let t = window.matchMedia("(max-width: 900px)"),
      e = () => {
        i(t.matches);
      };
    e();
    t.addEventListener("change", e);
    return () => {
      t.removeEventListener("change", e);
    };
  }, []);
  return (
    <div className="page-entry-gallery-wrap">
      <div className="row page-entry-gallery-row align-start">
        <div className="col col-sm-12 col-md-3 col-lg-3">
          <figure className="page-entry-gallery-card page-entry-gallery-card-1">
            <div className="page-entry-gallery-clip">
              <GalleryImage image={images[0]} isMobile={e} />
            </div>
          </figure>
        </div>
        <div className="col col-sm-12 col-md-6 col-lg-6">
          <figure className="page-entry-gallery-card page-entry-gallery-card-2">
            <div className="page-entry-gallery-clip">
              <GalleryImage image={images[1]} isMobile={e} />
            </div>
          </figure>
        </div>
        <div className="col col-sm-12 col-md-3 col-lg-3">
          <figure className="page-entry-gallery-card page-entry-gallery-card-3">
            <div className="page-entry-gallery-clip">
              <GalleryImage image={images[2]} isMobile={e} />
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}

export {
  INITIAL_GALLERY_GRID,
  clampGalleryProgress,
  getGalleryGrid,
  buildGalleryCells,
  GalleryImage,
  AboutGallery,
};
