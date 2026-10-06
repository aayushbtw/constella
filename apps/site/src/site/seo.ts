import { config } from "~/site/config";

export const siteMeta = [
  { name: "robots", content: "index, follow" },
  { property: "og:locale", content: "en_US" },
  { property: "og:site_name", content: config.name },
  { name: "twitter:site", content: `@${config.socials.twitter}` },
  { name: "twitter:creator", content: `@${config.socials.twitter}` },
];

interface SeoOptions {
  title?: string;
  description?: string;
}

export function seo({ title, description = config.description }: SeoOptions) {
  const fullTitle =
    title === undefined ? config.name : `${title} - ${config.name}`;

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
}
