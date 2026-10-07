"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  media,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  tabs: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  list: {
    backgroundClip: "padding-box",
    borderColor: colors.edge,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: strokes.border,
    display: "flex",
    // With the border, the tabs sit `space.xxs` in, so the corners stay concentric.
    padding: `calc(${space.xxs} - ${strokes.border})`,
    position: "relative",
    width: "fit-content",
  },
  tab: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: radii.sm,
    borderWidth: 0,
    color: {
      default: colors.textSecondary,
      ":is([data-active])": colors.textPrimary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover": colors.textPrimary,
        ":is([data-active])": colors.textPrimary,
      },
    },
    cursor: "pointer",
    display: "inline-flex",
    flexGrow: 1,
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    height: sizes.controlSm,
    justifyContent: "center",
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
  indicator: {
    backgroundColor: colors.fill,
    borderRadius: radii.sm,
    height: "var(--active-tab-height)",
    insetBlockStart: "var(--active-tab-top)",
    insetInlineStart: 0,
    position: "absolute",
    transform: "translateX(var(--active-tab-left))",
    // Arrow keys move focus visibly and a click doesn't, so only the pointer slides it.
    transitionDuration: {
      default: durations.move,
      ":is([data-slot='tabs-list']:has(:focus-visible) > *)": "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "transform, width",
    transitionTimingFunction: easings.inOut,
    width: "var(--active-tab-width)",
  },
});

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
  sx,
  ...props
}: Styled<TabsPrimitive.List.Props>) {
  return (
    <TabsPrimitive.List
      // Panels show at once, so arrows switch tabs instead of only moving focus.
      activateOnFocus
      data-slot="tabs-list"
      {...props}
      {...stylex.props(styles.list, sx)}
    >
      {children}
      <TabsIndicator />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ sx, ...props }: Styled<TabsPrimitive.Tab.Props>) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      {...props}
      {...stylex.props(styles.tab, sx)}
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

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
