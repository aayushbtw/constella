import {
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  DatabaseIcon,
  File02Icon,
  RepeatIcon,
  Tick02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Citation, Citations } from "@/components/ai/citation";
import type { Source } from "@/components/ai/citation";
import { Shimmer } from "@/components/ai/shimmer";
import {
  traceActionStyles,
  TraceCollapsible,
  TraceCollapsibleContent,
} from "@/components/ai/trace";
import { Button } from "@/components/primitives/button";
import { CollapsibleTrigger } from "@/components/primitives/collapsible";
import { Spinner } from "@/components/primitives/spinner";
import { SwapIcon, SwapIconItem } from "@/components/primitives/swap-icon";
import { SwapText } from "@/components/primitives/swap-text";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  lineHeights,
  media,
  motion,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

export const Route = createFileRoute("/_dev/trace-run")({
  component: TraceRunPage,
});

const grow = stylex.keyframes({
  from: { gridTemplateRows: "0fr" },
});

const enter = stylex.keyframes({
  from: {
    filter: `blur(${motion.crossfadeTextBlur})`,
    opacity: 0,
    transform: "translateY(4px)",
  },
});

const appear = {
  animationDuration: { default: durations.move, [media.reducedMotion]: "0s" },
  animationFillMode: "backwards",
  animationName: enter,
  animationTimingFunction: easings.out,
} as const;

// A ring reads heavier than a dot, so it gets 7px of rail gap to the dot's 5px, to look even.
const tallReach = `calc(${space.xxs} + ${space.xxxs})`;

// Lines the thought window shows; past them the oldest fades under the top edge.
const windowLines = 4;

// The rail's gap between a marker and the edge of its row.
const railGap = `calc((${sizes.controlSm} - ${sizes.icon}) / 2)`;

