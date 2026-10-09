"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  Cancel01Icon,
  Menu01Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ComponentProps, ReactNode } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SeparatorProps } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  motion,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const sidebarSides = ["left", "right"] as const;
const sidebarCollapsibles = ["offcanvas", "icon", "none"] as const;
const sidebarMenuButtonSizes = ["sm", "default", "lg"] as const;
const sidebarMenuButtonVariants = ["default", "outline"] as const;
const sidebarSectionDirections = ["forward", "back"] as const;

type SidebarSide = (typeof sidebarSides)[number];
type SidebarCollapsible = (typeof sidebarCollapsibles)[number];
type SidebarMenuButtonSize = (typeof sidebarMenuButtonSizes)[number];
type SidebarMenuButtonVariant = (typeof sidebarMenuButtonVariants)[number];
type SidebarSectionDirection = (typeof sidebarSectionDirections)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

interface SidebarContextValue {
  changeSection: (
    direction: SidebarSectionDirection,
    update: () => void | Promise<void>
  ) => void;
  isMobile: boolean;
  open: boolean;
  openMobile: boolean;
  sectionChanging: boolean;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  state: "collapsed" | "expanded";
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// Inside the mobile sheet, where the trigger closes it.
const InSheetContext = createContext(false);

// `collapsing` from the moment an icon sidebar starts to narrow; `rail` once it has,
// so until then the full layout stays and the width clips it. Tooltips point away
// from the window's edge.
const RailContext = createContext<{
  collapsing: boolean;
  rail: boolean;
  tooltipSide: "left" | "right";
}>({ collapsing: false, rail: false, tooltipSide: "right" });

// Toggles without the animation: a keyboard action is too frequent to animate.
const KeyboardToggleContext = createContext<(() => void) | null>(null);

// Tells a row's button whether its label is cut off, so its tooltip can show it whole.
const LabelContext = createContext<((truncated: boolean) => void) | null>(null);

// The media token is a full at-rule; matchMedia takes only its query.
const desktopQuery = media.md.slice("@media ".length);

function subscribe(onChange: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => {
    query.removeEventListener("change", onChange);
  };
}

// Without transition types the slide can't tell forward from back, and without
// `match-element` two sidebars would share a name, so those browsers swap at once.
function supportsSectionChange() {
  return (
    CSS.supports("selector(:active-view-transition-type(a))") &&
    CSS.supports("view-transition-name: match-element")
  );
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(desktopQuery).matches,
    () => false
  );
}

