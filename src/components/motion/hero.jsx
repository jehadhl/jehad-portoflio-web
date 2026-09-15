import dynamic from "next/dynamic";

const LocationClock = dynamic(
  () => import("./location-clock").then((mod) => mod.LocationClock),
  {
    ssr: false,
    loading: () => <div className="hero-meta-placeholder" aria-hidden="true" />,
  },
);

const MusicPlayer = dynamic(
  () => import("./music-player").then((mod) => mod.MusicPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="hero-player-placeholder" aria-hidden="true" />
    ),
  },
);

/** Hero content is server-rendered for SEO while the animated widgets load on the client. */
function Hero({ content: content }) {
  let e = content?.titleTop ?? "",
    i = content?.titleBottom ?? "",
    r = content?.aboutLabel ?? "About",
    s = content?.locationPrefix ?? "Location",
    n = content?.locations ?? [],
    o = content?.music ?? null,
    l = content?.copy ?? "";
  return (
    <div className="hero-title-wrap">
      <div className="hero-title-panel">
        <div className="hero-title-stack">
          <div className="row row-title justify-start">
            <div className="col col-full">
              <div className="hero-title-group">
                <h1 className="hero-title">{e}</h1>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="row hero-meta-row-date">
              <div className="hero-meta-row-date-left">
                <p className="hero-meta hero-meta-date">{r}</p>
              </div>
              <div className="hero-meta-row-date-right">
                <LocationClock locations={n} prefix={s} />
              </div>
            </div>
            <div className="row row-title row-title-split align-end">
              <div className="col col-sm-12 col-md-4 col-lg-3">
                <p className="hero-copy">{l}</p>
              </div>
              <div className="col hero-title-col hero-title-col-right">
                <div className="hero-title-stack-right">
                  <h1 className="hero-title">{i}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MusicPlayer track={o} />
      </div>
    </div>
  );
}

export { Hero };
