"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getContent,
  languages,
  type Language,
  type SiteContent,
} from "@/content";
import { settings } from "@/content/settings";
import { SmoothScroll } from "./smooth-scroll";
import { NoiseLayer } from "./noise-layer";
import { CursorOrb } from "./motion/cursor-orb";
import { SectionTransition } from "./motion/section-transition";
import { SiteLoader } from "./motion/site-loader";
import { SiteHeader } from "./motion/site-header";
import { Hero } from "./motion/hero";

const MorphScene = dynamic(
  () => import("./motion/morph-scene").then((mod) => mod.MorphScene),
  {
    ssr: false,
    loading: () => (
      <div className="morph-scene is-loading" aria-hidden="true" />
    ),
  },
);
import { About } from "./motion/about";
import { Projects } from "./motion/projects";
import { Quote } from "./motion/quote";
import { SiteFooter } from "./motion/site-footer";
/** App Router client boundary. Next.js also renders its initial markup on the server. */
export function Portfolio({
  content,
  language,
}: {
  content: SiteContent;
  language: Language;
}) {
  const [ready, setReady] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(language);
  const [sceneReady, setSceneReady] = useState(false);
  const copy =
    activeLanguage === language ? content : getContent(activeLanguage);
  const site = useMemo(
    () => ({
      ...copy.site,
      navigation: copy.site.navigation.map((link) => ({
        ...link,
        href: link.href.startsWith("mailto:")
          ? `mailto:${settings.email}`
          : link.href,
      })),
    }),
    [copy.site],
  );
  const onReady = useCallback(() => {
    setSceneReady(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!sceneReady) return;
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [sceneReady]);

  const changeLanguage = useCallback((value: string) => {
    if (!languages.some((option) => option.code === value)) return;
    setActiveLanguage(value as Language);
    const url = new URL(window.location.href);
    if (value === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", value);
    window.history.replaceState(null, "", url);
  }, []);
  useEffect(() => setActiveLanguage(language), [language]);
  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = activeLanguage === "ar" ? "rtl" : "ltr";
  }, [activeLanguage]);
  return (
    <SmoothScroll>
      <div className="site-corner-crosses" aria-hidden="true">
        {["tl", "tr", "tc", "bl", "br", "bc"].map((position) => (
          <span
            key={position}
            className={`site-corner-cross site-corner-cross-${position}`}
          />
        ))}
      </div>
      <NoiseLayer />
      <main
        className="site-home"
        lang={activeLanguage}
        dir={activeLanguage === "ar" ? "rtl" : "ltr"}
      >
        <SiteLoader isReady={ready} />
        <CursorOrb />
        <SectionTransition />
        <SiteHeader name={site.name} links={site.navigation} />
        <section className="hero-stage">
          <div className="hero-canvas-wrap">
            <div className="hero-canvas-track">
              <div className="hero-sticky">
                <MorphScene onReady={onReady} />
              </div>
            </div>
          </div>
          <div className="page-entry-scroll">
            <Hero content={copy.hero} />
          </div>
        </section>
        <About content={copy.about} projectItems={copy.about.tools.items} />
        <Projects
          items={copy.projects.items}
          workLabel={copy.about.gallery.workMark}
        />
        <Quote text={copy.quote.text} />
        <SiteFooter
          activeLanguage={activeLanguage}
          content={copy.footer}
          languageOptions={languages}
          onLanguageChange={changeLanguage}
          site={site}
        />
      </main>
    </SmoothScroll>
  );
}
