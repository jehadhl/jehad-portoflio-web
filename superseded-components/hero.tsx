import type { SiteContent } from "@/content";
import { MorphScene } from "./morph-scene";
import { MusicPlayer } from "./music-player";
import { LocationClock } from "./location-clock";

export function Hero({ content }: { content: SiteContent["hero"] }) {
  return (
    <section className="hero-stage" aria-label="Introduction">
      <div className="hero-canvas-wrap">
        <div className="hero-canvas-track">
          <div className="hero-sticky">
            <MorphScene />
          </div>
        </div>
      </div>
      <div className="page-entry-scroll">
        <div className="hero-title-panel">
          <div className="hero-title-stack">
            <h1 className="hero-title">{content.titleTop}</h1>
            <div className="hero-bottom">
              <div className="hero-intro-meta">
                <p className="hero-meta-name">{content.aboutLabel}</p>
                <LocationClock
                  prefix={content.locationPrefix}
                  locations={content.locations}
                />
              </div>
              <p className="hero-copy hero-description">{content.copy}</p>
              <p className="hero-title">{content.titleBottom}</p>
            </div>
          </div>
          <MusicPlayer tracks={content.music.tracks} />
        </div>
      </div>
    </section>
  );
}
