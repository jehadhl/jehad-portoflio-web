import en from "./en.json";
import ar from "./ar.json";
import fr from "./fr.json";

export type Language = "en" | "ar" | "fr";
export type SiteContent = typeof en;
export type NavigationItem = SiteContent["site"]["navigation"][number];
export type MusicTrack = SiteContent["hero"]["music"]["tracks"][number];
export type Project = SiteContent["projects"]["items"][number];
export type Tool = SiteContent["about"]["tools"]["items"][number];

export const languages: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

const translations: Record<Language, SiteContent> = { en, ar, fr };

export function resolveLanguage(
  value: string | string[] | undefined,
): Language {
  if (value === "ar") return "ar";
  if (value === "fr") return "fr";
  return "en";
}

export function getContent(language: Language): SiteContent {
  return translations[language];
}
