import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { components } from "tomekit/content";

const getComponents = createServerFn({ method: "GET" }).handler(() =>
  components
    .documents()
    .map(({ metadata, slug }) => ({ slug, title: metadata.title }))
    .toSorted((a, b) => a.title.localeCompare(b.title))
);

const getComponent = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const document = components.get(slug);

    if (!document) {
      throw notFound();
    }

    return document;
  });

export { getComponent, getComponents };
