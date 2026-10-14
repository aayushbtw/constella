export const config = {
  description: "Components, crafted with care.",
  name: "Constella",
  // The namespace components.json maps to this site's registry.
  registry: "@constella",
  repo: "https://github.com/aayushbtw/constella",
  siteUrl:
    process.env.NODE_ENV === "production"
      ? "https://constella.aayush.cv"
      : "http://localhost:8080",
  socials: {
    twitter: "aayushbtw",
  },
};
