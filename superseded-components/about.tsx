import type { ReactNode } from "react";
import type { SiteContent } from "@/content";
import { PixelImage } from "./pixel-image";

function RevealHeading({
  text,
  align,
}: {
  text: string;
  align: "left" | "right";
}) {
  return (
    <h2
      className={`page-entry-heading page-entry-heading-${align}`}
      aria-label={text}
    >
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="page-entry-heading-word">
            <span className="about-heading-word">{word}</span>
          </span>{" "}
        </span>
      ))}
    </h2>
  );
}

export function About({
  content,
  children,
}: {
  content: SiteContent["about"];
  children: ReactNode;
}) {
  return (
    <section id="about" className="about-section" aria-label="About">
      <div className="page-entry-split-trigger">
        <div className="page-entry-inner">
          <div className="row page-entry-row page-entry-row-headings">
            <div className="col col-sm-12 col-md-6 col-lg-5">
              <RevealHeading text={content.headings.left} align="left" />
            </div>
            <div className="col col-sm-12 col-md-6 col-lg-5">
              <RevealHeading text={content.headings.right} align="right" />
            </div>
          </div>
        </div>
      </div>
      <div className="about-orange-stage page-entry-pixel-section">
        <div className="about-pixel-edge" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              style={{ height: `${45 + ((index * 37) % 70)}%` }}
            />
          ))}
        </div>
        <div className="page-entry-content-inner">
          <div className="page-entry-gallery-wrap">
            <div className="row page-entry-gallery-row align-start">
              {content.gallery.images.map((image, index) => (
                <div
                  key={image.src}
                  className={`col col-sm-12 col-md-${index === 1 ? 6 : 3} col-lg-${index === 1 ? 6 : 3}`}
                >
                  <figure
                    className={`page-entry-gallery-card page-entry-gallery-card-${index + 1}`}
                  >
                    <PixelImage
                      src={image.src}
                      alt={image.alt}
                      revealOnScroll
                    />
                  </figure>
                </div>
              ))}
            </div>
          </div>
          <div className="page-entry-skills">
            {content.skills.map((skill, index) => (
              <article
                key={skill.index}
                className="row page-entry-skill-row is-visible"
                data-reveal
              >
                <span
                  className="page-entry-skill-hover-bar"
                  aria-hidden="true"
                />
                <div className="col col-sm-12 col-md-2 col-lg-1">
                  <p className="page-entry-skill-index">
                    [{String(index + 1).padStart(2, "0")}]
                  </p>
                </div>
                <div className="col col-sm-12 col-md-5 col-lg-4">
                  <h3 className="page-entry-skill-title">{skill.title}</h3>
                </div>
                <div className="col col-sm-12 col-md-5 col-lg-3">
                  <p className="page-entry-skill-copy">{skill.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