const styles = stylex.create({
  page: {
    backgroundColor: colors.background,
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    marginInline: "auto",
    maxWidth: 480,
    minHeight: "100vh",
    paddingBlockEnd: space.xl,
    paddingBlockStart: space.xl,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  prompt: {
    alignSelf: "flex-end",
    backgroundColor: colors.fill,
    borderEndEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderStartStartRadius: radii.lg,
    color: colors.textPrimary,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    paddingInlineStart: 0,
  },
  // The step opens its own space first, so the rail grows down to it before it fades in.
  step: {
    display: "grid",
    gridTemplateRows: "1fr",
  },
  stepGrowing: {
    animationDuration: {
      default: durations.move,
      [media.reducedMotion]: "0s",
    },
    animationName: grow,
    animationTimingFunction: easings.out,
  },
  stepInner: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    overflow: "hidden",
  },
  // Entrances run once, on arrival: a panel reopening or showing again replays none of them.
  arriving: appear,
  innerArriving: {
    ...appear,
    animationDelay: { default: "80ms", [media.reducedMotion]: "0s" },
  },
  row: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
    height: sizes.controlSm,
    minWidth: 0,
  },
  // Sits on the content's rail, masking it a dot's gap short of the dot.
  marker: {
    alignItems: "center",
    backgroundColor: colors.background,
    display: "flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    position: "relative",
    width: sizes.icon,
  },
  // A spinner or check fills the marker, so the mask reaches past it to keep the dot's gap.
  markerTall: {
    marginBlockEnd: `calc(-1 * ${tallReach})`,
    marginBlockStart: `calc(-1 * ${tallReach})`,
    height: `calc(${sizes.icon} + 2 * ${tallReach})`,
  },
  // Hides the rail below the last marker, detail and all, so the run ends on its newest node.
  stepEnd: {
    position: "relative",
    "::after": {
      backgroundColor: colors.background,
      bottom: 0,
      content: "''",
      insetInlineStart: 0,
      position: "absolute",
      top: `calc(${sizes.controlSm} - ${railGap})`,
      width: sizes.icon,
    },
  },
  // The spinner's size, so the dot it swaps to sits at the same center.
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
    height: 6,
    width: 6,
  },
  finished: {
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
  head: {
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: null,
        ":is(button:hover > *)": colors.textSecondary,
      },
    },
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
  headTitle: {
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  // The disclosure sits in the marker column, so the rail starts under it.
  chevron: {
    transform: {
      default: "rotate(-90deg)",
      ":is([data-panel-open] *)": "none",
    },
    transitionDuration: {
      default: durations.move,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
  },
  verb: {
    color: colors.textMuted,
    flexShrink: 0,
  },
  still: {
    animationName: "none",
    backgroundImage: "none",
    WebkitTextFillColor: "currentColor",
  },
  subject: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    fontWeight: fontWeights.medium,
    gap: space.xxs,
    minWidth: 0,
  },
  subjectName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  count: {
    color: colors.textMuted,
    flexShrink: 0,
    fontVariantNumeric: "tabular-nums",
  },
  // Opening grows the space, then fades in; closing fades out, then shuts.
  reveal: {
    display: "grid",
    filter: `blur(${motion.crossfadeTextBlur})`,
    gridTemplateRows: "0fr",
    opacity: 0,
    transitionDelay: {
      default: `${durations.popoverExit}, 0s, 0s`,
      [media.reducedMotion]: "0s",
    },
    transitionDuration: {
      default: `${durations.move}, ${durations.popoverExit}, ${durations.popoverExit}`,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "grid-template-rows, opacity, filter",
    transitionTimingFunction: easings.out,
  },
  revealOpen: {
    filter: "blur(0)",
    gridTemplateRows: "1fr",
    opacity: 1,
    transitionDelay: {
      default: "0s, 80ms, 80ms",
      [media.reducedMotion]: "0s",
    },
    transitionDuration: {
      default: `${durations.move}, ${durations.move}, ${durations.move}`,
      [media.reducedMotion]: "0s",
    },
  },
  revealInner: {
    minHeight: 0,
    overflow: "hidden",
  },
  body: {
    paddingBlockEnd: space.xs,
    // Keeps the card's ring inside the reveal's clip.
    paddingInlineEnd: space.xxxs,
    paddingInlineStart: `calc(${sizes.icon} + ${space.xs})`,
  },
  // A window on the newest lines; older ones scroll up under a fade.
  thought: {
    alignItems: "flex-start",
    color: colors.textMuted,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    maxHeight: `calc(${lineHeights.textSm} * ${windowLines})`,
    overflow: "hidden",
  },
  thoughtFull: {
    maskImage: `linear-gradient(to bottom, transparent, black ${lineHeights.textSm})`,
  },
  card: {
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
  task: {
    alignItems: "center",
    borderBlockStartColor: {
      default: colors.borderSubtle,
      ":first-child": "transparent",
    },
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    color: {
      default: colors.textSecondary,
      ":is([data-done])": colors.textPrimary,
    },
    display: "flex",
    gap: space.xs,
    height: sizes.controlMd,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    transitionDuration: durations.crossfade,
    transitionProperty: "color",
    transitionTimingFunction: easings.out,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
  },
  chipsTail: {
    display: "flex",
    gap: space.xxs,
  },
  chip: {
    display: "inline-flex",
  },
  more: {
    alignSelf: "center",
    color: colors.textSecondary,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
  },
  file: {
    alignItems: "center",
    borderEndEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderStartStartRadius: radii.md,
    boxShadow: shadows.defaultRingSubtle,
    display: "flex",
    gap: space.xs,
    marginBlockEnd: space.xxs,
    marginBlockStart: space.xxs,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    width: "fit-content",
  },
  fileKind: {
    color: colors.textMuted,
  },
});

function Icon({ icon }: { icon: IconSvgElement }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

const thought =
  "The goal is a launch plan for Sweden. Start with what the warehouse already knows: who orders from Sweden today, what they buy and how often they come back. Then look outward. Check how local brands price and position themselves, what Swedish shoppers expect on delivery and returns, and how Sweden compares with Norway. Orders first: they set the baseline for everything else.";

const words = thought.split(" ");

let measurer: CanvasRenderingContext2D | null = null;

// Computed `font` can come back empty, so it's built from its parts.
const fontOf = (style: CSSStyleDeclaration) =>
  `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

/** Breaks text into lines that fit `width` in `font`, since Torph only breaks at `\n`. */
function wrapTo(text: string, width: number, font: string) {
  measurer ??= document.createElement("canvas").getContext("2d");
  if (measurer === null) {
    return [text];
  }
  measurer.font = font;
  // Torph sets each letter in its own box, so pairs don't kern.
  measurer.fontKerning = "none";
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line === "" ? word : `${line} ${word}`;
    if (line !== "" && measurer.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  return [...lines, line];
}

/** Streamed reasoning in a window: words morph in, and the block glides up a line as one wraps. */
function Thought({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [box, setBox] = useState<{ width: number; font: string }>();
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) {
        setBox({
          width: entry.contentRect.width,
          font: fontOf(getComputedStyle(entry.target)),
        });
      }
    });
    if (ref.current !== null) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);
  const lines =
    box === undefined ? [children] : wrapTo(children, box.width, box.font);
  return (
    <p
      ref={ref}
      {...stylex.props(
        styles.thought,
        lines.length > windowLines && styles.thoughtFull
      )}
    >
      <SwapText>{lines.join("\n")}</SwapText>
    </p>
  );
}

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const sources: Source[] = [
  {
    icon: favicon("scb.se"),
    name: "Statistics Sweden",
    title: "E-commerce by region, 2026",
    url: "https://scb.se",
  },
  {
    icon: favicon("postnord.se"),
    name: "PostNord",
    title: "E-commerce in the Nordics",
    url: "https://postnord.se",
  },
  {
    icon: favicon("shopify.com"),
    name: "Shopify",
    title: "Selling in Sweden",
    url: "https://shopify.com",
  },
  {
    icon: favicon("statista.com"),
    name: "Statista",
    title: "Online shoppers in Sweden",
    url: "https://statista.com",
  },
];

const finalSource = sources.at(-1);

// Seconds into the run that each beat happens. A beat after a step closes
// lets its detail shut before the next one opens.
const at = {
  thinking: [0, 3.2],
  reading: [3.6, 6.2],
  readTasks: [4.6, 5.8],
  searching: [6.6, 8.8],
  chips: [7, 7.4, 7.8, 8.2],
  delegating: [9.2, 12],
  delegateTasks: [10.4, 11.6],
  reporting: [12.4, 13.8],
  end: 14.2,
} as const;

const ticks = 10;

type Status = "running" | "done";

/** Text that shimmers while it runs and morphs when it changes. */
function Live({ running, children }: { running: boolean; children: string }) {
  return (
    <Shimmer sx={running ? undefined : styles.still}>
      <SwapText>{children}</SwapText>
    </Shimmer>
  );
}

/**
 * True until the element's own entrance settles. Read from its animations after mount, not
 * `animationend`, which a server-rendered entrance fires before hydration. Cancelled counts as
 * settled, so a panel closed mid-entrance doesn't replay it.
 */
function useArrival<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [arrived, setArrived] = useState(false);
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

function Arrive({
  style,
  children,
  done,
}: {
  style: stylex.StyleXStyles;
  children: ReactNode;
  done?: boolean;
}) {
  const [arriving, ref] = useArrival<HTMLSpanElement>();
  return (
    <span
      data-done={done === true ? "" : undefined}
      ref={ref}
      {...stylex.props(style, arriving && styles.arriving)}
    >
      {children}
    </span>
  );
}

function Step({
  status,
  marker,
  children,
  detail,
  detailOpen,
  last,
}: {
  status: Status;
  marker?: ReactNode;
  children: ReactNode;
  detail?: ReactNode;
  detailOpen?: boolean;
  last: boolean;
}) {
  const [growing, stepRef] = useArrival<HTMLDivElement>();
  const [arriving, innerRef] = useArrival<HTMLDivElement>();
  return (
    <div
      ref={stepRef}
      {...stylex.props(
        styles.step,
        growing && styles.stepGrowing,
        last && styles.stepEnd
      )}
    >
      <div
        ref={innerRef}
        {...stylex.props(styles.stepInner, arriving && styles.innerArriving)}
      >
        <div {...stylex.props(typeStyles.textSm, styles.row)}>
          <span
            {...stylex.props(
              styles.marker,
              (marker !== undefined || status === "running") &&
                styles.markerTall
            )}
          >
            {marker ?? (
              <SwapIcon value={status}>
                <SwapIconItem value="running">
                  <Spinner aria-hidden />
                </SwapIconItem>
                <SwapIconItem sx={styles.dotSlot} value="done">
                  <span {...stylex.props(styles.dot)} />
                </SwapIconItem>
              </SwapIcon>
            )}
          </span>
          {children}
        </div>
        {detail === undefined ? null : (
          <div
            {...stylex.props(
              styles.reveal,
              detailOpen === true && styles.revealOpen
            )}
          >
            <div {...stylex.props(styles.revealInner)}>
              <div {...stylex.props(styles.body)}>{detail}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Verb({ status, children }: { status: Status; children: string }) {
  return (
    <span {...stylex.props(styles.verb)}>
      <Live running={status === "running"}>{children}</Live>
    </span>
  );
}

function Subject({
  icon,
  children,
}: {
  icon: IconSvgElement;
  children: string;
}) {
  return (
    <span {...stylex.props(styles.subject)}>
      <Icon icon={icon} />
      <span {...stylex.props(styles.subjectName)}>{children}</span>
    </span>
  );
}

function Tasks({
  t,
  done,
  labels,
}: {
  t: number;
  done: readonly number[];
  labels: readonly (readonly [string, string])[];
}) {
  return (
    <div {...stylex.props(typeStyles.textSm, styles.card)}>
      {labels.map(([running, finished], index) => {
        const over = t >= (done[index] ?? Infinity);
        return (
          <Arrive done={over} key={running} style={styles.task}>
            <SwapIcon value={over ? "done" : "running"}>
              <SwapIconItem value="running">
                <Spinner aria-hidden />
              </SwapIconItem>
              <SwapIconItem value="done">
                <Icon icon={CheckmarkCircle02Icon} />
              </SwapIconItem>
            </SwapIcon>
            <Live running={!over}>{over ? finished : running}</Live>
          </Arrive>
        );
      })}
    </div>
  );
}

function statusAt(
  t: number,
  [start, end]: readonly [number, number]
): Status | null {
  if (t < start) {
    return null;
  }
  return t < end ? "running" : "done";
}

const stepOrder = [
  "thinking",
  "reading",
  "searching",
  "delegating",
  "reporting",
] as const;

// The rail ends on this step's marker.
function newestStep(t: number) {
  return t >= at.end
    ? "finished"
    : stepOrder.findLast((step) => statusAt(t, at[step]) !== null);
}

/** The sources a search found, the count kept on the last chip's line. */
function SourceChips({ shown, done }: { shown: number; done: boolean }) {
  return (
    <div {...stylex.props(styles.chips)}>
      {sources.slice(0, Math.min(shown, sources.length - 1)).map((source) => (
        <Arrive key={source.url} style={styles.chip}>
          <Citation sources={[source]} />
        </Arrive>
      ))}
      {/* The last chip mounts here, so the count never wraps onto a line alone. */}
      {finalSource === undefined || shown < sources.length ? null : (
        <span {...stylex.props(styles.chipsTail)}>
          <Arrive style={styles.chip}>
            <Citation sources={[finalSource]} />
          </Arrive>
          {done ? (
            <Arrive style={[typeStyles.textSm, styles.more]}>42 more</Arrive>
          ) : null}
        </span>
      )}
    </div>
  );
}

function Run({ t }: { t: number }) {
  const [open, setOpen] = useState<boolean>();
  const thinking = statusAt(t, at.thinking);
  const reading = statusAt(t, at.reading);
  const searching = statusAt(t, at.searching);
  const delegating = statusAt(t, at.delegating);
  const reporting = statusAt(t, at.reporting);
  const finished = t >= at.end;
  const [thinkStart, thinkEnd] = at.thinking;
  const shownWords = Math.ceil(
    (words.length * (Math.min(t, thinkEnd) - thinkStart)) /
      (thinkEnd - thinkStart)
  );
  const chipsShown = at.chips.filter((time) => t >= time).length;
  const seconds = Math.floor(Math.min(t, at.end));
  const newest = newestStep(t);

  return (
    <TraceCollapsible onOpenChange={setOpen} open={open ?? true}>
      <CollapsibleTrigger
        render={<button type="button" {...stylex.props(traceActionStyles())} />}
      >
        <span {...stylex.props(typeStyles.textSm, styles.row, styles.head)}>
          <span {...stylex.props(styles.marker, styles.chevron)}>
            <Icon icon={ArrowDown01Icon} />
          </span>
          <span {...stylex.props(styles.headTitle)}>
            <Live running={!finished}>{finished ? "Worked" : "Working"}</Live>
          </span>
          <span {...stylex.props(styles.count)}>
            {/* The unit stays outside: Torph rolls a number only when no letter touches it. */}
            <SwapText>{finished ? `for ${seconds}` : String(seconds)}</SwapText>
            s
          </span>
        </span>
      </CollapsibleTrigger>
      {/* Kept mounted, so reopening doesn't replay each step's entrance while Base UI measures the panel. */}
      <TraceCollapsibleContent keepMounted sx={styles.content}>
        {thinking === null ? null : (
          <Step
            detail={<Thought>{words.slice(0, shownWords).join(" ")}</Thought>}
            detailOpen={thinking === "running"}
            last={newest === "thinking"}
            status={thinking}
          >
            <Verb status={thinking}>
              {thinking === "running" ? "Thinking" : "Done thinking"}
            </Verb>
          </Step>
        )}
        {reading === null ? null : (
          <Step
            detail={
              <Tasks
                done={at.readTasks}
                labels={[
                  [
                    "Pulling Swedish order history",
                    "Pulled Swedish order history",
                  ],
                  [
                    "Spotting top sellers in Sweden",
                    "Spotted top sellers in Sweden",
                  ],
                ]}
                t={t}
              />
            }
            detailOpen={reading === "running"}
            last={newest === "reading"}
            status={reading}
          >
            <Verb status={reading}>
              {reading === "running" ? "Reading" : "Read"}
            </Verb>
            <Subject icon={DatabaseIcon}>Swedish orders</Subject>
          </Step>
        )}
        {searching === null ? null : (
          <Step
            detail={
              <SourceChips done={searching === "done"} shown={chipsShown} />
            }
            detailOpen={chipsShown > 0}
            last={newest === "searching"}
            status={searching}
          >
            <Verb status={searching}>
              {searching === "running" ? "Searching" : "Searched"}
            </Verb>
            {chipsShown === 0 ? null : (
              <span {...stylex.props(styles.count)}>
                <SwapText>{`${searching === "running" ? chipsShown * 6 : 46} sources`}</SwapText>
              </span>
            )}
          </Step>
        )}
        {delegating === null ? null : (
          <Step
            detail={
              <Tasks
                done={at.delegateTasks}
                labels={[
                  [
                    "Scanning Swedish competitor brands",
                    "Scanned Swedish competitor brands",
                  ],
                  [
                    "Mapping local pricing trends",
                    "Mapped local pricing trends",
                  ],
                ]}
                t={t}
              />
            }
            detailOpen={delegating === "running"}
            last={newest === "delegating"}
            status={delegating}
          >
            <Verb status={delegating}>
              {delegating === "running" ? "Delegating to" : "Delegated to"}
            </Verb>
            <Subject icon={UserGroupIcon}>Brand researcher</Subject>
          </Step>
        )}
        {reporting === null ? null : (
          <Step
            detail={
              <Arrive style={[typeStyles.textSm, styles.file]}>
                <Icon icon={File02Icon} />
                sweden-launch
                <span {...stylex.props(styles.fileKind)}>PDF</span>
              </Arrive>
            }
            detailOpen
            last={newest === "reporting"}
            status={reporting}
          >
            <Verb status={reporting}>
              {reporting === "running"
                ? "Preparing the report"
                : "Report is ready"}
            </Verb>
            {reporting === "done" ? (
              <Subject icon={File02Icon}>Sweden launch plan</Subject>
            ) : null}
          </Step>
        )}
        {finished ? (
          <Step
            last
            marker={
              <span {...stylex.props(styles.finished)}>
                <HugeiconsIcon
                  aria-hidden
                  icon={Tick02Icon}
                  size={sizes.iconXs}
                  strokeWidth={2.5}
                />
              </span>
            }
            status="done"
          >
            <span {...stylex.props(styles.verb)}>Finished working</span>
          </Step>
        ) : null}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

function TraceRunPage() {
  const [tick, setTick] = useState(0);
  const [run, setRun] = useState(0);
  const t = tick / ticks;

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => Math.min(value + 1, at.end * ticks));
    }, 1000 / ticks);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <main {...stylex.props(styles.page)}>
      <div>
        <Button
          disabled={t < at.end}
          onClick={() => {
            setTick(0);
            setRun((value) => value + 1);
          }}
          size="sm"
          variant="outline"
        >
          <Icon icon={RepeatIcon} />
          Run again
        </Button>
      </div>
      <p {...stylex.props(typeStyles.textBase, styles.prompt)}>
        Plan our launch in Sweden.
      </p>
      <Citations>
        <Run key={run} t={t} />
      </Citations>
    </main>
  );
}