// Measured, so a label that fits never shows faded. Faded until then: the server
// can't measure, and a long label must never paint hard-clipped.
function useTruncated(enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  const report = use(LabelContext);
  const [truncated, setTruncated] = useState(enabled);
  useLayoutEffect(() => {
    const node = ref.current;
    function measure() {
      const next =
        enabled && node !== null && node.scrollWidth > node.clientWidth;
      setTruncated(next);
      report?.(next);
    }
    measure();
    // Its box changes width with the sidebar, and its text on a rename.
    const resize = new ResizeObserver(measure);
    const content = new MutationObserver(measure);
    if (node !== null) {
      resize.observe(node);
      content.observe(node, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
    return () => {
      resize.disconnect();
      content.disconnect();
    };
  }, [enabled, report]);
  return { ref, truncated };
}

const inSectionChange = ":is([data-section-change] *)";
// Toggled from the keyboard: too frequent to animate.
const fromKeyboard = ":is([data-instant] *)";
// The collapsed selectors outrank it, so each close duration pairs with it to stay at once.
const iconOnly = ":is([data-slot='sidebar'][data-collapsible='icon'] *)";
const expandingContent =
  ":is([data-slot='sidebar'][data-expanding] [data-slot='sidebar-content'] *)";
const fadeIn = stylex.keyframes({ from: { opacity: 0 } });
const inContentIconOnly =
  ":is([data-slot='sidebar'][data-collapsible='icon'] [data-slot='sidebar-content'] *)";
const inRail = ":is([data-slot='sidebar'][data-rail] *)";
const highlighted = ":is([data-active])";
const pressable = ":not(:disabled, [aria-disabled='true'])";
const rtl = ":is([dir='rtl'] *)";
const triggerHovered = ":is([data-slot='sidebar-trigger']:hover *)";
const triggerFocused = ":is([data-slot='sidebar-trigger']:focus-visible *)";

// The whole row answers the pointer, so reaching for its action keeps it lit, and so
// does an open menu from it.
const item = "[data-slot='sidebar-menu-item']";
// Its own attribute, not `data-slot`: a menu trigger rendering the action writes its slot over it.
const action = "[data-sidebar-menu-action]";
// Its own children only, so a sub-row doesn't light its parent.
const ownHover = `${item}:has(> :not([data-slot='sidebar-menu-sub']):hover)`;
const ownFocus = `${item}:has(> :focus-visible)`;
const rowHovered = `:is(${ownHover} > *)`;
// The action's menu only: the row's own tooltip writes the same attribute.
const actionOpen = `${item}:has(> ${action}[data-popup-open])`;
const rowOpen = `:is(${actionOpen} > *)`;
const idle = ":not([data-active])";
const rowFill = {
  default: "transparent",
  [media.hover]: {
    default: "transparent",
    [`${rowHovered}${idle}`]: colors.fillSubtle,
    [highlighted]: colors.fill,
  },
  [`${rowOpen}${idle}`]: colors.fillSubtle,
  [`:active${pressable}${idle}`]: colors.fillSubtle,
  [highlighted]: colors.fill,
};
// An inset shadow, not a second fill, so hover stacks on the current row's `fill` and still fades.
const lit = `inset 0 0 0 100vmax ${colors.fillSubtle}`;
const unlit = "inset 0 0 0 100vmax transparent";

// The label fades out before the row's end, or before an action drawn over it:
// the action's width and inset, less the row's padding.
const actionRoom = `(${sizes.controlXs} + ${space.xxs} - ${space.xs})`;
const fadeAtEdge = (to: string) =>
  `linear-gradient(to ${to}, black calc(100% - ${space.lg}), transparent)`;
const fadeBeforeAction = (to: string) =>
  `linear-gradient(to ${to}, black calc(100% - ${actionRoom} - ${space.md}), transparent calc(100% - ${actionRoom}))`;
const withAction = `${item}:has(> ${action})`;
// Whenever the action is drawn: always unless it waits for hover, and while its row is
// hovered, focused or has its menu open.
const actionShown = `:is(${item}:has(> ${action}:not([data-show-on-hover])) *, ${withAction}${ownFocus} *, ${actionOpen} *)`;
const actionHovered = `:is(${withAction}${ownHover} *)`;

const styles = stylex.create({
  wrapper: {
    display: "flex",
    minHeight: "100svh",
    width: "100%",
  },
  // In the flow and sticky, so it sits beside the content and fills the window's height.
  sidebar: {
    // On the column, not its full-width inside, so the edge stays drawn while the width moves.
    borderInlineEndColor: colors.edgeSubtle,
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: strokes.border,
    boxSizing: "border-box",
    color: colors.textPrimary,
    // Rows size to it, so they narrow with the width instead of being cut at its edge.
    containerType: "inline-size",
    display: { default: "none", [media.md]: "block" },
    flexShrink: 0,
    height: "100svh",
    insetBlockStart: 0,
    // Lets a sub-menu's height fold with the width.
    interpolateSize: "allow-keywords",
    maxHeight: "100%",
    overflow: "hidden",
    position: "sticky",
    transitionDuration: {
      default: durations.sidebar,
      ":is([data-collapsible])": durations.sidebarExit,
      [fromKeyboard]: "0s",
      [`:is([data-collapsible])${fromKeyboard}`]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "width",
    transitionTimingFunction: easings.inOut,
    width: sizes.sidebar,
  },
  offcanvas: { borderInlineEndWidth: 0, borderInlineStartWidth: 0, width: 0 },
  sidebarRight: {
    borderInlineEndWidth: 0,
    borderInlineStartColor: colors.edgeSubtle,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
  },
  icon: { width: sizes.sidebarIcon },
  // Keeps its full width while the sidebar narrows, so its content is clipped, not reflowed.
  inner: {
    backgroundColor: colors.sidebar,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    // Inside the column's border.
    width: {
      default: `calc(${sizes.sidebar} - ${strokes.border})`,
      [inRail]: `calc(${sizes.sidebarIcon} - ${strokes.border})`,
    },
  },
  innerRight: { marginInlineStart: "auto" },
  static: {
    backgroundColor: colors.sidebar,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: sizes.sidebar,
  },
  sheet: {
    backgroundColor: colors.sidebar,
    width: sizes.sidebar,
  },
  hidden: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
  main: {
    backgroundColor: colors.background,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    minWidth: 0,
    position: "relative",
  },
  rail: {
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    cursor: "ew-resize",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    // On the edge that meets the page, whichever side the sidebar is on.
    insetInlineEnd: {
      default: `calc(-1 * ${space.xs})`,
      ":is([data-side='right'] *)": "auto",
    },
    insetInlineStart: {
      default: "auto",
      ":is([data-side='right'] *)": `calc(-1 * ${space.xs})`,
    },
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "absolute",
    width: space.md,
    zIndex: 1,
    "::after": {
      backgroundColor: {
        default: "transparent",
        [media.hover]: { default: "transparent", ":hover": colors.edge },
      },
      content: "''",
      insetBlockEnd: 0,
      insetBlockStart: 0,
      insetInlineStart: `calc(50% - ${strokes.border})`,
      position: "absolute",
      transitionDuration: durations.hover,
      transitionProperty: "background-color",
      width: strokes.indicator,
    },
  },
  // Named only while its own sidebar changes section; base.css slides the snapshots.
  swap: {
    viewTransitionClass: { default: null, [inSectionChange]: "sidebar-swap" },
    viewTransitionName: { default: null, [inSectionChange]: "match-element" },
  },
  // The page's header height, so the two line up across the edge.
  header: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: space.xxs,
    height: sizes.header,
    // Alone in the rail, the trigger keeps to the start, on the rows' icon column.
    justifyContent: "space-between",
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
  headerActions: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: space.xxs,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: space.md,
    minHeight: 0,
    overflowX: "hidden",
    overflowY: { default: "auto", [iconOnly]: "hidden" },
    paddingBlockEnd: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
  separator: {
    marginInlineEnd: space.xs,
    marginInlineStart: space.xs,
    width: "auto",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    position: "relative",
    width: "100%",
  },
  // Folds away with the width, rather than leaving the rows below to jump up when it goes.
  groupLabel: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.xs,
    height: sizes.controlXs,
    marginBlockStart: {
      default: 0,
      [iconOnly]: `calc(-1 * ${sizes.controlXs})`,
    },
    opacity: { default: 1, [iconOnly]: 0 },
    overflow: "hidden",
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    transitionDuration: {
      default: durations.sidebar,
      [iconOnly]: durations.sidebarExit,
      [fromKeyboard]: "0s",
      [`${iconOnly}${fromKeyboard}`]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "margin, opacity",
    transitionTimingFunction: easings.inOut,
    whiteSpace: "nowrap",
  },
  action: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [media.hover]: { default: "transparent", ":hover": colors.fillSubtle },
    },
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    // Concentric with the row: its radius less the inset it sits at.
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    color: colors.textSecondary,
    cursor: "pointer",
    display: { default: "flex", [inRail]: "none" },
    height: sizes.controlXs,
    insetInlineEnd: space.xxs,
    justifyContent: "center",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "absolute",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, opacity",
    transitionTimingFunction: "ease",
    width: sizes.controlXs,
  },
  groupAction: {
    insetBlockStart: 0,
  },
  groupContent: {
    fontSize: fontSizes.sm,
    width: "100%",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    // Apart by a hairline, so a hovered row's fill never merges into the current one.
    gap: space.xxxs,
    listStyleType: "none",
    marginBlockEnd: 0,
    marginBlockStart: 0,
    minWidth: 0,
    paddingInlineStart: 0,
    width: "100%",
  },
  menuItem: {
    position: "relative",
  },
  // In the content it fades with the width, as it has no icon to keep in the rail; the
  // header's stays, so its logo holds where the rail's mark takes over.
  expandedOnly: {
    // Mounted as the rail opens, it fades in with the labels instead of starting whole.
    animationDuration: durations.sidebar,
    animationName: { default: null, [expandingContent]: fadeIn },
    animationTimingFunction: easings.inOut,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    opacity: { default: 1, [inContentIconOnly]: 0 },
    transitionDuration: {
      default: durations.sidebar,
      [iconOnly]: durations.sidebarExit,
      [fromKeyboard]: "0s",
      [`${iconOnly}${fromKeyboard}`]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: easings.inOut,
  },
  button: {
    alignItems: "center",
    backgroundColor: rowFill,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    boxShadow: {
      default: null,
      [highlighted]: {
        default: unlit,
        [media.hover]: { default: unlit, [rowHovered]: lit },
        [rowOpen]: lit,
      },
    },
    boxSizing: "border-box",
    color: colors.textPrimary,
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    gap: space.xs,
    height: sizes.controlMd,
    lineHeight: lineHeights.row,
    opacity: {
      default: 1,
      ":is(:disabled, [aria-disabled='true'])": opacities.disabled,
    },
    overflow: "hidden",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    textAlign: "start",
    textDecorationLine: "none",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, box-shadow",
    transitionTimingFunction: "ease",
    whiteSpace: "nowrap",
    width: {
      default: `min(100%, 100cqi - 2 * ${space.xs})`,
      [inRail]: sizes.controlMd,
    },
  },
  // Room on the end for a badge.
  buttonWithEnd: {
    paddingInlineEnd: {
      default: `calc(${space.xs} + ${sizes.controlXs} + ${space.xxs})`,
      [inRail]: space.xs,
    },
  },
  buttonOutline: {
    backgroundColor: colors.background,
    boxShadow: `0 0 0 ${strokes.border} ${colors.edge}`,
  },
  buttonSm: { fontSize: fontSizes.xs, height: sizes.controlSm },
  buttonLg: {
    height: { default: sizes.media, [inRail]: sizes.controlMd },
    paddingInlineEnd: { default: space.xs, [inRail]: 0 },
    paddingInlineStart: { default: space.xs, [inRail]: 0 },
  },
  // Stays put while the sidebar's edge passes over it; the rail's narrow button hides it.
  label: {
    // One mounted as the rail opens (a brand's name) fades in like the rest, not whole.
    animationDuration: durations.sidebar,
    animationName: {
      default: null,
      ":is([data-slot='sidebar'][data-expanding] *)": fadeIn,
    },
    animationTimingFunction: easings.inOut,
    flexGrow: 1,
    maskImage: {
      default: null,
      ":is([data-truncated])": fadeAtEdge("right"),
      [`:is([data-truncated])${rtl}`]: fadeAtEdge("left"),
      [actionShown]: fadeBeforeAction("right"),
      [`${actionShown}${rtl}`]: fadeBeforeAction("left"),
      [media.hover]: {
        [actionHovered]: fadeBeforeAction("right"),
        [`${actionHovered}${rtl}`]: fadeBeforeAction("left"),
      },
    },
    minWidth: 0,
    // On the width's own clock, so it's gone just as the edge reaches the icons.
    opacity: { default: 1, [iconOnly]: 0 },
    overflow: "hidden",
    transitionDuration: {
      default: durations.sidebar,
      [iconOnly]: durations.sidebarExit,
      [fromKeyboard]: "0s",
      [`${iconOnly}${fromKeyboard}`]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: easings.inOut,
    whiteSpace: "nowrap",
  },
  // Drawn while its row is pointed at or focused, and kept in the layout when hidden,
  // so the label's width never moves.
  kbd: {
    display: { default: "flex", [inRail]: "none" },
    flexShrink: 0,
    opacity: {
      default: 0,
      [`:is(${ownFocus} *)`]: 1,
      [media.hover]: {
        default: 0,
        [`:is(${ownHover} *)`]: 1,
      },
    },
    transitionDuration: durations.hover,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease",
  },
  menuAction: {
    insetBlockStart: `calc((${sizes.controlMd} - ${sizes.controlXs}) / 2)`,
  },
  // Shown while its row is hovered or focused, or while its menu is open; always on touch.
  onHover: {
    opacity: {
      default: 1,
      [media.hover]: {
        default: 0,
        [`:is(${ownHover} *, ${ownFocus} *)`]: 1,
        ":is([data-popup-open])": 1,
      },
    },
  },
  badge: {
    alignItems: "center",
    color: colors.textSecondary,
    display: { default: "flex", [inRail]: "none" },
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.medium,
    height: sizes.controlXs,
    insetBlockStart: `calc((${sizes.controlMd} - ${sizes.controlXs}) / 2)`,
    insetInlineEnd: space.xxs,
    justifyContent: "center",
    minWidth: sizes.controlXs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    pointerEvents: "none",
    position: "absolute",
    userSelect: "none",
  },
  skeleton: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
    height: sizes.controlMd,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
  skeletonIcon: {
    flexShrink: 0,
    height: sizes.icon,
    width: sizes.icon,
  },
  skeletonText: {
    flex: 1,
    height: sizes.icon,
  },
  sub: {
    borderInlineStartColor: colors.edgeSubtle,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    display: "flex",
    flexDirection: "column",
    gap: space.xxxs,
    // Folds shut with the width, so the rows under it close up in the same motion.
    height: { default: "auto", [iconOnly]: 0 },
    listStyleType: "none",
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: `calc(${space.xs} - ${space.xxxs})`,
    // Under the parent row's icon.
    marginInlineStart: `calc(${space.xs} + ${sizes.icon} / 2)`,
    minWidth: 0,
    opacity: { default: 1, [iconOnly]: 0 },
    overflow: "clip",
    overflowClipMargin: space.xxs,
    paddingBlockEnd: { default: space.xxxs, [iconOnly]: 0 },
    paddingBlockStart: { default: space.xxxs, [iconOnly]: 0 },
    paddingInlineEnd: 0,
    paddingInlineStart: `calc(${space.xs} - ${space.xxxs})`,
    transitionDuration: {
      default: durations.sidebar,
      [iconOnly]: durations.sidebarExit,
      [fromKeyboard]: "0s",
      [`${iconOnly}${fromKeyboard}`]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "height, padding-block, opacity",
    transitionTimingFunction: easings.inOut,
  },
  subButton: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [media.hover]: {
        default: "transparent",
        [`:hover${pressable}`]: colors.fillSubtle,
        [highlighted]: colors.fill,
      },
      [`:active${pressable}`]: colors.fillSubtle,
      [highlighted]: colors.fill,
    },
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
    height: sizes.controlSm,
    overflow: "hidden",
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    textDecorationLine: "none",
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
    whiteSpace: "nowrap",
  },
  subButtonSm: { fontSize: fontSizes.xs },
  // The rail's mark and the icon share one cell, and cross-fade as the trigger is pointed at.
  markStack: {
    display: "inline-grid",
  },
  markLayer: {
    display: "flex",
    gridArea: "1 / 1",
    transitionDuration: {
      default: durations.hover,
      // Keyboard focus never animates.
      [triggerFocused]: "0s",
    },
    transitionProperty: {
      default: "opacity, scale, filter",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.crossfade,
  },
  // The outgoing layer shrinks and softens, so the two never double-expose.
  markIdle: {
    filter: {
      default: "none",
      [triggerFocused]: `blur(${motion.crossfadeTextBlur})`,
      [media.hover]: {
        default: "none",
        [triggerHovered]: `blur(${motion.crossfadeTextBlur})`,
      },
    },
    opacity: {
      default: 1,
      [triggerFocused]: 0,
      [media.hover]: { default: 1, [triggerHovered]: 0 },
    },
    scale: {
      default: 1,
      [triggerFocused]: motion.popoverScale,
      [media.hover]: { default: 1, [triggerHovered]: motion.popoverScale },
    },
  },
  markActive: {
    filter: {
      default: `blur(${motion.crossfadeTextBlur})`,
      [triggerFocused]: "none",
      [media.hover]: {
        default: `blur(${motion.crossfadeTextBlur})`,
        [triggerHovered]: "none",
      },
    },
    opacity: {
      default: 0,
      [triggerFocused]: 1,
      [media.hover]: { default: 0, [triggerHovered]: 1 },
    },
    scale: {
      default: motion.popoverScale,
      [triggerFocused]: 1,
      [media.hover]: { default: motion.popoverScale, [triggerHovered]: 1 },
    },
  },
});

/** Holds the open state, toggles on ⌘B / Ctrl+B, and lays the sidebar out beside its inset. */
function SidebarProvider({
  defaultOpen = true,
  onOpenChange,
  open: openProp,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  // A count, so a change started mid-slide isn't unnamed when the first one ends.
  const [sectionChanges, setSectionChanges] = useState(0);
  // Whether the last toggle came from ⌘B / Ctrl+B.
  const [instant, setInstant] = useState(false);
  const open = openProp ?? ownOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      setInstant(false);
      if (onOpenChange) {
        onOpenChange(next);
      } else {
        setOwnOpen(next);
      }
    },
    [onOpenChange]
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, openMobile, setOpen]);

  const toggleFromKeyboard = useCallback(() => {
    toggleSidebar();
    setInstant(true);
  }, [toggleSidebar]);

  const changeSection = useCallback(
    (
      direction: SidebarSectionDirection,
      update: () => void | Promise<void>
    ) => {
      if (!supportsSectionChange()) {
        void update();
        return;
      }
      flushSync(() => {
        setSectionChanges((count) => count + 1);
      });
      const transition = document.startViewTransition({
        types: [`sidebar-${direction}`],
        update: async () => {
          await flushSync(update);
        },
      });
      // `finished` rejects when `update` does; the names come off either way.
      async function settle() {
        await Promise.allSettled([transition.finished]);
        setSectionChanges((count) => count - 1);
      }
      void settle();
    },
    []
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleFromKeyboard();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [toggleFromKeyboard]);

  const context = useMemo<SidebarContextValue>(
    () => ({
      changeSection,
      isMobile,
      open,
      openMobile,
      sectionChanging: sectionChanges > 0,
      setOpen,
      setOpenMobile,
      state: open ? "expanded" : "collapsed",
      toggleSidebar,
    }),
    [
      changeSection,
      isMobile,
      open,
      openMobile,
      sectionChanges,
      setOpen,
      toggleSidebar,
    ]
  );

  return (
    <SidebarContext value={context}>
      {/* One group, so once a row's tooltip is open, the next opens at once. */}
      <TooltipProvider>
        <KeyboardToggleContext value={toggleFromKeyboard}>
          <div
            data-instant={instant || undefined}
            data-slot="sidebar-wrapper"
            {...props}
            {...stylex.props(styles.wrapper, sx)}
          />
        </KeyboardToggleContext>
      </TooltipProvider>
    </SidebarContext>
  );
}

function Sidebar({
  children,
  collapsible = "offcanvas",
  side = "left",
  sx,
  ...props
}: Styled<Omit<ComponentProps<"div">, "ref">> & {
  collapsible?: SidebarCollapsible;
  side?: SidebarSide;
}) {
  const { isMobile, openMobile, sectionChanging, setOpenMobile, state } =
    useSidebar();
  const desktop = useRef<HTMLDivElement>(null);
  const isCollapsed = state === "collapsed";
  const [settled, setSettled] = useState(isCollapsed);
  // Settles once the width transition ends; with none running (reduced motion) at once.
  useEffect(() => {
    const running = desktop.current?.getAnimations() ?? [];
    let cancelled = false;
    async function settle() {
      await Promise.allSettled(
        running.map(async (animation) => await animation.finished)
      );
      // The next toggle cancels this run, and its own run settles it. Any other end, like the
      // column unmounting for the sheet, still settles, so the rail never waits on it.
      if (!cancelled) {
        setSettled(isCollapsed);
      }
    }
    void settle();
    return () => {
      cancelled = true;
    };
  }, [isCollapsed]);
  const collapsing = isCollapsed && collapsible === "icon";
  const rail = collapsing && settled;
  const tooltipSide: "left" | "right" = side === "right" ? "left" : "right";
  const railState = useMemo(
    () => ({ collapsing, rail, tooltipSide }),
    [collapsing, rail, tooltipSide]
  );
  // On the sidebar itself, not the provider, so it reaches into the mobile sheet's portal.
  const sectionChange = sectionChanging ? "" : undefined;

  if (collapsible === "none") {
    return (
      <div
        data-section-change={sectionChange}
        data-slot="sidebar"
        {...props}
        {...stylex.props(styles.static, sx)}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile}>
        <SheetContent
          data-mobile
          data-section-change={sectionChange}
          data-slot="sidebar"
          showCloseButton={false}
          side={side}
          sx={[styles.sheet, sx]}
        >
          <SheetTitle sx={styles.hidden}>Sidebar</SheetTitle>
          <SheetDescription sx={styles.hidden}>
            Displays the mobile sidebar.
          </SheetDescription>
          <InSheetContext value>{children}</InSheetContext>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-collapsible={isCollapsed ? collapsible : undefined}
      data-expanding={
        (collapsible === "icon" && !isCollapsed && settled) || undefined
      }
      data-rail={rail || undefined}
      data-section-change={sectionChange}
      data-side={side}
      data-slot="sidebar"
      ref={desktop}
      {...props}
      {...stylex.props(
        styles.sidebar,
        side === "right" && styles.sidebarRight,
        isCollapsed && collapsible === "offcanvas" && styles.offcanvas,
        isCollapsed && collapsible === "icon" && styles.icon
      )}
    >
      <div
        data-slot="sidebar-inner"
        {...stylex.props(
          styles.inner,
          side === "right" && styles.innerRight,
          sx
        )}
      >
        <RailContext value={railState}>{children}</RailContext>
      </div>
    </div>
  );
}

/**
 * Collapses the sidebar, or opens it as a sheet on narrow screens; inside the sheet it
 * closes it. Its children default to `SidebarTriggerIcon`; `kbd` follows the label in its
 * tooltip.
 */
function SidebarTrigger({
  "aria-label": ariaLabel,
  children,
  kbd,
  onClick,
  size = "icon",
  variant = "ghost",
  ...props
}: ButtonProps & { kbd?: ReactNode }) {
  const { isMobile, open, setOpenMobile, toggleSidebar } = useSidebar();
  const inSheet = use(InSheetContext);
  const toggleFromKeyboard = use(KeyboardToggleContext);
  const { rail, tooltipSide } = use(RailContext);

  if (inSheet) {
    return (
      <Button
        aria-label={ariaLabel ?? "Close sidebar"}
        data-slot="sidebar-trigger"
        onClick={(event) => {
          onClick?.(event);
          setOpenMobile(false);
        }}
        size={size}
        variant={variant}
        {...props}
      >
        {children ?? <SidebarTriggerIcon />}
      </Button>
    );
  }

  let label = open ? "Collapse sidebar" : "Expand sidebar";
  if (isMobile) {
    label = "Open sidebar";
  }
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-expanded={isMobile ? undefined : open}
            aria-label={ariaLabel ?? label}
            data-slot="sidebar-trigger"
            onClick={(event) => {
              onClick?.(event);
              // Enter or Space: a keyboard toggle, so it skips the animation.
              if (event.detail === 0 && toggleFromKeyboard) {
                toggleFromKeyboard();
              } else {
                toggleSidebar();
              }
            }}
            size={size}
            variant={variant}
            {...props}
          >
            {children ?? <SidebarTriggerIcon />}
          </Button>
        }
      />
      <TooltipContent side={rail ? tooltipSide : "bottom"}>
        {ariaLabel ?? label}
        {kbd}
      </TooltipContent>
    </Tooltip>
  );
}

