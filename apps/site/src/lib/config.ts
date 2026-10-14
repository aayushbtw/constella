const url = "https://constella.aayush.cv";

export const config = {
  description: "Components, crafted with care.",
  name: "Constella",
  // The namespace components.json maps to this site's registry.
  registry: "@constella",
  repo: "https://github.com/aayushbtw/constella",
  siteUrl:
    process.env.NODE_ENV === "production" ? url : "http://localhost:8080",
  // For tomekit transforms, which must be pure: siteUrl reads NODE_ENV, and they're cached without it.
  url,
  socials: {
    twitter: "aayushbtw",
  },
};
