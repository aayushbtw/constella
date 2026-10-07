import { components, definePageRule } from "../shared.ts";

export const nestByTopic = definePageRule({
  description:
    "A section's variants are h3s under it, not h2s that repeat its name.",
  check: ({ sections }) =>
    sections.flatMap((heading) => {
      const topic = sections.find(
        (other) => other !== heading && heading.startsWith(`${other} `)
      );
      return topic === undefined || components.includes(heading)
        ? []
        : [
            `"${heading}": nest it under ${topic} as "### ${heading.slice(topic.length + 1)}".`,
          ];
    }),
});
