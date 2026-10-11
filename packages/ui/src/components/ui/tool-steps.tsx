"use client";

import {
  Alert02Icon,
  ArrowRight01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Shimmer } from "@/components/ui/shimmer";
import { Spinner } from "@/components/ui/spinner";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const toolStepStatuses = ["running", "done", "failed"] as const;

type ToolStepStatus = (typeof toolStepStatuses)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const Status = createContext<ToolStepStatus>("done");

const statusLabels = {
  done: "Done",
  failed: "Failed",
  running: "Running",
} satisfies Record<ToolStepStatus, string>;

const open = ":is([data-panel-open] > *)";
const instant = ":is([data-collapsible-instant] > *)";
const rtl = ":is([dir='rtl'] *)";
const gap = space.xs;
// Through the middle of the status column, under the trigger's icon.
const railStart = `calc(${sizes.icon} / 2 - ${strokes.border} / 2)`;
// How far the rail reaches into a row: to its mark, less a gap around it.
const reach = `calc((${sizes.controlSm} - ${sizes.icon}) / 2 - ${space.xxs})`;

const rail = {
  backgroundColor: colors.edge,
  content: "''",
  insetInlineStart: railStart,
  position: "absolute",
  width: strokes.border,
} as const;

const styles = stylex.create({
  // Copied in reasoning.tsx and tool-steps.tsx, so each installs alone; change both.
  trigger: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: {
      default: colors.textSecondary,
      [media.hover]: { default: null, ":hover": colors.textPrimary },
    },
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    gap: space.xs,
    height: sizes.controlSm,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    // The rail's start, under the icon, while the panel below is open.
    "::after": {
      ...rail,
      content: { default: "none", ":is([data-panel-open])": "''" },
      height: reach,
      insetBlockEnd: 0,
    },
  },
  // Turns a quarter as its list opens; snaps when the keyboard opened it.
  chevron: {
    color: {
      default: colors.textMuted,
      [media.hover]: { default: null, ":is(:hover > *)": colors.textPrimary },
    },
    display: "flex",
    flexShrink: 0,
    transform: {
      default: "none",
      [open]: "rotate(90deg)",
      [rtl]: "scaleX(-1)",
      [`${open}${rtl}`]: "scaleX(-1) rotate(90deg)",
    },
    transitionDuration: {
      default: durations.move,
      [instant]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "color, transform",
    transitionTimingFunction: easings.out,
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap,
    paddingBlockStart: gap,
  },
  // Threads each step to the mark above it, the first to the trigger's icon.
  step: {
    position: "relative",
    "::before": {
      ...rail,
      height: {
        default: `calc(${gap} + ${reach} * 2)`,
        ":first-child": `calc(${gap} + ${reach})`,
      },
      insetBlockStart: {
        default: `calc(-1 * (${gap} + ${reach}))`,
        // From the panel's top, which clips; the trigger draws the rest.
        ":first-child": `calc(-1 * ${gap})`,
      },
    },
    // Down from its mark past its results; no length while they're closed.
    "::after": {
      ...rail,
      insetBlockEnd: reach,
      insetBlockStart: `calc(${sizes.controlSm} - ${reach})`,
    },
  },
  row: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
    height: sizes.controlSm,
    maxWidth: "100%",
    minWidth: 0,
  },
  rowTrigger: {
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    cursor: "pointer",
    fontFamily: "inherit",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    textAlign: "start",
    width: "100%",
  },
  // One column for the mark, so a spinner, a tick and an alert sit alike.
  status: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    width: sizes.icon,
  },
  failed: {
    color: colors.danger,
  },
  media: {
    alignItems: "center",
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    display: "flex",
    flexShrink: 0,
    height: sizes.iconLg,
    justifyContent: "center",
    width: sizes.iconLg,
  },
  // Gives way only once the description is cut to nothing.
  title: {
    fontWeight: fontWeights.medium,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    color: colors.textMuted,
    // Heavy enough that the title's share of a squeeze rounds to nothing.
    flexShrink: 10_000,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // Under the step's title, beside its rail.
  results: {
    lineHeight: lineHeights.text,
    paddingBlockStart: space.xxs,
    paddingInlineStart: `calc(${sizes.icon} + ${space.xs})`,
  },
  hidden: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
});

