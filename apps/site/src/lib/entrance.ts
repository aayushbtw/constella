import * as stylex from "@stylexjs/stylex";
import type { AnyRouter } from "@tanstack/react-router";

import { easings, media, space } from "@/lib/tokens.stylex";

// One gesture: the tagline and the page stagger in inside the logo's spin, and the
// last item lands as it settles. In ms.
const spinFor = 1000;
const wordsAt = 60;
const wordStep = 60;
const itemsAt = 300;
const itemFor = 450;

const spinIn = stylex.keyframes({
  from: { opacity: 0, transform: "rotate(-180deg) scale(0.85)" },
});
const focusIn = stylex.keyframes({
  from: { filter: "blur(8px)", opacity: 0, transform: "translateY(0.3em)" },
});
const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${space.xs})` },
});
const fade = stylex.keyframes({ from: { opacity: 0 } });

/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */

// Reduced motion keeps only the fade; after a client navigation nothing replays.
const play = (name: string, duration: number) => ({
  animationDuration: `${duration}ms`,
  animationFillMode: "both",
  animationName: {
    default: name,
    ":is([data-navigated] *)": "none",
    [media.reducedMotion]: { default: fade, ":is([data-navigated] *)": "none" },
  },
  animationTimingFunction: easings.out,
});

/* eslint-enable func-style */

const styles = stylex.create({
  spin: play(spinIn, spinFor),
  word: { ...play(focusIn, 500), display: "inline-block" },
  item: play(rise, itemFor),
  delay: (ms: number) => ({ animationDelay: `${ms}ms` }),
});

const entrance = {
  spin: styles.spin,
  word: (index: number) => [
    styles.word,
    styles.delay(wordsAt + index * wordStep),
  ],
  /** Item `order` of `count`, spaced so the last lands as the logo settles. */
  item: (order: number, count: number) => [
    styles.item,
    styles.delay(
      itemsAt + (order * (spinFor - itemsAt - itemFor)) / (count - 1)
    ),
  ],
};

/** Marks `<html>` with `data-navigated` once the reader moves to another page. */
function markNavigations(router: AnyRouter) {
  router.subscribe("onBeforeNavigate", ({ fromLocation, pathChanged }) => {
    if (fromLocation && pathChanged) {
      document.documentElement.dataset.navigated = "";
    }
  });
}

export { entrance, markNavigations };
