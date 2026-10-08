import "./base.css";
// The theme's variables, which base.css reads by name; nothing imports them by value.
import "./theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  accent: "var(--accent-solid)",
  background: "var(--background)",
  edge: "var(--edge)",
  edgeSubtle: "var(--edge-subtle)",
  fill: "var(--fill)",
  fillOpaque: "var(--fill-opaque)",
  fillStrong: "var(--fill-strong)",
  fillSubtle: "var(--fill-subtle)",
  inverted: "var(--inverted)",
  onAccent: "var(--on-accent)",
  onInverted: "var(--on-inverted)",
  onInvertedFill: "var(--on-inverted-fill)",
  overlay: "var(--overlay)",
  // Floating surfaces: popovers, menus, dialogs, toasts.
  raised: "var(--raised)",
  sidebar: "var(--sidebar)",
  textMuted: "var(--text-muted)",
  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",

  // Status: the base is the foreground step, for icons and short labels; the
  // fills mirror the neutral ones as tints, `Solid` fills a shape that
  // carries the status alone, like a dot.
  danger: "var(--danger)",
  dangerFill: "var(--danger-fill)",
  dangerFillSubtle: "var(--danger-fill-subtle)",
  dangerSolid: "var(--danger-solid)",
  info: "var(--info)",
  infoFill: "var(--info-fill)",
  infoFillSubtle: "var(--info-fill-subtle)",
  infoSolid: "var(--info-solid)",
  success: "var(--success)",
  successFill: "var(--success-fill)",
  successFillSubtle: "var(--success-fill-subtle)",
  successSolid: "var(--success-solid)",
  warning: "var(--warning)",
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

// A card's padding, which its header, content and footer read so they line up at every size.
export const cardVars = stylex.defineVars({
  spacing: "0px",
});

export const shadows = stylex.defineConsts({
  // The ladder under a bordered control: the border is its edge, these its height. It
  // rises a step on hover and settles flat while pressed.
  control: "0 1px 2px -1px var(--black-a1), 0 2px 4px 0 var(--black-a1)",
  controlHover: "0 1px 2px -1px var(--black-a2), 0 2px 4px 0 var(--black-a1)",
  controlPressed: "0 1px 1px -1px var(--black-a2)",
  // A near shadow for contact and a far one for height, so a surface sits at a distance.
  dialog:
    "0 0 0 1px var(--neutral-a4), 0 1px 3px var(--black-a1), 0 16px 40px -8px var(--black-a4)",
  invalid: "0 0 0 2px var(--red-a4)",
  popover:
    "0 0 0 1px var(--neutral-a4), 0 1px 2px var(--black-a1), 0 4px 16px -4px var(--black-a3)",
  // A lit top edge and a shaded bottom one, so the solid fill reads as a key, not a sticker.
  primary:
    "inset 0 1px 0 var(--white-a3), inset 0 -1px 0 var(--black-a3), 0 1px 2px -1px var(--black-a3), 0 2px 4px 0 var(--black-a2)",
  primaryPressed:
    "inset 0 1px 0 var(--white-a3), inset 0 -1px 0 var(--black-a3), 0 1px 1px -1px var(--black-a3)",
  thumb: "0 0 0 1px var(--neutral-a6), 0 1px 3px var(--black-a5)",
});

export const fontSizes = stylex.defineConsts({
  md: "16px",
  sm: "14px",
  xs: "13px",
  xxs: "12px",
});

export const lineHeights = stylex.defineConsts({
  // Reading copy at `md`, like a chat message.
  prose: "24px",
  row: "18px",
  text: "20px",
});

export const fontWeights = stylex.defineConsts({
  medium: "500",
  regular: "400",
  semibold: "600",
});

// Values a theme can change point at variables `base.css` defaults and a theme overrides.
// `xxxs` and `xxs` stay fixed: they're hairline gaps, and JS reads `xxs` as a popup offset.
export const space = stylex.defineConsts({
  xxxs: "2px",
  xxs: "4px",
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
});

export const radii = stylex.defineConsts({
  // The 20px pieces, Badge and Kbd; off the 4px grid, as 4 reads square and 8 a pill.
  chip: "var(--radius-chip)",
  full: "9999px",
  lg: "var(--radius-lg)",
  md: "var(--radius-md)",
  xl: "var(--radius-xl)",
  sm: "var(--radius-sm)",
  xs: "var(--radius-xs)",
});

export const sizes = stylex.defineConsts({
  controlLg: "var(--size-control-lg)",
  controlMd: "var(--size-control-md)",
  controlSm: "var(--size-control-sm)",
  controlXs: "var(--size-control-xs)",
  controlXxs: "var(--size-control-xxs)",
  dialog: "384px",
  dialogLg: "512px",
  dialogSm: "320px",
  hitArea: "40px",
  icon: "16px",
  iconLg: "20px",
  iconSm: "14px",
  iconXs: "12px",
  iconXxs: "8px",
  kbd: "20px",
  // An item's image or avatar, beside a title and description.
  media: "40px",
  menu: "144px",
  menuHeight: "320px",
  // A centered block of short text, like an empty state's.
  measure: "384px",
  popover: "288px",
  // A side panel beside the content.
  sidePanel: "400px",
  // A sidebar open, and collapsed to its icons (a control and its group padding).
  sidebar: "256px",
  sidebarIcon: "48px",
  thumb: "12px",
  toast: "356px",
  tooltip: "320px",
});

export const strokes = stylex.defineConsts({
  border: "1px",
  // Hugeicons' weight beside medium text; read in JS, so a bare number.
  icon: "1.75",
  // The line under a `line` tab, and the bar beside a vertical one.
  indicator: "2px",
  spinner: "1.5px",
  track: "4px",
});

// Popup distances from their trigger, read in JS by Base UI, so bare numbers.
export const offsets = stylex.defineConsts({
  popover: "4",
  tooltip: "8",
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
  // A skeleton at the low point of its pulse.
  pulse: "0.5",
  disabled: "0.6",
  hover: "0.88",
});

export const media = stylex.defineConsts({
  hover: "@media (hover: hover)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
  sm: "@media (min-width: 640px)",
  // Below it, a sidebar opens as a sheet; JS reads the query.
  md: "@media (min-width: 768px)",
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
  move: "250ms",
  popover: "180ms",
  popoverExit: "120ms",
  press: "160ms",
  layout: "300ms",
  spin: "1s",
  // One breath of a skeleton: slow, so loading reads as calm.
  pulse: "2s",
  crossfade: "300ms",
  // How long a confirmation (copied, saved) holds before it reverts; read in JS.
  confirm: "1500ms",
  dialog: "200ms",
  tooltipDelay: "300ms",
  // Longer than a tooltip's: a card covers content, so it waits for the pointer to settle.
  hoverCardDelay: "600ms",
  hoverCardCloseDelay: "300ms",
});

// The shapes motion moves between: where a crossfade starts, how far an exit drops,
// how much each surface behind a stack shrinks.
export const motion = stylex.defineConsts({
  dialogScale: "0.96",
  dotScale: "0.5",
  exitOffset: "8px",
  popoverScale: "0.96",
  stackScale: "0.05",
  crossfadeBlur: "4px",
  crossfadeScale: "0.25",
  crossfadeTextBlur: "2px",
});
