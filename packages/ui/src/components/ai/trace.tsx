"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
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
import { SwapText } from "@/components/primitives/swap-text";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  lineHeights,
  media,
  motion,
  opacities,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const traceStates = ["running", "error", "pending"] as const;

type TraceState = (typeof traceStates)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type CollapsibleProps = ComponentProps<typeof Collapsible>;

interface StepContext {
  // Whether the step is still arriving, so a substep mounted with it doesn't enter twice.
  arriving: boolean;
  state: TraceState | undefined;
}

const Step = createContext<StepContext>({
  arriving: false,
  state: undefined,
});

const InStepTrigger = createContext(false);

// True once the Trace has mounted: only a step that arrives after it gets an entrance, so a
// run read back from history, or rendered on the server, lands without one.
const Live = createContext<{ readonly current: boolean }>({ current: false });

const step = "[data-slot='trace-step']";
const open = ":is([data-panel-open] *)";
// Only the trigger's own flag: the run's panel carries it too, and holds every step's chevron.
const instant = ":is([data-slot$='-trigger'][data-collapsible-instant] *)";
const rtl = ":is([dir='rtl'] *)";
const inAction = ":is(a > *, button > *)";
const hovered = ":is(a:hover > *, button:hover > *)";
const pressed = ":is(a:active > *, button:active > *, [data-popup-open] > *)";
const inTrigger = ":is([data-slot='trace-collapsible-trigger'] *)";
const stepHovered = ":is([data-slot='trace-step-trigger']:hover *)";
const stepFocused = ":is([data-slot='trace-step-trigger']:focus-visible *)";

// The rail stops at each marker's box, measured from its center, half a row down; the box's room
// around its 14px icon is the gap.
const hole = `calc(${sizes.controlXs} / 2)`;
const rail = {
  backgroundColor: colors.border,
  content: "''",
  insetInlineStart: `calc(${sizes.controlXs} / 2 - ${strokes.border} / 2)`,
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
    transform: `translateY(${motion.arriveOffset})`,
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
      content: { default: "''", [`:nth-child(1 of ${step})`]: "none" },
      height: `calc(${sizes.controlMd} / 2 - ${hole})`,
      top: 0,
    },
    "::after": {
      ...rail,
      bottom: 0,
      // The rail ends on the newest step.
      content: { default: "''", [`:nth-last-child(1 of ${step})`]: "none" },
      top: `calc(${sizes.controlMd} / 2 + ${hole})`,
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
    animationDelay: { default: durations.stagger, [media.reducedMotion]: "0s" },
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
      default: colors.textSecondary,
      [media.hover]: { default: null, [hovered]: colors.textPrimary },
      [pressed]: colors.textPrimary,
    },
    cursor: { default: null, [inAction]: "pointer" },
    display: "flex",
    gap: space.xs,
    height: sizes.controlMd,
    maxWidth: "100%",
    minWidth: 0,
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    width: "fit-content",
  },
  pending: {
    opacity: opacities.disabled,
  },
  marker: {
    display: "inline-grid",
    flexShrink: 0,
    height: sizes.controlXs,
    placeItems: "center",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    width: sizes.controlXs,
  },
  markerError: {
    color: colors.dangerText,
  },
  markLayer: {
    display: "flex",
    gridArea: "1 / 1",
    transitionDuration: {
      default: durations.hover,
      // Keyboard focus never animates.
      [stepFocused]: "0s",
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
      [stepFocused]: `blur(${motion.crossfadeTextBlur})`,
      [media.hover]: {
        default: "none",
        [stepHovered]: `blur(${motion.crossfadeTextBlur})`,
      },
    },
    opacity: {
      default: 1,
      [stepFocused]: 0,
      [media.hover]: { default: 1, [stepHovered]: 0 },
    },
    scale: {
      default: 1,
      [stepFocused]: motion.popoverScale,
      [media.hover]: { default: 1, [stepHovered]: motion.popoverScale },
    },
  },
  markActive: {
    filter: {
      default: `blur(${motion.crossfadeTextBlur})`,
      [stepFocused]: "none",
      [media.hover]: {
        default: `blur(${motion.crossfadeTextBlur})`,
        [stepHovered]: "none",
      },
    },
    opacity: {
      default: 0,
      [stepFocused]: 1,
      [media.hover]: { default: 0, [stepHovered]: 1 },
    },
    scale: {
      default: motion.popoverScale,
      [stepFocused]: 1,
      [media.hover]: { default: motion.popoverScale, [stepHovered]: 1 },
    },
  },
  icon: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: sizes.iconSm,
    justifyContent: "center",
    marginInlineStart: {
      default: null,
      ":is([data-slot='trace-title'] ~ *)": `calc(-1 * ${space.xxs})`,
    },
    width: sizes.iconSm,
  },
  title: {
    flexShrink: 0,
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
    color: colors.textMuted,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    color: { default: colors.textMuted, [inTrigger]: "inherit" },
    flexShrink: 0,
    fontVariantNumeric: "tabular-nums",
  },
  descriptionError: {
    color: colors.dangerText,
  },
  contentBody: {
    color: colors.textSecondary,
    minWidth: 0,
    overflowWrap: "break-word",
    paddingBlockEnd: space.xs,
    // Keeps a ring drawn on the edge of what's inside within the clip.
    paddingBlockStart: space.xxxs,
    paddingInlineEnd: space.xxxs,
    paddingInlineStart: `calc(${sizes.controlXs} + ${space.xs})`,
  },
  collapsible: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
  },
  chevron: {
    display: "flex",
    transform: {
      default: "rotate(-90deg)",
      [rtl]: "rotate(90deg)",
      [open]: "none",
    },
    // On the panel's timing each way, so it lands as the panel does.
    transitionDuration: {
      default: durations.layoutExit,
      [open]: {
        default: durations.layout,
        [instant]: "0s",
        [media.reducedMotion]: "0s",
      },
      [instant]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "transform",
    transitionTimingFunction: {
      default: easings.out,
      [open]: easings.layout,
    },
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
    display: "flex",
    flexDirection: "column",
  },
  substep: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    gap: space.xs,
    height: sizes.controlMd,
    minWidth: 0,
    opacity: {
      default: null,
      ":is([data-state='pending'])": opacities.disabled,
    },
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

function Chevron() {
  return (
    <span {...stylex.props(styles.chevron)}>
      <HugeiconsIcon
        aria-hidden
        icon={ArrowDown01Icon}
        size={sizes.iconSm}
        strokeWidth={Number(strokes.icon)}
      />
    </span>
  );
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

/**
 * One step: its line, and what opens under it. Without `state` it's done. Its content shows
 * unless `open` or `defaultOpen` is false; a `TraceStepTrigger` toggles it.
 */
function TraceStep({
  children,
  defaultOpen = true,
  onOpenChange,
  open: shown,
  state,
  sx,
}: {
  children: ReactNode;
  state?: TraceState;
  sx?: Sx;
} & Pick<CollapsibleProps, "defaultOpen" | "onOpenChange" | "open">) {
  const [growing, stepRef] = useArrival<HTMLDivElement>();
  const [arriving, innerRef] = useArrival<HTMLDivElement>();
  const context = useMemo(
    () => ({ arriving: growing || arriving, state }),
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
        <Collapsible
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          open={shown}
          render={
            <div
              ref={innerRef}
              {...stylex.props(
                styles.stepInner,
                growing && styles.clipped,
                arriving && styles.arriving
              )}
            />
          }
        >
          {children}
        </Collapsible>
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
        state === "pending" && styles.pending,
        sx
      )}
    />
  );
}

