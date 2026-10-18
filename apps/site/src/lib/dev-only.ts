import { notFound } from "@tanstack/react-router";

// Dev pages are never linked, so never prerendered; a build answers them with a 404.
export function devOnly() {
  if (!import.meta.env.DEV) {
    throw notFound();
  }
}
