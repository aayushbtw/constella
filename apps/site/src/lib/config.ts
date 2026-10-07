export const config = {
  description: "Components, crafted with care.",
  name: "Constella",
  // The namespace components.json maps to this site's registry.
  registry: "@constella",
  siteUrl:
    process.env.NODE_ENV === "production"
      ? "https://constella.aayush.cv"
      : "http://localhost:3001",
  socials: {
    github: "aayushbtw",
    twitter: "aayushbtw",
  },
};
