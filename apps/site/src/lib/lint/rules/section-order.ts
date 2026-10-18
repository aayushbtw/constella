import { components, definePageRule, startsWith } from "../shared.ts";

const states = new Set([
  "Busy",
  "Controlled",
  "Disabled",
  "Indeterminate",
  "Invalid",
  "Required",
]);

const groups = ["the component's own sections", "states", "other components"];

export const sectionOrder = definePageRule({
  description:
    "The component's own sections, then states, then other components.",
  check: ({ parts, sections, title }) => {
    const errors: string[] = [];
    let last = 0;

    for (const heading of sections) {
      let group = 0;
      // The longest name wins, so "Code Block Actions" is Code Block's and not Code's.
      const [component] = components
        .filter((name) => startsWith(heading, name))
        .toSorted((a, b) => b.length - a.length);
      if (
        component !== title &&
        !parts.some((part) => startsWith(heading, part))
      ) {
        if (states.has(heading)) {
          group = 1;
        } else if (component !== undefined) {
          group = 2;
        }
      }

      if (group < last) {
        errors.push(
          `"${heading}": ${groups[group]} go before ${groups[last]}.`
        );
      }
      last = Math.max(last, group);
    }

    return errors;
  },
});
