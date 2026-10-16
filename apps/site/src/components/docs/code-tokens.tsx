import type { HighlightToken } from "@tanstack/highlight/core";

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

export { CodeTokens };
