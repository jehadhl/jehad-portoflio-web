"use client";
import { useEffect, useState } from "react";
/** The original responsive thresholds, paired with reference.css. */
export const BREAKPOINTS = {
  ABOUT_MOBILE: 800,
  LENIS_MOBILE: 768,
  MENU_GRID_DENSE: 768,
  TOPBAR_MENU: 880,
  PROJECTS_MOBILE: 1000,
  NOISE_STATIC: 1000,
};
export function useMaxWidth(width: number, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${width}px)`);
    const update = () => setMatches(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [width]);
  return matches;
}
