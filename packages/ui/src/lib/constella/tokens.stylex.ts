// The theme's variables, which base.css reads by name; nothing imports them by value.
import "./theme.stylex";
import * as stylex from "@stylexjs/stylex";

// A group `Sx` reads stays `as const`: without it the values widen to `string` and `sx` takes anything.
// Grouped by family; each family's tokens share its slots, so `<family><Slot>` names one.
export const colors = stylex.defineVars({
  // Surfaces.
  background: "var(--background)",
  overlay: "var(--overlay)",
  // Floating surfaces: popovers, menus, dialogs, toasts.
  raised: "var(--raised)",
  sidebar: "var(--sidebar)",
  well: "var(--well)",

  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",

  border: "var(--border)",
  borderSubtle: "var(--border-subtle)",
  borderStrong: "var(--border-strong)",

  // Translucent, so they read the same on any surface; `fillOpaque` hides what's under it.
  fillSubtle: "var(--fill-subtle)",
  fill: "var(--fill)",
  fillStrong: "var(--fill-strong)",
  fillOpaque: "var(--fill-opaque)",
  fillOnStrong: "var(--fill-on-strong)",

  accentSolid: "var(--accent-solid)",
  accentOnSolid: "var(--accent-on-solid)",

  invertedSolid: "var(--inverted-solid)",
  invertedOnSolid: "var(--inverted-on-solid)",
  invertedFill: "var(--inverted-fill)",

  // Status: `Text` for icons and short labels, `Subtle` tints with their hover, `Solid`
  // fills a shape that carries the status alone, like a dot.
  dangerText: "var(--danger-text)",
  dangerSubtle: "var(--danger-subtle)",
  dangerSubtleHover: "var(--danger-subtle-hover)",
  dangerSolid: "var(--danger-solid)",
  dangerBorder: "var(--danger-border)",
  infoText: "var(--info-text)",
  infoSubtle: "var(--info-subtle)",
  infoSubtleHover: "var(--info-subtle-hover)",
  infoSolid: "var(--info-solid)",
  successText: "var(--success-text)",
  successSubtle: "var(--success-subtle)",
  successSubtleHover: "var(--success-subtle-hover)",
  successSolid: "var(--success-solid)",
  warningText: "var(--warning-text)",
  warningSubtle: "var(--warning-subtle)",
  warningSubtleHover: "var(--warning-subtle-hover)",
  warningSolid: "var(--warning-solid)",

  // Chart series, in order; a legend or a tooltip's swatch reads them too.
  chart1: "var(--chart-1)",
  chart2: "var(--chart-2)",
  chart3: "var(--chart-3)",
  chart4: "var(--chart-4)",
  chart5: "var(--chart-5)",
  chart6: "var(--chart-6)",
} as const);

// Multipliers for the corners and edge where an item meets its neighbor: 1 keeps them,
// 0 joins them. ButtonGroup sets them, along its row (`inline`), its column (`block`) or
// either; outside a group they stay 1, so nothing changes.
export const joins = stylex.defineVars({
  block: "1",
  either: "1",
  inline: "1",
});

// An avatar's diameter, its badge's, the hole its photo leaves for the badge, and its
// corner. Avatar sets them per size, so the masks that cut it apart from its neighbors and
// badge can do math on them.
export const avatarVars = stylex.defineVars({
  badge: "0px",
  badgeCut: "none",
  corner: "9999px",
  size: "0px",
});

// The diameter of an avatar leading a badge. Badge sets it per size, Avatar reads it.
export const badgeVars = stylex.defineVars({
  avatar: "0px",
});

// A card's padding, which its header, content and footer read so they line up at every size.
export const cardVars = stylex.defineVars({
  spacing: "0px",
});

// A text field's type size over 16px, below which iOS zooms on focus. InputGroup sets it on touch screens.
export const inputVars = stylex.defineVars({
  scale: "1",
});

export const codeBlockVars = stylex.defineVars({
  padBlock: "0px",
  padInline: "0px",
});

