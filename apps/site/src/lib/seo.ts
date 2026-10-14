import { config } from "~/lib/config";

export const siteMeta = [
  { name: "robots", content: "index, follow" },
  { property: "og:locale", content: "en_US" },
  { property: "og:site_name", content: config.name },
  { name: "twitter:site", content: `@${config.socials.twitter}` },
  { name: "twitter:creator", content: `@${config.socials.twitter}` },
  { property: "og:image", content: `${config.siteUrl}/og.png` },
  { property: "og:image:width", content: "2400" },
  { property: "og:image:height", content: "1260" },
  {
    property: "og:image:alt",
    content: `${config.name}: ${config.description}`,
  },
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
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
}
