"use client";

import * as stylex from "@stylexjs/stylex";
import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
} from "@ui-sdk/react/progress";
import type { ComponentProps } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  layers,
  media,
  opacities,
  strokes,
} from "@/lib/constella/tokens.stylex";

type LoadingBarProps = Omit<
  ComponentProps<typeof ProgressPrimitive>,
  | "className"
  | "style"
  | "value"
  | "children"
  | "min"
  | "max"
  | "format"
  | "locale"
> & {
  loading: boolean;
  sx?: Sx;
};

type Phase = "hidden" | "shown" | "finishing";

interface Step {
  after: number;
  to: Phase;
}

const loadingDelay = Number.parseFloat(durations.loadingDelay);
const moveFor = Number.parseFloat(durations.move);
const finishFor = moveFor + Number.parseFloat(durations.popoverExit);
const trickleFor = Number.parseFloat(durations.trickle);
const reducedMotionQuery = media.reducedMotion.slice("@media ".length);

const steps = {
  hidden: { idle: null, loading: { after: loadingDelay, to: "shown" } },
  shown: { idle: { after: 0, to: "finishing" }, loading: null },
  finishing: {
    idle: { after: finishFor, to: "hidden" },
    loading: { after: 0, to: "shown" },
  },
} satisfies Record<Phase, Record<"idle" | "loading", Step | null>>;

const trickle = [{ transform: "scaleX(0.1)" }, { transform: "scaleX(0.9)" }];

const breathe = stylex.keyframes({
  "50%": { opacity: opacities.pulse },
});
const finishing = ":is([data-state='finishing'])";
const rtl = ":is([dir='rtl'], [dir='rtl'] *)";

const styles = stylex.create({
  root: {
    height: strokes.indicator,
    insetBlockStart: 0,
    insetInlineStart: 0,
    opacity: { default: 1, [finishing]: 0 },
    pointerEvents: "none",
    position: "fixed",
    transitionDelay: { default: null, [finishing]: durations.move },
    transitionDuration: { default: "0s", [finishing]: durations.popoverExit },
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
    width: "100%",
    zIndex: layers.loadingBar,
  },
  indicator: {
    animationDuration: {
      default: null,
      [media.reducedMotion]: durations.pulse,
    },
    animationIterationCount: {
      default: null,
      [media.reducedMotion]: "infinite",
    },
    animationName: { default: null, [media.reducedMotion]: breathe },
    animationTimingFunction: {
      default: null,
      [media.reducedMotion]: easings.inOut,
    },
    backgroundColor: colors.accentSolid,
    height: "100%",
    transformOrigin: { default: "left", [rtl]: "right" },
    width: "100%",
  },
});

/** A line along the window's top edge while `loading` holds, shown only once a load outlasts `durations.loadingDelay`. */
function LoadingBar({ loading, sx, ...props }: LoadingBarProps) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const indicator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = steps[phase][loading ? "loading" : "idle"];
    const timer =
      next === null
        ? undefined
        : setTimeout(() => {
            setPhase(next.to);
          }, next.after);
    return () => {
      clearTimeout(timer);
    };
  }, [loading, phase]);

  useLayoutEffect(() => {
    const element = indicator.current;
    if (element === null || matchMedia(reducedMotionQuery).matches) {
      return;
    }
    const reached = getComputedStyle(element).transform;
    for (const running of element.getAnimations()) {
      running.cancel();
    }
    if (phase === "shown") {
      element.animate(trickle, {
        duration: trickleFor,
        easing: easings.out,
        fill: "forwards",
      });
    } else {
      element.animate([{ transform: reached }, { transform: "none" }], {
        duration: moveFor,
        easing: easings.out,
        fill: "forwards",
      });
    }
  }, [phase]);

  if (phase === "hidden") {
    return null;
  }
  return (
    <ProgressPrimitive
      data-state={phase}
      {...props}
      value={null}
      {...stylex.props(styles.root, sx)}
    >
      <ProgressIndicatorPrimitive
        ref={indicator}
        {...stylex.props(styles.indicator)}
      />
    </ProgressPrimitive>
  );
}

export { LoadingBar };
export type { LoadingBarProps };
