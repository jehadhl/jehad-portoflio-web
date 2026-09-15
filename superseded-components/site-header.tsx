"use client";

import { useEffect, useRef, useState } from "react";
import type { NavigationItem } from "@/content";

export function SiteHeader({
  name,
  links,
}: {
  name: string;
  links: NavigationItem[];
}) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const next = window.scrollY;
        setHidden(next > 100 && next > previous && !open);
        previous = next;
        frame = 0;
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [open]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open) {
      element.showModal();
      document.body.classList.add("menu-open");
    } else {
      element.close();
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <>
      <header className={`topbar${hidden ? " is-hidden" : ""}`}>
        <div className="topbar-row">
          <div className="topbar-name-wrap">
            <a className="topbar-name" href="#main-content">
              {name}
            </a>
          </div>
          <nav className="topbar-nav" aria-label="Primary">
            {links.map((link) => (
              <a key={link.href} href={link.href} className={link.className}>
                {link.label}
              </a>
            ))}
          </nav>
          <button
            ref={trigger}
            className={`topbar-menu-toggle${open ? " is-open" : ""}`}
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <span />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-navigation"
        onCancel={close}
        onClose={() => setOpen(false)}
      >
        <button
          className="mobile-navigation-close"
          onClick={close}
          aria-label="Close navigation"
        >
          ×
        </button>
        <nav aria-label="Mobile">
          {links.map((link, index) => (
            <a key={link.href} href={link.href} onClick={close}>
              <span>0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
      </dialog>
    </>
  );
}
