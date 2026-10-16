import * as stylex from "@stylexjs/stylex";

import { scrollFadeVars as fade } from "@/lib/scroll-fade.stylex";
import { space } from "@/lib/tokens.stylex";

const timeline = "@supports (animation-timeline: scroll())";
const noTimeline = "@supports not (animation-timeline: scroll())";
const rtl = ":is([dir='rtl'], [dir='rtl'] *)";
const timelineAround = "@supports (timeline-scope: none)";
const noTimelineAround = "@supports not (timeline-scope: none)";
const timelineName = "--scroll-fade";

const depth = `min(12%, ${space.xl})`;
// How far from an edge the content must be before that edge fades in full.
const reveal = `calc(2 * ${space.xl})`;
const ranges = `0 ${reveal}, calc(100% - ${reveal}) 100%`;

const fadeInStart = stylex.keyframes({
  from: { [fade.start]: "0px" },
  to: { [fade.start]: depth },
});
const fadeOutEnd = stylex.keyframes({
  from: { [fade.end]: depth },
  to: { [fade.end]: "0px" },
});

const stops = `transparent, #000 ${fade.start}, #000 calc(100% - ${fade.end}), transparent`;

const endStops = `#000 calc(100% - ${fade.end}), transparent`;

/** Fades a scroller's edges while there's more content past them. Pass to the element that scrolls. */
const scrollFade = stylex.create({
  x: {
    [fade.start]: { default: null, [noTimeline]: depth },
    [fade.end]: { default: null, [noTimeline]: depth },
    animationDuration: "1ms",
    animationFillMode: "both",
    animationName: {
      default: null,
      [timeline]: `${fadeInStart}, ${fadeOutEnd}`,
    },
    animationRange: ranges,
    animationTimeline: "scroll(self inline), scroll(self inline)",
    animationTimingFunction: "linear",
    maskImage: {
      default: `linear-gradient(to right, ${stops})`,
      [rtl]: `linear-gradient(to left, ${stops})`,
    },
  },
  /** Names the scroller's position, for `xEndAround` on an ancestor. */
  source: {
    scrollTimelineAxis: "inline",
    scrollTimelineName: timelineName,
  },
  /** Fades only the right end, drawn by an ancestor of a left-to-right `source` scroller, so what the ancestor places beside the scroller (a code block's line numbers) stays unmasked. */
  xEndAround: {
    [fade.end]: { default: null, [noTimelineAround]: depth },
    animationDuration: "1ms",
    animationFillMode: "both",
    animationName: { default: null, [timelineAround]: fadeOutEnd },
    animationRange: `calc(100% - ${reveal}) 100%`,
    animationTimeline: timelineName,
    animationTimingFunction: "linear",
    maskImage: `linear-gradient(to right, ${endStops})`,
    timelineScope: timelineName,
  },
  y: {
    [fade.start]: { default: null, [noTimeline]: depth },
    [fade.end]: { default: null, [noTimeline]: depth },
    animationDuration: "1ms",
    animationFillMode: "both",
    animationName: {
      default: null,
      [timeline]: `${fadeInStart}, ${fadeOutEnd}`,
    },
    animationRange: ranges,
    animationTimeline: "scroll(self block), scroll(self block)",
    animationTimingFunction: "linear",
    maskImage: `linear-gradient(to bottom, ${stops})`,
  },
});

export { scrollFade };
