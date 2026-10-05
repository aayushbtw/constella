import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { docs } from "tomekit/content";

const getDocs = createServerFn({ method: "GET" }).handler(() =>
  docs
    .documents()
    .map(({ metadata, slug }) => ({
      slug,
      draft: metadata.draft,
      title: metadata.title,
    }))
    .toSorted((a, b) => a.title.localeCompare(b.title))
);

const getDoc = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const document = docs.get(slug);

    if (!document) {
      throw notFound();
    }

    return document;
  });

export { getDoc, getDocs };
