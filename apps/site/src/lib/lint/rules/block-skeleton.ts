import { definePageRule } from "../shared.ts";

export const blockSkeleton = definePageRule({
  description: "Start a block page with Installation and Usage.",
  check: ({ headings }) =>
    headings[0] === "Installation" && headings[1] === "Usage"
      ? []
      : ["Start with Installation, then Usage."],
});
