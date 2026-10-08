import "./base.css";
import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  accent: "var(--gray-12)",
  background: "var(--gray-1)",
  edge: "var(--gray-a6)",
  edgeSubtle: "var(--gray-a4)",
  fill: "var(--gray-a3)",
  fillOpaque: "var(--gray-3)",
  fillStrong: "var(--gray-a4)",
  fillSubtle: "var(--gray-a2)",
  onAccent: "var(--gray-1)",
  onAccentFill: "var(--on-accent-fill)",
  overlay: "var(--black-a5)",
  textMuted: "var(--text-muted)",
  textPrimary: "var(--gray-12)",
  textSecondary: "var(--gray-11)",

  // Status: the base is the foreground step, for icons and short labels; the
  // fills mirror the neutral ones as tints, `Edge` is a tinted edge, `Solid`
  // fills a shape that carries the status alone, like a dot.
  danger: "var(--danger)",
  dangerEdge: "var(--red-a6)",
  dangerFill: "var(--danger-fill)",
  dangerFillSubtle: "var(--danger-fill-subtle)",
  dangerSolid: "var(--red-9)",
  info: "var(--info)",
  infoEdge: "var(--blue-a6)",
  infoFill: "var(--info-fill)",
  infoFillSubtle: "var(--info-fill-subtle)",
  infoSolid: "var(--blue-9)",
  success: "var(--success)",
  successEdge: "var(--green-a6)",
  successFill: "var(--success-fill)",
  successFillSubtle: "var(--success-fill-subtle)",
  successSolid: "var(--green-9)",
  warning: "var(--warning)",
  warningEdge: "var(--amber-a6)",
  warningFill: "var(--warning-fill)",
  warningFillSubtle: "var(--warning-fill-subtle)",
  warningSolid: "var(--warning-solid)",
});

// Multipliers for the corners and edge where an item meets its neighbor: 1 keeps them,
// 0 joins them. ButtonGroup sets them, along its row (`inline`), its column (`block`) or
// either; outside a group they stay 1, so nothing changes.
export const joins = stylex.defineVars({
  block: "1",
  either: "1",
  inline: "1",
});

// An avatar's diameter, its badge's, and the hole its photo leaves for the badge. Avatar
// sets them per size, so the masks that cut it apart from its neighbors and badge can do math on them.
export const avatarVars = stylex.defineVars({
  badge: "0px",
  badgeCut: "none",
  size: "0px",
});

export const shadows = stylex.defineConsts({
  control: "0 1px 2px var(--black-a1)",
  dialog: "0 0 0 1px var(--gray-a4), 0 16px 40px var(--black-a6)",
  invalid: "0 0 0 2px var(--red-a4)",
  popover: "0 0 0 1px var(--gray-a4), 0 4px 16px var(--black-a6)",
  thumb: "0 0 0 1px var(--gray-a6), 0 1px 3px var(--black-a5)",
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
  // The 20px pieces, Badge and Kbd; off the 4px grid, as 4 reads square and 8 a pill.
  chip: "6px",
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
  iconXxs: "8px",
  kbd: "20px",
  menu: "144px",
  menuHeight: "320px",
  popover: "288px",
  thumb: "12px",
  toast: "356px",
  tooltip: "320px",
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
  // Above a dialog, so a select or menu opened from one sits on top of it.
  popover: "45",
  toast: "50",
  tooltip: "60",
});

export const opacities = stylex.defineConsts({
  busy: "0.8",
  disabled: "0.6",
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
  popoverExit: "120ms",
  press: "160ms",
  layout: "300ms",
  spin: "1s",
  crossfade: "300ms",
  dialog: "200ms",
  tooltipDelay: "300ms",
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
