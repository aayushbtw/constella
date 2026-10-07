import { definePageRule, startsWith } from "../shared.ts";

const renames = new Map([
  ["Basic", "drop it: the preview is the basic example"],
  ["Dropdown", "Dropdown Menu"],
  ["Error", "Invalid"],
  ["Icon", "With Icon, or Icon Only for an icon with no text"],
  ["Icons", "With Icon"],
  ["Sizes", "Size"],
  ["States", "one section per state"],
  ["Variants", "Variant"],
]);

export const headingNames = definePageRule({
  description:
    "Name a section after what you type; With only in With Icon; no Basic.",
  check: ({ body, parts, sections }) =>
    sections.flatMap((heading) => {
      const isPart = parts.some((part) => startsWith(heading, part));
      const isProp = body.includes(
        `\`${heading[0].toLowerCase()}${heading.slice(1).replaceAll(" ", "")}\``
      );
      if (isPart || isProp) {
        return [];
      }

      const rename =
        renames.get(heading) ??
        (/\bWith\b/u.test(heading) && !heading.endsWith("With Icon")
          ? "the component's name, without With"
          : undefined);
      return rename === undefined ? [] : [`"${heading}": ${rename}.`];
    }),
});
