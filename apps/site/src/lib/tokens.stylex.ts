import * as stylex from "@stylexjs/stylex";

// The UI's 4px unit, in rem so the layout grows with the reader's text.
const unit = "0.25rem";
const header = `calc(${unit} * 16)`;

export const shadows = stylex.defineConsts({
  card: "0 0 0 1px var(--border-subtle)",
  // Drawn inside the box, so it never stacks on the surface around it.
  inset: "inset 0 0 0 1px var(--border-subtle)",
  rule: "inset 0 -1px 0 var(--border-subtle)",
} as const);

export const surfaces = stylex.defineConsts({
  stage: "var(--stage)",
});

export const layout = stylex.defineConsts({
  content: `calc(${unit} * 160)`,
  gutter: `calc(${unit} * 4)`,
  header,
  logo: "1.25rem",
  outline: `calc(${unit} * 50)`,
  pageBottom: `calc(${unit} * 24)`,
  pageTop: `calc(${header} + var(--space-lg) + var(--space-xs))`,
  search: `calc(${unit} * 56)`,
  sectionGap: `calc(${unit} * 12)`,
  // Past this, the sidebar and outline stop following the window's edges.
  shell: `calc(${unit} * 384)`,
  sidebar: `calc(${unit} * 56)`,
  gutterWide: `calc(${unit} * 10)`,
  stage: `calc(${unit} * 70)`,
  stageControl: `calc(${unit} * 40)`,
  stageTile: `calc(${unit} * 35)`,
  stageSample: `calc(${unit} * 18)`,
  bentoRow: `calc(${unit} * 58)`,
  bentoTile: `calc(${unit} * 54)`,
  bentoFill: `calc(${unit} * 80)`,
  bentoChat: `calc(${unit} * 110)`,
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