// Steps by height, after Interfere's: `default` under a control, `lg` under a popup, `xl`
// under a dialog. A step's slots follow it: `Hover`, `Pressed`, `Invalid`, `Ring` (draws its
// own edge, `Subtle` in `borderSubtle`). The theme's depth sets `default`'s drops (`--shadow-*`):
// a flat theme drops them, and a ring keeps its edge. `panel`, `lg` and `xl` stand off the page, so every theme keeps them.
export const shadows = stylex.defineConsts({
  // The border is the control's edge, these its height. It rises a step on hover and
  // settles flat while pressed.
  default: "var(--shadow-default)",
  defaultHover: "var(--shadow-default-hover)",
  defaultPressed: "var(--shadow-default-pressed)",
  defaultInvalid: "0 0 0 2px var(--red-a4)",
  defaultRing: "0 0 0 1px var(--border), var(--shadow-default-ring)",
  defaultRingSubtle:
    "0 0 0 0.5px var(--border-subtle), var(--shadow-default-ring-subtle)",
  defaultRingInvalid: "0 0 0 1px var(--danger-border), 0 0 0 3px var(--red-a4)",
  // A side panel beside the page: it stands apart from the content in every depth, so the theme doesn't set it.
  panel:
    "0 0 0 0.5px var(--border-subtle), 0 1px 2px var(--black-a1), 0 4px 12px -6px var(--black-a1)",
  // A near shadow for contact and a far one for height, so a surface sits at a distance.
  lg: "0 0 0 1px var(--border-subtle), 0 1px 2px var(--black-a1), 0 4px 16px -4px var(--black-a3)",
  xl: "0 0 0 1px var(--border-subtle), 0 1px 3px var(--black-a1), 0 16px 40px -8px var(--black-a4)",
} as const);

// The theme's fonts, which base.css sets on the page and reset.css on controls and code. Figures to compare take `mono`.
export const fonts = stylex.defineConsts({
  mono: "var(--font-mono)",
  sans: "var(--font-sans)",
});

// The bases the type scale multiplies, 4px at a 16px root. In rem, so text follows the
// reader's browser font size; apart, so leading can change without the sizes.
const typeUnit = "0.25rem";
const leadingUnit = "0.25rem";

// The type scale, after Interfere's: headings rank 1 (largest) to 6, text steps around
// `textBase`. Each size has a line height of the same name; set them together. 15, 13 and
// 11 add 1px to a step, as Interfere's do.
export const fontSizes = stylex.defineConsts({
  heading1: `calc(${typeUnit} * 14)`,
  heading2: `calc(${typeUnit} * 11)`,
  heading3: `calc(${typeUnit} * 9)`,
  heading4: `calc(${typeUnit} * 7)`,
  heading5: `calc(${typeUnit} * 6)`,
  heading6: `calc(${typeUnit} * 5)`,
  textLg: `calc(${typeUnit} * 4.5)`,
  // Reading copy.
  textBase: `calc(${typeUnit} * 3.5 + 1px)`,
  // A sidebar's rows.
  textMd: `calc(${typeUnit} * 3.5)`,
  // Controls and the text inside components.
  textSm: `calc(${typeUnit} * 3 + 1px)`,
  // Badges, shortcuts, group labels.
  captionLg: `calc(${typeUnit} * 3)`,
  captionBase: `calc(${typeUnit} * 2.5 + 1px)`,
  captionSm: `calc(${typeUnit} * 2.5)`,
  captionXs: `calc(${typeUnit} * 2)`,
  // Under 16px, iOS Safari zooms the page when a field takes focus; fields switch to this on touch.
  touch: "16px",
} as const);

export const lineHeights = stylex.defineConsts({
  heading1: `calc(${leadingUnit} * 14)`,
  heading2: `calc(${leadingUnit} * 14)`,
  heading3: `calc(${leadingUnit} * 11)`,
  heading4: `calc(${leadingUnit} * 9)`,
  heading5: `calc(${leadingUnit} * 8)`,
  heading6: `calc(${leadingUnit} * 6)`,
  textLg: `calc(${leadingUnit} * 6)`,
  textBase: `calc(${leadingUnit} * 6)`,
  textMd: `calc(${leadingUnit} * 5)`,
  textSm: `calc(${leadingUnit} * 5)`,
  captionLg: `calc(${leadingUnit} * 4)`,
  captionBase: `calc(${leadingUnit} * 4)`,
  captionSm: `calc(${leadingUnit} * 4)`,
  captionXs: `calc(${leadingUnit} * 3)`,
  touch: `calc(${leadingUnit} * 6)`,
});

