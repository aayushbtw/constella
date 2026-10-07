import { definePageRule } from "../shared.ts";

export const requireComposition = definePageRule({
  description:
    "A component with more than one part shows its tree after Usage.",
  check: ({ headings, parts }) =>
    parts.length > 1 && headings[2] !== "Composition"
      ? ["Put Composition right after Usage: the page has parts."]
      : [],
});
