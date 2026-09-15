import type { Metadata, Viewport } from "next";
import { settings } from "@/content/settings";
import "./globals.css";

const siteUrl = "https://jehadhlewi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: settings.title,
    template: "%s | Jehad Hlewi",
  },
  description: settings.description,
  applicationName: "Jehad Hlewi",
  authors: [{ name: "Jehad Hlewi" }],
  keywords: [
    "Jehad Hlewi",
    "AI Full Stack Engineer",
    "Full Stack Developer",
    "Software Engineer",
    "Web App Development",
    "Backend Development",
    "Mobile App Development",
    "AI Integration",
    "LLM Integration",
    "Motion Design",
    "RAG",
    "AI Agents",
    "React",
    "Next.js",
    "React Native",
    "NestJS",
    "TypeScript",
    "Python",
    "PostgreSQL",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/?lang=en",
      fr: "/?lang=fr",
      ar: "/?lang=ar",
    },
  },
  openGraph: {
    title: settings.title,
    description: settings.description,
    url: siteUrl,
    siteName: "Jehad Hlewi",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jehad Hlewi portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: settings.title,
    description: settings.description,
    creator: "@jehadhlewi",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = { themeColor: "#ff641c" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
