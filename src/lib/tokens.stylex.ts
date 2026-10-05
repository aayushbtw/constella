import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  accent: "light-dark(#111111, #eeeeee)",
  background: "var(--gray-1)",
  edgeStrong: "var(--gray-a6)",
  fill: "var(--gray-a3)",
  fillStrong: "var(--gray-a4)",
  fillSubtle: "var(--gray-a2)",
  textMuted: "var(--gray-10)",
  textPrimary: "var(--gray-12)",
  textSecondary: "var(--gray-11)",
});

export const shadows = stylex.defineConsts({
  card: "0 0 0 1px var(--gray-a2)",
  divider: "inset 0 -1px 0 var(--gray-a2)",
  popover: "0 0 0 1px var(--gray-a4), 0 4px 16px var(--black-a6)",
  ring: "0 0 0 1px var(--gray-a4)",
  rule: "inset 0 -1px 0 var(--gray-a3)",
});

export const fonts = stylex.defineConsts({
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
  sans: '"Inter Variable", -apple-system, BlinkMacSystemFont, sans-serif',
});

export const fontSizes = stylex.defineConsts({
  base: "15px",
  display: "96px",
  sm: "14px",
  xs: "13px",
});

export const lineHeights = stylex.defineConsts({
  code: "20px",
  prose: "24px",
  row: "18px",
});

export const space = stylex.defineConsts({
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "48px",
});

export const radii = stylex.defineConsts({
  full: "9999px",
  md: "12px",
  sm: "8px",
  xs: "4px",
});

export const media = stylex.defineConsts({
  hover: "@media (hover: hover)",
  lg: "@media (min-width: 1280px)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
  sm: "@media (min-width: 640px)",
});

export const layout = stylex.defineConsts({
  columnGap: "48px",
  content: "644px",
  gutter: "16px",
  pageBottom: "96px",
  pageTop: "96px",
  sectionGap: "48px",
});

export const presses = stylex.defineConsts({
  icon: "scale(0.95)",
  link: "scale(0.97)",
  row: "scale(0.99)",
});

export const easings = stylex.defineConsts({
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // Springs sampled into CSS: bounce 0 and 0.3. Pair each with its own duration.
  spring:
    "linear(0, 0.019, 0.068, 0.134, 0.208, 0.286, 0.363, 0.436, 0.505, 0.568, 0.625, 0.676, 0.721, 0.761, 0.795, 0.826, 0.852, 0.874, 0.893, 0.91, 0.924, 0.936, 0.946, 0.955, 0.962, 0.968, 0.974, 0.978, 0.982, 0.985, 0.987, 0.989, 0.991, 0.993, 0.994, 0.995, 0.996, 0.996, 0.997, 0.998, 1)",
  springBounce:
    "linear(0, 0.024, 0.084, 0.169, 0.268, 0.372, 0.476, 0.575, 0.665, 0.746, 0.816, 0.875, 0.923, 0.962, 0.992, 1.013, 1.029, 1.039, 1.044, 1.046, 1.045, 1.043, 1.039, 1.035, 1.03, 1.025, 1.02, 1.016, 1.012, 1.009, 1.006, 1.004, 1.002, 1.001, 1, 0.999, 0.998, 0.998, 0.998, 0.998, 1)",
  swap: "cubic-bezier(0.2, 0, 0, 1)",
});

export const durations = stylex.defineConsts({
  hover: "150ms",
  move: "300ms",
  popover: "180ms",
  press: "160ms",
  spring: "540ms",
  springBounce: "660ms",
  swap: "300ms",
});