// Large type tightens a little, so a heading doesn't read as spaced out.
export const letterSpacings = stylex.defineConsts({
  heading: "-0.01em",
  // Uppercase reads cramped at its own spacing.
  caps: "0.05em",
});

export const fontWeights = stylex.defineConsts({
  medium: "500",
  regular: "400",
  // 450 and 550 need a variable font; a static one renders them as 500 and 600.
  semimedium: "450",
  semibold: "550",
});

// The base space, sizes and the theme's radius multiply, 4px at a 16px root, as Tailwind's
// `--spacing`. In rem, so controls and their padding grow with the text.
const spaceUnit = "0.25rem";

// Values a theme can change point at variables `base.css` defaults and a theme overrides.
// `xxxs` and `xxs` stay fixed across themes: they're hairline gaps.
export const space = stylex.defineConsts({
  xxxs: `calc(${spaceUnit} * 0.5)`,
  xxs: spaceUnit,
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  // shadcn's off-grid insets, a hairline under a step so they follow the preset: a row's 6, a popup's 10.
  row: `calc(var(--space-xs) - ${spaceUnit} * 0.5)`,
  popup: `calc(var(--space-sm) - ${spaceUnit} * 0.5)`,
} as const);

export const radii = stylex.defineConsts({
  // The 20px pieces, Badge and Kbd; off the 4px grid, as 4 reads square and 8 a pill.
  chip: "var(--radius-chip)",
  full: "9999px",
  lg: "var(--radius-lg)",
  md: "var(--radius-md)",
  xl: "var(--radius-xl)",
  sm: "var(--radius-sm)",
  xs: "var(--radius-xs)",
} as const);

export const sizes = stylex.defineConsts({
  controlLg: "var(--size-control-lg)",
  controlMd: "var(--size-control-md)",
  controlSm: "var(--size-control-sm)",
  controlXs: "var(--size-control-xs)",
  controlXxs: "var(--size-control-xxs)",
  // A small badge: a hairline under `controlXxs`, so it follows the preset.
  controlXxxs: `calc(var(--size-control-xxs) - ${spaceUnit} * 0.5)`,
  // A vertical attachment card's width, and its wide variant's.
  attachment: `calc(${spaceUnit} * 24)`,
  attachmentWide: `calc(${spaceUnit} * 30)`,
  // A citation pill's widest; a longer publication name truncates.
  citation: `calc(${spaceUnit} * 40)`,
  dialog: `calc(${spaceUnit} * 96)`,
  dialogLg: `calc(${spaceUnit} * 128)`,
  dialogSm: `calc(${spaceUnit} * 80)`,
  // The top row the sidebar and the page share, so their headers line up.
  header: `calc(${spaceUnit} * 14)`,
  hitArea: `calc(${spaceUnit} * 10)`,
  icon: `calc(${spaceUnit} * 4)`,
  iconLg: `calc(${spaceUnit} * 5)`,
  iconSm: `calc(${spaceUnit} * 3.5)`,
  iconXs: `calc(${spaceUnit} * 3)`,
  iconXxs: `calc(${spaceUnit} * 2)`,
  kbd: `calc(${spaceUnit} * 5)`,
  // An item's image or avatar, beside a title and description.
  media: `calc(${spaceUnit} * 10)`,
  // The least an item's text keeps beside its actions before they drop under it.
  itemText: `calc(${spaceUnit} * 40)`,
  menu: `calc(${spaceUnit} * 36)`,
  // A default or large menu's least width, roomy enough for a label beside its value.
  menuLg: `calc(${spaceUnit} * 50)`,
  menuHeight: `calc(${spaceUnit} * 80)`,
  // A model picker's list: short names beside a search field.
  modelPicker: `calc(${spaceUnit} * 60)`,
  // A centered block of short text, like an empty state's.
  measure: `calc(${spaceUnit} * 96)`,
  popover: `calc(${spaceUnit} * 72)`,
  // A settings dialog's nav and page side by side, capped to the window.
  settingsDialog: `calc(${spaceUnit} * 250)`,
  settingsDialogHeight: `calc(${spaceUnit} * 160)`,
  // A side panel beside the content.
  sidePanel: `calc(${spaceUnit} * 100)`,
  // A sidebar open, and collapsed to its icons (a control and its group padding).
  sidebar: `calc(${spaceUnit} * 64)`,
  sidebarIcon: `calc(${spaceUnit} * 12)`,
  thumb: `calc(${spaceUnit} * 3)`,
  toast: `calc(${spaceUnit} * 89)`,
  tooltip: `calc(${spaceUnit} * 80)`,
} as const);

