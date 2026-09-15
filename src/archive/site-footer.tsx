import Link from "next/link";
import {
  languages,
  type Language,
  type NavigationItem,
  type SiteContent,
} from "@/content";
import { settings } from "@/content/settings";
import { LottiePlayer } from "./lottie-player";
import { ContactForm } from "./contact-form";

export function SiteFooter({
  content,
  links,
  language,
}: {
  content: SiteContent["footer"];
  links: NavigationItem[];
  language: Language;
}) {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-pixel-edge" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span
            key={index}
            style={{ height: `${40 + ((index * 31) % 60)}%` }}
          />
        ))}
      </div>
      <div className="site-footer-content">
        {["top-left", "top-right", "bottom-left", "bottom-right"].map(
          (position) => (
            <span
              key={position}
              className={`site-footer-corner site-footer-corner-${position}`}
              aria-hidden="true"
            />
          ),
        )}
        <div className="site-footer-top">
          <div className="site-footer-top-col">
            <p className="site-footer-lead">{content.lead}</p>
            <p className="site-footer-sublead">{content.sublead}</p>
          </div>
          <div className="site-footer-top-col">
            <p className="site-footer-col-title">{content.linksTitle}</p>
            <nav className="site-footer-nav" aria-label="Footer">
              {links.map((link) => (
                <a href={link.href} key={link.href} className={link.className}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="site-footer-language">
              <p className="site-footer-language-title">
                {content.languageTitle}
              </p>
              <div className="site-footer-language-options">
                {languages.map((option) => (
                  <Link
                    key={option.code}
                    scroll={false}
                    href={option.code === "en" ? "/" : `/?lang=${option.code}`}
                    lang={option.code}
                    hrefLang={option.code}
                    aria-current={language === option.code ? "page" : undefined}
                    className={`site-footer-language-button${language === option.code ? " is-active" : ""}`}
                  >
                    <span
                      className="site-footer-language-button-fill"
                      aria-hidden="true"
                    />
                    <span
                      className="site-footer-language-button-text"
                      data-text={option.label}
                    >
                      <span>{option.label}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="site-footer-top-col site-footer-top-col-contact">
            <p className="site-footer-col-title">{content.contactTitle}</p>
            <div className="site-footer-contact-list">
              {content.contactLinks.map((link) => (
                <a
                  className="site-footer-contact-link"
                  href={link.href}
                  key={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <ContactForm
              email={settings.email}
              label={content.emailLabel}
              placeholder={content.emailPlaceholder}
              sendLabel={content.sendLabel}
            />
          </div>
        </div>
        <div className="site-footer-bottom">
          <div className="site-footer-wordmark">
            <LottiePlayer
              src="/assets/lottie/runman01.json"
              label="Running character"
              className="site-footer-runner site-footer-lottie-inner"
            />
            <p className="footer-wordmark-type">{settings.footerWordmark}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
