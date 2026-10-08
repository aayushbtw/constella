"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useMemo } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const tabsListVariants = ["default", "line"] as const;
const tabsListSizes = ["sm", "default", "lg"] as const;

type TabsListVariant = (typeof tabsListVariants)[number];
type TabsListSize = (typeof tabsListSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type TabsListProps = Styled<TabsPrimitive.List.Props> & {
  size?: TabsListSize;
  variant?: TabsListVariant;
};

const vertical = ":is([data-orientation='vertical'])";

// shadcn's padding, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  tabs: {
    display: "flex",
    flexDirection: { default: "column", [vertical]: "row" },
    gap: space.sm,
  },
  list: {
    display: "flex",
    flexDirection: { default: "row", [vertical]: "column" },
    position: "relative",
    width: "fit-content",
  },
  // A tinted pill slides between tabs inside a bordered track.
  listDefault: {
    backgroundClip: "padding-box",
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    borderBlockEndColor: colors.edge,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartColor: colors.edge,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    borderInlineEndColor: colors.edge,
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: strokes.border,
    borderInlineStartColor: colors.edge,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    // With the border, the tabs sit `space.xxs` in, so the corners stay concentric.
    paddingBlock: `calc(${space.xxs} - ${strokes.border})`,
    paddingInline: `calc(${space.xxs} - ${strokes.border})`,
  },
  // An accent line slides along a faint baseline: under the row, beside the column.
  listLine: {
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: { default: "solid", [vertical]: "none" },
    borderBlockEndWidth: { default: strokes.border, [vertical]: 0 },
    borderInlineStartColor: colors.edgeSubtle,
    borderInlineStartStyle: { default: "none", [vertical]: "solid" },
    borderInlineStartWidth: { default: 0, [vertical]: strokes.border },
  },
  tab: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: {
      default: colors.textSecondary,
      ":is([data-active])": colors.textPrimary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover:not([data-disabled])": colors.textPrimary,
        ":is([data-active])": colors.textPrimary,
      },
      ":active:not([data-disabled])": colors.textPrimary,
    },
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    flexGrow: { default: 1, [vertical]: 0 },
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    height: sizes.controlSm,
    justifyContent: { default: "center", [vertical]: "flex-start" },
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    paddingInline: space.sm,
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    whiteSpace: "nowrap",
    zIndex: 1,
  },
  tabSm: {
    fontSize: fontSizes.xs,
    gap: space.xxs,
    height: sizes.controlXs,
    paddingInline: px10,
  },
  tabLg: {
    height: sizes.controlMd,
  },
  // Line tabs sit on the baseline, so they take the list's height, not a pill's corners.
  tabLine: {
    borderStartStartRadius: 0,
    borderStartEndRadius: 0,
    borderEndStartRadius: 0,
    borderEndEndRadius: 0,
  },
  // Base UI measures from the physical left, so the indicator anchors there too.
  indicator: {
    left: 0,
    position: "absolute",
    top: 0,
    // Arrow keys move focus visibly and a click doesn't, so only the pointer slides it.
    transitionDuration: {
      default: durations.move,
      ":is([data-slot='tabs-list']:has(:focus-visible) > *)": "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "transform, width, height",
    transitionTimingFunction: easings.inOut,
  },
  indicatorDefault: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    height: "var(--active-tab-height)",
    transform: "translate(var(--active-tab-left), var(--active-tab-top))",
    width: "var(--active-tab-width)",
  },
  // Over the baseline, so the active tab's line replaces it.
  indicatorLine: {
    backgroundColor: colors.accent,
    height: {
      default: strokes.indicator,
      [vertical]: "var(--active-tab-height)",
    },
    insetInlineStart: {
      default: null,
      [vertical]: `calc(-1 * ${strokes.border})`,
    },
    left: { default: 0, [vertical]: null },
    top: {
      default: `calc(100% - ${strokes.indicator} + ${strokes.border})`,
      [vertical]: 0,
    },
    transform: {
      default: "translateX(var(--active-tab-left))",
      [vertical]: "translateY(var(--active-tab-top))",
    },
    width: {
      default: "var(--active-tab-width)",
      [vertical]: strokes.indicator,
    },
  },
});

const listVariantStyles = {
  default: styles.listDefault,
  line: styles.listLine,
} satisfies Record<TabsListVariant, stylex.StyleXStyles>;

const indicatorVariantStyles = {
  default: styles.indicatorDefault,
  line: styles.indicatorLine,
} satisfies Record<TabsListVariant, stylex.StyleXStyles>;

const tabSizeStyles = {
  default: null,
  lg: styles.tabLg,
  sm: styles.tabSm,
} satisfies Record<TabsListSize, stylex.StyleXStyles | null>;

const TabsListContext = createContext<{
  size: TabsListSize;
  variant: TabsListVariant;
}>({ size: "default", variant: "default" });

function Tabs({ sx, ...props }: Styled<TabsPrimitive.Root.Props>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      {...props}
      {...stylex.props(styles.tabs, sx)}
    />
  );
}

/** Renders the list and the indicator that slides between its tabs. */
function TabsList({
  children,
  size = "default",
  sx,
  variant = "default",
  ...props
}: TabsListProps) {
  const context = useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <TabsListContext value={context}>
      <TabsPrimitive.List
        // Panels show at once, so arrows switch tabs instead of only moving focus.
        activateOnFocus
        data-size={size}
        data-slot="tabs-list"
        data-variant={variant}
        {...props}
        {...stylex.props(styles.list, listVariantStyles[variant], sx)}
      >
        {children}
        <TabsIndicator sx={indicatorVariantStyles[variant]} />
      </TabsPrimitive.List>
    </TabsListContext>
  );
}

function TabsTrigger({ sx, ...props }: Styled<TabsPrimitive.Tab.Props>) {
  const { size, variant } = use(TabsListContext);
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      {...props}
      {...stylex.props(
        styles.tab,
        tabSizeStyles[size],
        variant === "line" && styles.tabLine,
        sx
      )}
    />
  );
}

function TabsIndicator({
  sx,
  ...props
}: Styled<TabsPrimitive.Indicator.Props>) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      renderBeforeHydration
      {...props}
      {...stylex.props(styles.indicator, sx)}
    />
  );
}

function TabsContent({ sx, ...props }: Styled<TabsPrimitive.Panel.Props>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      {...props}
      {...stylex.props(sx)}
    />
  );
}

export {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  tabsListSizes,
  tabsListVariants,
  TabsTrigger,
};
export type { TabsListProps, TabsListSize, TabsListVariant };
