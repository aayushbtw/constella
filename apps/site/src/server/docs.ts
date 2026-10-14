import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { docs, markdown } from "tomekit/content";

const getDocs = createServerFn({ method: "GET" }).handler(() =>
  docs
    .documents()
    .filter(({ slug }) => !slug.includes("/"))
    .map(({ metadata, slug }) => ({
      slug,
      draft: metadata.draft,
      order: metadata.order,
      title: metadata.title,
    }))
    .toSorted((a, b) => a.order - b.order || a.title.localeCompare(b.title))
);

const getDoc = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const document = docs.get(slug);
    const page = markdown.get(`docs/${slug}`);

    if (!document || !page) {
      throw notFound();
    }

    return { ...document, markdown: page.body };
  });

export { getDoc, getDocs };