/**
 * A step's line that opens and shuts its content. Put the line's parts in it; its marker turns
 * into a chevron while it's pointed at. A step with `open` needs `onOpenChange` for it to toggle.
 */
function TraceStepTrigger({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof CollapsibleTrigger>>, "render">) {
  return (
    <CollapsibleTrigger
      data-slot="trace-step-trigger"
      render={<button type="button" {...stylex.props(styles.action, sx)} />}
      {...props}
    >
      <InStepTrigger value>
        <TraceLine>{children}</TraceLine>
      </InStepTrigger>
    </CollapsibleTrigger>
  );
}

/** The step's icon on the rail, red when it failed. In a `TraceStepTrigger` it reveals a chevron. */
function TraceMarker({ children, sx }: { children: ReactNode; sx?: Sx }) {
  const { state } = use(Step);
  const inStepTrigger = use(InStepTrigger);
  return (
    <span
      aria-hidden
      data-slot="trace-marker"
      {...stylex.props(
        styles.marker,
        state === "error" && styles.markerError,
        sx
      )}
    >
      {inStepTrigger ? (
        <>
          <span {...stylex.props(styles.markLayer, styles.markIdle)}>
            {children}
          </span>
          <span {...stylex.props(styles.markLayer, styles.markActive)}>
            <Chevron />
          </span>
        </>
      ) : (
        children
      )}
    </span>
  );
}

/** An icon after the subject, like a link's arrow. */
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

/** What the step acted on: "Swedish orders". */
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
  const { state } = use(Step);
  return (
    <span
      data-slot="trace-description"
      {...props}
      {...stylex.props(
        styles.description,
        state === "error" && styles.descriptionError,
        sx
      )}
    />
  );
}

/** What opens under a step, lined up with its title. The step's `open` shows it. */
function TraceStepContent({ children, sx }: { children: ReactNode; sx?: Sx }) {
  return (
    <CollapsibleContent data-slot="trace-step-content" keepMounted>
      <div {...stylex.props([typeStyles.textSm, styles.contentBody], sx)}>
        {children}
      </div>
    </CollapsibleContent>
  );
}

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

/** The run's row, with the chevron after it: put a `TraceTitle` and `TraceDescription` in it. */
function TraceCollapsibleTrigger({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof CollapsibleTrigger>>, "render">) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      render={<button type="button" {...stylex.props(styles.action, sx)} />}
      {...props}
    >
      <span {...stylex.props([typeStyles.textSm, styles.line])}>
        {children}
        <Chevron />
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

/** The smaller steps one step runs, as rows under it. */
function TraceSubsteps({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="trace-substeps"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.substeps], sx)}
    />
  );
}

/** One row of `TraceSubsteps`: a `TraceMarker`, a `TraceTitle` and what it acted on. */
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
  const context = useMemo(() => ({ arriving, state }), [arriving, state]);
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
  TraceReasoning,
  traceStates,
  TraceStep,
  TraceStepContent,
  TraceStepTrigger,
  TraceSubject,
  TraceSubstep,
  TraceSubsteps,
  TraceTitle,
};
export type { TraceState };
