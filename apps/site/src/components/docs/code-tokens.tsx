import type { HighlightToken } from "@tanstack/highlight/core";

import { CodeBlockLine } from "@/components/ui/code-block";
import type { CodeBlockLineVariant } from "@/components/ui/code-block";
import { codeLines } from "~/lib/highlight";

/** Highlighted tokens, colored by the highlighter's theme CSS. */
function CodeTokens({ tokens }: { tokens: readonly HighlightToken[] }) {
  // Keyed by offset, not index: two identical words would collide.
  let offset = 0;
  return tokens.map((token) => {
    const key = offset;
    offset += token.value.length;
    return (
      <span
        className={
          token.className === undefined
            ? undefined
            : `th-token th-${token.className}`
        }
        key={key}
      >
        {token.value}
      </span>
    );
  });
}

/** Code split into highlighted `CodeBlockLine`s; `variantOf` marks a line by its index. */
function CodeLines({
  code,
  lang,
  variantOf,
}: {
  code: string;
  lang: string;
  variantOf?: (index: number) => CodeBlockLineVariant;
}) {
  return codeLines(code, lang).map((tokens, index) => (
    // oxlint-disable-next-line react/no-array-index-key -- a line's place is its identity
    <CodeBlockLine key={index} variant={variantOf?.(index)}>
      {tokens.length > 0 ? <CodeTokens tokens={tokens} /> : undefined}
    </CodeBlockLine>
  ));
}

export { CodeLines, CodeTokens };
