import { createHighlighter } from "@tanstack/highlight/core";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import type { TanStackMarkdownHighlighterOptions } from "@tanstack/highlight/markdown";

// Server and client must share one registry, or hydrated code blocks tokenize differently from the SSR markup.
const highlighter = createHighlighter({ languages: [shell, ts, tsx] });

const highlightMarkdown = createTanStackMarkdownHighlighter(highlighter);

// Numbered once there's more than one line to point at.
function highlightCode(
  code: string,
  lang?: string,
  options?: TanStackMarkdownHighlighterOptions
) {
  return highlightMarkdown(code, lang, {
    ...options,
    lineNumbers: options?.lineNumbers ?? code.trimEnd().includes("\n"),
  });
}

/** A shell line's tokens, carrying the class names the theme's CSS colors. */
function shellTokens(code: string) {
  return highlighter.tokenize(code, { lang: "shell" }).tokens;
}

export { highlightCode, shellTokens };
