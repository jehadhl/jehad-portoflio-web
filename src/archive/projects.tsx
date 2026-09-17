"use client";

import type { CSSProperties } from "react";
import type { Project } from "@/content";
import { useScrollIndex } from "@/archive/use-scroll-index";
import { PixelImage } from "./pixel-image";

function ProjectLink({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="projects-view-link"
      aria-label={`View ${project.title} project`}
    >
      <span className="projects-view-link-fill" aria-hidden="true" />
      <span className="projects-view-link-text" data-text="View project">
        <span>View project</span>
      </span>
    </a>
  );
}

export function Projects({
  items,
  label,
}: {
  items: Project[];
  label: string;
}) {
  const { ref, index, select } = useScrollIndex(items.length);
  const project = items[index];

  return (
    <section
      id="work"
      ref={ref}
      className="projects-section projects-track"
      style={
        {
          "--projects-track-height": `${(items.length + 1) * 100}vh`,
        } as CSSProperties
      }
      aria-label="Selected work"
    >
      <div className="projects-desktop projects-sticky">
        <div className="projects-work-title">
          <h2>{label}</h2>
        </div>
        <div className="projects-cycle-row">
          <div className="projects-cycle-col projects-cycle-col-index">
            <p className="projects-index">{project.index}</p>
            <ProjectLink project={project} />
            <div className="project-selector" aria-label="Choose a project">
              {items.map((item, position) => (
                <button
                  key={item.index}
                  onClick={() => select(position)}
                  aria-label={`Show ${item.title}`}
                  aria-pressed={position === index}
                >
                  {item.index}
                </button>
              ))}
            </div>
          </div>
          <div className="projects-cycle-col projects-cycle-col-media">
            <PixelImage src={project.image} alt={project.alt} />
          </div>
          <div className="projects-cycle-col projects-cycle-col-copy">
            <div className="projects-list-copy">
              <div>
                <h3 className="projects-label">{project.title}</h3>
                <p className="projects-label-line">{project.subtitle}</p>
              </div>
              <p className="projects-copy-body">{project.copy}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="projects-mobile">
        <div className="projects-work-title">
          <h2>{label}</h2>
        </div>
        {items.map((item) => (
          <article key={item.index} className="project-mobile-card">
            <div className="project-mobile-heading">
              <span>{item.index}</span>
              <h3>{item.title}</h3>
            </div>
            <div className="project-mobile-image">
              <PixelImage src={item.image} alt={item.alt} revealOnScroll />
            </div>
            <div className="project-mobile-copy">
              <p className="projects-label-line">{item.subtitle}</p>
              <p className="projects-copy-body">{item.copy}</p>
              <ProjectLink project={item} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