/** The trigger's glyph for where it is: close in the mobile sheet, a menu below 768px, the sidebar otherwise. */
function SidebarTriggerIcon() {
  const { isMobile } = useSidebar();
  let icon = SidebarLeftIcon;
  if (use(InSheetContext)) {
    icon = Cancel01Icon;
  } else if (isMobile) {
    icon = Menu01Icon;
  }
  return <Glyph icon={icon} />;
}

/**
 * A mark, like your logo, that stands in for `SidebarTriggerIcon` in the icon rail until
 * the trigger is pointed at or focused. Anywhere else it's the icon.
 */
function SidebarTriggerMark({ children }: { children: ReactNode }) {
  if (!use(RailContext).rail) {
    return <SidebarTriggerIcon />;
  }
  return (
    <span {...stylex.props(styles.markStack)}>
      <span {...stylex.props(styles.markLayer, styles.markIdle)}>
        {children}
      </span>
      <span {...stylex.props(styles.markLayer, styles.markActive)}>
        <SidebarTriggerIcon />
      </span>
    </span>
  );
}

function Glyph({ icon }: { icon: typeof SidebarLeftIcon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

/** A strip on the sidebar's edge that toggles it, for the pointer only. */
function SidebarRail({ sx, ...props }: Styled<ComponentProps<"button">>) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      aria-label="Toggle Sidebar"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      type="button"
      {...props}
      {...stylex.props(styles.rail, sx)}
    />
  );
}

