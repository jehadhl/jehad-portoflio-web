"use client";
import * as React from "react";
import type { Language, SiteContent } from "@/content";
import lottie from "@/lib/lottie-client";
import { settings } from "@/content/settings";
import { isSectionLink, requestSectionTransition } from "./section-navigation";

/** Original animation controllers, restored as editable React source. */
let FOOTER_PIXEL_PATTERN = [
  "000010001000100001000100",
  "001101000110001001100010",
  "011111011011101111011110",
  "111111111111111111111111",
];
function SiteFooter({
  activeLanguage = "en" as Language,
  content,
  languageOptions = [] as Array<{ code: Language; label: string }>,
  onLanguageChange,
  site,
}: {
  activeLanguage?: Language;
  content: SiteContent["footer"];
  languageOptions?: Array<{ code: Language; label: string }>;
  onLanguageChange?: (language: string) => void;
  site: SiteContent["site"];
}) {
  let n = React.useRef(null),
    a = React.useRef(null),
    [o, l] = React.useState(false),
    h = content?.wordmark ?? "R/JEHAD",
    c = content?.lead ?? "Let me Run your next project!",
    p =
      content?.sublead ??
      "It's the one you didn't expect. Not in the spotlight, but out there on the edge.",
    u = content?.linksTitle ?? "Links",
    f = content?.contactTitle ?? "Contact",
    d = content?.emailLabel ?? "Email address",
    m = content?.emailPlaceholder ?? "Email",
    g = content?.sendLabel ?? "Send",
    v = content?.languageTitle ?? "Language",
    y = site?.navigation ?? [],
    b = content?.contactLinks ?? [],
    x = h.startsWith("R") ? h.slice(1) : h;
  React.useEffect(() => {
    let t = n.current;
    if (!t || o) return;
    let e = new IntersectionObserver(
      ([t]) => {
        t?.isIntersecting && (l(true), e.disconnect());
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );
    e.observe(t);
    return () => {
      e.disconnect();
    };
  }, [o]);
  React.useEffect(() => {
    let t = a.current;
    if (!t) return;
    let e = lottie.loadAnimation({
      container: t,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/lottie/runman02.json",
      rendererSettings: {
        preserveAspectRatio: "xMaxYMax meet",
      },
    });
    return () => {
      e.destroy();
    };
  }, []);
  let _ = (t, e) => {
    isSectionLink(e) && (t.preventDefault(), requestSectionTransition(e));
  };
  return (
    <footer ref={n} id="contact" className="site-footer">
      <div
        className={`site-footer-pixel-edge${o ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {FOOTER_PIXEL_PATTERN.map((t, e) => (
          <div key={`footer-pixel-row-${e}`} className="site-footer-pixel-row">
            {t.split("").map((t, i) => (
              <span
                key={`footer-pixel-cell-${e}-${i}`}
                className={`site-footer-pixel-cell${"0" === t ? " is-gap" : ""}`}
                style={{
                  "--footer-pixel-delay": `${(0.14 * e + (((i + 1) * 17 + (e + 1) * 23) % 8) * 0.026).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="site-footer-content">
        <span
          className="site-footer-corner site-footer-corner-top-left"
          aria-hidden="true"
        />
        <span
          className="site-footer-corner site-footer-corner-top-right"
          aria-hidden="true"
        />
        <span
          className="site-footer-corner site-footer-corner-bottom-left"
          aria-hidden="true"
        />
        <span
          className="site-footer-corner site-footer-corner-bottom-right"
          aria-hidden="true"
        />
        <div className="site-footer-top">
          <div className="site-footer-top-col">
            <span
              className="site-footer-corner site-footer-panel-corner site-footer-panel-corner-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-top-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-top-right"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-bottom-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-bottom-right"
              aria-hidden="true"
            />
            <p className="site-footer-lead">{c}</p>
            <p className="site-footer-sublead">{p}</p>
          </div>
          <div className="site-footer-top-col">
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-top-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-top-right"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-bottom-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-bottom-right"
              aria-hidden="true"
            />
            <p className="site-footer-col-title">{u}</p>
            <nav className="site-footer-nav" aria-label="Footer">
              {y.map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className={t.className}
                  onClick={(e) => _(e, t.href)}
                >
                  {t.label}
                </a>
              ))}
            </nav>
            <div className="site-footer-language">
              <p className="site-footer-language-title">{v}</p>
              <div className="site-footer-language-options">
                {languageOptions.map((e) => (
                  <button
                    key={e.code}
                    type="button"
                    className={`site-footer-language-button${e.code === activeLanguage ? " is-active" : ""}`}
                    aria-pressed={e.code === activeLanguage}
                    onClick={() => onLanguageChange?.(e.code)}
                  >
                    <span
                      className="site-footer-language-button-fill"
                      aria-hidden="true"
                    />
                    <span
                      className="site-footer-language-button-text"
                      data-text={e.label}
                    >
                      <span>{e.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="site-footer-top-col site-footer-top-col-contact">
            <span
              className="site-footer-corner site-footer-panel-corner site-footer-panel-corner-right"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-top-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-top-right"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-bottom-left"
              aria-hidden="true"
            />
            <span
              className="site-footer-corner site-footer-mobile-col-corner site-footer-mobile-col-corner-bottom-right"
              aria-hidden="true"
            />
            <p className="site-footer-col-title">{f}</p>
            <div className="site-footer-contact-list">
              {b.map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className="site-footer-contact-link"
                >
                  {t.label}
                </a>
              ))}
            </div>
            <form
              className="site-footer-contact-form"
              action={`mailto:${settings.email}`}
              method="post"
            >
              <label className="sr-only" htmlFor="footer-contact-email">
                {d}
              </label>
              <input
                id="footer-contact-email"
                className="site-footer-contact-input"
                type="email"
                name="email"
                placeholder={m}
                autoComplete="email"
              />
              <button className="site-footer-contact-button" type="submit">
                {g}
              </button>
            </form>
          </div>
        </div>
        <div className="site-footer-bottom">
          <div className="site-footer-wordmark-wrap">
            <div className="site-footer-wordmark">
              <span
                className="site-footer-runner site-footer-runner-inline"
                aria-hidden="true"
              >
                <div ref={a} className="site-footer-lottie-inner" />
              </span>
              <svg
                className="site-footer-wordmark-svg"
                viewBox="0 0 1200 220"
                role="img"
                aria-label={x}
                preserveAspectRatio="xMinYMax meet"
              >
                <text
                  className="site-footer-wordmark-text"
                  x="0"
                  y="188"
                  textLength="1200"
                  lengthAdjust="spacingAndGlyphs"
                >
                  {x}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { FOOTER_PIXEL_PATTERN, SiteFooter };