function Chevron() {
  return (
    <span {...stylex.props(styles.chevron)}>
      <HugeiconsIcon
        aria-hidden
        icon={ArrowRight01Icon}
        size={sizes.iconSm}
        strokeWidth={Number(strokes.icon)}
      />
    </span>
  );
}

/** The tool calls a run makes before it answers, closed to one line. */
function ToolSteps({
  sx,
  ...props
}: Styled<ComponentProps<typeof Collapsible>>) {
  return (
    <Collapsible data-slot="tool-steps" {...props} {...stylex.props(sx)} />
  );
}

/** The line that opens the list; pass its label ("Used 3 tools"). */
function ToolStepsTrigger({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsibleTrigger>> & {
  children?: ReactNode;
}) {
  return (
    <CollapsibleTrigger
      data-slot="tool-steps-trigger"
      {...props}
      {...stylex.props(styles.trigger, sx)}
    >
      {children}
      <Chevron />
    </CollapsibleTrigger>
  );
}

function ToolStepsContent({
  children,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent data-slot="tool-steps-content" {...props}>
      <div {...stylex.props(styles.steps)}>{children}</div>
    </CollapsibleContent>
  );
}

/** One tool call. A step with results opens like the list does. */
function ToolStep({
  status = "done",
  sx,
  ...props
}: Styled<ComponentProps<typeof Collapsible>> & { status?: ToolStepStatus }) {
  return (
    <Status value={status}>
      <Collapsible
        data-slot="tool-step"
        data-status={status}
        {...props}
        {...stylex.props(styles.step, sx)}
      />
    </Status>
  );
}

/** The step's row, for a step with nothing to open. */
function ToolStepHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="tool-step-header"
      {...props}
      {...stylex.props(styles.row, sx)}
    />
  );
}

/** The step's row as a button that opens its results. */
function ToolStepTrigger({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsibleTrigger>> & {
  children?: ReactNode;
}) {
  return (
    <CollapsibleTrigger
      data-slot="tool-step-trigger"
      {...props}
      {...stylex.props(styles.row, styles.rowTrigger, sx)}
    >
      {children}
      <Chevron />
    </CollapsibleTrigger>
  );
}

/** The status mark, named for screen readers. */
function ToolStepIndicator({ sx, ...props }: Styled<ComponentProps<"span">>) {
  const status = use(Status);
  return (
    <span
      data-slot="tool-step-indicator"
      {...props}
      {...stylex.props(styles.status, status === "failed" && styles.failed, sx)}
    >
      <SwapIcon value={status}>
        <SwapIconItem value="running">
          <Spinner aria-hidden aria-label={undefined} />
        </SwapIconItem>
        <SwapIconItem value="done">
          <HugeiconsIcon
            aria-hidden
            icon={Tick02Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
        <SwapIconItem value="failed">
          <HugeiconsIcon
            aria-hidden
            icon={Alert02Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
      </SwapIcon>
      <span {...stylex.props(styles.hidden)}>{statusLabels[status]}</span>
    </span>
  );
}

/** A small tile for the tool's icon. */
function ToolStepMedia({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      aria-hidden
      data-slot="tool-step-media"
      {...props}
      {...stylex.props(styles.media, sx)}
    />
  );
}

/** The tool's name; it shimmers while the step runs. */
function ToolStepTitle({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"span">>) {
  const running = use(Status) === "running";
  return (
    <span
      data-slot="tool-step-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    >
      {running ? <Shimmer>{children}</Shimmer> : children}
    </span>
  );
}

/** What the tool looked at or why it failed; cut short on one line. */
function ToolStepDescription({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="tool-step-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

/** What the step returned, under its title on the rail. */
function ToolStepContent({
  children,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent data-slot="tool-step-content" {...props}>
      <div {...stylex.props(styles.results)}>{children}</div>
    </CollapsibleContent>
  );
}

export {
  ToolStep,
  ToolStepContent,
  ToolStepDescription,
  ToolStepHeader,
  ToolStepMedia,
  ToolStepIndicator,
  ToolSteps,
  ToolStepsContent,
  ToolStepsTrigger,
  ToolStepTitle,
  ToolStepTrigger,
  toolStepStatuses,
};
export type { ToolStepStatus };