function SidebarInset({ sx, ...props }: Styled<ComponentProps<"main">>) {
  return (
    <main
      data-slot="sidebar-inset"
      {...props}
      {...stylex.props(styles.main, sx)}
    />
  );
}

/** Renders its children except in the collapsed icon rail. */
function SidebarExpandedOnly({ children }: { children: ReactNode }) {
  if (use(RailContext).rail) {
    return null;
  }
  return (
    <div
      data-slot="sidebar-expanded-only"
      {...stylex.props(styles.expandedOnly)}
    >
      {children}
    </div>
  );
}

/** `swap`: whether it slides when the section changes. */
type SwapProps = Styled<ComponentProps<"div">> & { swap?: boolean };

/** A row the page's header height: a brand or title first, `SidebarHeaderActions` last. */
function SidebarHeader({ swap = true, sx, ...props }: SwapProps) {
  return (
    <div
      data-slot="sidebar-header"
      {...props}
      {...stylex.props(styles.header, swap && styles.swap, sx)}
    />
  );
}

function SidebarHeaderActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sidebar-header-actions"
      {...props}
      {...stylex.props(styles.headerActions, sx)}
    />
  );
}

function SidebarFooter({ swap = false, sx, ...props }: SwapProps) {
  return (
    <div
      data-slot="sidebar-footer"
      {...props}
      {...stylex.props(styles.footer, swap && styles.swap, sx)}
    />
  );
}

