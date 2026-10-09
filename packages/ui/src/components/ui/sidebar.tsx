"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ComponentProps } from "react";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  media,
  opacities,
  presses,
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

const collapsed = ":is([data-slot='sidebar'][data-state='collapsed'] *)";
const inSectionChange = ":is([data-section-change] *)";
const iconOnly = ":is([data-slot='sidebar'][data-collapsible='icon'] *)";
const highlighted = ":is([data-active])";
const pressable = ":not(:disabled, [aria-disabled='true'])";

// A row's hover and press take `fillSubtle`; the current one stays a step above, on `fill`.
const rowFill = {
  default: "transparent",
  [media.hover]: {
    default: "transparent",
    [`:hover${pressable}:not([data-active])`]: colors.fillSubtle,
    [highlighted]: colors.fill,
  },
  [`:active${pressable}:not([data-active])`]: colors.fillSubtle,
  [highlighted]: colors.fill,
};

// shadcn's padding, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;

const styles = stylex.create({
  wrapper: {
    display: "flex",
    minHeight: "100svh",
    width: "100%",
  },
  // In the flow and sticky, so it sits beside the content and fills the window's height.
  sidebar: {
    color: colors.textPrimary,
    display: { default: "none", [media.md]: "block" },
    flexShrink: 0,
    height: "100svh",
    insetBlockStart: 0,
    maxHeight: "100%",
    overflow: "hidden",
    position: "sticky",
    transitionDuration: {
      default: durations.layout,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "width",
    transitionTimingFunction: easings.layout,
    width: sizes.sidebar,
  },
  offcanvas: { width: 0 },
  icon: { width: sizes.sidebarIcon },
  // Keeps its full width while the sidebar narrows, so its content is clipped, not reflowed.
  inner: {
    backgroundColor: colors.sidebar,
    borderInlineEndColor: colors.edgeSubtle,
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: strokes.border,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    width: sizes.sidebar,
  },
  innerRight: {
    borderInlineEndWidth: 0,
    borderInlineStartColor: colors.edgeSubtle,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    marginInlineStart: "auto",
  },
  innerIcon: {
    width: { default: sizes.sidebar, [collapsed]: sizes.sidebarIcon },
  },
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
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
  // Named only while its own sidebar changes section; base.css slides the snapshots.
  swap: {
    viewTransitionClass: { default: null, [inSectionChange]: "sidebar-swap" },
    viewTransitionName: { default: null, [inSectionChange]: "match-element" },
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    minHeight: 0,
    overflowX: "hidden",
    overflowY: { default: "auto", [iconOnly]: "hidden" },
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
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    position: "relative",
    width: "100%",
  },
  // Folds away as the sidebar narrows to its icons.
  groupLabel: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.medium,
    height: sizes.controlMd,
    marginBlockStart: {
      default: 0,
      [iconOnly]: `calc(-1 * ${sizes.controlMd})`,
    },
    opacity: { default: 1, [iconOnly]: 0 },
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    transitionDuration: durations.layout,
    transitionProperty: "margin, opacity",
    transitionTimingFunction: easings.layout,
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
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    color: colors.textSecondary,
    cursor: "pointer",
    display: { default: "flex", [iconOnly]: "none" },
    height: sizes.controlXxs,
    justifyContent: "center",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "absolute",
    width: sizes.controlXxs,
  },
  groupAction: {
    insetBlockStart: `calc(${space.xs} + (${sizes.controlMd} - ${sizes.controlXxs}) / 2)`,
    insetInlineEnd: `calc(${space.xs} + ${space.xxs})`,
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
    boxSizing: "border-box",
    color: colors.textPrimary,
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    fontWeight: {
      default: fontWeights.regular,
      [highlighted]: fontWeights.medium,
    },
    gap: space.xs,
    height: sizes.controlMd,
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
    transform: { default: null, [`:active${pressable}`]: presses.row },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
    whiteSpace: "nowrap",
    width: { default: "100%", [iconOnly]: sizes.controlMd },
  },
  // Room on the end for an action or badge.
  buttonWithEnd: {
    paddingInlineEnd: {
      default: `calc(${space.xs} + ${sizes.controlXxs} + ${space.xxs})`,
      [iconOnly]: space.xs,
    },
  },
  buttonOutline: {
    backgroundColor: colors.background,
    boxShadow: `0 0 0 ${strokes.border} ${colors.edge}`,
  },
  buttonSm: { fontSize: fontSizes.xs, height: sizes.controlSm },
  buttonLg: {
    height: { default: sizes.media, [iconOnly]: sizes.controlMd },
    paddingInlineEnd: { default: space.xs, [iconOnly]: 0 },
    paddingInlineStart: { default: space.xs, [iconOnly]: 0 },
  },
  menuAction: {
    insetBlockStart: `calc((${sizes.controlMd} - ${sizes.controlXxs}) / 2)`,
    insetInlineEnd: space.xxs,
  },
  // Shown while its row is hovered or focused, or while its menu is open.
  onHover: {
    opacity: {
      default: 1,
      [media.hover]: {
        default: 0,
        ":is([data-slot='sidebar-menu-item']:hover *, [data-slot='sidebar-menu-item']:focus-within *)": 1,
        ":is([aria-expanded='true'])": 1,
      },
    },
  },
  badge: {
    alignItems: "center",
    color: colors.textSecondary,
    display: { default: "flex", [iconOnly]: "none" },
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.medium,
    height: sizes.controlXxs,
    insetBlockStart: `calc((${sizes.controlMd} - ${sizes.controlXxs}) / 2)`,
    insetInlineEnd: space.xxs,
    justifyContent: "center",
    minWidth: sizes.controlXxs,
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
    display: { default: "flex", [iconOnly]: "none" },
    flexDirection: "column",
    gap: space.xxxs,
    listStyleType: "none",
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: px6,
    // Under the parent row's icon.
    marginInlineStart: `calc(${space.xs} + ${sizes.icon} / 2)`,
    minWidth: 0,
    paddingBlockEnd: space.xxxs,
    paddingBlockStart: space.xxxs,
    paddingInlineEnd: 0,
    paddingInlineStart: px6,
  },
  subButton: {
    alignItems: "center",
    backgroundColor: rowFill,
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
  const open = openProp ?? ownOpen;

  const setOpen = useCallback(
    (next: boolean) => {
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
        toggleSidebar();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [toggleSidebar]);

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
      <div
        data-slot="sidebar-wrapper"
        {...props}
        {...stylex.props(styles.wrapper, sx)}
      />
    </SidebarContext>
  );
}

function Sidebar({
  children,
  collapsible = "offcanvas",
  side = "left",
  sx,
  ...props
}: Styled<ComponentProps<"div">> & {
  collapsible?: SidebarCollapsible;
  side?: SidebarSide;
}) {
  const { isMobile, openMobile, sectionChanging, setOpenMobile, state } =
    useSidebar();
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
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  const isCollapsed = state === "collapsed";
  return (
    <div
      data-collapsible={isCollapsed ? collapsible : undefined}
      data-section-change={sectionChange}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      {...props}
      {...stylex.props(
        styles.sidebar,
        isCollapsed && collapsible === "offcanvas" && styles.offcanvas,
        isCollapsed && collapsible === "icon" && styles.icon
      )}
    >
      <div
        data-slot="sidebar-inner"
        {...stylex.props(
          styles.inner,
          side === "right" && styles.innerRight,
          collapsible === "icon" && styles.innerIcon,
          sx
        )}
      >
        {children}
      </div>
    </div>
  );
}

function SidebarTrigger({
  "aria-label": label = "Toggle Sidebar",
  onClick,
  size = "icon-sm",
  variant = "ghost",
  ...props
}: ButtonProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      aria-label={label}
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size={size}
      variant={variant}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={SidebarLeftIcon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </Button>
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

/** `swap`: whether it slides when the section changes. */
type SwapProps = Styled<ComponentProps<"div">> & { swap?: boolean };

function SidebarHeader({ swap = true, sx, ...props }: SwapProps) {
  return (
    <div
      data-slot="sidebar-header"
      {...props}
      {...stylex.props(styles.section, swap && styles.swap, sx)}
    />
  );
}

function SidebarFooter({ swap = false, sx, ...props }: SwapProps) {
  return (
    <div
      data-slot="sidebar-footer"
      {...props}
      {...stylex.props(styles.section, swap && styles.swap, sx)}
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

/** A row in the menu. `isActive` marks the current page; `tooltip` names it while collapsed to icons. */
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
  tooltip?: string;
  variant?: SidebarMenuButtonVariant;
  /** Leaves room for a `SidebarMenuAction` or `SidebarMenuBadge` at its end. */
  withEnd?: boolean;
}) {
  const { isMobile, state } = useSidebar();
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
    return button;
  }

  return (
    <Tooltip disabled={state !== "collapsed" || isMobile}>
      {button}
      <TooltipContent align="center" side="right">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarMenuAction({
  render,
  showOnHover = false,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"button">> & { showOnHover?: boolean }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      { type: "button" },
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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  sidebarMenuButtonSizes,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  sidebarSectionDirections,
  sidebarSides,
  SidebarTrigger,
  useSidebar,
};
export type {
  SidebarCollapsible,
  SidebarMenuButtonSize,
  SidebarMenuButtonVariant,
  SidebarSectionDirection,
  SidebarSide,
};
