import "./base.css";
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
  overlay: "var(--black-a5)",
  textMuted: "var(--text-muted)",
  textPrimary: "var(--gray-12)",
  textSecondary: "var(--gray-11)",

  // Status: the base is the foreground step, for icons and short labels; the
  // fills mirror the neutral ones as tints, `Edge` is a tinted edge.
  danger: "var(--red-11)",
  dangerEdge: "var(--red-a6)",
  dangerFill: "var(--red-a3)",
  dangerFillSubtle: "var(--red-a2)",
  info: "var(--blue-11)",
  infoEdge: "var(--blue-a6)",
  infoFill: "var(--blue-a3)",
  infoFillSubtle: "var(--blue-a2)",
  success: "var(--green-11)",
  successEdge: "var(--green-a6)",
  successFill: "var(--green-a3)",
  successFillSubtle: "var(--green-a2)",
  warning: "var(--amber-11)",
  warningEdge: "var(--amber-a6)",
  warningFill: "var(--amber-a3)",
  warningFillSubtle: "var(--amber-a2)",
});

export const shadows = stylex.defineConsts({
  control: "0 1px 2px var(--black-a1)",
  dialog: "0 0 0 1px var(--gray-a4), 0 16px 40px var(--black-a6)",
  popover: "0 0 0 1px var(--gray-a4), 0 4px 16px var(--black-a6)",
});

export const fontSizes = stylex.defineConsts({
  md: "16px",
  sm: "14px",
  xs: "13px",
  xxs: "12px",
});

export const lineHeights = stylex.defineConsts({
  row: "18px",
  text: "20px",
});

export const fontWeights = stylex.defineConsts({
  medium: "500",
  regular: "400",
  semibold: "600",
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
  controlLg: "36px",
  controlMd: "32px",
  controlSm: "28px",
  controlXs: "24px",
  controlXxs: "20px",
  dialog: "384px",
  hitArea: "40px",
  icon: "16px",
  iconSm: "14px",
  iconXs: "12px",
  thumb: "16px",
  toast: "356px",
});

export const strokes = stylex.defineConsts({
  border: "1px",
  // Hugeicons' weight beside medium text; read in JS, so a bare number.
  icon: "1.75",
  spinner: "1.5px",
  track: "4px",
});

export const layers = stylex.defineConsts({
  dialog: "40",
  toast: "50",
});

export const opacities = stylex.defineConsts({
  disabled: "0.5",
  hover: "0.88",
});

export const media = stylex.defineConsts({
  hover: "@media (hover: hover)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
  sm: "@media (min-width: 640px)",
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
  dialog: "200ms",
});

// The shapes motion moves between: where a crossfade starts, how far an exit drops,
// how much each surface behind a stack shrinks.
export const motion = stylex.defineConsts({
  dialogScale: "0.96",
  exitOffset: "8px",
  stackScale: "0.05",
  crossfadeBlur: "4px",
  crossfadeScale: "0.25",
  crossfadeTextBlur: "2px",
});