function SidebarSeparator({ sx, ...props }: SeparatorProps) {
  return (
    <Separator
      data-slot="sidebar-separator"
      {...props}
      sx={[styles.separator, sx]}
    />
  );
}

function SidebarContent({ swap = true, sx, ...props }: SwapProps) {
  return (
    <div
      data-slot="sidebar-content"
      {...props}
      {...stylex.props(styles.content, swap && styles.swap, sx)}
    />
  );
}

function SidebarGroup({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sidebar-group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function SidebarGroupLabel({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(props, stylex.props(styles.groupLabel, sx)),
    render,
    state: { slot: "sidebar-group-label" },
  });
}

function SidebarGroupAction({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"button">>) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      { type: "button" },
      props,
      stylex.props(styles.action, styles.groupAction, sx)
    ),
    render,
    state: { slot: "sidebar-group-action" },
  });
}

function SidebarGroupContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sidebar-group-content"
      {...props}
      {...stylex.props(styles.groupContent, sx)}
    />
  );
}

function SidebarMenu({ sx, ...props }: Styled<ComponentProps<"ul">>) {
  return (
    <ul
      data-slot="sidebar-menu"
      {...props}
      {...stylex.props(styles.menu, sx)}
    />
  );
}

function SidebarMenuItem({ sx, ...props }: Styled<ComponentProps<"li">>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      {...props}
      {...stylex.props(styles.menuItem, sx)}
    />
  );
}

