import * as stylex from "@stylexjs/stylex";

export const shadows = stylex.defineConsts({
  card: "0 0 0 1px var(--gray-a2)",
  // Drawn inside the box, so it never stacks on the surface around it.
  inset: "inset 0 0 0 1px var(--gray-a3)",
  rule: "inset 0 -1px 0 var(--gray-a3)",
});

export const fonts = stylex.defineConsts({
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
  sans: '"Inter Variable", -apple-system, BlinkMacSystemFont, sans-serif',
});

export const fontSizes = stylex.defineConsts({
  base: "15px",
});

export const lineHeights = stylex.defineConsts({
  code: "20px",
  prose: "24px",
});

export const layout = stylex.defineConsts({
  content: "644px",
  gutter: "16px",
  pageBottom: "96px",
  pageTop: "96px",
  sectionGap: "48px",
});

export const durations = stylex.defineConsts({
  // How long a confirmation (copied, saved) holds before it reverts.
  confirm: "1500ms",
});