// Lines stay in px, so a hairline stays one crisp device pixel at any text size.
export const strokes = stylex.defineConsts({
  border: "1px",
  // Hugeicons' weight beside medium text; read in JS, so a bare number. In the icon's own
  // units, so it scales with the icon.
  icon: "1.75",
  // The line under a `line` tab, and the bar beside a vertical one.
  indicator: "2px",
  spinner: "1.5px",
  // A slider or progress bar: a size, not a line, so it grows with its thumb.
  track: spaceUnit,
});

// Popup distances from their trigger, read in JS by Base UI, so bare numbers.
export const offsets = stylex.defineConsts({
  popover: "4",
  tooltip: "8",
});

export const layers = stylex.defineConsts({
  // Floats over the page, under a dialog's backdrop.
  bar: "30",
  dialog: "40",
  // Above a dialog, so a select or menu opened from one sits on top of it.
  popover: "45",
  toast: "50",
  tooltip: "60",
} as const);

export const opacities = stylex.defineConsts({
  busy: "0.8",
  // A skeleton at the low point of its pulse.
  pulse: "0.6",
  disabled: "0.6",
  hover: "0.88",
});

export const media = stylex.defineConsts({
  coarse: "@media (pointer: coarse)",
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

// Shared by name so the tokens and the CSS variables below can't drift.
const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";
const easeCrossfade = "cubic-bezier(0.2, 0, 0, 1)";
const popoverIn = "180ms";
const popoverOut = "120ms";
const crossfadeFor = "300ms";
const surfaceFor = "200ms";

export const easings = stylex.defineConsts({
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  out: easeOut,
  overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  layout: "cubic-bezier(0.32, 0.72, 0, 1)",
  crossfade: easeCrossfade,
} as const);

export const durations = stylex.defineConsts({
  hover: "150ms",
  move: "250ms",
  popover: popoverIn,
  popoverExit: popoverOut,
  press: "160ms",
  layout: "300ms",
  layoutExit: surfaceFor,
  spin: "1s",
  // One breath of a skeleton: slow, so loading reads as calm.
  pulse: "2s",
  // One sweep of a shimmer across working text.
  shimmer: "2s",
  crossfade: crossfadeFor,
  // How long a confirmation (copied, saved) holds before it reverts; read in JS.
  confirm: "1500ms",
  dialog: surfaceFor,
  chart: surfaceFor,
  sidebar: "250ms",
  sidebarExit: surfaceFor,
  // The gap between siblings arriving one after another.
  stagger: "50ms",
  // How long an image may load before its fallback shows; read in JS.
  fallbackDelay: "600ms",
  // Half Base UI's 600ms, for a tooltip and a hover card alike.
  tooltipDelay: "300ms",
  hoverCardDelay: "300ms",
  hoverCardCloseDelay: "300ms",
} as const);

// The motion CSS outside StyleX's reach reads (view transitions in base.css and the site),
// under literal names.
export const motionVars = stylex.defineVars({
  "--duration-crossfade": crossfadeFor,
  "--duration-popover": popoverIn,
  "--duration-popover-exit": popoverOut,
  "--ease-crossfade": easeCrossfade,
  "--ease-out": easeOut,
});

// The shapes motion moves between: where a crossfade starts, how far an exit drops,
// how much each surface behind a stack shrinks.
export const motion = stylex.defineConsts({
  // How far a row rises as it arrives.
  arriveOffset: "4px",
  dialogScale: "0.96",
  dotScale: "0.5",
  exitOffset: "8px",
  popoverScale: "0.96",
  stackScale: "0.05",
  crossfadeBlur: "4px",
  crossfadeScale: "0.25",
  crossfadeTextBlur: "2px",
});

export const blurs = stylex.defineConsts({
  backdrop: "4px",
});
