import { definePageRule } from "../shared.ts";

const agentSections = new Set(["AI", "TanStack"]);

export const agentSection = definePageRule({
  description:
    "AI and TanStack pages list their snapshot in Agent, right before API Reference.",
  check: ({ headings, section }) => {
    const reference = headings.indexOf("API Reference");
    const agent = headings.indexOf("Agent");
    const required = section !== undefined && agentSections.has(section);
    if (agent === -1 && !required) {
      return [];
    }
    return reference !== -1 && agent === reference - 1
      ? []
      : ["Put Agent right before API Reference, from `vpr agent-docs`."];
  },
});