const buttonSizeStyles = {
  default: null,
  lg: styles.buttonLg,
  sm: styles.buttonSm,
} satisfies Record<SidebarMenuButtonSize, stylex.StyleXStyles | null>;

/**
 * A row in the menu. `isActive` marks the current page; `tooltip` names it in the icon
 * rail, and whenever its `SidebarMenuLabel` is cut off.
 */
function SidebarMenuButton({
  isActive = false,
  render,
  size = "default",
  sx,
  tooltip,
  variant = "default",
  withEnd = false,
  ...props
}: Styled<useRender.ComponentProps<"button">> & {
  isActive?: boolean;
  size?: SidebarMenuButtonSize;
  tooltip?: ReactNode;
  variant?: SidebarMenuButtonVariant;
  /** Leaves room for a `SidebarMenuBadge` at its end. */
  withEnd?: boolean;
}) {
  const { rail, tooltipSide } = use(RailContext);
  const [truncated, setTruncated] = useState(false);
  const button = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      props,
      stylex.props(
        styles.button,
        variant === "outline" && styles.buttonOutline,
        buttonSizeStyles[size],
        withEnd && styles.buttonWithEnd,
        sx
      )
    ),
    render: tooltip === undefined ? render : <TooltipTrigger render={render} />,
    // Base UI writes state as data attributes: `data-slot`, `data-size`, `data-active`.
    state: { active: isActive, size, slot: "sidebar-menu-button" },
  });

  if (tooltip === undefined) {
    return <LabelContext value={null}>{button}</LabelContext>;
  }

  return (
    <LabelContext value={setTruncated}>
      <Tooltip disabled={!(rail || truncated)}>
        {button}
        <TooltipContent align="center" side={tooltipSide}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </LabelContext>
  );
}

