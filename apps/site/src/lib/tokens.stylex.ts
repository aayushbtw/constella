import * as stylex from "@stylexjs/stylex";

export const shadows = stylex.defineConsts({
  card: "0 0 0 1px var(--gray-a2)",
  // Drawn inside the box, so it never stacks on the surface around it.
  inset: "inset 0 0 0 1px var(--gray-a3)",
  rule: "inset 0 -1px 0 var(--gray-a3)",
});

export const surfaces = stylex.defineConsts({
  stage: "var(--stage)",
});

export const fonts = stylex.defineConsts({
  mono: '"JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace',
  sans: '"Inter Variable", -apple-system, BlinkMacSystemFont, sans-serif',
});

export const fontSizes = stylex.defineConsts({
  base: "15px",
  display: "32px",
  // The large glyph a font specimen opens with.
  specimen: "96px",
});

export const lineHeights = stylex.defineConsts({
  code: "20px",
  display: "38px",
  specimen: "96px",
  prose: "24px",
});

export const layout = stylex.defineConsts({
  content: "644px",
  gutter: "16px",
  header: "64px",
  logo: "20px",
  outline: "200px",
  pageBottom: "96px",
  // Clears the fixed header; where sidebar, content and outline start.
  pageTop: "64px",
  sectionGap: "48px",
  // Past this, the sidebar and outline stop following the window's edges.
  shell: "1536px",
  sidebar: "220px",
  gutterWide: "40px",
});

export const media = stylex.defineConsts({
  // Room for the sidebar beside the content.
  sidebar: "@media (min-width: 1024px)",
  // Room for the outline too.
  outline: "@media (min-width: 1280px)",
});

export const layers = stylex.defineConsts({
  header: "10",
});

export const durations = stylex.defineConsts({
  // How long a confirmation (copied, saved) holds before it reverts.
  confirm: "1500ms",
});
