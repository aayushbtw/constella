"use client";

import {
  Alert02Icon,
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentProps, ReactNode } from "react";

import { Shimmer } from "@/components/ai/shimmer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/primitives/collapsible";
import { Spinner } from "@/components/primitives/spinner";
import { SwapIcon, SwapIconItem } from "@/components/primitives/swap-icon";
import { SwapText } from "@/components/primitives/swap-text";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  lineHeights,
  media,
  motion,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const traceStates = ["running", "error", "pending"] as const;

type TraceState = (typeof traceStates)[number];

const traceMarkerVariants = ["check"] as const;

type TraceMarkerVariant = (typeof traceMarkerVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

interface StepContext {
  // Whether the step is still arriving, so a substep mounted with it doesn't enter twice.
  arriving: boolean;
  state: TraceState | undefined;
  substep: boolean;
}

const Step = createContext<StepContext>({
  arriving: false,
  state: undefined,
  substep: false,
});

// True once the Trace has mounted: only a step that arrives after it gets an entrance, so a
// run read back from history, or rendered on the server, lands without one.
const Live = createContext<{ readonly current: boolean }>({ current: false });

const step = "[data-slot='trace-step']";
const open = ":is([data-panel-open] *)";
const instant = ":is([data-collapsible-instant] *)";
const rtl = ":is([dir='rtl'] *)";
const inAction = ":is(a > *, button > *)";
const hovered = ":is(a:hover > *, button:hover > *)";
const pressed = ":is(a:active > *, button:active > *, [data-popup-open] > *)";
const inTrigger = ":is([data-slot='trace-collapsible-trigger'] *)";

// The rail stops short of each marker: a dot's own gap, or more past a spinner, alert or
// check, which read heavier. Measured from the marker's center, half a row down.
const dotHole = `calc(${sizes.icon} / 2)`;
const ringHole = `calc(${sizes.icon} / 2 + ${space.xxs} + ${space.xxxs})`;
const ringed = `:is([data-state='running'], [data-state='error'], :has(> * > [data-slot='trace-line'] > [data-slot='trace-marker'][data-variant='check']))`;
const rail = {
  backgroundColor: colors.border,
  content: "''",
  insetInlineStart: `calc(${sizes.icon} / 2 - ${strokes.border} / 2)`,
  position: "absolute",
  width: strokes.border,
} as const;

const grow = stylex.keyframes({
  from: { gridTemplateRows: "0fr" },
});

const arrive = stylex.keyframes({
  from: {
    filter: `blur(${motion.crossfadeTextBlur})`,
    opacity: 0,
    transform: `translateY(${space.xxs})`,
  },
});

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
});

