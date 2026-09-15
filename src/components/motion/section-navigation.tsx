"use client";
import * as React from "react";

/** Original animation controllers, restored as editable React source. */
let SECTION_TRANSITION_EVENT = "site:section-transition";
function isSectionLink(t) {
  return "string" == typeof t && t.startsWith("#") && t.length > 1;
}
function getSectionOffset(t, e) {
  if ("about" === t) return window.innerHeight || 0;
  if ("tools" === t) {
    let t = e.querySelector(".page-entry-tools-mark");
    return t?.offsetHeight ?? 0;
  }
  return 0;
}
function getSectionScrollTop(t) {
  if (!isSectionLink(t)) return null;
  let e = t.slice(1),
    i = document.getElementById(e);
  return i
    ? Math.max(
        window.scrollY + i.getBoundingClientRect().top + getSectionOffset(e, i),
        0,
      )
    : null;
}
function jumpToSection(t) {
  let e = getSectionScrollTop(t);
  if (null === e) return false;
  let i = window.__siteLenis;
  i?.scrollTo
    ? i.scrollTo(e, {
        immediate: true,
        force: true,
      })
    : window.scrollTo({
        top: e,
        left: 0,
        behavior: "auto",
      });
  return true;
}
function requestSectionTransition(t) {
  return (
    !!isSectionLink(t) &&
    (window.dispatchEvent(
      new CustomEvent(SECTION_TRANSITION_EVENT, {
        detail: {
          href: t,
        },
      }),
    ),
    true)
  );
}

export {
  SECTION_TRANSITION_EVENT,
  isSectionLink,
  getSectionOffset,
  getSectionScrollTop,
  jumpToSection,
  requestSectionTransition,
};
