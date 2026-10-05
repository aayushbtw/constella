import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  accent: "var(--gray-12)",
  background: "var(--gray-1)",
  edge: "var(--gray-a4)",
  edgeStrong: "var(--gray-a6)",
  fill: "var(--gray-a3)",
  fillStrong: "var(--gray-a4)",
  fillSubtle: "var(--gray-a2)",
  onAccent: "var(--gray-1)",
  textMuted: "var(--gray-10)",
  textPrimary: "var(--gray-12)",
  textSecondary: "var(--gray-11)",

  // Status: the base is the foreground step, for icons and titles; `Subtle` is
  // a tinted background, `Edge` its edge. Body text stays neutral.
  danger: "var(--red-11)",
  dangerEdge: "var(--red-a6)",
  dangerSolid: "var(--red-9)",
  dangerSubtle: "var(--red-a3)",
  info: "var(--blue-11)",
  infoEdge: "var(--blue-a6)",
  infoSubtle: "var(--blue-a3)",
  onDanger: "white",
  success: "var(--green-11)",
  successEdge: "var(--green-a6)",
  successSubtle: "var(--green-a3)",
  warning: "var(--amber-11)",
  warningEdge: "var(--amber-a6)",
  warningSubtle: "var(--amber-a3)",
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

export const fontWeights = stylex.defineConsts({
  medium: "500",
  regular: "400",
});

export const space = stylex.defineConsts({
  xxxs: "2px",
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

export const sizes = stylex.defineConsts({
  controlLg: "40px",
  controlMd: "32px",
  controlSm: "24px",
  controlXs: "20px",
  icon: "16px",
  iconSm: "14px",
});

export const strokes = stylex.defineConsts({
  // Hugeicons' weight beside medium text; read in JS, so a bare number.
  icon: "1.75",
  spinner: "1.5px",
});

export const layers = stylex.defineConsts({
  toast: "50",
});

export const opacities = stylex.defineConsts({
  disabled: "0.5",
  hover: "0.88",
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
  toast: "356px",
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
  layout: "cubic-bezier(0.32, 0.72, 0, 1)",
  crossfade: "cubic-bezier(0.2, 0, 0, 1)",
});

export const durations = stylex.defineConsts({
  hover: "150ms",
  move: "300ms",
  popover: "180ms",
  press: "160ms",
  layout: "300ms",
  spin: "1s",
  crossfade: "300ms",
  // How long a confirmation (copied, saved) holds before it reverts.
  confirm: "1500ms",
});

// The shapes motion moves between: where a crossfade starts, how far an exit drops,
// how much each surface behind a stack shrinks.
export const motion = stylex.defineConsts({
  exitOffset: "8px",
  stackScale: "0.05",
  crossfadeBlur: "4px",
  crossfadeScale: "0.25",
  crossfadeTextBlur: "2px",
});
