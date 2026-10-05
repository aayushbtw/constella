import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderValue,
} from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoControls, Stage, Well } from "~/components/demos/frame";
import { fonts } from "~/site/tokens.stylex";

const dot = "12px";
const graph = "200px";

const easingNames = [
  "out",
  "inOut",
  "overshoot",
  "layout",
  "crossfade",
] as const satisfies readonly (keyof typeof easings)[];
type EasingName = (typeof easingNames)[number];

// Every mover rests at its end and plays from its start, so reduced motion shows the end.
const fromStart = stylex.keyframes({
  from: { transform: "translate(0, 0)" },
});

const styles = stylex.create({
  easing: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    width: `calc(${graph} + 2 * ${space.lg})`,
  },
  stage: {
    position: "relative",
  },
  replay: {
    insetBlockStart: space.sm,
    insetInlineEnd: space.sm,
    position: "absolute",
  },
  graphWell: {
    borderRadius: radii.md,
    padding: space.lg,
  },
  graph: {
    height: graph,
    position: "relative",
    width: graph,
  },
  plot: {
    inset: 0,
    overflow: "visible",
    position: "absolute",
  },
  axis: {
    stroke: colors.edgeStrong,
  },
  // Linear, for reference: how far each curve bends away from it.
  linear: {
    stroke: colors.edge,
    strokeDasharray: "4 4",
  },
  curve: {
    stroke: colors.textPrimary,
  },
  readout: {
    color: colors.textMuted,
    display: "flex",
    fontFamily: fonts.mono,
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    gap: space.md,
    gridColumn: "1 / -1",
    justifyContent: "space-between",
  },
  readoutValue: {
    color: colors.textPrimary,
  },
  play: {
    animationFillMode: "both",
    animationName: { default: fromStart, [media.reducedMotion]: "none" },
  },
  timing: (duration: string, easing: string) => ({
    animationDuration: duration,
    animationTimingFunction: easing,
  }),
  // Time runs across at a steady pace while progress follows the curve, so the dot traces it.
  traceX: {
    insetBlockEnd: `calc(${dot} / -2)`,
    insetInlineStart: `calc(${dot} / -2)`,
    position: "absolute",
    transform: `translate(${graph}, 0)`,
  },
  traceY: {
    transform: `translate(0, -${graph})`,
  },
  dot: {
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    height: dot,
    width: dot,
  },
  trackWell: {
    borderRadius: radii.full,
    width: "100%",
  },
  // As wide as the track, so moving it its own width less a dot lands the dot at the end.
  runner: {
    transform: `translate(calc(100% - ${dot}), 0)`,
    width: "100%",
  },
  span: {
    gridColumn: "1 / -1",
    width: "100%",
  },
});

// Reads `cubic-bezier(x1, y1, x2, y2)` into the four numbers.
function bezier(easing: string) {
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = (
    easing.match(/-?[\d.]+/gu) ?? []
  ).map(Number);

  return { x1, x2, y1, y2 };
}

function slowed(duration: string, factor: number) {
  return `calc(${duration} * ${factor})`;
}

const moveMs = Number(durations.move.slice(0, -"ms".length));

function Plot({ d, sx }: { d: string; sx: stylex.StyleXStyles }) {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={strokes.spinner}
      vectorEffect="non-scaling-stroke"
      {...stylex.props(sx)}
    />
  );
}

function ReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <Button
      aria-label="Replay"
      onClick={onReplay}
      size="icon-sm"
      sx={styles.replay}
      variant="ghost"
    >
      <HugeiconsIcon
        aria-hidden
        icon={ArrowReloadHorizontalIcon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </Button>
  );
}

function MotionEasingDemo() {
  const [name, setName] = useState<EasingName>("out");
  const [slow, setSlow] = useState(4);
  const [run, setRun] = useState(0);
  const easing = easings[name];
  const { x1, x2, y1, y2 } = bezier(easing);
  const duration = slowed(durations.move, slow);

  return (
    <>
      <Stage sx={styles.stage}>
        <ReplayButton
          onReplay={() => {
            setRun((value) => value + 1);
          }}
        />
        <div {...stylex.props(styles.easing)}>
          <Well sx={styles.graphWell}>
            <div {...stylex.props(styles.graph)}>
              <svg
                aria-hidden
                preserveAspectRatio="none"
                viewBox="0 0 1 1"
                {...stylex.props(styles.plot)}
              >
                <Plot d="M0 0V1H1" sx={styles.axis} />
                <Plot d="M0 1L1 0" sx={styles.linear} />
                <Plot
                  d={`M0 1C${x1} ${1 - y1} ${x2} ${1 - y2} 1 0`}
                  sx={styles.curve}
                />
              </svg>
              <div
                key={`x${run}${name}`}
                {...stylex.props(
                  styles.traceX,
                  styles.play,
                  styles.timing(duration, "linear")
                )}
              >
                <div
                  {...stylex.props(
                    styles.traceY,
                    styles.play,
                    styles.timing(duration, easing)
                  )}
                >
                  <div {...stylex.props(styles.dot)} />
                </div>
              </div>
            </div>
          </Well>
          <Well sx={styles.trackWell}>
            <div
              key={`t${run}${name}`}
              {...stylex.props(
                styles.runner,
                styles.play,
                styles.timing(duration, easing)
              )}
            >
              <div {...stylex.props(styles.dot)} />
            </div>
          </Well>
        </div>
      </Stage>
      <DemoControls>
        <p {...stylex.props(styles.readout)}>
          <span {...stylex.props(styles.readoutValue)}>{easing}</span>
          <span>
            {durations.move} × {slow} = {moveMs * slow}ms
          </span>
        </p>
        <Tabs
          onValueChange={(value: EasingName) => {
            setName(value);
          }}
          sx={styles.span}
          value={name}
        >
          <TabsList sx={styles.span}>
            {easingNames.map((easingName) => (
              <TabsTrigger key={easingName} value={easingName}>
                {easingName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Slider
          format={{ maximumFractionDigits: 0, style: "decimal" }}
          max={8}
          min={1}
          onValueChange={(value) => {
            setSlow(value);
          }}
          sx={styles.span}
          value={slow}
        >
          <SliderLabel>Slow down</SliderLabel>
          <SliderValue>{(formatted) => `${formatted[0] ?? ""}×`}</SliderValue>
          <SliderControl />
        </Slider>
      </DemoControls>
    </>
  );
}

export { MotionEasingDemo };
