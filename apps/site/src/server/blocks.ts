import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { blocks } from "tomekit/content";

const getBlocks = createServerFn({ method: "GET" }).handler(() =>
  blocks
    .documents()
    .map(({ metadata, slug }) => ({
      slug,
      draft: metadata.draft,
      order: metadata.order,
      title: metadata.title,
    }))
    .toSorted((a, b) => a.order - b.order || a.title.localeCompare(b.title))
);

const getBlock = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const document = blocks.get(slug);

    if (!document) {
      throw notFound();
    }

    return document;
  });

export { getBlock, getBlocks };