const styles = stylex.create({
  trace: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
  },
  // Holds its rail, drawn as two halves around the marker so no mask covers it.
  step: {
    display: "grid",
    gridTemplateRows: "1fr",
    position: "relative",
    "::before": {
      ...rail,
      content: {
        default: "''",
        // A run's first step meets the trigger's rail; a list's first step starts the rail.
        [`:nth-child(1 of ${step}):not(:is([data-slot='trace-collapsible-content'] > [data-slot='trace'] > *))`]:
          "none",
      },
      height: {
        default: `calc(${sizes.controlSm} / 2 - ${dotHole})`,
        [ringed]: `calc(${sizes.controlSm} / 2 - ${ringHole})`,
      },
      top: 0,
    },
    "::after": {
      ...rail,
      bottom: 0,
      // The rail ends on the newest step.
      content: { default: "''", [`:nth-last-child(1 of ${step})`]: "none" },
      top: {
        default: `calc(${sizes.controlSm} / 2 + ${dotHole})`,
        [ringed]: `calc(${sizes.controlSm} / 2 + ${ringHole})`,
      },
    },
  },
  // A step that arrives opens its space first, so the rail grows down to it.
  growing: {
    animationDuration: { default: durations.move, [media.reducedMotion]: "0s" },
    animationName: grow,
    animationTimingFunction: easings.out,
  },
  stepInner: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    minWidth: 0,
  },
  // Only while the step grows: a clip at rest would cut a focus ring drawn on its edge.
  clipped: {
    overflow: "hidden",
  },
  arriving: {
    animationDelay: { default: "50ms", [media.reducedMotion]: "0s" },
    animationDuration: durations.move,
    animationFillMode: "backwards",
    animationName: { default: arrive, [media.reducedMotion]: fadeIn },
    animationTimingFunction: easings.out,
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
      default: colors.textMuted,
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
  marker: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    width: sizes.icon,
  },
  dotSlot: {
    alignItems: "center",
    height: sizes.icon,
    justifyContent: "center",
    width: sizes.icon,
  },
  dot: {
    backgroundColor: colors.border,
    borderEndEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderStartStartRadius: radii.full,
    height: `calc(${space.xxs} + ${space.xxxs})`,
    width: `calc(${space.xxs} + ${space.xxxs})`,
  },
  check: {
    alignItems: "center",
    backgroundColor: colors.accentSolid,
    borderEndEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderStartStartRadius: radii.full,
    color: colors.accentOnSolid,
    display: "flex",
    height: sizes.iconSm,
    justifyContent: "center",
    width: sizes.iconSm,
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
    flexShrink: 0,
    fontWeight: { default: null, [inTrigger]: fontWeights.medium },
    color: { default: null, [inTrigger]: colors.textSecondary },
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // Off without leaving the tree, so its text morphs as the step settles.
  still: {
    animationName: "none",
    backgroundImage: "none",
    WebkitTextFillColor: "currentColor",
  },
  subject: {
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
    marginInlineStart: {
      default: null,
      ":is([data-slot='trace-icon'] + *)": `calc(-1 * ${space.xxs})`,
    },
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
  // Opening grows the space, then fades in; closing fades out, then shuts.
  content: {
    display: "grid",
    filter: `blur(${motion.crossfadeTextBlur})`,
    gridTemplateRows: "0fr",
    opacity: 0,
    transitionDelay: {
      default: `${durations.popoverExit}, 0s, 0s`,
      [media.reducedMotion]: "0s",
    },
    transitionDuration: {
      default: `${durations.popover}, ${durations.popoverExit}, ${durations.popoverExit}`,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "grid-template-rows, opacity, filter",
    transitionTimingFunction: easings.out,
  },
  contentOpen: {
    filter: "blur(0)",
    gridTemplateRows: "1fr",
    opacity: 1,
    transitionDelay: { default: "0s, 50ms, 50ms", [media.reducedMotion]: "0s" },
    transitionDuration: {
      default: `${durations.move}, ${durations.move}, ${durations.move}`,
      [media.reducedMotion]: "0s",
    },
  },
  contentClip: {
    minHeight: 0,
    overflow: "hidden",
  },
  contentBody: {
    color: colors.textSecondary,
    minWidth: 0,
    overflowWrap: "break-word",
    paddingBlockEnd: space.xs,
    // Keeps a ring drawn on the edge of what's inside within the clip.
    paddingBlockStart: space.xxxs,
    paddingInlineEnd: space.xxxs,
    paddingInlineStart: `calc(${sizes.icon} + ${space.xs})`,
  },
  collapsible: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
  },
  trigger: {
    position: "relative",
    "::after": {
      ...rail,
      bottom: 0,
      // Kept while the panel shuts, so its first step's rail isn't left hanging.
      content: {
        default: "none",
        ":is([data-panel-open], :has(+ [data-ending-style]))": "''",
      },
      top: `calc(${sizes.controlSm} / 2 + ${dotHole})`,
    },
  },
  chevron: {
    color: {
      default: colors.textMuted,
      [media.hover]: { default: null, [hovered]: colors.textPrimary },
    },
    transform: {
      default: "rotate(-90deg)",
      [rtl]: "rotate(90deg)",
      [open]: "none",
    },
    transitionDuration: {
      default: durations.move,
      [instant]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "color, transform",
    transitionTimingFunction: easings.out,
  },
  // A window on the newest lines; older ones scroll up under a fade.
  reasoning: {
    alignItems: "flex-start",
    color: colors.textMuted,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    maxHeight: `calc(${lineHeights.textSm} * 4)`,
    overflow: "hidden",
  },
  reasoningFull: {
    maskImage: `linear-gradient(to bottom, transparent, black ${lineHeights.textSm})`,
  },
  substeps: {
    borderEndEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderStartStartRadius: radii.md,
    boxShadow: shadows.defaultRingSubtle,
    display: "flex",
    flexDirection: "column",
    marginBlockEnd: space.xxs,
    marginBlockStart: space.xxs,
  },
  substep: {
    alignItems: "center",
    borderBlockStartColor: {
      default: colors.borderSubtle,
      ":first-child": "transparent",
    },
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    color: {
      default: colors.textPrimary,
      ":is([data-state])": colors.textSecondary,
      ":is([data-state='error'])": colors.dangerText,
    },
    opacity: {
      default: null,
      ":is([data-state='pending'])": opacities.disabled,
    },
    display: "flex",
    gap: space.xs,
    height: sizes.controlMd,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    transitionDuration: durations.crossfade,
    transitionProperty: "color",
    transitionTimingFunction: easings.crossfade,
  },
});

/** True until the element's own entrance settles; cancelled counts, so a hidden panel won't replay it. */
function useArrival<T extends HTMLElement>(carried = false) {
  const live = use(Live);
  const ref = useRef<T>(null);
  // Read once, at mount: whether the Trace was already on screen when this arrived.
  const [arrived, setArrived] = useState(() => carried || !live.current);
  useEffect(() => {
    const animations = ref.current?.getAnimations() ?? [];
    const settle = async () => {
      await Promise.allSettled(
        animations.map(async (entrance) => await entrance.finished)
      );
      setArrived(true);
    };
    void settle();
  }, []);
  return [!arrived, ref] as const;
}

/** A link or trigger's styles, for one that wraps a `TraceLine`. */
function traceActionStyles() {
  return styles.action;
}

/** The steps an agent takes, on one rail. */
function Trace({ sx, ...props }: Styled<ComponentProps<"div">>) {
  const live = useRef(false);
  useEffect(() => {
    live.current = true;
  }, []);
  return (
    <Live value={live}>
      <div data-slot="trace" {...props} {...stylex.props(styles.trace, sx)} />
    </Live>
  );
}

/** One step: its line, and what opens under it. Without `state` it's done. */
function TraceStep({
  children,
  state,
  sx,
}: {
  children: ReactNode;
  state?: TraceState;
  sx?: Sx;
}) {
  const [growing, stepRef] = useArrival<HTMLDivElement>();
  const [arriving, innerRef] = useArrival<HTMLDivElement>();
  const context = useMemo(
    () => ({ arriving: growing || arriving, state, substep: false }),
    [arriving, growing, state]
  );
  return (
    <Step value={context}>
      <div
        data-slot="trace-step"
        data-state={state}
        ref={stepRef}
        {...stylex.props(styles.step, growing && styles.growing, sx)}
      >
        <div
          ref={innerRef}
          {...stylex.props(
            styles.stepInner,
            growing && styles.clipped,
            arriving && styles.arriving
          )}
        >
          {children}
        </div>
      </div>
    </Step>
  );
}

/** A step's row. Wrap it in a trigger or a link to make it do something. */
function TraceLine({ sx, ...props }: Styled<ComponentProps<"span">>) {
  const { state } = use(Step);
  return (
    <span
      data-slot="trace-line"
      {...props}
      {...stylex.props(
        [typeStyles.textSm, styles.line],
        state === "error" && styles.error,
        state === "pending" && styles.pending,
        sx
      )}
    />
  );
}

function Icon({ icon, size }: { icon: typeof Tick02Icon; size: string }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={size}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

/**
 * The step's node on the rail: a dot when done, a spinner while running, an alert when it
 * failed. `check` ends a run. Children replace the mark.
 */
function TraceMarker({
  children,
  sx,
  variant,
}: {
  children?: ReactNode;
  sx?: Sx;
  variant?: TraceMarkerVariant;
}) {
  const { state, substep } = use(Step);
  return (
    <span
      aria-hidden
      data-slot="trace-marker"
      data-variant={variant}
      {...stylex.props(styles.marker, sx)}
    >
      {children ?? <Mark state={state} substep={substep} variant={variant} />}
    </span>
  );
}

function Mark({
  state,
  substep,
  variant,
}: {
  state: TraceState | undefined;
  substep: boolean;
  variant: TraceMarkerVariant | undefined;
}) {
  if (variant === "check") {
    return (
      <span {...stylex.props(styles.check)}>
        <HugeiconsIcon
          aria-hidden
          icon={Tick02Icon}
          size={sizes.iconXs}
          strokeWidth={2.5}
        />
      </span>
    );
  }
  return (
    <SwapIcon value={state ?? "done"}>
      <SwapIconItem value="running">
        <Spinner aria-hidden />
      </SwapIconItem>
      <SwapIconItem value="error">
        <Icon icon={Alert02Icon} size={sizes.icon} />
      </SwapIconItem>
      <SwapIconItem sx={styles.dotSlot} value="pending">
        <span {...stylex.props(styles.dot)} />
      </SwapIconItem>
      <SwapIconItem sx={substep ? undefined : styles.dotSlot} value="done">
        {substep ? (
          <Icon icon={CheckmarkCircle02Icon} size={sizes.icon} />
        ) : (
          <span {...stylex.props(styles.dot)} />
        )}
      </SwapIconItem>
    </SwapIcon>
  );
}

/** An icon in the line: the subject's, or after the title, the indicator. */
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

/** What the step does, as a verb: "Reading", "Read". It shimmers while the step runs. */
function TraceTitle({ children, sx }: { children: ReactNode; sx?: Sx }) {
  const { state } = use(Step);
  return (
    <span data-slot="trace-title" {...stylex.props(styles.title, sx)}>
      <Shimmer sx={state === "running" ? undefined : styles.still}>
        {children}
      </Shimmer>
    </span>
  );
}

/** What the step acted on: "Swedish orders". Put its `TraceIcon` before it. */
function TraceSubject({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="trace-subject"
      {...props}
      {...stylex.props(styles.subject, sx)}
    />
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

/** What opens under a step, lined up with its title. `open` defaults to true. */
function TraceStepContent({
  children,
  open: shown = true,
  sx,
}: {
  children: ReactNode;
  open?: boolean;
  sx?: Sx;
}) {
  return (
    <div
      data-slot="trace-step-content"
      inert={!shown}
      {...stylex.props(styles.content, shown && styles.contentOpen)}
    >
      <div {...stylex.props(styles.contentClip)}>
        <div {...stylex.props([typeStyles.textSm, styles.contentBody], sx)}>
          {children}
        </div>
      </div>
    </div>
  );
}

type CollapsibleProps = ComponentProps<typeof Collapsible>;

/** A run, or any list of steps, that opens and shuts under its trigger. */
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

/** A row with the chevron on the rail's column: put a `TraceTitle` and `TraceDescription` in it. */
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
      <span {...stylex.props([typeStyles.textSm, styles.line])}>
        <span {...stylex.props(styles.marker, styles.chevron)}>
          <Icon icon={ArrowDown01Icon} size={sizes.icon} />
        </span>
        {children}
      </span>
    </CollapsibleTrigger>
  );
}

/** The panel; it stays mounted while shut, so its steps don't arrive again on reopening. */
function TraceCollapsibleContent({
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsibleContent>>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      keepMounted
      sx={sx}
      {...props}
    />
  );
}

const windowLines = 4;

let measurer: CanvasRenderingContext2D | null = null;

// Torph sets each letter in its own box, so pairs don't kern, and never breaks a line itself.
const linesOf = (text: string, width: number, style: CSSStyleDeclaration) => {
  measurer ??= document.createElement("canvas").getContext("2d");
  if (measurer === null) {
    return [text];
  }
  measurer.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  measurer.fontKerning = "none";
  measurer.letterSpacing = style.letterSpacing;
  const lines: string[] = [];
  // A break in the text is a line of its own, so each paragraph wraps apart.
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      const next = line === "" ? word : `${line} ${word}`;
      if (line !== "" && measurer.measureText(next).width > width) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
};

/**
 * The model's reasoning as it streams: a window on its newest lines, each new word morphing in
 * and the block gliding up a line as one wraps, the oldest fading under the top edge.
 */
function TraceReasoning({ children, sx }: { children: string; sx?: Sx }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{
    style: CSSStyleDeclaration;
    width: number;
  }>();
  useEffect(() => {
    const measure = (element: Element, width: number) => {
      setBox({ style: getComputedStyle(element), width });
    };
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) {
        measure(entry.target, entry.contentRect.width);
      }
    });
    if (ref.current !== null) {
      observer.observe(ref.current);
    }
    // A web font landing changes the widths but not the box, so measure once more.
    const remeasure = async () => {
      await document.fonts.ready;
      if (ref.current !== null) {
        measure(ref.current, ref.current.getBoundingClientRect().width);
      }
    };
    void remeasure();
    return () => {
      observer.disconnect();
    };
  }, []);
  const lines = useMemo(
    () =>
      box === undefined ? [children] : linesOf(children, box.width, box.style),
    [box, children]
  );
  return (
    <div
      data-slot="trace-reasoning"
      ref={ref}
      {...stylex.props(
        styles.reasoning,
        lines.length > windowLines && styles.reasoningFull,
        sx
      )}
    >
      <SwapText>{lines.slice(-(windowLines + 1)).join("\n")}</SwapText>
    </div>
  );
}

/** A card of the smaller steps one step runs, each settling to a check. */
function TraceSubsteps({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="trace-substeps"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.substeps], sx)}
    />
  );
}

/** One row of `TraceSubsteps`: a `TraceMarker` and a `TraceTitle`. */
function TraceSubstep({
  children,
  state,
  sx,
}: {
  children: ReactNode;
  state?: TraceState;
  sx?: Sx;
}) {
  const parent = use(Step);
  const [arriving, ref] = useArrival<HTMLDivElement>(parent.arriving);
  const context = useMemo(
    () => ({ arriving, state, substep: true }),
    [arriving, state]
  );
  return (
    <Step value={context}>
      <div
        data-slot="trace-substep"
        data-state={state}
        ref={ref}
        {...stylex.props(styles.substep, arriving && styles.arriving, sx)}
      >
        {children}
      </div>
    </Step>
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
  TraceMarker,
  traceMarkerVariants,
  TraceReasoning,
  traceStates,
  TraceStep,
  TraceStepContent,
  TraceSubject,
  TraceSubstep,
  TraceSubsteps,
  TraceTitle,
};
export type { TraceMarkerVariant, TraceState };
