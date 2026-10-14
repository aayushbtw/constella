import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { components, markdown } from "tomekit/content";

const getComponents = createServerFn({ method: "GET" }).handler(() =>
  components
    .documents()
    .map(({ metadata, slug }) => ({
      slug,
      draft: metadata.draft,
      section: metadata.section,
      title: metadata.title,
    }))
    .toSorted((a, b) => a.title.localeCompare(b.title))
);

const getComponent = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const document = components.get(slug);
    const page = markdown.get(`docs/components/${slug}`);

    if (!document || !page) {
      throw notFound();
    }

    return { ...document, markdown: page.body };
  });

export { getComponent, getComponents };
