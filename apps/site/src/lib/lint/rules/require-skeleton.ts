import { definePageRule } from "../shared.ts";

export const requireSkeleton = definePageRule({
  description:
    "Start with Installation and Usage; end with API Reference, then Pending on a draft.",
  check: ({ headings }) => {
    const errors: string[] = [];
    const end = headings.at(-1) === "Pending" ? -2 : -1;

    if (headings[0] !== "Installation" || headings[1] !== "Usage") {
      errors.push("Start with Installation, then Usage.");
    }
    if (headings.at(end) !== "API Reference") {
      errors.push("End with API Reference, then Pending on a draft.");
    }

    return errors;
  },
});
