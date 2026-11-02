"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useLayoutEffect, useMemo, useRef } from "react";

import { scrollFade } from "@/lib/constella/scroll-fade";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const tabsListVariants = ["default", "line"] as const;
const tabsListSizes = ["sm", "default", "lg"] as const;

type TabsListVariant = (typeof tabsListVariants)[number];
type TabsListSize = (typeof tabsListSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type TabsListProps = Styled<TabsPrimitive.List.Props> & {
  size?: TabsListSize;
  variant?: TabsListVariant;
};

const vertical = ":is([data-orientation='vertical'])";

const besideColumn = ":is([data-slot='tabs'][data-orientation='vertical'] > *)";

const styles = stylex.create({
  tabs: {
    display: "flex",
    flexDirection: { default: "column", [vertical]: "row" },
    flexWrap: { default: null, [vertical]: "wrap" },
    gap: space.sm,
  },
  // Beside a column of tabs while it has a menu's width, under it once it hasn't.
  panel: {
    flexBasis: { default: null, [besideColumn]: 0 },
    flexGrow: { default: null, [besideColumn]: 1 },
    minWidth: { default: null, [besideColumn]: sizes.menu },
  },
  // A row too long for its container scrolls, fading the edge with more past it; a picked tab
  // scrolls in clear of the fade.
  list: {
    display: "flex",
    flexDirection: { default: "row", [vertical]: "column" },
    flexShrink: 0,
    maxWidth: "100%",
    overflowX: { default: "auto", [vertical]: "visible" },
    position: "relative",
    scrollPaddingInline: { default: space.xl, [vertical]: null },
    scrollbarWidth: { default: "none", [vertical]: "auto" },
    width: "fit-content",
  },
  // A tinted pill slides between tabs, with no track around them.
  listDefault: {
    gap: 0,
  },
  // An accent line slides along a faint baseline: under the row, beside the column.
  // The row's baseline is an inset shadow in its padding, not a border, so the scrolling list
  // doesn't clip the indicator that covers it.
  listLine: {
    boxShadow: {
      default: `inset 0 calc(-1 * ${strokes.border}) ${colors.borderSubtle}`,
      [vertical]: "none",
    },
    paddingBlockEnd: { default: strokes.border, [vertical]: 0 },
    borderInlineStartColor: colors.borderSubtle,
    borderInlineStartStyle: { default: "none", [vertical]: "solid" },
    borderInlineStartWidth: { default: 0, [vertical]: strokes.border },
  },
  tab: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
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
    fontWeight: fontWeights.semimedium,
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
    gap: space.xxs,
    height: sizes.controlXs,
    paddingInline: space.popup,
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
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: "var(--active-tab-height)",
    transform: "translate(var(--active-tab-left), var(--active-tab-top))",
    width: "var(--active-tab-width)",
  },
  // Over the baseline, so the active tab's line replaces it.
  indicatorLine: {
    backgroundColor: colors.accentSolid,
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
      default: `calc(100% - ${strokes.indicator})`,
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
  sm: [typeStyles.textSm, styles.tabSm],
} satisfies Record<TabsListSize, stylex.StyleXStyles | null>;

const TabsListContext = createContext<{
  size: TabsListSize;
  variant: TabsListVariant;
}>({ size: "default", variant: "default" });

// A column's list stays unmasked: a mask would clip the line indicator drawn just outside it.
const TabsOrientationContext =
  createContext<TabsPrimitive.Root.Orientation>("horizontal");

// Scrolls the list, never the page, until the tab clears its edges by the list's scroll padding.
const reveal = (list: HTMLElement, tab: HTMLElement) => {
  const style = getComputedStyle(list);
  const [left, right] = [style.scrollPaddingLeft, style.scrollPaddingRight].map(
    // oxlint-disable-next-line unicorn/prefer-number-coercion -- `Number("48px")` is NaN
    (padding) => Number.parseFloat(padding)
  );
  list.scrollLeft = Math.min(
    Math.max(
      list.scrollLeft,
      tab.offsetLeft + tab.offsetWidth + right - list.clientWidth
    ),
    tab.offsetLeft - left
  );
};

function Tabs({
  orientation = "horizontal",
  sx,
  ...props
}: Styled<TabsPrimitive.Root.Props>) {
  return (
    <TabsOrientationContext value={orientation}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        {...props}
        {...stylex.props(styles.tabs, sx)}
      />
    </TabsOrientationContext>
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
  const orientation = use(TabsOrientationContext);
  const list = useRef<HTMLDivElement>(null);

  // However a tab is picked (arrows, a click, a value set from elsewhere), it scrolls into view.
  useLayoutEffect(() => {
    const element = list.current;
    const picks = new MutationObserver((records) => {
      for (const { target } of records) {
        if (
          element !== null &&
          target instanceof HTMLElement &&
          target.ariaSelected === "true"
        ) {
          // Next frame: a router that keeps the value in the URL restores the list's old scroll after the pick renders.
          requestAnimationFrame(() => {
            reveal(element, target);
          });
        }
      }
    });
    if (element !== null && orientation === "horizontal") {
      picks.observe(element, {
        attributeFilter: ["aria-selected"],
        subtree: true,
      });
    }
    return () => {
      picks.disconnect();
    };
  }, [orientation]);

  return (
    <TabsListContext value={context}>
      <TabsPrimitive.List
        // Panels show at once, so arrows switch tabs instead of only moving focus.
        activateOnFocus
        data-size={size}
        data-slot="tabs-list"
        data-variant={variant}
        ref={list}
        {...props}
        {...stylex.props(
          styles.list,
          listVariantStyles[variant],
          orientation === "horizontal" && scrollFade.x,
          sx
        )}
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
        [typeStyles.textSm, styles.tab],
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
      {...stylex.props(styles.panel, sx)}
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
