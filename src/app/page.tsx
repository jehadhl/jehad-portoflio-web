import { Portfolio } from "@/components/portfolio";
import { getContent, resolveLanguage } from "@/content";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const language = resolveLanguage((await searchParams).lang);
  return <Portfolio content={getContent(language)} language={language} />;
}