/** A row's label: fades at the edge when cut off, and out as the sidebar narrows to its icons. */
function SidebarMenuLabel({ sx, ...props }: Styled<ComponentProps<"span">>) {
  const { rail } = use(RailContext);
  const { ref, truncated } = useTruncated(!rail);
  return (
    <span
      data-slot="sidebar-menu-label"
      data-truncated={truncated || undefined}
      ref={ref}
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

/** A row's shortcut, after its label; shown while the row is pointed at or focused. */
function SidebarMenuKbd({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      aria-hidden
      data-slot="sidebar-menu-kbd"
      {...props}
      {...stylex.props(styles.kbd, sx)}
    />
  );
}

function SidebarMenuAction({
  render,
  showOnHover = false,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"button">> & { showOnHover?: boolean }) {
  const marker = {
    "data-show-on-hover": showOnHover ? "" : undefined,
    "data-sidebar-menu-action": "",
    type: "button" as const,
  };
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      marker,
      props,
      stylex.props(
        styles.action,
        styles.menuAction,
        showOnHover && styles.onHover,
        sx
      )
    ),
    render,
    state: { slot: "sidebar-menu-action" },
  });
}

function SidebarMenuBadge({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      {...props}
      {...stylex.props(styles.badge, sx)}
    />
  );
}

