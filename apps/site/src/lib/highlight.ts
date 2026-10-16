import { createHighlighter } from "@tanstack/highlight/core";
import type { HighlightToken } from "@tanstack/highlight/core";
import { html } from "@tanstack/highlight/languages/html";
import { json } from "@tanstack/highlight/languages/json";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import type { TanStackMarkdownHighlighterOptions } from "@tanstack/highlight/markdown";

// Server and client must share one registry, or hydrated code blocks tokenize differently from the SSR markup.
const highlighter = createHighlighter({
  languages: [html, json, shell, ts, tsx],
});

const highlightMarkdown = createTanStackMarkdownHighlighter(highlighter);

// Numbered once there's more than one line of code to point at; prose isn't.
function highlightCode(
  code: string,
  lang?: string,
  options?: TanStackMarkdownHighlighterOptions
) {
  return highlightMarkdown(code, lang, {
    ...options,
    lineNumbers:
      options?.lineNumbers ??
      (lang !== "text" && code.trimEnd().includes("\n")),
  });
}

/** A shell line's tokens, carrying the class names the theme's CSS colors. */
function shellTokens(code: string) {
  return highlighter.tokenize(code, { lang: "shell" }).tokens;
}

function codeLines(code: string, lang: string) {
  const lines: HighlightToken[][] = [[]];
  for (const token of highlighter.tokenize(code.trimEnd(), { lang }).tokens) {
    for (const [index, value] of token.value.split("\n").entries()) {
      if (index > 0) {
        lines.push([]);
      }
      if (value !== "") {
        lines.at(-1)?.push({ className: token.className, value });
      }
    }
  }
  return lines;
}

export { codeLines, highlightCode, shellTokens };
