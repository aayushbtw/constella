import * as stylex from "@stylexjs/stylex";

import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  radii,
  shadows,
  space,
} from "@/lib/constella/tokens.stylex";

const accepts = (sx: Sx) => sx;

const ok = stylex.create({
  tokens: {
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.md,
    boxShadow: shadows.lg,
    color: { default: colors.textMuted, ":hover": colors.textPrimary },
    paddingInlineStart: space.md,
    transitionDuration: durations.hover,
    transitionTimingFunction: easings.out,
  },
  keywords: {
    color: "currentColor",
    marginInlineStart: "auto",
    paddingBlock: 0,
    transitionDuration: 0,
    transitionTimingFunction: "ease",
  },
  unset: { marginInlineStart: null },
  math: {
    marginInlineStart: `calc(-1 * ${space.xs})`,
    paddingBlock: `max(${space.xxs}, calc(${radii.xl} - ${space.sm}))`,
  },
  lists: {
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionTimingFunction: `${easings.out}, ease`,
  },
  open: { display: "flex", width: "100%" },
  // Known gaps: a token in the math, a leading token or a radius token lets raw values ride along.
  mixed: { paddingBlock: `calc(${space.xs} + 13px)` },
  listTail: { transitionDuration: `${durations.hover}, 1ms` },
  radiusFactor: { borderStartStartRadius: `calc(${radii.md} * 13px)` },
});

accepts(ok.tokens);
accepts(ok.keywords);
accepts(ok.unset);
accepts(ok.math);
accepts(ok.lists);
accepts(ok.open);
accepts([ok.tokens, false, ok.open]);
accepts(ok.mixed);
accepts(ok.listTail);
accepts(ok.radiusFactor);

const raw = stylex.create({
  color: { color: "#3b82f6" },
  hover: { color: { default: colors.textMuted, ":hover": "red" } },
  padding: { paddingInlineStart: "13px" },
  paddingCalc: { paddingInlineStart: "calc(13px)" },
  radius: { borderStartStartRadius: 6 },
  duration: { transitionDuration: "1ms" },
  easing: { transitionTimingFunction: "ease-in" },
  shadow: { boxShadow: "0 1px 2px black" },
  fontSize: { fontSize: "13px" },
  zIndex: { zIndex: 999 },
  shorthand: { background: "#3b82f6" },
  foreignVar: { paddingBlock: "calc(var(--mine) * 2)" },
  dynamic: (color: string) => ({ color }),
});

// @ts-expect-error -- raw color
accepts(raw.color);
// @ts-expect-error -- raw color in a condition
accepts(raw.hover);
// @ts-expect-error -- raw length
accepts(raw.padding);
// @ts-expect-error -- math with no token
accepts(raw.paddingCalc);
// @ts-expect-error -- raw radius
accepts(raw.radius);
// @ts-expect-error -- raw duration
accepts(raw.duration);
// @ts-expect-error -- easing outside the tokens and keywords
accepts(raw.easing);
// @ts-expect-error -- raw shadow
accepts(raw.shadow);
// @ts-expect-error -- raw type size
accepts(raw.fontSize);
// @ts-expect-error -- raw layer
accepts(raw.zIndex);
// @ts-expect-error -- shorthand
accepts(raw.shorthand);
// @ts-expect-error -- math on a variable that isn't a token
accepts(raw.foreignVar);
// @ts-expect-error -- dynamic value
accepts(raw.dynamic("red"));
