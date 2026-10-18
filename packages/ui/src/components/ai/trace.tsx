"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps } from "react";

import { Shimmer } from "@/components/ai/shimmer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/primitives/collapsible";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  media,
  opacities,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const traceStates = ["running", "error", "pending"] as const;

type TraceState = (typeof traceStates)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const State = createContext<TraceState | undefined>(undefined);

const open = ":is([data-panel-open] > *)";
const instant = ":is([data-collapsible-instant] > *)";
const rtl = ":is([dir='rtl'] *)";
const inAction = ":is(a > *, button > *)";
const hovered = ":is(a:hover > *, button:hover > *)";
const pressed = ":is(a:active > *, button:active > *, [data-popup-open] > *)";
const failed = "[data-state='error']";
// Under the line's icon, stopping `space.xxs` short of it.
const reach = `calc((${sizes.controlSm} - ${sizes.icon}) / 2 - ${space.xxs})`;
const rail = {
  backgroundColor: colors.border,
  content: "''",
  insetInlineStart: `calc(${sizes.icon} / 2 - ${strokes.border} / 2)`,
  position: "absolute",
  width: strokes.border,
} as const;

const styles = stylex.create({
  trace: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    minWidth: 0,
    width: "100%",
  },
  action: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: "inherit",
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    maxWidth: "100%",
    minWidth: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    textAlign: "start",
    textDecorationLine: "none",
    width: "fit-content",
  },
  line: {
    alignItems: "center",
    color: {
      default: colors.textSecondary,
      [media.hover]: { default: null, [hovered]: colors.textPrimary },
      [pressed]: colors.textPrimary,
    },
    cursor: { default: null, [inAction]: "pointer" },
    display: "flex",
    gap: space.xs,
    height: sizes.controlSm,
    maxWidth: "100%",
    minWidth: 0,
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    width: "fit-content",
  },
  error: {
    color: colors.dangerText,
  },
  pending: {
    opacity: opacities.disabled,
  },
  icon: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    marginInlineStart: {
      default: null,
      ":is([data-slot='trace-title'] ~ *)": `calc(-1 * ${space.xxs})`,
    },
    width: sizes.icon,
  },
  title: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    color: colors.textMuted,
    flexShrink: 0,
    fontVariantNumeric: "tabular-nums",
  },
  collapsible: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
  },
  trigger: {
    gap: space.xs,
    position: "relative",
    "::after": {
      ...rail,
      content: { default: "none", ":is([data-panel-open])": "''" },
      height: reach,
      insetBlockEnd: 0,
    },
  },
  chevron: {
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: null,
        [`:is(:hover:not(:has(> ${failed})) > *)`]: colors.textPrimary,
      },
      [`:is(:active:not(:has(> ${failed})) > *)`]: colors.textPrimary,
      [`:is(:has(> ${failed}) > *)`]: colors.dangerText,
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
  content: {
    color: colors.textSecondary,
    minWidth: 0,
    overflowWrap: "break-word",
    paddingBlockStart: space.xxs,
    paddingInlineStart: `calc(${sizes.icon} + ${space.xs})`,
    position: "relative",
    "::before": { ...rail, insetBlockEnd: 0, insetBlockStart: 0 },
  },
});

/** A link or trigger's styles, for one that wraps a `TraceLine`. */
function traceActionStyles() {
  return styles.action;
}

/** A list of lines: the steps an agent takes. */
function Trace({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div data-slot="trace" {...props} {...stylex.props(styles.trace, sx)} />
  );
}

/** One step: an icon and a title. Wrap it in a trigger or a link to make it do something. */
function TraceLine({
  state,
  sx,
  ...props
}: Styled<ComponentProps<"span">> & { state?: TraceState }) {
  return (
    <State value={state}>
      <span
        data-slot="trace-line"
        data-state={state}
        {...props}
        {...stylex.props(
          [typeStyles.textSm, styles.line],
          state === "error" && styles.error,
          state === "pending" && styles.pending,
          sx
        )}
      />
    </State>
  );
}

/** Before the title it names the action; after it, it's the indicator. */
function TraceIcon({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      aria-hidden
      data-slot="trace-icon"
      {...props}
      {...stylex.props(styles.icon, sx)}
    />
  );
}

/** One sentence on one line; it shimmers while the line runs. */
function TraceTitle({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"span">>) {
  const running = use(State) === "running";
  return (
    <span
      data-slot="trace-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    >
      {running ? <Shimmer>{children}</Shimmer> : children}
    </span>
  );
}

/** A count or a duration after the title; it doesn't truncate. */
function TraceDescription({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="trace-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

type CollapsibleProps = ComponentProps<typeof Collapsible>;

/** A line that opens to show more. */
function TraceCollapsible({
  sx,
  ...props
}: Styled<Omit<CollapsibleProps, "open">> &
  (
    | { open?: undefined }
    | {
        open: boolean;
        onOpenChange: NonNullable<CollapsibleProps["onOpenChange"]>;
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      {...props}
      sx={[styles.collapsible, sx]}
    />
  );
}

/** Wraps a `TraceLine` and adds a chevron after it. */
function TraceCollapsibleTrigger({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof CollapsibleTrigger>>, "render">) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      render={
        <button
          type="button"
          {...stylex.props(styles.action, styles.trigger, sx)}
        />
      }
      {...props}
    >
      {children}
      <span {...stylex.props(styles.chevron)}>
        <HugeiconsIcon
          aria-hidden
          icon={ArrowRight01Icon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
      </span>
    </CollapsibleTrigger>
  );
}

function TraceCollapsibleContent({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsibleContent>>) {
  return (
    <CollapsibleContent data-slot="trace-collapsible-content" {...props}>
      <div {...stylex.props([typeStyles.textSm, styles.content], sx)}>
        {children}
      </div>
    </CollapsibleContent>
  );
}

export {
  Trace,
  traceActionStyles,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  traceStates,
  TraceTitle,
};
export type { TraceState };