/** A row's shape while its label loads. */
function SidebarMenuSkeleton({
  showIcon = false,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & { showIcon?: boolean }) {
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      {...props}
      {...stylex.props(styles.skeleton, sx)}
    >
      {showIcon && <Skeleton sx={styles.skeletonIcon} />}
      <Skeleton sx={styles.skeletonText} />
    </div>
  );
}

function SidebarMenuSub({ sx, ...props }: Styled<ComponentProps<"ul">>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      inert={use(RailContext).collapsing}
      {...props}
      {...stylex.props(styles.sub, sx)}
    />
  );
}

function SidebarMenuSubItem({ sx, ...props }: Styled<ComponentProps<"li">>) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      {...props}
      {...stylex.props(styles.menuItem, sx)}
    />
  );
}

function SidebarMenuSubButton({
  isActive = false,
  render,
  size = "default",
  sx,
  ...props
}: Styled<useRender.ComponentProps<"a">> & {
  isActive?: boolean;
  size?: "sm" | "default";
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      props,
      stylex.props(styles.subButton, size === "sm" && styles.subButtonSm, sx)
    ),
    render,
    state: { active: isActive, size, slot: "sidebar-menu-sub-button" },
  });
}

export {
  Sidebar,
  sidebarCollapsibles,
  SidebarContent,
  SidebarExpandedOnly,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarHeaderActions,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  sidebarMenuButtonSizes,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuKbd,
  SidebarMenuLabel,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  sidebarSectionDirections,
  SidebarSeparator,
  sidebarSides,
  SidebarTrigger,
  SidebarTriggerIcon,
  SidebarTriggerMark,
  useSidebar,
};
export type {
  SidebarCollapsible,
  SidebarMenuButtonSize,
  SidebarMenuButtonVariant,
  SidebarSectionDirection,
  SidebarSide,
};
