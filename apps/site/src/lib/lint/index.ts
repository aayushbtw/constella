// The DOCS.md rules that can drift, checked as each page is parsed, so a broken page fails dev and the build.

import { headingNames } from "./rules/heading-names.ts";
import { nestByTopic } from "./rules/nest-by-topic.ts";
import { requireComposition } from "./rules/require-composition.ts";
import { requireSkeleton } from "./rules/require-skeleton.ts";
import { sectionOrder } from "./rules/section-order.ts";
import { headings, parts } from "./shared.ts";
import type { Page, PageRule } from "./shared.ts";

const componentRules = {
  "heading-names": headingNames,
  "nest-by-topic": nestByTopic,
  "require-composition": requireComposition,
  "require-skeleton": requireSkeleton,
  "section-order": sectionOrder,
} satisfies Record<string, PageRule>;

const guideRules = {
  "nest-by-topic": nestByTopic,
} satisfies Record<string, PageRule>;

function run(rules: Record<string, PageRule>, page: Page) {
  const errors = Object.entries(rules).flatMap(([name, rule]) =>
    rule.check(page).map((error) => `${error} (${name})`)
  );

  if (errors.length > 0) {
    throw new Error(`${page.title} breaks DOCS.md:\n- ${errors.join("\n- ")}`);
  }
}

function checkComponentPage(body: string, title: string) {
  const found = headings(body);
  const end = found.at(-1) === "Pending" ? -2 : -1;

  run(componentRules, {
    body,
    headings: found,
    parts: parts(title),
    sections: found.slice(found[2] === "Composition" ? 3 : 2, end),
    title,
  });
}

function checkGuidePage(body: string, title: string) {
  const found = headings(body);
  run(guideRules, { body, headings: found, parts: [], sections: found, title });
}

export { checkComponentPage, checkGuidePage };
